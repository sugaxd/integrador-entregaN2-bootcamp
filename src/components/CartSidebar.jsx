import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function CartSidebar({ isOpen, onClose }) {
  const { order, count, total, clearCart, createOrder } = useOrder();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateOrder = async () => {
    if (!isLoggedIn) { onClose(); navigate('/login'); return; }
    setLoading(true);
    setError(null);
    try {
      await createOrder();
      setSuccess(true);
      // Resetear éxito después de 4 seg
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999,
        }} />
      )}

      <aside style={{
        position: 'fixed', top: 0, right: 0,
        width: '360px', maxWidth: '100vw', height: '100vh',
        background: '#1a1a2e', color: '#f0f0f0',
        zIndex: 1000, display: 'flex', flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.4)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1.2rem 1.5rem', borderBottom: '1px solid #333',
        }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>🛒 Mi Carrito ({count})</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#f0f0f0', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Mensaje de exito de carrito */}
        {success && (
          <div style={{
            margin: '1rem 1.5rem 0',
            padding: '1rem', borderRadius: '8px',
            background: '#1b4332', color: '#6fcf97',
            textAlign: 'center', fontWeight: 600,
          }}>
             ¡Orden creada correctamente!<br />
            <span style={{ fontSize: '0.85rem', fontWeight: 400 }}>Gracias por tu compra</span>
          </div>
        )}

        {error && (
          <div style={{
            margin: '1rem 1.5rem 0',
            padding: '0.8rem', borderRadius: '8px',
            background: '#4a1c1c', color: '#f28b82',
          }}>
            ❌ {error}
          </div>
        )}

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {order.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '3rem', color: '#888' }}>
              <i className="bi bi-cart-x" style={{ fontSize: '3rem' }}></i>
              <p style={{ marginTop: '1rem' }}>
                {success ? 'Tu orden fue enviada 🎉' : 'Tu carrito está vacío'}
              </p>
            </div>
          ) : (
            order.map((item) => (
              <div key={item._id} style={{
                display: 'flex', gap: '1rem', alignItems: 'center',
                padding: '0.8rem 0', borderBottom: '1px solid #2a2a3e',
              }}>
                <img
                  src={item.imagen?.startsWith('/uploads')
                    ? `${(process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '')}${item.imagen}`
                    : item.imagen}
                  alt={item.nombre}
                  style={{ width: '55px', height: '55px', objectFit: 'cover', borderRadius: '8px' }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/55'; }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{item.nombre}</p>
                  <p style={{ margin: '2px 0 0', color: '#aaa', fontSize: '0.82rem' }}>
                    x{item.quantity} — ${(item.precio * item.quantity).toLocaleString('es-AR')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer con botones — solo si hay item */}
        {order.length > 0 && (
          <div style={{ padding: '1.2rem 1.5rem', borderTop: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 600 }}>Total:</span>
              <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#e63946' }}>
                ${total.toLocaleString('es-AR')}
              </span>
            </div>
            <button onClick={handleCreateOrder} disabled={loading} style={{
              width: '100%', padding: '0.8rem',
              background: '#e63946', color: 'white',
              border: 'none', borderRadius: '8px',
              fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
              marginBottom: '0.5rem', opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Procesando...' : 'Confirmar Orden'}
            </button>
            <button onClick={clearCart} style={{
              width: '100%', padding: '0.6rem',
              background: 'transparent', color: '#888',
              border: '1px solid #444', borderRadius: '8px',
              cursor: 'pointer', fontSize: '0.9rem',
            }}>
              Vaciar carrito
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default CartSidebar;
