import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import ImageViewer from '../ui-components/image-viewer/ImageViewer';

const GET_ORDER_IMAGES = gql`
  query GetOrderImages($id: Int!) {
    imageDetails(filter: { orderheaderId: { equalTo: $id } }) {
      totalCount
      nodes {
        headerImageFile
        id
        longName
        shortName
        reference
        worksheetReference
        dateTakenManual
        exifDate
      }
    }
  }
`;

const OrderImageData = (props) => {
  const history = useHistory();
  const { data, loading, error } = useQuery(GET_ORDER_IMAGES, {
     variables: { id: Number(history.location.state) },

    fetchPolicy: 'cache-and-network',
  });
  if (loading) {
    return <CircularProgress />;
  }
  return <ImageViewer data={data && data} loading={loading} />;
};
export default OrderImageData;
