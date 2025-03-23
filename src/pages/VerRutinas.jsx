import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Button, Modal, Nav } from "react-bootstrap";
import axios from "axios";

// Función para convertir un enlace a formato embed
const getEmbedUrl = (url) => {
  if (url.includes("youtu.be")) {
    const videoId = url.split("/").pop().split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes("watch?v=")) {
    const videoId = url.split("v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url; // Devuelve la URL original si no requiere conversión
};

const VerRutinas = ({ user }) => {
  const [rutina, setRutina] = useState(null);
  const [selectedEjercicio, setSelectedEjercicio] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeSemana, setActiveSemana] = useState(0);

  // Obtener la rutina del alumno logueado dinámicamente
  useEffect(() => {
    if (user) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/api/rutinas?alumno_id=${user._id}`
        ) // Usa el ID dinámico del usuario logueado
        .then((response) => {
          const rutinasDelAlumno = response.data;
          if (rutinasDelAlumno && rutinasDelAlumno.length > 0) {
            setRutina(rutinasDelAlumno[0]);
          } else {
            console.warn("No se encontraron rutinas para este alumno.");
            setRutina(null);
          }
        })
        .catch((error) => {
          console.error("Error al obtener la rutina asignada:", error);
        });
    }
  });

  const handleShowEjercicio = (ejercicio) => {
    setSelectedEjercicio(ejercicio);
    setShowModal(true);
  };

  return (
    <Container className="pb-5 pt-5 mt-5">
      <h1 className="my-4 text-center">Rutina Asignada</h1>
      {rutina ? (
        <>
          <h3>{rutina.nombre}</h3>
          <p>{rutina.descripcion}</p>
          <Nav
            variant="tabs"
            activeKey={activeSemana}
            onSelect={(key) => setActiveSemana(parseInt(key))}
          >
            {rutina.semanas.map((semana, index) => (
              <Nav.Item key={index}>
                <Nav.Link eventKey={index}>
                  Semana {semana.numeroSemana}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          {rutina.semanas.length > 0 && (
            <div className="mt-4">
              <h4 className="text-success">
                Semana {rutina.semanas[activeSemana].numeroSemana}
              </h4>
              {rutina.semanas[activeSemana].dias.map((dia, dayIndex) => (
                <div key={dayIndex} className="mb-4">
                  <h5 className="text-primary">{dia.dia}</h5>
                  <Row>
                    {dia.ejercicios.map((ejercicio, idx) => (
                      <Col md={4} key={idx} className="mb-3">
                        <Card>
                          <Card.Body>
                            <Card.Title>{ejercicio.nombre}</Card.Title>
                            <Card.Text>
                              <strong>Series:</strong> {ejercicio.series} <br />
                              <strong>Repeticiones:</strong>{" "}
                              {ejercicio.repeticiones} <br />
                              <strong>Peso sugerido:</strong>{" "}
                              {ejercicio.peso_sugerido || "No especificado"}
                            </Card.Text>
                            <Button
                              variant="info"
                              onClick={() => handleShowEjercicio(ejercicio)}
                            >
                              Ver Detalles
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p>Cargando rutina...</p>
      )}

      {/* Modal para Detalles del Ejercicio */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Ejercicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEjercicio && (
            <div>
              <h5>{selectedEjercicio.nombre}</h5>
              <p>
                <strong>Series:</strong> {selectedEjercicio.series} <br />
                <strong>Repeticiones:</strong> {selectedEjercicio.repeticiones}{" "}
                <br />
                <strong>Peso sugerido:</strong>{" "}
                {selectedEjercicio.peso_sugerido || "No especificado"}
              </p>
              {selectedEjercicio.ejercicio_id?.video_url && (
                <div className="ratio ratio-16x9">
                  <iframe
                    src={getEmbedUrl(selectedEjercicio.ejercicio_id.video_url)}
                    title="Video del Ejercicio"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default VerRutinas;
