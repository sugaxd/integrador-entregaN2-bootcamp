import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { getProductos } from '../services/api';

function Productos() {
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
    <div style={{ padding: '1rem' }}>
      <h1 className="titulo-principal">Todos los Productos</h1>

      {loading && <p className="loading">Cargando productos...</p>}
      {error && (
        <p className="loading" style={{ color: '#dc3545' }}>
          Error: {error}
        </p>
      )}

      <div className="card-container">
        {!loading && !error && productos.map(producto => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
        {!loading && !error && productos.length === 0 && (
          <p className="loading">No hay productos disponibles.</p>
        )}
      </div>
    </div>
  );
}

export default Productos;
