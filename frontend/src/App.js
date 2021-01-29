import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Product from './pages/Product.js';
import Cart from './pages/Cart';

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
                <Route path='/' exact component={Home} />
                <Route path='/product/:id' component={Product} />
                <Route path='/cart/:id?' component={Cart} />
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
