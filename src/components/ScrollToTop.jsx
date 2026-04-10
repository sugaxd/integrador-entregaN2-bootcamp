import React, { useState, useEffect } from 'react';

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Volver arriba"
      style={{
        position: 'fixed', bottom: '24px', right: '24px', zIndex: 900,
        background: '#e63946', color: 'white',
        width: '56px', height: '56px', borderRadius: '50%',
        border: 'none', fontSize: '1.4rem', cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(230,57,70,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <i className="bi bi-arrow-up"></i>
    </button>
  );
}

export default ScrollToTop;
