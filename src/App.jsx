import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Loader from './components/Loader';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Constructor from './pages/Constructor';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Account from './pages/Account';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <Loader />
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/constructor" element={<Constructor />} />
            <Route path="/constructor/:productId" element={<Constructor />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
