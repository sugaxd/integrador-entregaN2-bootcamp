import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');

const BADGE_STYLES = {
  nuevo: { label: '🆕 Nuevo ingreso', bg: '#2a9d8f', color: 'white' },
  oferta: { label: '🔥 Oferta', bg: '#e63946', color: 'white' },
};

function ProductCard({ producto, badge }) {
  const navigate = useNavigate();
  const { addItemToCart } = useOrder();

  const getImgSrc = (imagen) => {
    if (!imagen) return 'https://via.placeholder.com/200x200?text=Sin+imagen';
    if (imagen.startsWith('/uploads')) return `${API_BASE}${imagen}`;
    return imagen;
  };

  // Mostrar descripción corta si existe, sino truncar la larga
  const textoCard = producto.descripcionCorta
    ? producto.descripcionCorta
    : producto.descripcion?.substring(0, 80) + (producto.descripcion?.length > 80 ? '...' : '');

  const badgeInfo = badge ? BADGE_STYLES[badge] : BADGE_STYLES[producto.destacado];

  const sinStock = producto.stock === 0;

  return (
    <div className="card" style={{ position: 'relative' }}>
      {badgeInfo && (
        <span style={{
          position: 'absolute', top: '10px', left: '10px',
          background: badgeInfo.bg, color: badgeInfo.color,
          padding: '3px 10px', borderRadius: '10px',
          fontSize: '0.75rem', fontWeight: 700, zIndex: 1,
        }}>
          {badgeInfo.label}
        </span>
      )}
      <div className="card-descripcion">
        <img
          src={getImgSrc(producto.imagen)}
          alt={producto.nombre}
          className="img-producto"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200?text=Sin+imagen'; }}
        />
        <h3>{producto.nombre}</h3>
        <p>{textoCard}</p>
      </div>
      <div>
        <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          ${Number(producto.precio).toLocaleString('es-AR')}
        </p>
        <div className="card-buttons">
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/productos/${producto._id}`)}
          >
            Ver detalle
          </button>
          <button
            className="btn btn-comprar"
            onClick={() => !sinStock && addItemToCart(producto)}
            disabled={sinStock}
            style={{ opacity: sinStock ? 0.5 : 1, cursor: sinStock ? 'not-allowed' : 'pointer' }}
          >
            {sinStock ? 'Sin stock' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
