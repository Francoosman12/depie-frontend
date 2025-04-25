import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import getEmbedUrl from "../utils/getEmbedUrl"; // ✅ Importar correctamente

const EjercicioModal = ({
  showModal,
  setShowModal,
  selectedEjercicio,
  selectedRutinaId,
  handleEjercicioChange,
  setSelectedEjercicio, // ✅ Recibir la función como prop
}) => {
  // Estado para los pesos por serie y bloqueo de edición
  const [datosGuardados, setDatosGuardados] = useState(false);
  const [pesosPorSerie, setPesosPorSerie] = useState({
    peso_serie_1: selectedEjercicio?.peso_serie_1 ?? 0,
    peso_serie_2: selectedEjercicio?.peso_serie_2 ?? 0,
    peso_serie_3: selectedEjercicio?.peso_serie_3 ?? 0,
  });

  // Estado para mostrar el mensaje de éxito
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // Detectar si el ejercicio ya fue completado y bloquear edición
  useEffect(() => {
    if (selectedEjercicio) {
      setPesosPorSerie({
        peso_serie_1: selectedEjercicio.peso_serie_1 ?? 0,
        peso_serie_2: selectedEjercicio.peso_serie_2 ?? 0,
        peso_serie_3: selectedEjercicio.peso_serie_3 ?? 0,
      });
      setDatosGuardados(selectedEjercicio.terminado || false);
    }
  }, [selectedEjercicio]);

  // Manejar cambios en el peso por serie
  const handlePesoChange = (serie, value) => {
    if (!datosGuardados) {
      setPesosPorSerie((prevState) => ({
        ...prevState,
        [serie]: Number(value),
      }));
    }
  };

  // Manejar cambios en el checkbox sin borrar datos de peso
  const handleCheckboxChange = (e) => {
    setSelectedEjercicio((prevEjercicio) => ({
      ...prevEjercicio,
      terminado: e.target.checked, // ✅ Permitir cambiar entre `true` y `false`
    }));
  };

  // Guardar los datos en el backend y actualizar el estado en tiempo real
  const handleGuardarPeso = () => {
    if (!selectedEjercicio || !selectedRutinaId) {
      alert("No se ha seleccionado un ejercicio válido.");
      return;
    }

    const numeroSemana = selectedEjercicio?.numeroSemana;
    const diaEntrenamiento = selectedEjercicio?.dia;
    const ejercicioId = selectedEjercicio?._id;

    if (!numeroSemana || !diaEntrenamiento || !ejercicioId) {
      alert("No se ha podido obtener la semana, el día o el ID del ejercicio.");
      return;
    }

    axios
      .put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/rutinas/${selectedRutinaId}/semana/${numeroSemana}/dia/${diaEntrenamiento}/ejercicio/${ejercicioId}`,
        {
          numeroSemana,
          dia: diaEntrenamiento,
          ...pesosPorSerie,
          terminado: true,
        }
      )
      .then(() => {
        alert("Datos guardados exitosamente.");

        // ✅ Ahora pasamos `selectedRutinaId` a `handleEjercicioChange`
        handleEjercicioChange(selectedRutinaId);

        // Mostrar mensaje de éxito y cerrar el modal
        setMostrarConfirmacion(true);
        setDatosGuardados(true);
      })
      .catch((error) => {
        console.error("Error al guardar los datos:", error);
        alert("Hubo un error al guardar los datos.");
      });
  };

  // Función para cerrar el mensaje de confirmación y el modal de ejercicio
  const handleCerrarConfirmacion = () => {
    setMostrarConfirmacion(false);
    setShowModal(false);
  };

  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtu.be")) {
      const videoId = url.split("/").pop().split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("watch?v=")) {
      const videoId = url.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <>
      {/* Modal principal */}
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
              {/* Mostrar Pesos Guardados y Bloquear Edición */}
              {selectedEjercicio.series &&
                [...Array(selectedEjercicio.series)].map((_, index) => {
                  const serie = `peso_serie_${index + 1}`;
                  return (
                    <Form.Group className="mb-3" key={serie}>
                      <Form.Label>
                        Peso utilizado - Serie {index + 1}:
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={pesosPorSerie[serie] || ""}
                        onFocus={(e) => e.target.select()} // Seleccionar y limpiar el valor al hacer clic
                        onChange={(e) =>
                          handlePesoChange(serie, e.target.value)
                        }
                        disabled={datosGuardados}
                      />
                    </Form.Group>
                  );
                })}
              {/* Checkbox para marcar como terminado */}
              <Form.Check
                type="checkbox"
                label="Ejercicio Terminado"
                checked={selectedEjercicio.terminado}
                onChange={handleCheckboxChange}
                className="mb-3"
              />
              {/* Video del ejercicio */}

              {selectedEjercicio?.video_url && (
                <div className="ratio ratio-16x9">
                  <iframe
                    src={getEmbedUrl(selectedEjercicio.video_url)} // ✅ Convertir solo al renderizar
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
          <Button
            variant="primary"
            onClick={handleGuardarPeso}
            disabled={datosGuardados}
          >
            Guardar Datos
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación de guardado */}
      <Modal
        show={mostrarConfirmacion}
        onHide={handleCerrarConfirmacion}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Pesos guardados con éxito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Los datos de peso utilizados han sido guardados correctamente.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCerrarConfirmacion}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EjercicioModal;
