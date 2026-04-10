import React, { useState } from 'react';

function CookieBanner() {
  const [aceptado, setAceptado] = useState(() => !!localStorage.getItem('elbordo_cookies'));

  if (aceptado) return null;

  const aceptar = () => {
    localStorage.setItem('elbordo_cookies', 'true');
    setAceptado(true);
  };

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100,
      background: '#1a1a2e', color: '#f0f0f0',
      padding: '1rem 2rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: '1rem',
      borderTop: '2px solid #e63946',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.4)',
    }}>
      <p style={{ margin: 0, fontSize: '0.9rem', flex: 1 }}>
        🍪 Usamos cookies para mejorar tu experiencia en El Bordo amiguin. Al continuar navegando, aceptas nuestra{' '}
        <a href="/" style={{ color: '#e63946' }}>política de privacidad</a>.
      </p>
      <div style={{ display: 'flex', gap: '0.8rem' }}>
        <button onClick={aceptar} className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', whiteSpace: 'nowrap' }}>
          Aceptar todo
        </button>
        <button onClick={aceptar} style={{ background: 'none', border: '1px solid #555', color: '#aaa', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          Solo necesarias
        </button>
      </div>
    </div>
  );
}

export default CookieBanner;
