import React from 'react';
import {gql, useQuery} from '@apollo/client';
import {useHistory} from 'react-router-dom';
import {CircularProgress} from '@mui/material';
import OrderItemsGrid from '../grids/OrderItemsGrid';
import OrderItemButtons from '../button-bars/OrderItemButtons';

export const GET_ORDER_DETAILS = gql`
  query GetOrderdetails($id: Int!) {
    orderdetailWithValues(filter: { orderheaderId: { equalTo: $id } }) {
      nodes {
        activityCode
        activityDescription
        complete
        id
        orderheaderId
        qtyApplied
        qtyComplete
        qtyOrdered
        typeShort
        unitPayableTotal
        valueApplied
        valueComplete
        valuePayableTotal
        worksheetReference
        itemNumber
      }
      totalCount
    }
  }
`;

const OrderItems = () => {
  const history = useHistory();

  const {data, loading} = useQuery(GET_ORDER_DETAILS, {
    variables: {id: Number(history.location.state)},
    fetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return <CircularProgress/>;
  }

  return (
    <>
      <OrderItemButtons/>
      <OrderItemsGrid data={data.orderdetailWithValues.nodes}/>
    </>
  );
};

export default OrderItems;
