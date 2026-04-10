import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUsuario } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
    setApiError('');
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
      const data = await loginUsuario(form.email, form.password);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setApiError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="div-login">
      <section className="seccion-login">
        <h1>Iniciar Sesión</h1>

        {apiError && (
          <div style={{ background: '#4a1c1c', color: '#f28b82', padding: '0.7rem 1rem', borderRadius: '6px', marginBottom: '1rem' }}>
            {apiError}
          </div>
        )}

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

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>

          <Link to="/registro">¿No tenés cuenta? Registrate aquí</Link>
        </form>
      </section>
    </div>
  );
}

export default Login;
