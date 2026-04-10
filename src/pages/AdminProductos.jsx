import React, { useEffect, useState } from 'react';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIAS = ['Guitarras', 'Violines', 'Chucherias', 'Bajos', 'Teclados', 'Vientos', 'Percusión', 'Accesorios'];
const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');
const LIMITE_DESTACADO = 5;
const BADGE = {
  nuevo: { label: ' Nuevo ingreso', bg: '#2a9d8f', color: 'white' },
  oferta: { label: ' Oferta', bg: '#e63946', color: 'white' },
  ninguno: { label: '—', bg: 'transparent', color: '#888' },
};
const EMPTY_FORM = {
  nombre: '', precio: '', precioOriginal: '', descripcionCorta: '',
  descripcion: '', imagen: '', categoria: '', destacado: 'ninguno', stock: '',
};

function AdminProductos() {
  const { token } = useAuth();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [imgFile, setImgFile] = useState(null);
  const [imagenesFiles, setImagenesFiles] = useState([]);
  const [imagenesEliminar, setImagenesEliminar] = useState([]);

  const showAlert = (msg, type = 'success') => { setAlert({ msg, type }); setTimeout(() => setAlert(null), 3500); };

  const fetchProductos = () => {
    setLoading(true);
    getProductos()
      .then(data => { setProductos(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  };

  useEffect(() => { fetchProductos(); }, []);

  const contarDestacados = (tipo, excluirId = null) =>
    productos.filter(p => p.destacado === tipo && p._id !== excluirId).length;

  const openCreate = () => {
    setEditando(null); setForm(EMPTY_FORM); setImgFile(null);
    setImagenesFiles([]); setImagenesEliminar([]); setFormErrors({}); setShowModal(true);
  };

  const openEdit = (p) => {
    setEditando(p);
    setForm({
      nombre: p.nombre || '', precio: p.precio || '',
      precioOriginal: p.precioOriginal || '',
      descripcionCorta: p.descripcionCorta || '',
      descripcion: p.descripcion || '', imagen: p.imagen || '',
      categoria: p.categoria || '', destacado: p.destacado || 'ninguno',
      stock: p.stock ?? '',
    });
    setImgFile(null); setImagenesFiles([]); setImagenesEliminar([]);
    setFormErrors({}); setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const toggleEliminarImg = (img) => {
    setImagenesEliminar(prev =>
      prev.includes(img) ? prev.filter(i => i !== img) : [...prev, img]
    );
  };

  const validateForm = () => {
    const errors = {};
    if (!form.nombre.trim()) errors.nombre = 'El nombre es obligatorio.';
    if (!form.precio || isNaN(form.precio) || Number(form.precio) <= 0)
      errors.precio = 'El precio debe ser mayor a 0.';
    if (form.precioOriginal && Number(form.precioOriginal) <= Number(form.precio))
      errors.precioOriginal = 'El precio original debe ser mayor al precio actual.';
    if (!form.descripcion.trim()) errors.descripcion = 'La descripción es obligatoria.';
    if (!form.categoria) errors.categoria = 'Seleccioná una categoría.';
    if (!editando && !imgFile && !form.imagen.trim()) errors.imagen = 'Subí una imagen o pegá una URL.';
    if (form.destacado !== 'ninguno') {
      const actual = contarDestacados(form.destacado, editando?._id);
      if (actual >= LIMITE_DESTACADO)
        errors.destacado = `Límite de ${LIMITE_DESTACADO} en "${BADGE[form.destacado].label}". Quitá uno antes.`;
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') formData.append(k, v); });
      if (form.precioOriginal === '') formData.append('precioOriginal', '');
      if (form.stock === '') formData.append('stock', '');
      if (imgFile) formData.append('imagen', imgFile);
      imagenesFiles.forEach(f => formData.append('imagenes', f));
      if (imagenesEliminar.length > 0)
        formData.append('imagenesEliminar', JSON.stringify(imagenesEliminar));

      if (editando) {
        await updateProducto(editando._id, formData, token);
        showAlert('Producto actualizado exitosamente.');
      } else {
        await createProducto(formData, token);
        showAlert('Producto creado exitosamente.');
      }
      setShowModal(false);
      fetchProductos();
    } catch (err) {
      showAlert(`Error: ${err.message}`, 'error');
    }
  };

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Seguro que deseas eliminar "${nombre}"?`)) return;
    try {
      await deleteProducto(id, token);
      showAlert('Producto eliminado correctamente.');
      fetchProductos();
    } catch (err) {
      showAlert(`Error al eliminar: ${err.message}`, 'error');
    }
  };

  const getImgSrc = (img) => {
    if (!img) return 'https://via.placeholder.com/50';
    return img.startsWith('/uploads') ? `${API_BASE}${img}` : img;
  };

  const totalNuevos = contarDestacados('nuevo');
  const totalOfertas = contarDestacados('oferta');

  return (
    <div className="admin-container">
      <h1 className="titulo-principal">Administración de Productos</h1>

      {alert && <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>{alert.msg}</div>}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ padding: '0.8rem 1.2rem', borderRadius: '8px', background: '#1b4332', color: '#6fcf97', fontWeight: 600 }}>
          🆕 Nuevos ingresos: {totalNuevos} / {LIMITE_DESTACADO}
        </div>
        <div style={{ padding: '0.8rem 1.2rem', borderRadius: '8px', background: '#4a1c1c', color: '#f28b82', fontWeight: 600 }}>
          🔥 Ofertas: {totalOfertas} / {LIMITE_DESTACADO}
        </div>
      </div>

      <div className="contenedor-acciones">
        <button className="btn-principal" onClick={openCreate}>+ Añadir Producto</button>
      </div>

      {loading && <p className="loading">Cargando productos...</p>}
      {error && <p className="loading" style={{ color: '#dc3545' }}>Error: {error}</p>}

      {!loading && !error && (
        <table className="tabla-productos">
          <thead>
            <tr><th>Foto</th><th>Nombre</th><th>Categoría</th><th>Destacado</th><th>Stock</th><th>Precio</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {productos.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No hay productos.</td></tr>}
            {productos.map(p => (
              <tr key={p._id}>
                <td data-label="Foto">
                  <img src={getImgSrc(p.imagen)} alt={p.nombre} className="foto-producto"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }} />
                </td>
                <td data-label="Nombre">{p.nombre}</td>
                <td data-label="Categoría">{p.categoria}</td>
                <td data-label="Destacado">
                  <span style={{ padding: '3px 10px', borderRadius: '10px', fontSize: '0.8rem', background: BADGE[p.destacado || 'ninguno']?.bg, color: BADGE[p.destacado || 'ninguno']?.color, border: (!p.destacado || p.destacado === 'ninguno') ? '1px solid #444' : 'none' }}>
                    {BADGE[p.destacado || 'ninguno']?.label}
                  </span>
                </td>
                <td data-label="Stock">
                  {p.stock === null || p.stock === undefined ? '∞' :
                    p.stock === 0 ? <span style={{ color: '#e63946' }}>Sin stock</span> :
                    p.stock <= 5 ? <span style={{ color: '#f4a261' }}>⚠️ {p.stock}</span> :
                    p.stock}
                </td>
                <td data-label="Precio">
                  {p.precioOriginal && <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '0.85rem', marginRight: '6px' }}>${Number(p.precioOriginal).toLocaleString('es-AR')}</span>}
                  ${Number(p.precio).toLocaleString('es-AR')}
                </td>
                <td data-label="Acciones">
                  <button className="btn btn-editar" onClick={() => openEdit(p)}><i className="bi bi-pencil"></i> Editar</button>
                  <button className="btn btn-borrar" onClick={() => handleDelete(p._id, p.nombre)}><i className="bi bi-trash"></i> Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2>{editando ? 'Editar Producto' : 'Agregar Producto'}</h2>
            <form onSubmit={handleSubmit} noValidate>

              <div className="form-group">
                <label>Nombre</label>
                <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Guitarra Acústica" />
                {formErrors.nombre && <span className="error-msg">{formErrors.nombre}</span>}
              </div>

              <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label>Precio actual</label>
                  <input type="number" name="precio" value={form.precio} onChange={handleChange} placeholder="15000" />
                  {formErrors.precio && <span className="error-msg">{formErrors.precio}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <label>Precio original <span style={{ color: '#888', fontSize: '0.8rem' }}>(tachado, opcional)</span></label>
                  <input type="number" name="precioOriginal" value={form.precioOriginal} onChange={handleChange} placeholder="20000" />
                  {formErrors.precioOriginal && <span className="error-msg">{formErrors.precioOriginal}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Stock <span style={{ color: '#888', fontSize: '0.8rem' }}>(dejar vacío = sin límite)</span></label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="Ej: 10" min="0" />
              </div>

              <div className="form-group">
                <label>Descripción corta <span style={{ color: '#888', fontSize: '0.8rem' }}>(para la card)</span></label>
                <input type="text" name="descripcionCorta" value={form.descripcionCorta} onChange={handleChange} placeholder="Ideal para principiantes..." maxLength={120} />
              </div>

              <div className="form-group">
                <label>Descripción completa <span style={{ color: '#888', fontSize: '0.8rem' }}>(para Ver Detalle)</span></label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción detallada..." />
                {formErrors.descripcion && <span className="error-msg">{formErrors.descripcion}</span>}
              </div>

              <div className="form-group">
                <label>Imagen principal</label>
                <input type="file" accept="image/*" onChange={(e) => setImgFile(e.target.files[0])} />
                <label style={{ marginTop: '0.4rem', display: 'block', fontSize: '0.85rem', color: '#888' }}>O pegar URL</label>
                <input type="text" name="imagen" value={form.imagen} onChange={handleChange} placeholder="https://..." />
                {formErrors.imagen && <span className="error-msg">{formErrors.imagen}</span>}
              </div>

              <div className="form-group">
                <label>Imágenes adicionales <span style={{ color: '#888', fontSize: '0.8rem' }}>(hasta 5, se suman a las existentes)</span></label>
                <input type="file" accept="image/*" multiple onChange={(e) => setImagenesFiles(Array.from(e.target.files).slice(0, 5))} />
              </div>

              {/* Imágenes existentes al editar */}
              {editando && editando.imagenes?.length > 0 && (
                <div className="form-group">
                  <label>Imágenes actuales <span style={{ color: '#888', fontSize: '0.8rem' }}>(marcá las que querés eliminar)</span></label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {editando.imagenes.map((img, i) => (
                      <div key={i} style={{ position: 'relative', cursor: 'pointer' }} onClick={() => toggleEliminarImg(img)}>
                        <img src={`${API_BASE}${img}`} alt={`img-${i}`}
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', opacity: imagenesEliminar.includes(img) ? 0.3 : 1, border: imagenesEliminar.includes(img) ? '2px solid #e63946' : '2px solid transparent' }} />
                        {imagenesEliminar.includes(img) && (
                          <span style={{ position: 'absolute', top: '2px', right: '2px', fontSize: '0.7rem', background: '#e63946', color: 'white', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Categoría</label>
                <select name="categoria" value={form.categoria} onChange={handleChange}>
                  <option value="">-- Seleccionar --</option>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {formErrors.categoria && <span className="error-msg">{formErrors.categoria}</span>}
              </div>

              <div className="form-group">
                <label>Sección destacada en el Home</label>
                <select name="destacado" value={form.destacado} onChange={handleChange}>
                  <option value="ninguno">Sin destacar</option>
                  <option value="nuevo">🆕 Nuevo ingreso ({contarDestacados('nuevo', editando?._id)}/{LIMITE_DESTACADO})</option>
                  <option value="oferta">🔥 Oferta ({contarDestacados('oferta', editando?._id)}/{LIMITE_DESTACADO})</option>
                </select>
                {formErrors.destacado && <span className="error-msg">{formErrors.destacado}</span>}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-volver" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editando ? 'Guardar Cambios' : 'Crear Producto'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductos;
