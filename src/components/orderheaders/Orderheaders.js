import React from 'react';
import OrderheaderGrid from '../grids/OrderheaderGrid';
import OrderheaderButtons from '../button-bars/OrderheaderButtons';
import allOrderheaders from '../../api-calls/queries/AllOrderheaders'


const Orderheaders = () => {

  const [data] = allOrderheaders()

  return (
    <>
      <OrderheaderButtons/>
      <OrderheaderGrid data={data}/>
    </>
  );
};

export default Orderheaders;
