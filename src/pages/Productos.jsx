import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { getProductos } from '../services/api';

const CATEGORIAS = ['Todas', 'Guitarras', 'Violines', 'Chucherias', 'Bajos', 'Teclados', 'Vientos', 'Percusión', 'Accesorios'];
const POR_PAGINA = 10;

function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    getProductos()
      .then(data => { setProductos(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  // Reset page al cambiar filtros
  useEffect(() => { setPagina(1); }, [busqueda, categoriaActiva]);

  const filtrados = productos.filter(p => {
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaActiva === 'Todas' || p.categoria === categoriaActiva;
    return coincideBusqueda && coincideCategoria;
  });

  const totalPaginas = Math.ceil(filtrados.length / POR_PAGINA);
  const productosPagina = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  return (
    <div style={{ padding: '1rem' }}>
      <h1 className="titulo-principal">Todos los Productos</h1>

      {/* Buscador */}
      <div style={{ maxWidth: '500px', margin: '0 auto 1.5rem', position: 'relative' }}>
        <i className="bi bi-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}></i>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ width: '100%', padding: '0.7rem 0.7rem 0.7rem 2.5rem', borderRadius: '25px', border: '1px solid #333', background: '#1a1a2e', color: '#f0f0f0', fontSize: '1rem' }}
        />
        {busqueda && (
          <button onClick={() => setBusqueda('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
        )}
      </div>

      {/* Filtros por categ */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
        {CATEGORIAS.map(cat => (
          <button key={cat} onClick={() => setCategoriaActiva(cat)}
            style={{
              padding: '0.4rem 1rem', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
              background: categoriaActiva === cat ? '#e63946' : '#2a2a3e',
              color: categoriaActiva === cat ? 'white' : '#ccc',
              transition: 'all 0.2s',
            }}>
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="loading">Cargando productos...</p>}
      {error && <p className="loading" style={{ color: '#dc3545' }}>Error: {error}</p>}

      {/* Resultado de búsqueda */}
      {!loading && !error && busqueda && (
        <p style={{ textAlign: 'center', color: '#888', marginBottom: '1rem' }}>
          {filtrados.length} resultado{filtrados.length !== 1 ? 's' : ''} para "{busqueda}"
        </p>
      )}

      <div className="card-container">
        {!loading && !error && productosPagina.map(producto => (
          <ProductCard key={producto._id} producto={producto} />
        ))}
        {!loading && !error && filtrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888', width: '100%' }}>
            <i className="bi bi-search" style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}></i>
            <p>No se encontraron productos{busqueda ? ` para "${busqueda}"` : ''}.</p>
            {busqueda && <button onClick={() => setBusqueda('')} className="btn btn-primary" style={{ marginTop: '1rem' }}>Limpiar búsqueda</button>}
          </div>
        )}
      </div>

      {/* Paginacion */}
      {!loading && !error && totalPaginas > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', margin: '2rem 0', flexWrap: 'wrap' }}>
          <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: pagina === 1 ? '#2a2a3e' : '#e63946', color: 'white', cursor: pagina === 1 ? 'not-allowed' : 'pointer', opacity: pagina === 1 ? 0.5 : 1 }}>
            ← Anterior
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
            <button key={num} onClick={() => setPagina(num)}
              style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none', background: pagina === num ? '#e63946' : '#2a2a3e', color: 'white', cursor: 'pointer', fontWeight: pagina === num ? 700 : 400 }}>
              {num}
            </button>
          ))}

          <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: pagina === totalPaginas ? '#2a2a3e' : '#e63946', color: 'white', cursor: pagina === totalPaginas ? 'not-allowed' : 'pointer', opacity: pagina === totalPaginas ? 0.5 : 1 }}>
            Siguiente →
          </button>

          <span style={{ color: '#888', fontSize: '0.85rem', width: '100%', textAlign: 'center', marginTop: '0.5rem' }}>
            Página {pagina} de {totalPaginas} — {filtrados.length} productos
          </span>
        </div>
      )}
    </div>
  );
}

export default Productos;
