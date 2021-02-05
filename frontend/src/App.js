import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import { useUIContext } from './ui-context';
import Cart from './pages/Cart';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Product from './pages/Product';
import Profile from './pages/Profile';
import Register from './pages/Register';

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
          <main className='flex-grow p-4 flex' onClick={closeUserMenu}>
            <div className='max-w-screen-lg mx-auto flex-grow'>
              <Switch>
                <Route path='/register'>
                  <Register />
                </Route>
                <Route path='/login'>
                  <Login />
                </Route>
                <Route path='/logout'>
                  <Logout />
                </Route>
                <Route path='/me'>
                  <Profile />
                </Route>
                <Route path='/product/:id'>
                  <Product />
                </Route>
                <Route path='/cart/:id?'>
                  <Cart />
                </Route>
                <Route path='/' exact>
                  <Home />
                </Route>
              </Switch>
            </div>
          </main>
          <Footer />
        </div>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
    </QueryClientProvider>
  );
}

export default App;
