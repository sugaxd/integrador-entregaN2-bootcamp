import React, { useState } from 'react';
import { createUsuario } from '../services/api';

const PROVINCIAS = ['San Juan', 'Corrientes', 'Mendoza', 'Buenos Aires', 'Córdoba', 'Santa Fe', 'Tucumán'];

function Registro() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    repetirPassword: '',
    fechaNacimiento: '',
    provincia: '',
    terminos: false,
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/;
    const emailRegex = /^[A-Za-z0-9._+\-']+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
    const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;

    if (!form.nombre) newErrors.nombre = 'El nombre es obligatorio.';
    else if (!nombreRegex.test(form.nombre)) newErrors.nombre = 'Solo letras y espacios.';

    if (!form.email) newErrors.email = 'El email es obligatorio.';
    else if (!emailRegex.test(form.email)) newErrors.email = 'Email inválido.';

    if (!form.password) newErrors.password = 'La contraseña es obligatoria.';
    else if (!passRegex.test(form.password))
      newErrors.password = 'Mínimo 8 caracteres, una mayúscula, una minúscula y un número.';

    if (!form.repetirPassword) newErrors.repetirPassword = 'Repite tu contraseña.';
    else if (form.password !== form.repetirPassword)
      newErrors.repetirPassword = 'Las contraseñas no coinciden.';

    if (!form.fechaNacimiento) newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria.';

    if (!form.provincia) newErrors.provincia = 'Selecciona una provincia.';

    if (!form.terminos) newErrors.terminos = 'Debes aceptar los términos y condiciones.';

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
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const { repetirPassword, terminos, ...userData } = form;
      await createUsuario(userData);
      setAlert({ type: 'success', msg: '¡Usuario registrado exitosamente!' });
      setForm({ nombre: '', email: '', password: '', repetirPassword: '', fechaNacimiento: '', provincia: '', terminos: false });
      setErrors({});
    } catch (err) {
      setAlert({ type: 'error', msg: 'Error al registrar. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
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
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Anacleto Palermo"
            />
            {errors.nombre && <span className="error-msg">{errors.nombre}</span>}
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div>
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
            />
            <span className="form-text">
              Entre 8 y 20 caracteres, letras mayúsculas, minúsculas y números.
            </span>
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          <div>
            <label>Repetir Contraseña</label>
            <input
              type="password"
              name="repetirPassword"
              value={form.repetirPassword}
              onChange={handleChange}
              placeholder="********"
            />
            {errors.repetirPassword && <span className="error-msg">{errors.repetirPassword}</span>}
          </div>

          <div>
            <label>Fecha de Nacimiento</label>
            <input
              type="date"
              name="fechaNacimiento"
              value={form.fechaNacimiento}
              onChange={handleChange}
            />
            {errors.fechaNacimiento && <span className="error-msg">{errors.fechaNacimiento}</span>}
          </div>

          <div>
            <label>Seleccione su Provincia</label>
            <select name="provincia" value={form.provincia} onChange={handleChange}>
              <option value="">-- Seleccionar --</option>
              {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.provincia && <span className="error-msg">{errors.provincia}</span>}
          </div>

          <div className="form-check">
            <input
              type="checkbox"
              name="terminos"
              id="terminos"
              checked={form.terminos}
              onChange={handleChange}
            />
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
