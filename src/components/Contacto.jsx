import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "../styles/Contacto.css";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Mensaje enviado correctamente.");
    // Aquí podrías agregar lógica para enviar el formulario al backend
  };

  return (
    <div className="contacto-container">
      <Container>
        <Row className="align-items-center">
          {/* 📌 Sección izquierda: Mapa y datos de ubicación */}
          <Col md={6} className="contacto-mapa">
            <h2 className="contacto-title">Nuestra Ubicación</h2>
            <p className="contacto-text">
              Visítanos en nuestro centro de entrenamiento.
            </p>
            <iframe
              className="mapa"
              src="https://www.google.com/maps/embed?pb=!1m18..."
              width="100%"
              height="250"
              style={{ borderRadius: "8px", border: "none" }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
            <p className="contacto-direccion">
              📍 Dirección: Calle 123, Ciudad, País <br />
              📞 Teléfono: +123 456 7890 <br />
              ✉️ Email: contacto@tugym.com
            </p>
          </Col>

          {/* 📌 Sección derecha: Formulario de contacto */}
          <Col md={6} className="contacto-form-container">
            <h2 className="contacto-title">Contáctanos</h2>
            <p className="contacto-text">
              Déjanos tu mensaje y te responderemos a la brevedad.
            </p>
            <Form onSubmit={handleSubmit} className="contacto-form">
              <Form.Group controlId="nombre">
                <Form.Control
                  type="text"
                  name="nombre"
                  placeholder="Tu Nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="email" className="mt-3">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Tu Correo Electrónico"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="mensaje" className="mt-3">
                <Form.Control
                  as="textarea"
                  name="mensaje"
                  rows={4}
                  placeholder="Escribe tu mensaje aquí..."
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                className="btn btn-warning mt-4 contacto-btn"
              >
                ENVIAR MENSAJE
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contacto;
