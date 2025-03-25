import React from "react";
import {
  Accordion,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
} from "react-bootstrap";
import axios from "axios";

const DiaRutina = ({
  dia,
  selectedRutinaId,
  comentariosDiarios,
  handleShowEjercicio,
  handleComentarioDiarioChange,
}) => {
  const handleGuardarComentario = () => {
    const comentario = comentariosDiarios[dia.dia];
    if (!comentario) {
      alert("Por favor ingresa un comentario antes de guardar.");
      return;
    }

    axios
      .put(
        `http://localhost:5000/api/rutinas/${selectedRutinaId}/comentario_dia`,
        { dia: dia.dia, comentario: comentario }
      )
      .then(() => {
        alert(`Comentario para ${dia.dia} guardado exitosamente.`);
      })
      .catch((error) => {
        console.error("Error al guardar el comentario:", error);
        alert("Hubo un error al guardar el comentario.");
      });
  };

  // Agrupar ejercicios por bloque
  const ejerciciosPorBloque = dia.ejercicios.reduce((bloques, ejercicio) => {
    const bloque = ejercicio.bloque || "Sin asignar"; // Nombre del bloque
    if (!bloques[bloque]) {
      bloques[bloque] = []; // Inicializar el bloque si no existe
    }
    bloques[bloque].push(ejercicio); // Añadir el ejercicio al bloque
    return bloques;
  }, {});

  return (
    <Accordion className="mb-4">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <h5 className="text-black mb-0">{dia.dia}</h5>
        </Accordion.Header>
        <Accordion.Body>
          {/* Renderizar ejercicios por bloque */}
          {Object.keys(ejerciciosPorBloque).map((bloque, idx) => (
            <div key={idx} className="mb-4">
              <h6 className="text-success mb-3">
                <Badge bg="info" style={{ fontSize: "1rem" }}>
                  Bloque: {bloque}
                </Badge>
              </h6>
              <Row className="g-4">
                {ejerciciosPorBloque[bloque].map((ejercicio, index) => (
                  <Col md={6} lg={4} key={index}>
                    <Card
                      style={{
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        border: "none",
                      }}
                    >
                      <Card.Body>
                        <Card.Title
                          className="text-center text-primary"
                          style={{ fontWeight: "600" }}
                        >
                          {ejercicio.nombre}
                        </Card.Title>
                        <Card.Text
                          className="text-muted"
                          style={{ fontSize: "0.9rem" }}
                        >
                          <strong>Series:</strong> {ejercicio.series} <br />
                          <strong>Repeticiones:</strong>{" "}
                          {ejercicio.repeticiones} <br />
                          <strong>Peso sugerido:</strong>{" "}
                          {ejercicio.peso_sugerido || "No especificado"}
                        </Card.Text>
                        <div className="d-flex justify-content-center">
                          <Button
                            variant="info"
                            onClick={() => handleShowEjercicio(ejercicio)}
                            style={{ color: "white" }}
                          >
                            Ver Detalles
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ))}

          <Form.Group controlId={`comentario-${dia.dia}`} className="mt-4">
            <Form.Label style={{ fontWeight: "500" }}>
              Comentario del día:
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comentariosDiarios[dia.dia] || ""}
              onChange={(e) =>
                handleComentarioDiarioChange(dia.dia, e.target.value)
              }
              placeholder="¿Cómo te sentiste durante el entrenamiento?"
              style={{
                resize: "none",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button
              variant="primary"
              className="mt-3"
              onClick={handleGuardarComentario}
              style={{ backgroundColor: "#007bff", border: "none" }}
            >
              Guardar Comentario
            </Button>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default DiaRutina;
