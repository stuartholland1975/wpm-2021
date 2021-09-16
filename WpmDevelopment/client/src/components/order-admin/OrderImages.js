import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import { formatDate } from "../../functions/commonFunctions";
import {CircularProgress} from "@mui/material";

const GET_ORDER_IMAGES = gql`
  query GetOrderImages($id: Int!) {
    images(
      filter: { orderheaderId: { equalTo: $id } }
      orderBy: SITELOCATION_ID_ASC
    ) {
      nodes {
        exif
        dateTakenManual
        headerImageFile
        id
        imageType {
          id
          longName
          shortName
        }
        sitelocation {
          id
          reference
          worksheetReference
        }
        orderheaderId
      }
    }
  }
`;

const OrderImages = () => {

  const history = useHistory()
    const { data, loading, error } = useQuery(GET_ORDER_IMAGES, {
    variables: { id: Number(history.location.state) },
    fetchPolicy: "cache-and-network",
  });

  const images =
    data &&
    data.images.nodes.map((item) => {
      return {
        original: `/images/${item.headerImageFile.id}`,
        thumbnail: `http://localhost:5000/images/${item.headerImageFile.id}`,
        originalHeight: 750,
        // originalTitle: item.sitelocation.worksheetReference,
        description: (
          <div style={{ textAlign: "left" }}>
            <p>WORKSHEET: {item.sitelocation.worksheetReference}</p>
            <p>{item.imageType.longName}</p>
            <p>{formatDate(item.dateTakenManual)}</p>
          </div>
        ),
      };
    });
  if (loading) {
    return (
     <CircularProgress/>
    )
  }
  return (
    <>
      <hr />
      {data && data.images.nodes.length > 0 ? (

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
    </>
  );
};

export default OrderImages;
