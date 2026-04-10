import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUsuario } from '../services/api';

const PROVINCIAS = [
  'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
  'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa',
  'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro',
  'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
  'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
];

function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '', email: '', password: '', repetirPassword: '',
    fechaNacimiento: '', provincia: '', terminos: false,
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showRepeatPass, setShowRepeatPass] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[A-Za-z0-9._+\-']+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    if (!form.email) newErrors.email = 'El email es obligatorio.';
    else if (!emailRegex.test(form.email)) newErrors.email = 'Email inválido.';
    if (!form.password) newErrors.password = 'La contraseña es obligatoria.';
    if (!form.repetirPassword) newErrors.repetirPassword = 'Repetí tu contraseña.';
    else if (form.password !== form.repetirPassword) newErrors.repetirPassword = 'Las contraseñas no coinciden.';
    if (!form.fechaNacimiento) newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria.';
    if (!form.provincia) newErrors.provincia = 'Seleccioná una provincia.';
    if (!form.terminos) newErrors.terminos = 'Debés aceptar los términos y condiciones.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('nombre', form.nombre);
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('fechaNacimiento', form.fechaNacimiento);
      formData.append('provincia', form.provincia);
      await createUsuario(formData);
      setAlert({ type: 'success', msg: '¡Cuenta creada exitosamente! Redirigiendo al login...' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setAlert({ type: 'error', msg: err.message || 'Error al registrar. Intentá nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  // Estilo para el pass con ojo
  const passFieldStyle = { position: 'relative' };
  const eyeBtnStyle = {
    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '1rem',
  };

  return (
    <div className="div-registro">
      <section className="seccion-registro">
        <h1>Registro de Usuario</h1>

        {alert && (
          <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {alert.msg}
          </div>
        )}

        <form className="form-registro" onSubmit={handleSubmit} noValidate>
          <div>
            <label>Nombre Completo</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Juan Pérez" />
            {errors.nombre && <span className="error-msg">{errors.nombre}</span>}
          </div>

          <div>
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="correo@ejemplo.com" />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div>
            <label>Contraseña</label>
            <div style={passFieldStyle}>
              <input
                type={showPass ? 'text' : 'password'}
                name="password" value={form.password}
                onChange={handleChange} placeholder="********"
                style={{ paddingRight: '2.5rem', width: '100%' }}
              />
              <button type="button" style={eyeBtnStyle} onClick={() => setShowPass(!showPass)}>
                <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          <div>
            <label>Repetir Contraseña</label>
            <div style={passFieldStyle}>
              <input
                type={showRepeatPass ? 'text' : 'password'}
                name="repetirPassword" value={form.repetirPassword}
                onChange={handleChange} placeholder="********"
                style={{ paddingRight: '2.5rem', width: '100%' }}
              />
              <button type="button" style={eyeBtnStyle} onClick={() => setShowRepeatPass(!showRepeatPass)}>
                <i className={`bi ${showRepeatPass ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
            {errors.repetirPassword && <span className="error-msg">{errors.repetirPassword}</span>}
          </div>

          <div>
            <label>Fecha de Nacimiento</label>
            <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} />
            {errors.fechaNacimiento && <span className="error-msg">{errors.fechaNacimiento}</span>}
          </div>

          <div>
            <label>Provincia</label>
            <select name="provincia" value={form.provincia} onChange={handleChange}>
              <option value="">-- Seleccionar --</option>
              {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.provincia && <span className="error-msg">{errors.provincia}</span>}
          </div>

          <div className="form-check">
            <input type="checkbox" name="terminos" id="terminos" checked={form.terminos} onChange={handleChange} />
            <label htmlFor="terminos">Acepto los términos y condiciones de El Bordo.</label>
          </div>
          {errors.terminos && <span className="error-msg">{errors.terminos}</span>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Registro;
