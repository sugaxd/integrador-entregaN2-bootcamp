import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { getProductos } from '../services/api';
import elbordoImg from '../assets/elbordo.png';

const BANNER_URL =
  'https://www.malaga8.com/modules/dbblog/views/img/post/Resumen%202022%20-%20Tienda%20de%20instrumentos%20musicales%20en%20madrid.jpg';

const LIMITE_HOME = 10;

function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProductos()
      .then(data => { setProductos(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const nuevos = productos.filter(p => p.destacado === 'nuevo');
  const ofertas = productos.filter(p => p.destacado === 'oferta');
  const generales = productos
    .filter(p => !p.destacado || p.destacado === 'ninguno')
    .slice(0, LIMITE_HOME);

  return (
    <div>
      {/* Banner */}
      <div className="header-container" id="inicio">
        <img src={BANNER_URL} alt="Banner El Bordo" className="banner-img" />
      </div>

      {/* Descripción */}
      <div className="descripcion-container">
        <div className="descripcion-text">
          <h1>¡Bienvenidos a El Bordo!</h1>
          <p>
            Encuentra el instrumento perfecto para dar vida a tus melodías.
            Explora nuestra amplia selección de guitarras, pianos, baterías y más,
            desde opciones para principiantes hasta equipos de alta gama para
            profesionales. Te ayudamos a encontrar el sonido que siempre has
            soñado, con la mejor calidad y al mejor precio. ¡Empieza tu viaje
            musical con nosotros!
          </p>
        </div>
        <div>
          <img src={elbordoImg} alt="El Bordo" className="img-elbordo" />
        </div>
      </div>

      {loading && <p className="loading">Cargando productos...</p>}
      {error && <p className="loading" style={{ color: '#dc3545' }}>Error al cargar productos: {error}</p>}

      {!loading && !error && (
        <>
          {/* Sección Nuevos Ingresos */}
          {nuevos.length > 0 && (
            <div id="nuevos">
              <h2 className="texts-productos"> NUEVOS INGRESOS</h2>
              <div className="separador"></div>
              <div className="card-container">
                {nuevos.map(producto => (
                  <ProductCard key={producto._id} producto={producto} badge="nuevo" />
                ))}
              </div>
            </div>
          )}

          {/* Sección Ofertas */}
          {ofertas.length > 0 && (
            <div id="ofertas">
              <h2 className="texts-productos"> OFERTAS CALIENTITAS</h2>
              <div className="separador"></div>
              <div className="card-container">
                {ofertas.map(producto => (
                  <ProductCard key={producto._id} producto={producto} badge="oferta" />
                ))}
              </div>
            </div>
          )}

          {/* Sección Productos generales */}
          <div id="productos">
            <h2 className="texts-productos">PRODUCTOS</h2>
            <div className="separador"></div>
            <div className="card-container">
              {generales.map(producto => (
                <ProductCard key={producto._id} producto={producto} />
              ))}
              {generales.length === 0 && nuevos.length === 0 && ofertas.length === 0 && (
                <p className="loading">No hay productos disponibles. Agrega algunos desde el Admin.</p>
              )}
            </div>

            {productos.filter(p => !p.destacado || p.destacado === 'ninguno').length > LIMITE_HOME && (
              <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                <a href="/productos" className="btn btn-primary">
                  Ver todos los productos
                </a>
              </div>
            )}
          </div>
        </>
      )}


    </div>
  );
}

export default Home;
