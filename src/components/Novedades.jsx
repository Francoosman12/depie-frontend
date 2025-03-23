import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/Novedades.css"; // Importar estilos específicos para esta sección

const Novedades = () => {
  return (
    <div className="novedades-container">
      <Container className="h-100">
        <Row className="h-100 align-items-center">
          <Col className="text-center">
            <h2 className="novedades-title">Novedades</h2>
            <p className="novedades-text">
              Aquí encontrarás las últimas actualizaciones, eventos y noticias
              relacionadas con nuestro gimnasio. ¡Mantente informado y no te
              pierdas ninguna novedad!
            </p>
            <button className="btn btn-primary mt-3">Ver Más</button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Novedades;
