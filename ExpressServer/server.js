/** @format */
const sharp = require('sharp');
const PgManyToManyPlugin = require('@graphile-contrib/pg-many-to-many');
const express = require('express');
const {postgraphile} = require('postgraphile');
const SimplifyInflectionsPlugin = require('@graphile-contrib/pg-simplify-inflector');
const PgAggregatesPlugin = require('@graphile/pg-aggregates').default;
//const { tableExtensionPlugin } = require('postgraphile-table-extension-plugin');

require('dotenv').config();
const PgConnectionFilterPlugin = require('postgraphile-plugin-connection-filter');
const PostGraphileNestedMutations = require('postgraphile-plugin-nested-mutations');
const path = require('path');
const PostGraphileUploadFieldPlugin = require('postgraphile-plugin-upload-field');
const {graphqlUploadExpress} = require('graphql-upload');
const fs = require('fs');
const {
  addFakeUniqueConstraintFromIndex,
} = require('postgraphile-index-to-unique-constraint-plugin');
const PgOrderByRelatedPlugin = require('@graphile-contrib/pg-order-by-related');
const PgOrderByMultiColumnIndexPlugin = require('@graphile-contrib/pg-order-by-multi-column-index');

//const DOCUMENTS_UPLOAD_DIR_NAME = "/var/www/html/documents";
const DOCUMENTS_UPLOAD_DIR_NAME = path.join(__dirname, 'media/documents');
//const IMAGES_UPLOAD_DIR_NAME = "/var/www/html/images";
const IMAGES_UPLOAD_DIR_NAME = path.join(__dirname, 'media/images/original');
const RESIZED_IMAGES_UPLOAD_DIR_NAME = path.join(
  __dirname,
  'media/images/resized',
);
const THUMBNAIL_IMAGES_UPLOAD_DIR_NAME = path.join(
  __dirname,
  'media/images/thumbnails',
);
//const REPORTS_UPLOAD_DIR_NAME = "/var/www/html/reports";
const REPORTS_UPLOAD_DIR_NAME = path.join(__dirname, 'media.reports');

const cors = require('cors');
const {
  postgraphilePolyRelationCorePlugin,
} = require('postgraphile-polymorphic-relation-plugin');

const postGraphOptions = {
  watchPg: true,
  enableQueryBatching: true,
  graphiql: true,
  dynamicJson: true,
  enhanceGraphiql: true,
  allowExplain: true,
  enableCors: true,
  showErrorStack: 'json',
  extendedErrors: ['hint', 'detail', 'errcode'],
  exportGqlSchemaPath: 'schema.graphql',
  appendPlugins: [
    SimplifyInflectionsPlugin,
    PgOrderByMultiColumnIndexPlugin,
    PgAggregatesPlugin,
    PostGraphileNestedMutations,
    PostGraphileUploadFieldPlugin,
    PgConnectionFilterPlugin,
    postgraphilePolyRelationCorePlugin,
    addFakeUniqueConstraintFromIndex,
    PgManyToManyPlugin,
    require('postgraphile-plugin-many-create-update-delete').default,
    PgOrderByRelatedPlugin,
  ],
  graphileBuildOptions: {
    connectionFilterRelations: true,
    connectionFilterPolymorphicForward: true,
    connectionFilterPolymorphicBackward: true,
    nestedMutationsSimpleFieldNames: true,
    uploadFieldDefinitions: [
      {
        match: ({column}) => column === 'header_document_file',
        resolve: resolveDocumentUpload,
      },
      {
        match: ({column}) => column === 'header_image_file',
        resolve: processImage,
      },
      {
        match: ({column}) => column === 'header_report_file',
        resolve: resolveReportUpload,
      },
    ],
  },
};
const middleware = postgraphile(
  process.env.DATABASE_URL ||
  'postgres://production:987jmo00@developer-toshiba:5432/wpm_live',
  'wpm_graphql',
  postGraphOptions,
);

const app = express();
app.use(express.json({limit: '100mb', extended: true}));
app.use(express.urlencoded({limit: '100mb', extended: true}));
app.use(graphqlUploadExpress({maxFileSize: 10000000, maxFiles: 10}));
app.use(cors('*'));
app.use(express.static(path.join(__dirname, 'media')));
app.use(middleware, express.json({limit: '100mb', extended: true}));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  const address = server.address();
  console.log(`Postgraphile Listening on  ${address.port}`);
});

async function resolveDocumentUpload(upload) {
  const {filename, mimetype, encoding, createReadStream} = upload;
  const stream = createReadStream();
  const {id, path} = await saveDocument({stream, filename});
  return {
    id,
    path,
    filename,
    mimetype,
    encoding,
  };
}

async function resolveImageUpload(upload) {
  console.log(upload);
  const {filename, mimetype, encoding, createReadStream} = upload;
  const stream = createReadStream();
  const timestamp = new Date().toISOString().replace(/\D/g, '');
  const id = `${timestamp}_${filename}`;

  const allPromises = await Promise.all([
    saveOriginalImage({stream, id}),
    saveThumbnailImage({stream, id}),
    saveResizedImage({stream, id}),
  ]);

  console.log(allPromises[0], allPromises[1], allPromises[2]);

  return {
    id,
    path: allPromises[0].filepath,
    filename,
    mimetype,
    encoding,
  };
}

