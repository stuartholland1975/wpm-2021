import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import { formatDate,formatExifDate } from "../../../functions/commonFunctions";
import {CircularProgress} from "@mui/material";
import OrderImageButtons from "../../button-bars/OrderImageButtons";



const ImageViewer = (props) => {
    const images =
    props.data.imageDetails.nodes.map((item) => (

      {
        original: `http://192.168.0.17:5000/images/${item.headerImageFile.id}`,
        thumbnail: `http://192.168.0.17:5000/images/${item.headerImageFile.id}`,
        originalHeight: 800,
       //  originalTitle: item.worksheetReference,
          thumbnailTitle: item.reference,
        description: (
          <div style={{ textAlign: "left" }}>
            <p>WORKSHEET: {item.worksheetReference}</p>
            <p>{item.longName}</p>
              <p>{item.exifDate ? formatExifDate(item.exifDate) :formatDate(item.dateTakenManual) }</p>

          </div>
        )
      }))



  return (
    <div style={{marginTop:'50px'}}>
      { images.length > 0 ? (
          <ImageGallery
            items={images}
            slideInterval={2000}
            thumbnailPosition="bottom"
            onClick={(event) => console.log(event)}
          //   showPlayButton={false}
          //   showFullscreenButton={false}
          />

      ) : (
        <div className="no-data-message">
          NO IMAGES ARE CURRENLTY ASSOCIATED WITH THIS ORDER
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
