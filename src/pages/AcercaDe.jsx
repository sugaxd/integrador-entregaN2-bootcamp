import React from 'react';

function AcercaDe() {
  return (
    <div>
      <h1 className="titulo-principal">Acerca de nosotros</h1>

      <section className="seccion-mision">
        <h2>La misión de El Bordo</h2>
        <p>
          En El Bordo, nuestra misión es ser el puente entre los músicos y los
          instrumentos que los inspiran. Nos dedicamos a ofrecer una selección
          curada de guitarras, bajos, baterías, teclados y accesorios de la más
          alta calidad, tanto para principiantes que dan sus primeros acordes como
          para profesionales que buscan el sonido perfecto. Creemos que la música
          tiene el poder de transformar y queremos equiparte para que lo logres.
        </p>
        <p>
          Más allá de la venta, nos enfocamos en el servicio y la comunidad.
          Buscamos fomentar un espacio donde la pasión por la música sea el hilo
          conductor, ofreciendo asesoramiento experto, talleres y un servicio
          técnico confiable. Nuestro compromiso es garantizar que cada cliente
          encuentre en El Bordo no solo un instrumento, sino un compañero fiel en
          su viaje musical.
        </p>
      </section>

      <section className="seccion-equipo">
        <h2>Integrantes de nuestro equipo</h2>

        <div className="card-integrante">
          <div className="contenido-card">
            <div className="foto-carnet">
              <img
                src={require('../assets/img-integrante.jpg')}
                alt="Foto de Agustin Bazán"
              />
            </div>

            <div className="detalles-integrante">
              <h3>Agustín Bazán</h3>
              <p>
                Fundador y experto en guitarras vintage. Agus ha dedicado más de 5
                años al mundo de la lutería y el sonido. Es nuestro gurú para todo
                lo relacionado con amplificadores a válvulas y efectos de pedal.
              </p>

              <div className="redes-sociales-2">
                <a className="social-icons-2" href="https://www.facebook.com/" target="_blank" rel="noreferrer">
                  <i className="bi bi-facebook"></i>
                  <span>Facebook</span>
                </a>
                <a className="social-icons-2" href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                  <i className="bi bi-instagram"></i>
                  <span>Instagram</span>
                </a>
                <a className="social-icons-2" href="https://www.youtube.com/" target="_blank" rel="noreferrer">
                  <i className="bi bi-youtube"></i>
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AcercaDe;
