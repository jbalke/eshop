import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Cart from './pages/Cart';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import NoMatch from './pages/NoMatch';
import Order from './pages/Order';
import Payment from './pages/Payment';
import PlaceOrder from './pages/PlaceOrder';
import Product from './pages/Product';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Shipping from './pages/Shipping';
import UserList from './pages/UserList';
import ProductList from './pages/ProductList';
import ProductEdit from './pages/ProductEdit';
import OrderList from './pages/OrderList';
import UndeliveredOrderList from './pages/UndeliveredOrderList';
import UserProfile from './pages/UserProfile';
import { useUIContext } from './ui-context';
import { ToastContainer } from 'react-toastify';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

function App() {
  const { closeUserMenu } = useUIContext();

  const [limit, setLimit] = useState('12');

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className='flex flex-col h-screen'>
          <Header />
          <main className='flex-grow flex flex-col' onClick={closeUserMenu}>
            <div className='w-screen lg:max-w-screen-lg lg:mx-auto flex-grow py-2 px-2 sm:px-4 flex flex-col'>
              <Switch>
                <Route path='/' exact>
                  <Home limit={limit} setLimit={setLimit} />
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
      </Router>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {process.env.NODE_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
      )}
    </QueryClientProvider>
  );
}

export default App;
