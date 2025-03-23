import React from "react";
import { Container } from "react-bootstrap";
import logo from "../assets/depie.png"; // Ruta del logo
import "../styles/Home.css"; // Importar los estilos CSS
import Novedades from "../components/Novedades"; // Primera sección adicional
import Testimonios from "../components/Testimonios"; // Segunda sección
import Servicios from "../components/Servicios"; // Tercera sección
import Contacto from "../components/Contacto"; // Cuarta sección

const Home = () => {
  return (
    <div>
      {/* Sección de Inicio */}
      <div className="home-container">
        {/* Video de fondo */}
        <iframe
          className="background-video"
          src="https://www.youtube.com/embed/I_RYujJvZ7s?autoplay=1&mute=1&loop=1&controls=0&playlist=I_RYujJvZ7s&rel=0"
          title="Video de fondo"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>

        {/* Contenido superpuesto */}
        <Container className="home-content">
          <img src={logo} alt="DePie Entrenamiento" className="home-logo" />
          <h1 className="home-title">DePie Entrenamiento</h1>
          <h3 className="home-subtitle">Profesor Gabriel Ovejero</h3>
        </Container>
      </div>

      {/* Sección Novedades */}
      <Novedades />

      {/* Sección Testimonios */}
      <Testimonios />

      {/* Sección Servicios */}
      <Servicios />

      {/* Sección Contacto */}
      <Contacto />
    </div>
  );
};

export default Home;
