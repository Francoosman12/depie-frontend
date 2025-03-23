import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/Contacto.css";

const Contacto = () => {
  return (
    <div className="contacto-container">
      <Container>
        <Row>
          <Col className="text-center">
            <h2 className="contacto-title">Contáctanos</h2>
            <p className="contacto-text">
              Escríbenos para más información sobre nuestros servicios.
            </p>
            <button className="btn btn-primary mt-3">Enviar Mensaje</button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contacto;
