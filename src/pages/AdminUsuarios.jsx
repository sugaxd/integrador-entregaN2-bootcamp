import React, { useEffect, useState } from 'react';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PROVINCIAS = [
  'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
  'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa',
  'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro',
  'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
  'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
];
const EMPTY_FORM = { nombre: '', email: '', password: '', fechaNacimiento: '', provincia: '', role: 'client' };

function AdminUsuarios() {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [imgFile, setImgFile] = useState(null);

  const showAlert = (msg, type = 'success') => { setAlert({ msg, type }); setTimeout(() => setAlert(null), 3000); };

  const fetchUsuarios = () => {
    setLoading(true);
    getUsuarios(token)
      .then(data => { setUsuarios(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  };

  useEffect(() => { fetchUsuarios(); }, []);

  const openCreate = () => { setEditando(null); setForm(EMPTY_FORM); setImgFile(null); setFormErrors({}); setShowModal(true); };
  const openEdit = (u) => {
    setEditando(u);
    setForm({ nombre: u.nombre || '', email: u.email || '', password: '', fechaNacimiento: u.fechaNacimiento || '', provincia: u.provincia || '', role: u.role || 'client' });
    setImgFile(null); setFormErrors({}); setShowModal(true);
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
    if (!form.provincia) errors.provincia = 'Seleccioná una provincia.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    try {
      const formData = new FormData();
      formData.append('nombre', form.nombre);
      formData.append('email', form.email);
      formData.append('provincia', form.provincia);
      formData.append('fechaNacimiento', form.fechaNacimiento);
      formData.append('role', form.role);
      if (form.password) formData.append('password', form.password);
      if (imgFile) formData.append('imagen', imgFile);

      if (editando) {
        await updateUsuario(editando._id, formData, token);
        showAlert('Usuario actualizado exitosamente.');
      } else {
        await createUsuario(formData);
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
      await deleteUsuario(id, token);
      showAlert('Usuario eliminado correctamente.');
      fetchUsuarios();
    } catch (err) {
      showAlert(`Error al eliminar: ${err.message}`, 'error');
    }
  };

  return (
    <div className="admin-container">
      <h1 className="titulo-principal">Administración de Usuarios</h1>

      {alert && <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>{alert.msg}</div>}

      <div className="contenedor-acciones">
        <button className="btn-principal" onClick={openCreate}>+ Añadir Usuario</button>
      </div>

      {loading && <p className="loading">Cargando usuarios...</p>}
      {error && <p className="loading" style={{ color: '#dc3545' }}>Error: {error}</p>}

      {!loading && !error && (
        <table className="tabla-productos">
          <thead>
            <tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Provincia</th><th>Fecha Nac.</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {usuarios.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No hay usuarios.</td></tr>}
            {usuarios.map(u => (
              <tr key={u._id}>
                <td data-label="Nombre">{u.nombre}</td>
                <td data-label="Email">{u.email}</td>
                <td data-label="Rol"><span style={{ padding: '2px 8px', borderRadius: '10px', background: u.role === 'admin' ? '#e63946' : '#2a9d8f', color: 'white', fontSize: '0.8rem' }}>{u.role}</span></td>
                <td data-label="Provincia">{u.provincia}</td>
                <td data-label="Fecha Nac.">{u.fechaNacimiento || '-'}</td>
                <td data-label="Acciones">
                  <button className="btn btn-editar" onClick={() => openEdit(u)}><i className="bi bi-pencil"></i> Editar</button>
                  <button className="btn btn-borrar" onClick={() => handleDelete(u._id, u.nombre)}><i className="bi bi-trash"></i> Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
                <label>Rol</label>
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="client">Cliente</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Foto de perfil</label>
                <input type="file" accept="image/*" onChange={(e) => setImgFile(e.target.files[0])} />
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
                <button type="submit" className="btn btn-primary">{editando ? 'Guardar Cambios' : 'Crear Usuario'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsuarios;
