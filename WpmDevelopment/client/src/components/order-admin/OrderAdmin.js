import React from 'react';
import OrderAdminButtons from '../button-bars/OrderAdminButtons';
import OrderStats from './OrderStats';
import { Switch, Route } from 'react-router-dom';
import OrderLocations from './OrderLocations';
import OrderItems from './OrderItems';
import OrderImages from "./OrderImages";

const OrderAdmin = () => {
  return (
    <>
      <br />
      <OrderAdminButtons />
      <OrderStats />
      <hr />
      <Switch>
        <Route path='/orders/admin/locations/:orderId' exact>
          <OrderLocations />
        </Route>
        <Route path='/orders/admin/items/:orderId' exact>
          <OrderItems />
        </Route>
          <Route path='/orders/admin/images/:orderId' exact>
          <OrderImages />
        </Route>
      </Switch>
    </>
  );
};

export default OrderAdmin;
