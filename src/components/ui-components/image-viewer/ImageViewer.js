import React from 'react';
import ImageGallery from 'react-image-gallery';
import { formatDate } from '../../../functions/commonFunctions';


const ImageViewer = (props) => {
  const images = props.data.imageDetails.nodes.map((item) => ({
    original: `https://workpm.ddns.net/images/resized/${item.headerImageFile.id}`,
    thumbnail: `https://workpm.ddns.net/images/thumbnails/${item.headerImageFile.id}`,
    originalHeight: 800,
    //  originalTitle: item.worksheetReference,
    //  thumbnailTitle: item.reference,
    description: (
      <div style={{ textAlign: 'left' }}>
        <p>WORKSHEET: {item.worksheetReference}</p>
        <p>{item.longName}</p>
        <p>
          {item.exifDate
            ? formatDate(item.exifDate)
            : formatDate(item.dateTakenManual)}
        </p>
      </div>
    ),
  }));

  const handleImageClick = event => window.open(event.target.currentSrc.replace('resized', 'original'), '_blank')

  return (
    <div style={{ marginTop: '50px' }}>
      {images.length > 0 ? (
        <ImageGallery
          items={images}
          // slideInterval={4000}
          thumbnailPosition='bottom'
          onClick={handleImageClick}
          lazyLoad={true}
          showThumbnails={true}
        //  autoPlay={true}
        />
      ) : (
        <div className='no-data-message'>
          NO IMAGES ARE CURRENLTY ASSOCIATED WITH THIS ORDER
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
