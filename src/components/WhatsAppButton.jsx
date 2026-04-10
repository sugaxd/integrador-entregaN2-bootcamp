import React from 'react';

function WhatsAppButton({ numero = '5492644451811', mensaje = 'Hola! Quiero consultar sobre un producto de El Bordo.' }) {
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp"
      style={{
        position: 'fixed', bottom: '90px', right: '24px', zIndex: 900,
        background: '#25d366', color: 'white',
        width: '56px', height: '56px', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.7rem', boxShadow: '0 4px 15px rgba(37,211,102,0.5)',
        transition: 'transform 0.2s',
        textDecoration: 'none',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <i className="bi bi-whatsapp"></i>
    </a>
  );
}

export default WhatsAppButton;
