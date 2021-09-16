import Home from './components/home/Home';
import TestComponent from './components/test-components/TestComponent';
import NavBar from './components/navigation/Navbar';
import { Switch, Route } from 'react-router-dom';
import Orderheaders from './components/orderheaders/Orderheaders';
import OrderAdmin from './components/order-admin/OrderAdmin';

function App() {
  return (
    <div className='App'>
      <NavBar />
      <Switch>
        <Route path='/' exact>
          <Home />
        </Route>
        <Route path='/test' exact>
          <TestComponent />
        </Route>
        <Route path='/orders' exact>
          <Orderheaders />
        </Route>
        <Route path='/orders/admin/:orderId'>
          <OrderAdmin />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
