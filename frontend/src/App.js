import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';

function App() {
  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <main className='flex-grow py-3 px-2'>
        <div className='max-w-screen-lg mx-auto'>
          <Home />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
