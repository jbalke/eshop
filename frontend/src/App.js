import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Product from './pages/Product.js';
import { ScrollToTop } from './utils/scroll';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className='flex flex-col h-screen'>
        <Header />
        <main className='flex-grow py-3 px-2'>
          <div className='max-w-screen-lg mx-auto'>
            <Switch>
              <Route path='/' exact component={Home} />
              <Route path='/product/:id' component={Product} />
            </Switch>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
