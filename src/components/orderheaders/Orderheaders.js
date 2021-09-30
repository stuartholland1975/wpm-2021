import React from 'react';
import OrderheaderGrid from '../grids/OrderheaderGrid';
import OrderheaderButtons from '../button-bars/OrderheaderButtons';
import allOrderheaders from '../../api-calls/queries/AllOrderheaders'


const Orderheaders = () => {

  const [data, loading] = allOrderheaders()
  console.log(data, loading)
  return (
    <>
      <OrderheaderButtons/>
      <OrderheaderGrid data={data}/>
    </>
  );
};

export default Orderheaders;
