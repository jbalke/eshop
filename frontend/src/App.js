import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
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
import UserProfile from './pages/UserProfile';
import { useUIContext } from './ui-context';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
    },
  },
});

function App() {
  const { closeUserMenu } = useUIContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className='flex flex-col h-screen'>
          <Header />
          <main className='flex-grow flex flex-col' onClick={closeUserMenu}>
            <div className='w-screen lg:max-w-screen-lg lg:mx-auto flex-grow p-2'>
              <Switch>
                <Route path='/' exact>
                  <Home />
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
                <PrivateRoute path='/user/:id'>
                  <UserProfile />
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
                <AdminRoute path='/admin/user-list'>
                  <UserList />
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
      <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
    </QueryClientProvider>
  );
}

export default App;
