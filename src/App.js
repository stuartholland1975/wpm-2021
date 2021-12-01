import React, {Suspense, lazy} from 'react';
import NavBar from './components/navigation/Navbar';
import {Switch, Route} from 'react-router-dom';
import {CircularProgress} from "@mui/material";
import ApplicationAdmin from './components/application-admin/ApplicationAdmin';
import ContractDashboard from './components/dashboard/ContractDashboard';
import ApplicationEnquiry from './components/enquiries/applications/ApplicationEnquiry';
import Enquiries from './components/enquiries/Enquiries';

const Home = lazy(() => import('./components/home/Home'));
const Orderheaders = lazy(() => import('./components/orderheaders/Orderheaders'));
const OrderAdmin = lazy(() => import('./components/order-admin/OrderAdmin'));
const AdminHome = lazy(() => import("./components/admin/AdminHome"))
const TestComponent = lazy(() => import("./components/test-components/TestComponent"))
const ImportOrderDetail = lazy(() => import("./components/forms/ImportOrderDetailExcel"))
//const Enquiries = lazy(() => import("./components/enquiries/Enquiries"))
const Analysis = lazy(() => import('./components/analysis/Analysis'))

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
          <Route path='/orders/import/:orderId' exact>
            <ImportOrderDetail/>
          </Route>
          <Route path='/orders/admin/:orderId'>
            <OrderAdmin/>
          </Route>
          <Route path='/admin'>
            <AdminHome/>
          </Route>
          <Route path='/applications'>
            <ApplicationAdmin/>
          </Route>
          <Route path='/dashboard'>
            <ContractDashboard/>
          </Route>
          <Route path='/analysis'>
            <Analysis/>
          </Route>
          <Route path='/enquiries' exact>
            <Enquiries/>
          </Route>
          <Route path={'/enquiry/applications'}>
            <ApplicationEnquiry/>
          </Route>

        </Switch>
      </Suspense>
    </div>
  );
}

export default App;
