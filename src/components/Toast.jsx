import React, { useEffect, useState } from 'react';

function Toast({ mensaje, visible, onClose, duracion = 5000 }) {
  const [saliendo, setSaliendo] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const timer1 = setTimeout(() => setSaliendo(true), duracion - 400);
    const timer2 = setTimeout(() => { setSaliendo(false); onClose(); }, duracion);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, [visible]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', top: '80px', right: '20px', zIndex: 1200,
      background: '#1a1a2e', color: '#f0f0f0',
      padding: '1rem 1.2rem',
      borderRadius: '12px', maxWidth: '320px',
      boxShadow: '0 6px 25px rgba(0,0,0,0.5)',
      borderLeft: '4px solid #e63946',
      display: 'flex', gap: '0.8rem', alignItems: 'flex-start',
      opacity: saliendo ? 0 : 1,
      transform: saliendo ? 'translateX(20px)' : 'translateX(0)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
      animation: 'slideIn 0.4s ease',
    }}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>🛒</span>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: '1.5' }}>{mensaje}</p>
        <a href="/registro" style={{ color: '#e63946', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none', display: 'inline-block', marginTop: '0.4rem' }}>
          Registrarme ahora →
        </a>
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1rem', padding: 0, flexShrink: 0 }}>✕</button>
    </div>
  );
}

export default Toast;
