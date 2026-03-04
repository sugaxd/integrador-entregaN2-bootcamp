import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { getProductos } from '../services/api';
import elbordoImg from '../assets/elbordo.png';

const BANNER_URL =
  'https://www.malaga8.com/modules/dbblog/views/img/post/Resumen%202022%20-%20Tienda%20de%20instrumentos%20musicales%20en%20madrid.jpg';

function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProductos()
      .then(data => {
        setProductos(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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

      {/* Productos */}
      <div id="productos">
        <h2 className="texts-productos">PRODUCTOS</h2>
        <div className="separador"></div>

        {loading && <p className="loading">Cargando productos...</p>}
        {error && (
          <p className="loading" style={{ color: '#dc3545' }}>
            Error al cargar productos: {error}. <br />
            <small>Asegúrate de configurar la URL de MockAPI en src/services/api.js</small>
          </p>
        )}

        <div className="card-container">
          {!loading && !error && productos.map(producto => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
          {!loading && !error && productos.length === 0 && (
            <p className="loading">No hay productos disponibles. Agrega algunos desde el Admin.</p>
          )}
        </div>
      </div>

      <a href="#inicio" className="inicio-pag">⬆️ Inicio de Página</a>
    </div>
  );
}

export default Home;
