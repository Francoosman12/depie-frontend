import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

const MiPerfil = ({ user }) => {
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      // Verifica si user y user._id existen
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/${user._id}`)
        .then((response) => {
          setPerfil(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error al obtener los datos del perfil:", err);
          setError("Hubo un error al cargar el perfil.");
          setLoading(false);
        });
    } else {
      setLoading(false); // Evita que se quede cargando si no hay usuario
    }
  }, [user]); // Agregar user como dependencia para recargar si cambia

  return (
    <Container className="my-4 pb-5 pt-5 mt-5">
      <h1 className="text-center mb-4">Mi Perfil</h1>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {perfil && (
        <Card className="shadow-lg">
          <Card.Header className="bg-primary text-white text-center">
            <h3>{perfil.nombre || "Usuario sin nombre"}</h3>
          </Card.Header>
          <Card.Body>
            <Row className="mb-3">
              <Col md={6}>
                <h5>Email:</h5>
                <p>{perfil.email || "No registrado"}</p>
              </Col>
              <Col md={6}>
                <h5>Teléfono:</h5>
                <p>{perfil.telefono || "No proporcionado"}</p>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <h5>Peso Actual:</h5>
                <p>
                  {perfil.pesoActual
                    ? `${perfil.pesoActual} kg`
                    : "No registrado"}
                </p>
              </Col>
              <Col md={6}>
                <h5>Altura:</h5>
                <p>{perfil.altura ? `${perfil.altura} cm` : "No registrada"}</p>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <h5>Nivel de Experiencia:</h5>
                <p>{perfil.nivelExperiencia || "No especificado"}</p>
              </Col>
              <Col md={6}>
                <h5>Objetivos:</h5>
                <p>{perfil.objetivos || "No definidos"}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <h5>Condiciones Médicas:</h5>
                <p>{perfil.condicionesMedicas || "Ninguna"}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default MiPerfil;
