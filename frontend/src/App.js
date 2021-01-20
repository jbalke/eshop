import Header from './components/Header';
import Footer from './components/Footer';
function App() {
  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <main className='flex-grow py-3'>
        <div className='max-w-screen-lg mx-auto'>
          <h1 className='text-3xl font-bold uppercase tracking-wider'>
            Welcome To E-Shop
          </h1>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
