import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductoById } from '../services/api';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgPrincipal, setImgPrincipal] = useState('');

  useEffect(() => {
    getProductoById(id)
      .then(data => {
        setProducto(data);
        setImgPrincipal(data.imagen);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="loading">Cargando producto...</p>;
  if (error) return <p className="loading" style={{ color: '#dc3545' }}>Error: {error}</p>;
  if (!producto) return null;

  // se dejan espacios para futuras mejoras como mostrar varias imágenes, reseñas, etc.
  return (
    <div>
      <main className="contenedor-producto">
        {/* Galería */}
        <section className="galeria">
          <div className="imagen-principal">
            <img
              src={imgPrincipal || producto.imagen}
              alt={producto.nombre}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=Sin+imagen'; }}
            />
          </div>
          {/* Miniaturas - para imagenes futuras */}
          <div className="miniaturas">
            {[producto.imagen].filter(Boolean).map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Vista ${i + 1}`}
                className={imgPrincipal === img ? 'active' : ''}
                onClick={() => setImgPrincipal(img)}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80'; }}
              />
            ))}
          </div>
        </section>

        {/* Detailsss */}
        <section className="detalles">
          <h1>{producto.nombre}</h1>
          <p className="precio">
            <span className="etiqueta">Precio:</span>
            ${Number(producto.precio).toLocaleString('es-AR')}
          </p>
          <p className="descripcion" style={{ lineHeight: '1.6', marginBottom: '20px' }}>
            {producto.descripcion}
          </p>

          {producto.categoria && (
            <p style={{ marginBottom: '1rem', color: '#777' }}>
              <strong>Categoría:</strong> {producto.categoria}
            </p>
          )}

          <div className="acciones">
            <button className="btn btn-comprar">Comprar Ahora</button>
            <button className="btn btn-carrito">Añadir al Carrito</button>
          </div>

          <div className="volver">
            <button className="btn btn-volver" onClick={() => navigate(-1)}>
              ← Volver
            </button>
          </div>
        </section>
      </main>

      <div className="descripcion-ver-mas">
        <h2>Descripción</h2>
        <p>{producto.descripcion}</p>
      </div>

      <div className="descripcion-ver-mas2">
        <h2>SITIO OFICIAL</h2>
        <a href="/" className="vinculo-vermas">
          EL BORDO - LOS MEJORES INSTRUMENTOS
        </a>
      </div>
    </div>
  );
}

export default ProductDetail;
