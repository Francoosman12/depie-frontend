import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const EjercicioModal = ({
  showModal,
  setShowModal,
  selectedEjercicio,
  selectedRutinaId,
  getEmbedUrl,
  handleEjercicioChange,
}) => {
  // Estado para los pesos por serie
  const [pesosPorSerie, setPesosPorSerie] = useState({
    peso_serie_1: selectedEjercicio?.peso_serie_1 || 0,
    peso_serie_2: selectedEjercicio?.peso_serie_2 || 0,
    peso_serie_3: selectedEjercicio?.peso_serie_3 || 0,
  });

  const handlePesoChange = (serie, value) => {
    setPesosPorSerie((prevState) => ({
      ...prevState,
      [serie]: Number(value), // Asegurarse de que el valor es un número
    }));
  };

  const handleGuardarPeso = () => {
    const ejercicioId = selectedEjercicio?.ejercicio_id?._id;
    if (!ejercicioId) {
      alert("El ID del ejercicio no es válido");
      return;
    }

    console.log("Datos enviados al backend:", {
      ...pesosPorSerie,
      terminado: selectedEjercicio.terminado,
    });

    axios
      .put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/rutinas/${selectedRutinaId}/ejercicio/${ejercicioId}`,
        {
          ...pesosPorSerie,
          terminado: selectedEjercicio.terminado, // Guardar estado terminado
        }
      )
      .then(() => {
        alert("Datos guardados exitosamente");
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error al guardar los datos:", error);
        alert("Hubo un error al guardar los datos");
      });
  };

  return (
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

            {/* Inputs separados para registrar peso por serie */}
            <Form.Group className="mb-3">
              <Form.Label>Peso utilizado - Serie 1:</Form.Label>
              <Form.Control
                type="number"
                value={pesosPorSerie.peso_serie_1}
                onChange={(e) =>
                  handlePesoChange("peso_serie_1", e.target.value)
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Peso utilizado - Serie 2:</Form.Label>
              <Form.Control
                type="number"
                value={pesosPorSerie.peso_serie_2}
                onChange={(e) =>
                  handlePesoChange("peso_serie_2", e.target.value)
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Peso utilizado - Serie 3:</Form.Label>
              <Form.Control
                type="number"
                value={pesosPorSerie.peso_serie_3}
                onChange={(e) =>
                  handlePesoChange("peso_serie_3", e.target.value)
                }
              />
            </Form.Group>

            {/* Checkbox para marcar como terminado */}
            <Form.Check
              type="checkbox"
              label="Ejercicio Terminado"
              checked={selectedEjercicio.terminado}
              onChange={(e) =>
                handleEjercicioChange({
                  ...selectedEjercicio,
                  terminado: e.target.checked,
                })
              }
              className="mb-3"
            />

            {/* Video del ejercicio */}
            {selectedEjercicio?.ejercicio_id?.video_url && (
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
        <Button variant="primary" onClick={handleGuardarPeso}>
          Guardar Datos
        </Button>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EjercicioModal;
