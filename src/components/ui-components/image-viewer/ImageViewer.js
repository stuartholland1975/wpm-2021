import React from 'react';
import ImageGallery from 'react-image-gallery';
import { formatDate, formatExifDate } from '../../../functions/commonFunctions';

const ImageViewer = (props) => {
  const images = props.data.imageDetails.nodes.map((item) => ({
    original: `https://workpm.ddns.net/images/${item.headerImageFile.id}`,
  //  thumbnail: `https://workpm.ddns.net/images/${item.headerImageFile.id}`,
    originalHeight: 800,
    //  originalTitle: item.worksheetReference,
  //  thumbnailTitle: item.reference,
    description: (
      <div style={{ textAlign: 'left' }}>
        <p>WORKSHEET: {item.worksheetReference}</p>
        <p>{item.longName}</p>
        <p>
          {item.exifDate
            ? formatExifDate(item.exifDate)
            : formatDate(item.dateTakenManual)}
        </p>
      </div>
    ),
  }));

  const handleImageClick = event => window.open(event.target.currentSrc, '_blank')

  return (
    <div style={{ marginTop: '50px' }}>
      {images.length > 0 ? (
        <ImageGallery
          items={images}
         // slideInterval={4000}
        //  thumbnailPosition='bottom'
          onClick={handleImageClick}
          lazyLoad={true}
          showThumbnails={false}
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
