import React, { useEffect, useState } from 'react';
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from '../services/api';

const CATEGORIAS = ['Guitarras', 'Pianos', 'Violines', 'chucherias', 'Bajos', 'Baterías', 'Teclados', 'Vientos', 'Percusión', 'Accesorios'];

const EMPTY_FORM = {
  nombre: '',
  precio: '',
  descripcion: '',
  imagen: '',
  categoria: '',
};

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null); // null = creando, objeto = editando
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const fetchProductos = () => {
    setLoading(true);
    getProductos()
      .then(data => { setProductos(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  };

  useEffect(() => { fetchProductos(); }, []);

  const openCreate = () => {
    setEditando(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (producto) => {
    setEditando(producto);
    setForm({
      nombre: producto.nombre || '',
      precio: producto.precio || '',
      descripcion: producto.descripcion || '',
      imagen: producto.imagen || '',
      categoria: producto.categoria || '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!form.nombre.trim()) errors.nombre = 'El nombre es obligatorio.';
    if (!form.precio || isNaN(form.precio) || Number(form.precio) <= 0)
      errors.precio = 'El precio debe ser un número mayor a 0.';
    if (!form.descripcion.trim()) errors.descripcion = 'La descripción es obligatoria.';
    if (!form.imagen.trim()) errors.imagen = 'La URL de imagen es obligatoria.';
    if (!form.categoria) errors.categoria = 'Selecciona una categoría.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    try {
      if (editando) {
        await updateProducto(editando.id, form);
        showAlert('Producto actualizado exitosamente.');
      } else {
        await createProducto(form);
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
      await deleteProducto(id);
      showAlert('Producto eliminado correctamente.');
      fetchProductos();
    } catch (err) {
      showAlert(`Error al eliminar: ${err.message}`, 'error');
    }
  };

  return (
    <div className="admin-container">
      <h1 className="titulo-principal">Administración de Productos</h1>

      {alert && (
        <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {alert.msg}
        </div>
      )}

      <div className="contenedor-acciones">
        <button className="btn-principal" onClick={openCreate}>
          + Añadir Producto
        </button>
      </div>

      {loading && <p className="loading">Cargando productos...</p>}
      {error && <p className="loading" style={{ color: '#dc3545' }}>Error: {error}</p>}

      {!loading && !error && (
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Fecha</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No hay productos.</td></tr>
            )}
            {productos.map(p => (
              <tr key={p.id}>
                <td data-label="Foto">
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    className="foto-producto"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                  />
                </td>
                <td data-label="Nombre">{p.nombre}</td>
                <td data-label="Descripción">{p.descripcion?.substring(0, 50)}...</td>
                <td data-label="Categoría">{p.categoria}</td>
                <td data-label="Fecha">{p.createdAt ? new Date(p.createdAt).toLocaleDateString('es-AR') : '-'}</td>
                <td data-label="Precio">${Number(p.precio).toLocaleString('es-AR')}</td>
                <td data-label="Acciones">
                  <button className="btn btn-editar" onClick={() => openEdit(p)}>
                    <i className="bi bi-pencil"></i> Editar
                  </button>
                  <button className="btn btn-borrar" onClick={() => handleDelete(p.id, p.nombre)}>
                    <i className="bi bi-trash"></i> Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2>{editando ? 'Editar Producto' : 'Agregar Producto'}</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label>Nombre del producto</label>
                <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Guitarra Acústica" />
                {formErrors.nombre && <span className="error-msg">{formErrors.nombre}</span>}
              </div>
              <div className="form-group">
                <label>Precio</label>
                <input type="number" name="precio" value={form.precio} onChange={handleChange} placeholder="15000" />
                {formErrors.precio && <span className="error-msg">{formErrors.precio}</span>}
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción del producto..." />
                {formErrors.descripcion && <span className="error-msg">{formErrors.descripcion}</span>}
              </div>
              <div className="form-group">
                <label>Imagen (URL)</label>
                <input type="text" name="imagen" value={form.imagen} onChange={handleChange} placeholder="https://..." />
                {formErrors.imagen && <span className="error-msg">{formErrors.imagen}</span>}
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select name="categoria" value={form.categoria} onChange={handleChange}>
                  <option value="">-- Seleccionar --</option>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {formErrors.categoria && <span className="error-msg">{formErrors.categoria}</span>}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-volver" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">
                  {editando ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductos;
