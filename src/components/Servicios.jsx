import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/Servicios.css";

const Servicios = () => {
  return (
    <div className="servicios-container">
      <Container>
        <Row>
          <Col className="text-center">
            <h2 className="servicios-title">Nuestros Servicios</h2>
            <ul className="servicios-list">
              <li>Entrenamientos personalizados</li>
              <li>Clases grupales</li>
              <li>Evaluación física</li>
              <li>Planes de nutrición</li>
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Servicios;
