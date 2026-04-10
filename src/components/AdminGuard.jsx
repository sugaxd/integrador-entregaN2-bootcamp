import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminGuard({ children }) {
  const { isLoggedIn, isAdmin } = useAuth();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!isAdmin) return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h2> Acceso denegado</h2>
      <p>No tenés permisos para acceder a esta sección.</p>
      <a href="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
        Volver al inicio
      </a>
    </div>
  );

  return children;
}

export default AdminGuard;
