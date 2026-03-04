import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logoImg from '../assets/logo.png';

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar-bs">
      <div className="navbar-top">
        <Link to="/" className="navbar-brand">
          <img src={logoImg} alt="El Bordo Logo" className="img-logo" />
        </Link>
        <button className="navbar-toggler" onClick={() => setOpen(!open)}>
          <i className={`bi ${open ? 'bi-x' : 'bi-list'}`}></i>
        </button>
      </div>

      <div className={`navbar-collapse ${open ? 'open' : ''}`}>
        <div className="navbar-elements">
          <ul className="navbar-list">
            <li>
              <NavLink to="/" onClick={() => setOpen(false)}
                className={({ isActive }) => isActive ? 'active' : ''}>
                Principal
              </NavLink>
            </li>
            <li>
              <NavLink to="/productos" onClick={() => setOpen(false)}
                className={({ isActive }) => isActive ? 'active' : ''}>
                Productos
              </NavLink>
            </li>
            <li>
              <NavLink to="/registro" onClick={() => setOpen(false)}
                className={({ isActive }) => isActive ? 'active' : ''}>
                Registro
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" onClick={() => setOpen(false)}
                className={({ isActive }) => isActive ? 'active' : ''}>
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/acerca-de" onClick={() => setOpen(false)}
                className={({ isActive }) => isActive ? 'active' : ''}>
                Acerca de nosotros
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/productos" onClick={() => setOpen(false)}
                className={({ isActive }) => isActive ? 'active' : ''}>
                Admin Productos
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/usuarios" onClick={() => setOpen(false)}
                className={({ isActive }) => isActive ? 'active' : ''}>
                Admin Usuarios
              </NavLink>
            </li>
          </ul>
          <div className="icons-container">
            <i className="bi bi-cart icon"></i>
            <i className="bi bi-person icon"></i>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
