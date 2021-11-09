import React from 'react';
import OrderheaderGrid from '../grids/OrderheaderGrid';
import OrderheaderButtons from '../button-bars/OrderheaderButtons';
import allOrderheaders from '../../api-calls/queries/AllOrderheaders'
import { CircularProgress } from "@mui/material";


const Orderheaders = () => {

  const [data, loading] = allOrderheaders()

  if (loading) return <CircularProgress size={300} sx={{ p: 25 }} color={'info'} />

  return (
    <>
      <OrderheaderButtons />
      <OrderheaderGrid data={data} />
    </>
  );
};

export default Orderheaders;
