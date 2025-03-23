import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/Testimonios.css";

const Testimonios = () => {
  return (
    <div className="testimonios-container">
      <Container>
        <Row>
          <Col className="text-center">
            <h2 className="testimonios-title">Testimonios</h2>
            <p className="testimonios-text">
              "Entrenar en DePie Entrenamiento ha sido la mejor experiencia.
              ¡Resultados garantizados!"
            </p>
            <p className="testimonios-text">
              "Gabriel me ayudó a alcanzar mis metas. ¡Altamente recomendado!"
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Testimonios;