async function resolveReportUpload(upload) {
  const {filename, mimetype, encoding, createReadStream} = upload;
  const stream = createReadStream();

  const {id, path} = await saveReport({stream, filename});
  return {
    id,
    path,
    filename,
    mimetype,
    encoding,
  };
}

function saveDocument({stream, filename}) {
  const timestamp = new Date().toISOString().replace(/\D/g, '');
  const id = `${timestamp}_${filename}`;
  const filepath = path.join(DOCUMENTS_UPLOAD_DIR_NAME, id);

  return new Promise((resolve, reject) =>
    stream
      .on('error', (error) => {
        console.log(error);
        if (stream.truncated)
          // Delete the truncated file
          fs.unlinkSync(filepath);
        reject(error);
      })
      .on('end', () => resolve({id, filepath}))
      .pipe(fs.createWriteStream(filepath)),
  );
}

function saveOriginalImage({stream, id}) {
  const filepath = path.join(IMAGES_UPLOAD_DIR_NAME, id);
  return new Promise((resolve, reject) =>
    stream
      .on('error', (error) => {
        console.log(error);
        if (stream.truncated)
          // Delete the truncated file
          fs.unlinkSync(filepath);
        reject(error);
      })
      .on('end', () => {
        resolve({id, filepath});
        console.log('END OF ORIGINAL');
      })
      .on('readable', () => {
        stream.read();
      })
      .pipe(fs.createWriteStream(filepath)),
  );
}

async function processImage(upload) {
  const {filename, mimetype, encoding, createReadStream} = upload;
  const stream = createReadStream();
  const timestamp = new Date().toISOString().replace(/\D/g, '');
  const id = `${timestamp}_${filename}`;
  const thumbnailFilepath = path.join(THUMBNAIL_IMAGES_UPLOAD_DIR_NAME, id);
  const resizedFilepath = path.join(RESIZED_IMAGES_UPLOAD_DIR_NAME, id);
  const originalFilepath = path.join(IMAGES_UPLOAD_DIR_NAME, id);

  const transformThumbnail = sharp()
    .rotate()
    .resize(720)

  const transformResize = sharp()
    .rotate()
    .resize(1920)

  try {
    const tn = await stream.pipe(transformThumbnail)
    const rs = await stream.pipe(transformResize)
    await stream.pipe(fs.createWriteStream(originalFilepath))
    rs.pipe(fs.createWriteStream(resizedFilepath))
    tn.pipe(fs.createWriteStream(thumbnailFilepath))
  }
  catch (e) {
    if (stream.truncated) {
      fs.unlinkSync(thumbnailFilepath);
      console.log(e)
    }
  } finally {
    return {
      id,
      originalFilepath,
      filename,
      mimetype,
      encoding,
    };
  }

}

function saveThumbnailImage({stream, id}) {
  const thumbnailFilepath = path.join(THUMBNAIL_IMAGES_UPLOAD_DIR_NAME, id);
  tempPath = id;
  return new Promise((resolve, reject) =>
    stream
      .on('error', (error) => {
        console.log(error);
        if (stream.truncated)
          // Delete the truncated file
          fs.unlinkSync(thumbnailFilepath);
        reject(error);
      })
      .on('end', () => {
        resolve({id, thumbnailFilepath});
        console.log('END OF THUMBNAIL');
      })
      .on('readable', () => {
        stream.read();
      })
      .on('close', () => {
        console.log('THUMBNAIL CLOSED');
      })
      .pipe(transformThumbnail)
      //	.pipe(transformToFile),
      .pipe(fs.createWriteStream(thumbnailFilepath)),
  );
}

function saveResizedImage({stream, id}) {
  const resizedFilepath = path.join(RESIZED_IMAGES_UPLOAD_DIR_NAME, id);
  return new Promise((resolve, reject) =>
    stream
      .on('error', (error) => {
        console.log(error);
        if (stream.truncated)
          // Delete the truncated file
          fs.unlinkSync(thumbnailFilepath);
        reject(error);
      })
      .on('end', () => {
        resolve({id, resizedFilepath});
        console.log('END OF RESIZED');
      })
      .on('readable', () => {
        stream.read();
      })
      .on('close', () => {
        console.log('RESIZED CLOSED');
      })
      .pipe(transformResized)
      .pipe(fs.createWriteStream(resizedFilepath)),
  );
}

function saveReport({stream, filename}) {
  const timestamp = new Date().toISOString().replace(/\D/g, '');
  const id = `${timestamp}_${filename}`;
  const filepath = path.join(REPORTS_UPLOAD_DIR_NAME, id);

  return new Promise((resolve, reject) =>
    stream
      .on('error', (error) => {
        if (stream.truncated)
          // Delete the truncated file
          fs.unlinkSync(filepath);
        reject(error);
      })
      .on('end', () => resolve({id, filepath}))
      .pipe(fs.createWriteStream(filepath)),
  );
}
