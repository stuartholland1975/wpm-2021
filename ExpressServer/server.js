const PgManyToManyPlugin = require("@graphile-contrib/pg-many-to-many");
const express = require("express");
const { postgraphile, makePluginHook } = require("postgraphile");
//const { default: PgPubsub } = require("@graphile/pg-pubsub");
const SimplifyInflectionsPlugin = require("@graphile-contrib/pg-simplify-inflector");
const PgAggregatesPlugin = require("@graphile/pg-aggregates").default;
//const { tableExtensionPlugin } = require('postgraphile-table-extension-plugin');

require('dotenv').config()
const PgConnectionFilterPlugin = require("postgraphile-plugin-connection-filter");
const PostGraphileNestedMutations = require("postgraphile-plugin-nested-mutations");
const path = require("path");
const PostGraphileUploadFieldPlugin = require("postgraphile-plugin-upload-field");
const { graphqlUploadExpress } = require("graphql-upload");
const fs = require("fs");
const {
    addFakeUniqueConstraintFromIndex,
} = require("postgraphile-index-to-unique-constraint-plugin");
const PgOrderByRelatedPlugin = require("@graphile-contrib/pg-order-by-related");
const PgOrderByMultiColumnIndexPlugin = require("@graphile-contrib/pg-order-by-multi-column-index");


//const DOCUMENTS_UPLOAD_DIR_NAME = "/var/www/html/documents";
const DOCUMENTS_UPLOAD_DIR_NAME = path.join(__dirname, 'media/documents')
//const IMAGES_UPLOAD_DIR_NAME = "/var/www/html/images";
const IMAGES_UPLOAD_DIR_NAME = path.join(__dirname, 'media/images');
//const REPORTS_UPLOAD_DIR_NAME = "/var/www/html/reports";
const REPORTS_UPLOAD_DIR_NAME = path.join(__dirname, 'media.reports');
const cors = require("cors");
const {
    postgraphilePolyRelationCorePlugin,
} = require("postgraphile-polymorphic-relation-plugin");

const postGraphOptions = {
    watchPg: true,
    enableQueryBatching: true,
    graphiql: true,
    dynamicJson: true,
    enhanceGraphiql: true,
    allowExplain: true,
    enableCors: true,
    //  live: false,
    // ownerConnectionString: process.env.ROOT_DATABASE_URL || "postgres://postgres:987jmo00@192.168.0.18:5432/work_package_manager",
    // ignoreIndexes: false,
    showErrorStack: "json",
    extendedErrors: ["hint", "detail", "errcode"],
    exportGqlSchemaPath: "schema.graphql",
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
        require("@graphile/subscriptions-lds").default,
        require("postgraphile-plugin-many-create-update-delete").default,
        PgOrderByRelatedPlugin,
        //  tableExtensionPlugin
    ],
    graphileBuildOptions: {
        connectionFilterRelations: true,
        connectionFilterPolymorphicForward: true,
        connectionFilterPolymorphicBackward: true,
        nestedMutationsSimpleFieldNames: true,
        // orderByRelatedColumnAggregates: true,

        uploadFieldDefinitions: [
            {
                match: ({ column }) => column === "header_document_file",
                resolve: resolveDocumentUpload,
            },
            {
                match: ({ column }) => column === "header_image_file",
                resolve: resolveImageUpload,
            },
            {
                match: ({ column }) => column === "header_report_file",
                resolve: resolveReportUpload,
            },
        ],
    },
};
const app = express();
app.use(express.json({ limit: "100mb", extended: true }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(graphqlUploadExpress());
app.use(cors('*'));
const middleware = postgraphile(
    process.env.DATABASE_URL ||
    "postgres://postgres:987jmo00@localhost:5432/wpm_live",
    "wpm_graphql",
    postGraphOptions
);

app.use(middleware);




const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    const address = server.address();
    console.log(`Postgraphile Listening on  ${address.port}`);
});

async function resolveDocumentUpload(upload) {
    const { filename, mimetype, encoding, createReadStream } = upload;
    const stream = createReadStream();
    // Save file to the local filesystem
    const { id, path } = await saveDocument({ stream, filename }).then(
        console.log("FILE SAVED")
    );

    // Return metadata to save it to Postgres
    return {
        id,
        path,
        filename,
        mimetype,
        encoding,
    };
}

async function resolveImageUpload(upload) {
    const { filename, mimetype, encoding, createReadStream } = upload;
    const stream = createReadStream();
    // Save file to the local filesystem
    const { id, path } = await saveImage({ stream, filename }).then(
        console.log("FILE SAVED")
    );
    // Return metadata to save it to Postgres
    return {
        id,
        path,
        filename,
        mimetype,
        encoding,
    };
}

async function resolveReportUpload(upload) {
    const { filename, mimetype, encoding, createReadStream } = upload;
    const stream = createReadStream();
    // Save file to the local filesystem
    const { id, path } = await saveReport({ stream, filename }).then(
        console.log("FILE SAVED")
    );

    // Return metadata to save it to Postgres
    return {
        id,
        path,
        filename,
        mimetype,
        encoding,
    };
}

function saveDocument({ stream, filename }) {
    const timestamp = new Date().toISOString().replace(/\D/g, "");
    const id = `${timestamp}_${filename}`;
    const filepath = path.join(DOCUMENTS_UPLOAD_DIR_NAME, id);

    return new Promise((resolve, reject) =>
        stream
            .on("error", (error) => {
                console.log(error);
                if (stream.truncated)
                    // Delete the truncated file
                    fs.unlinkSync(filepath);
                reject(error);
            })
            .on("end", () => resolve({ id, filepath }))
            .pipe(fs.createWriteStream(filepath))
    );
}

function saveImage({ stream, filename }) {
    const timestamp = new Date().toISOString().replace(/\D/g, "");
    const id = `${timestamp}_${filename}`;
    const filepath = path.join(IMAGES_UPLOAD_DIR_NAME, id);

    return new Promise((resolve, reject) =>
        stream
            .on("error", (error) => {
                if (stream.truncated)
                    // Delete the truncated file
                    fs.unlinkSync(filepath);
                reject(error);
            })
            .on("end", () => resolve({ id, filepath }))
            .pipe(fs.createWriteStream(filepath))
    );
}

function saveReport({ stream, filename }) {
    const timestamp = new Date().toISOString().replace(/\D/g, "");
    const id = `${timestamp}_${filename}`;
    const filepath = path.join(REPORTS_UPLOAD_DIR_NAME, id);

    return new Promise((resolve, reject) =>
        stream
            .on("error", (error) => {
                if (stream.truncated)
                    // Delete the truncated file
                    fs.unlinkSync(filepath);
                reject(error);
            })
            .on("end", () => resolve({ id, filepath }))
            .pipe(fs.createWriteStream(filepath))
    );
}
