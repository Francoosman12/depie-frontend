import React from "react";
import { Link } from "react-router-dom";

const NotAuthorized = () => (
  <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h1>Acceso Denegado</h1>
    <p>
      Tu cuenta está inactiva. Por favor, contacta al administrador para más
      información.
    </p>
    <Link to="/">
      <button>Volver al Inicio</button>
    </Link>
  </div>
);

export default NotAuthorized;
