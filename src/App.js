import React, {Suspense, lazy} from 'react';
import NavBar from './components/navigation/Navbar';
import {Switch, Route} from 'react-router-dom';
import {CircularProgress} from "@mui/material";

const Home = lazy(() => import('./components/home/Home'));
const Orderheaders = lazy(() => import('./components/orderheaders/Orderheaders'));
const OrderAdmin = lazy(() => import('./components/order-admin/OrderAdmin'));
const AdminHome = lazy(() => import("./components/admin/AdminHome"))
const TestComponent = lazy(() => import("./components/test-components/TestComponent"))

function App() {
  return (
    <div className='App'>
      <NavBar/>
      <Suspense fallback={<CircularProgress/>}>
        <Switch>
          <Route path='/' exact>
            <Home/>
          </Route>
          <Route path='/test' exact>
            <TestComponent/>
          </Route>
          <Route path='/orders' exact>
            <Orderheaders/>
          </Route>
          <Route path='/orders/admin/:orderId'>
            <OrderAdmin/>
          </Route>
          <Route path='/admin'>
            <AdminHome/>
          </Route>
        </Switch>
      </Suspense>
    </div>
  );
}

export default App;
