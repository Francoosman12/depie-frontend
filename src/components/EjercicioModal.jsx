import React from "react";
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
  const handleGuardarPeso = () => {
    const ejercicioId = selectedEjercicio?.ejercicio_id?._id;
    if (!ejercicioId) {
      alert("El ID del ejercicio no es válido");
      return;
    }

    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/api/rutinas/${selectedRutinaId}/ejercicio/${ejercicioId}`,
        { peso_utilizado: selectedEjercicio.peso_utilizado }
      )
      .then(() => {
        alert("Peso utilizado guardado exitosamente");
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error al guardar el peso utilizado:", error);
        alert("Hubo un error al guardar el peso utilizado");
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
            <Form.Group className="pb-4" controlId="pesoUtilizado">
              <Form.Label>Peso utilizado:</Form.Label>
              <p>(Introducir el peso por serie de esta manera: 8-10-12)</p>
              <Form.Control
                type="number"
                value={selectedEjercicio.peso_utilizado || ""}
                placeholder="Introduce el peso utilizado 8-10-12"
                onChange={(e) => handleEjercicioChange(e.target.value)}
              />
            </Form.Group>
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
          Guardar Peso Utilizado
        </Button>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EjercicioModal;
