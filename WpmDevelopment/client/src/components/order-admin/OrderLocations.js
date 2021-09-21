import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import OrderLocationsGrid from '../grids/OrderLocationsGrid';
import OrderLocationButtons from '../button-bars/OrderLocationButtons';

const GET_ORDER_LOCATIONS = gql`
  query GetOrderLocations($id: Int!) {
    sitelocationWithValues(filter: { orderheaderId: { equalTo: $id } }) {
      nodes {
        complete
        id
        itemCount
        itemsComplete
        orderValue
        orderheaderId
        reference
        valueApplied
        valueComplete
        worksheetReference
        imageCount
      }
      totalCount
    }
  }
`;

const OrderLocations = () => {
  const history = useHistory();

  const { data, loading } = useQuery(GET_ORDER_LOCATIONS, {
    variables: { id: Number(history.location.state) },
    fetchPolicy: 'cache-and-network',
  });


  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <OrderLocationButtons />
      <OrderLocationsGrid data={data.sitelocationWithValues.nodes} />
    </>
  );
};

export default OrderLocations;
