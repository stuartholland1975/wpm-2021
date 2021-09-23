import React, {Suspense, lazy} from 'react';
import OrderAdminButtons from '../button-bars/OrderAdminButtons';
import OrderStats from './OrderStats';
import {Route, Switch} from 'react-router-dom';
import {CircularProgress} from "@mui/material";

const OrderLocations = lazy(() => import('./OrderLocations'));
const OrderItems = lazy(() => import('./OrderItems'));
const OrderImages = lazy(() => import('./OrderImages'));
const OrderDocuments = lazy(() => import('./OrderDocuments'));

const OrderAdmin = () => {
  return (
    <>
      <br/>
      <OrderAdminButtons/>
      <OrderStats/>
      <hr/>
      <Suspense fallback={<CircularProgress/>}>
        <Switch>
          <Route path='/orders/admin/locations/:orderId' exact>
            <OrderLocations/>
          </Route>
          <Route path='/orders/admin/items/:orderId' exact>
            <OrderItems/>
          </Route>
          <Route path='/orders/admin/images/:orderId' exact>
            <OrderImages/>
          </Route>
          <Route path='/orders/admin/documents/:orderId' exact>
            <OrderDocuments/>
          </Route>
        </Switch>
      </Suspense>
    </>
  );
};
export default OrderAdmin;
