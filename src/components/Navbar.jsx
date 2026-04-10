import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import CartSidebar from './CartSidebar';

function Navbar() {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { isLoggedIn, isAdmin, user, logout } = useAuth();
  const { count } = useOrder();
  const navigate = useNavigate();

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    setOpen(false);
    navigate('/login');
  };

  // Clase CSS según rol (maneja colores y efectos hover/active)
  const navClass = isAdmin ? 'navbar-admin' : isLoggedIn ? 'navbar-cliente' : '';
  // Fondo según rol
  const navBg = isAdmin ? '#000000' : isLoggedIn ? '#ffffff' : undefined;
  // Color de íconos (carrito, persona)
  const iconColor = isAdmin ? '#ffffff' : isLoggedIn ? '#1a1a2e' : undefined;
  // Filtro del logo
  const logoFilter = isAdmin ? 'brightness(0) invert(1)' : isLoggedIn ? 'brightness(0)' : undefined;

  return (
    <>
      <nav className={`navbar-bs ${navClass}`} style={{ background: navBg }}>
        <div className="navbar-top">
          <Link to="/" className="navbar-brand">
            <img src={logoImg} alt="El Bordo Logo" className="img-logo"
              style={logoFilter ? { filter: logoFilter } : undefined} />
          </Link>
          <button className="navbar-toggler" onClick={() => setOpen(!open)}>
            <i className={`bi ${open ? 'bi-x' : 'bi-list'}`}></i>
          </button>
        </div>

        <div className={`navbar-collapse ${open ? 'open' : ''}`} style={{ background: navBg }}>
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
                <NavLink to="/acerca-de" onClick={() => setOpen(false)}
                  className={({ isActive }) => isActive ? 'active' : ''}>
                  Acerca de nosotros
                </NavLink>
              </li>

              {/* Links de admin, solo si es admin */}
              {isAdmin && (
                <>
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
                </>
              )}

              {/* Login y Logout */}
              {isLoggedIn ? (
                <li>
                  <button onClick={() => setShowLogoutModal(true)}>
                    Logout ({user?.nombre?.split(' ')[0]})
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <NavLink to="/login" onClick={() => setOpen(false)}
                      className={({ isActive }) => isActive ? 'active' : ''}>
                      Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/registro" onClick={() => setOpen(false)}
                      className={({ isActive }) => isActive ? 'active' : ''}>
                      Registro
                    </NavLink>
                  </li>
                </>
              )}
            </ul>

            <div className="icons-container">
              {/* Carrito */}
              <button
                onClick={() => setCartOpen(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '0', color: iconColor }}
                aria-label="Ver carrito"
              >
                <i className="bi bi-cart icon" style={{ color: iconColor }}></i>
                {count > 0 && (
                  <span style={{
                    position: 'absolute', top: '-8px', right: '-8px',
                    background: '#e63946', color: 'white',
                    borderRadius: '50%', width: '20px', height: '20px',
                    fontSize: '11px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 'bold',
                  }}>
                    {count}
                  </span>
                )}
              </button>

              {/* icono persona */}
              <button
                onClick={() => navigate(isLoggedIn ? '/admin/usuarios' : '/login')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', color: iconColor }}
                aria-label="Perfil"
                title={isLoggedIn ? `Hola, ${user?.nombre?.split(' ')[0]}` : 'Iniciar sesión'}
              >
                <i className="bi bi-person icon" style={{ color: iconColor }}></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mod de confirmacion de logout */}
      {showLogoutModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}>
          <div style={{
            background: '#1a1a2e', borderRadius: '14px',
            padding: '2rem', maxWidth: '380px', width: '100%',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            border: '1px solid #333',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>👋</div>
            <h3 style={{ margin: '0 0 0.5rem', color: '#f0f0f0' }}>¿Cerrar sesión?</h3>
            <p style={{ color: '#aaa', margin: '0 0 1.5rem', fontSize: '0.95rem' }}>
              Vas a salir de tu cuenta como <strong style={{ color: '#f0f0f0' }}>{user?.nombre?.split(' ')[0]}</strong>. ¿Deseás continuar?
            </p>
            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
              <button onClick={() => setShowLogoutModal(false)} style={{
                padding: '0.6rem 1.5rem', borderRadius: '8px',
                border: '1px solid #444', background: 'transparent',
                color: '#ccc', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem',
              }}>
                Cancelar
              </button>
              <button onClick={handleLogoutConfirm} style={{
                padding: '0.6rem 1.5rem', borderRadius: '8px',
                border: 'none', background: '#e63946',
                color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem',
              }}>
                Sí, cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export default Navbar;
