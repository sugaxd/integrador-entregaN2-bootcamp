import React, { useEffect, useState } from 'react';
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from '../services/api';

const PROVINCIAS = ['San Juan', 'Corrientes', 'Mendoza', 'Buenos Aires', 'Córdoba', 'Santa Fe', 'Tucumán', 'Entre Ríos', 'Salta', 'Misiones', 'Chaco', 'Chubut', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Neuquén', 'Río Negro'];

const EMPTY_FORM = { nombre: '', email: '', password: '', fechaNacimiento: '', provincia: '' };

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const fetchUsuarios = () => {
    setLoading(true);
    getUsuarios()
      .then(data => { setUsuarios(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  };

  useEffect(() => { fetchUsuarios(); }, []);

  const openCreate = () => {
    setEditando(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (usuario) => {
    setEditando(usuario);
    setForm({
      nombre: usuario.nombre || '',
      email: usuario.email || '',
      password: '',
      fechaNacimiento: usuario.fechaNacimiento || '',
      provincia: usuario.provincia || '',
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
    if (!form.email.trim()) errors.email = 'El email es obligatorio.';
    if (!editando && !form.password.trim()) errors.password = 'La contraseña es obligatoria.';
    if (!form.provincia) errors.provincia = 'Selecciona una provincia.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    try {
      const data = { ...form };
      if (editando && !data.password) delete data.password;

      if (editando) {
        await updateUsuario(editando.id, data);
        showAlert('Usuario actualizado exitosamente.');
      } else {
        await createUsuario(data);
        showAlert('Usuario creado exitosamente.');
      }
      setShowModal(false);
      fetchUsuarios();
    } catch (err) {
      showAlert(`Error: ${err.message}`, 'error');
    }
  };

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Seguro que deseas eliminar a "${nombre}"?`)) return;
    try {
      await deleteUsuario(id);
      showAlert('Usuario eliminado correctamente.');
      fetchUsuarios();
    } catch (err) {
      showAlert(`Error al eliminar: ${err.message}`, 'error');
    }
  };

  return (
    <div className="admin-container">
      <h1 className="titulo-principal">Administración de Usuarios</h1>

      {alert && (
        <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {alert.msg}
        </div>
      )}

      <div className="contenedor-acciones">
        <button className="btn-principal" onClick={openCreate}>
          + Añadir Usuario
        </button>
      </div>

      {loading && <p className="loading">Cargando usuarios...</p>}
      {error && <p className="loading" style={{ color: '#dc3545' }}>Error: {error}</p>}

      {!loading && !error && (
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Provincia</th>
              <th>Fecha Nac.</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No hay usuarios registrados.</td></tr>
            )}
            {usuarios.map(u => (
              <tr key={u.id}>
                <td data-label="Nombre">{u.nombre}</td>
                <td data-label="Email">{u.email}</td>
                <td data-label="Provincia">{u.provincia}</td>
                <td data-label="Fecha Nac.">{u.fechaNacimiento || '-'}</td>
                <td data-label="Acciones">
                  <button className="btn btn-editar" onClick={() => openEdit(u)}>
                    <i className="bi bi-pencil"></i> Editar
                  </button>
                  <button className="btn btn-borrar" onClick={() => handleDelete(u.id, u.nombre)}>
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
            <h2>{editando ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label>Nombre completo</label>
                <input type="text" name="nombre" value={form.nombre} onChange={handleChange} />
                {formErrors.nombre && <span className="error-msg">{formErrors.nombre}</span>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} />
                {formErrors.email && <span className="error-msg">{formErrors.email}</span>}
              </div>
              <div className="form-group">
                <label>{editando ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña'}</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} />
                {formErrors.password && <span className="error-msg">{formErrors.password}</span>}
              </div>
              <div className="form-group">
                <label>Fecha de nacimiento</label>
                <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Provincia</label>
                <select name="provincia" value={form.provincia} onChange={handleChange}>
                  <option value="">-- Seleccionar --</option>
                  {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {formErrors.provincia && <span className="error-msg">{formErrors.provincia}</span>}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-volver" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">
                  {editando ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsuarios;
