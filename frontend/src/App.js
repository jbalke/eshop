import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Logout from './pages/Logout';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className='flex flex-col h-screen'>
          <Header />
          <main className='flex-grow p-4 flex'>
            <div className='max-w-screen-lg mx-auto flex-grow'>
              <Switch>
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
