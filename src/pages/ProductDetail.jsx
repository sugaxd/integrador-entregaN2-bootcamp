import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductoById } from '../services/api';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import ReviewSection from '../components/ReviewSection';

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');

const getImgSrc = (img) => {
  if (!img) return 'https://via.placeholder.com/400x400?text=Sin+imagen';
  return img.startsWith('/uploads') ? `${API_BASE}${img}` : img;
};

function StockBadge({ stock }) {
  if (stock === null || stock === undefined) return null;
  if (stock === 0) return <span style={{ background: '#e63946', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>Sin stock</span>;
  if (stock <= 5) return <span style={{ background: '#f4a261', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}> Últimas!! {stock} unidades</span>;
  return <span style={{ background: '#2a9d8f', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>✅ En stock ({stock})</span>;
}

function StarRating({ value, onChange, readonly = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{ fontSize: '1.4rem', cursor: readonly ? 'default' : 'pointer', color: star <= (hovered || value) ? '#f4a261' : '#444' }}
        >★</span>
      ))}
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItemToCart } = useOrder();
  const { isLoggedIn, token, user } = useAuth();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgPrincipal, setImgPrincipal] = useState('');
  const [addedMsg, setAddedMsg] = useState(false);

  const fetchProducto = () => {
    getProductoById(id)
      .then(data => { setProducto(data); setImgPrincipal(data.imagen); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  };

  useEffect(() => { fetchProducto(); }, [id]);

  const handleAddToCart = () => {
    if (producto.stock === 0) return;
    addItemToCart(producto);
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000);
  };

  if (loading) return <p className="loading">Cargando producto...</p>;
  if (error) return <p className="loading" style={{ color: '#dc3545' }}>Error: {error}</p>;
  if (!producto) return null;

  const todasLasImagenes = [producto.imagen, ...(producto.imagenes || [])].filter(Boolean);
  const sinStock = producto.stock === 0;

  // Calcular descuento si hay precio original
  const descuento = producto.precioOriginal
    ? Math.round((1 - producto.precio / producto.precioOriginal) * 100)
    : null;

  return (
    <div>
      <main className="contenedor-producto">
        {/* Galería */}
        <section className="galeria">
          <div className="imagen-principal">
            <img
              src={getImgSrc(imgPrincipal || producto.imagen)}
              alt={producto.nombre}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=Sin+imagen'; }}
            />
            {descuento && (
              <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#e63946', color: 'white', padding: '4px 10px', borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem' }}>
                -{descuento}%
              </span>
            )}
          </div>
          {todasLasImagenes.length > 1 && (
            <div className="miniaturas">
              {todasLasImagenes.map((img, i) => (
                <img key={i} src={getImgSrc(img)} alt={`Vista ${i + 1}`}
                  className={imgPrincipal === img ? 'active' : ''}
                  onClick={() => setImgPrincipal(img)}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80'; }}
                />
              ))}
            </div>
          )}
        </section>

        {/* Detalles */}
        <section className="detalles">
          <h1>{producto.nombre}</h1>

          {/* Rating */}
          {producto.reviews?.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}>
              <StarRating value={Math.round(producto.rating)} readonly />
              <span style={{ color: '#888', fontSize: '0.9rem' }}>
                {producto.rating} ({producto.reviews.length} reseña{producto.reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}

          {/* Precio */}
          <div style={{ marginBottom: '1rem' }}>
            {producto.precioOriginal && (
              <p style={{ textDecoration: 'line-through', color: '#888', margin: 0, fontSize: '1rem' }}>
                ${Number(producto.precioOriginal).toLocaleString('es-AR')}
              </p>
            )}
            <p className="precio" style={{ margin: 0 }}>
              <span className="etiqueta">Precio: </span>
              ${Number(producto.precio).toLocaleString('es-AR')}
              {descuento && <span style={{ marginLeft: '10px', background: '#e63946', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.85rem' }}>-{descuento}%</span>}
            </p>
          </div>

          {/* Stock */}
          <div style={{ marginBottom: '1rem' }}>
            <StockBadge stock={producto.stock} />
          </div>

          {producto.categoria && (
            <p style={{ marginBottom: '1rem', color: '#777' }}>
              <strong>Categoría:</strong> {producto.categoria}
            </p>
          )}

          <p className="descripcion" style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>
            {producto.descripcion}
          </p>

          {addedMsg && (
            <div style={{ background: '#1b4332', color: '#6fcf97', padding: '0.5rem 1rem', borderRadius: '6px', marginBottom: '1rem' }}>
              ✅ Producto agregado al carrito
            </div>
          )}

          <div className="acciones">
            <button className="btn btn-comprar" onClick={handleAddToCart} disabled={sinStock}
              style={{ opacity: sinStock ? 0.5 : 1, cursor: sinStock ? 'not-allowed' : 'pointer' }}>
              {sinStock ? 'Sin stock' : 'Comprar Ahora'}
            </button>
            <button className="btn btn-carrito" onClick={handleAddToCart} disabled={sinStock}
              style={{ opacity: sinStock ? 0.5 : 1, cursor: sinStock ? 'not-allowed' : 'pointer' }}>
              {sinStock ? 'Sin stock' : 'Añadir al Carrito'}
            </button>
          </div>

          <div className="volver">
            <button className="btn btn-volver" onClick={() => navigate(-1)}>← Volver</button>
          </div>
        </section>
      </main>

      <div className="descripcion-ver-mas">
        <h2>Descripción</h2>
        <p>{producto.descripcion}</p>
      </div>

      {/* Reseñas */}
      <ReviewSection
        producto={producto}
        token={token}
        isLoggedIn={isLoggedIn}
        user={user}
        onReviewAdded={fetchProducto}
      />

      <div className="descripcion-ver-mas2">
        <h2>SITIO OFICIAL</h2>
        <a href="/" className="vinculo-vermas">EL BORDO - LOS MEJORES INSTRUMENTOS</a>
      </div>
    </div>
  );
}

export default ProductDetail;
