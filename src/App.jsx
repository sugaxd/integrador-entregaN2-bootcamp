import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminGuard from './components/AdminGuard';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import Productos from './pages/Productos';
import ProductDetail from './pages/ProductDetail';
import Registro from './pages/Registro';
import Login from './pages/Login';
import AcercaDe from './pages/AcercaDe';
import AdminProductos from './pages/AdminProductos';
import AdminUsuarios from './pages/AdminUsuarios';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/acerca-de" element={<AcercaDe />} />
          <Route path="/admin/productos" element={<AdminGuard><AdminProductos /></AdminGuard>} />
          <Route path="/admin/usuarios" element={<AdminGuard><AdminUsuarios /></AdminGuard>} />
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <h2>404 - Página no encontrada</h2>
              <a href="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Volver al inicio</a>
            </div>
          } />
        </Routes>
      </main>
      <Footer />

      {/* Componentes flotantes globales */}
      <WhatsAppButton numero="5491112345678" />
      <ScrollToTop />
      <CookieBanner />
    </>
  );
}

export default App;
