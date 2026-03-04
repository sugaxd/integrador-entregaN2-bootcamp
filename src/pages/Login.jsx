import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'El email es obligatorio.';
    if (!form.password) newErrors.password = 'La contraseña es obligatoria.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log('Datos de login:', { email: form.email, password: form.password });
    alert(`Login exitoso!\nEmail: ${form.email}`);
  };

  return (
    <div className="div-login">
      <section className="seccion-login">
        <h1>Iniciar Sesión</h1>

        <form className="form-login" onSubmit={handleSubmit} noValidate>
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
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            Ingresar
          </button>

          <Link to="/registro">¿No tenés cuenta? Registrate aquí</Link>
        </form>
      </section>
    </div>
  );
}

export default Login;
