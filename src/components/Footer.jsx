import React from 'react';
import logoImg from '../assets/logo.png';

function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="redes-sociales">
          <a className="social-icons" href="https://www.facebook.com/" target="_blank" rel="noreferrer">
            <i className="bi bi-facebook"></i>
            <p>Facebook</p>
          </a>
          <a className="social-icons" href="https://www.instagram.com/" target="_blank" rel="noreferrer">
            <i className="bi bi-instagram"></i>
            <p>Instagram</p>
          </a>
          <a className="social-icons" href="https://www.youtube.com/" target="_blank" rel="noreferrer">
            <i className="bi bi-youtube"></i>
            <p>YouTube</p>
          </a>
        </div>
        <div className="info-container">
          <img src={logoImg} alt="Logo El Bordo" className="img-logo" />
          <p>&copy; 2024 El Bordo. Todos los derechos reservados.</p>
        </div>
        <div>
          <p><strong>El Bordo</strong></p>
          <p>Contáctanos</p>
          <p>665425052525</p>
          <p>Lunes a Viernes</p>
          <p>9 a 22hs</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
