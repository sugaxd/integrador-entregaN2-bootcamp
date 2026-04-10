import React, { useState } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function StarRating({ value, onChange, readonly = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{ fontSize: readonly ? '1.2rem' : '1.6rem', cursor: readonly ? 'default' : 'pointer', color: star <= (hovered || value) ? '#f4a261' : '#444' }}>
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewSection({ producto, token, isLoggedIn, user, onReviewAdded }) {
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const yaReseñó = producto.reviews?.some(r => r.user?._id === user?._id || r.user === user?._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { setMsg({ type: 'error', text: 'Seleccioná una calificación.' }); return; }
    if (!comentario.trim()) { setMsg({ type: 'error', text: 'Escribí un comentario.' }); return; }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/products/${producto._id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating, comentario }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      setMsg({ type: 'success', text: '✅ Reseña publicada.' });
      setRating(0); setComentario('');
      onReviewAdded();
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="descripcion-ver-mas" style={{ marginTop: '2rem' }}>
      <h2>⭐ Reseñas ({producto.reviews?.length || 0})</h2>

      {/* Lista de reseñas */}
      {producto.reviews?.length === 0 && (
        <p style={{ color: '#888' }}>Todavía no hay reseñas. ¡Sé el primero!</p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {producto.reviews?.map((r, i) => (
          <div key={i} style={{ background: '#1a1a2e', borderRadius: '10px', padding: '1rem 1.2rem', borderLeft: '4px solid #f4a261' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <strong>{r.nombre}</strong>
              <StarRating value={r.rating} readonly />
            </div>
            <p style={{ margin: 0, color: '#ccc', lineHeight: '1.5' }}>{r.comentario}</p>
            <p style={{ margin: '0.4rem 0 0', fontSize: '0.78rem', color: '#666' }}>
              {new Date(r.createdAt).toLocaleDateString('es-AR')}
            </p>
          </div>
        ))}
      </div>

      {/* Formulario de reseña */}
      {!isLoggedIn ? (
        <p style={{ color: '#888' }}>
          <a href="/login" style={{ color: '#f4a261' }}>Iniciá sesión</a> para dejar una reseña.
        </p>
      ) : yaReseñó ? (
        <p style={{ color: '#2a9d8f' }}>✅ Ya dejaste tu reseña para este producto.</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Dejá tu reseña</h3>

          {msg && (
            <div style={{ padding: '0.6rem 1rem', borderRadius: '6px', marginBottom: '1rem', background: msg.type === 'success' ? '#1b4332' : '#4a1c1c', color: msg.type === 'success' ? '#6fcf97' : '#f28b82' }}>
              {msg.text}
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem' }}>Calificación</label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem' }}>Comentario</label>
            <textarea
              value={comentario} onChange={e => setComentario(e.target.value)}
              placeholder="¿Qué te pareció el producto?"
              rows={4}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #333', background: '#1a1a2e', color: '#f0f0f0', resize: 'vertical' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Publicando...' : 'Publicar reseña'}
          </button>
        </form>
      )}
    </div>
  );
}

export default ReviewSection;
