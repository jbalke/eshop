import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Cart from './pages/Cart';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import NoMatch from './pages/NoMatch';
import Order from './pages/Order';
import OrderList from './pages/OrderList';
import Payment from './pages/Payment';
import PlaceOrder from './pages/PlaceOrder';
import Product from './pages/Product';
import ProductEdit from './pages/ProductEdit';
import ProductList from './pages/ProductList';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Shipping from './pages/Shipping';
import StockList from './pages/StockList';
import UndeliveredOrderList from './pages/UndeliveredOrderList';
import UserList from './pages/UserList';
import UserProfile from './pages/UserProfile';

function App() {
  const [appLimit, setAppLimit] = useState(12);

  return (
    <>
      <div className='flex flex-col h-screen'>
        <Header />
        <main className='flex-grow flex flex-col'>
          <div className='w-screen lg:max-w-screen-lg lg:mx-auto flex-grow py-2 px-4 flex flex-col'>
            <Switch>
              <Route path='/' exact>
                <Home appLimit={appLimit} setAppLimit={setAppLimit} />
              </Route>
              <Route path='/register'>
                <Register />
              </Route>
              <Route path='/login'>
                <Login />
              </Route>
              <Route path='/logout'>
                <Logout />
              </Route>
              <Route path='/product/:id'>
                <Product />
              </Route>
              <Route path='/cart/:id?'>
                <Cart />
              </Route>
              <PrivateRoute path='/profile'>
                <Profile />
              </PrivateRoute>
              <PrivateRoute path='/shipping'>
                <Shipping />
              </PrivateRoute>
              <PrivateRoute path='/payment'>
                <Payment />
              </PrivateRoute>
              <PrivateRoute path='/placeorder'>
                <PlaceOrder />
              </PrivateRoute>
              <PrivateRoute path='/order/:id'>
                <Order />
              </PrivateRoute>
              <PrivateRoute path='/me'>
                <Profile />
              </PrivateRoute>
              <AdminRoute path='/admin/order-list'>
                <OrderList />
              </AdminRoute>
              <AdminRoute path='/admin/undelivered-order-list'>
                <UndeliveredOrderList />
              </AdminRoute>
              <AdminRoute path='/admin/product-list'>
                <ProductList />
              </AdminRoute>
              <AdminRoute path='/admin/stock-list'>
                <StockList />
              </AdminRoute>
              <AdminRoute path='/admin/product/:id/edit'>
                <ProductEdit />
              </AdminRoute>
              <AdminRoute path='/admin/user-list'>
                <UserList />
              </AdminRoute>
              <AdminRoute path='/admin/user/:id'>
                <UserProfile />
              </AdminRoute>
              <Route path='*'>
                <NoMatch />
              </Route>
            </Switch>
          </div>
        </main>
        <Footer />
      </div>
      <div id='modal'></div>
      <ToastContainer
        position='bottom-right'
        autoClose={3000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />
    </>
  );
}

export default App;
