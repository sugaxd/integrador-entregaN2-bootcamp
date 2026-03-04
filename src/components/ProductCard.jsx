import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProductCard({ producto }) {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div className="card-descripcion">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="img-producto"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200?text=Sin+imagen'; }}
        />
        <h3>{producto.nombre}</h3>
        <p>{producto.descripcion}</p>
      </div>
      <div>
        <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          ${Number(producto.precio).toLocaleString('es-AR')}
        </p>
        <div className="card-buttons">
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/productos/${producto.id}`)}
          >
            Ver detalle
          </button>
          <button className="btn btn-comprar">
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
