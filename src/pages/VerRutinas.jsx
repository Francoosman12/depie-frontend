import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Modal,
  Nav,
  Form,
} from "react-bootstrap";
import axios from "axios";
import EjercicioModal from "../components/EjercicioModal";
import DiaRutina from "../components/DiaRutina";

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
  const [rutinas, setRutinas] = useState([]); // Todas las rutinas disponibles
  const [selectedRutina, setSelectedRutina] = useState(null); // Rutina seleccionada
  const [selectedEjercicio, setSelectedEjercicio] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeSemana, setActiveSemana] = useState(0);
  const [comentariosDiarios, setComentariosDiarios] = useState({}); // Comentarios diarios del alumno

  // Obtener todas las rutinas del usuario
  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/api/rutinas?alumno_id=${user._id}`)
        .then((response) => {
          const rutinasDelAlumno = response.data;
          setRutinas(rutinasDelAlumno); // Guardar todas las rutinas
          if (rutinasDelAlumno.length > 0) {
            setSelectedRutina(rutinasDelAlumno[0]); // Seleccionar la primera rutina por defecto
          }
        })
        .catch((error) => console.error("Error al obtener rutinas:", error));
    }
  }, []); // Array de dependencias vacío para ejecutar solo al cargar

  const handleShowEjercicio = (ejercicio) => {
    setSelectedEjercicio(ejercicio);
    setShowModal(true);
  };

  // Manejar el cambio del comentario diario del alumno
  const handleComentarioDiarioChange = (dia, comentario) => {
    setComentariosDiarios({ ...comentariosDiarios, [dia]: comentario });
  };

  // Guardar el progreso del alumno (peso utilizado y comentarios)
  const handleSaveProgress = () => {
    if (!selectedRutina) return; // Asegurarse de que hay una rutina seleccionada
    const progreso = {
      comentariosDiarios,
      rutina: selectedRutina._id, // Usar la rutina seleccionada
    };

    axios
      .post("http://localhost:5000/api/progreso", progreso) // Endpoint para guardar progreso
      .then((response) => {
        alert("Progreso guardado exitosamente");
      })
      .catch((error) => {
        console.error("Error al guardar el progreso:", error);
        alert("Hubo un error al guardar el progreso");
      });
  };

  return (
    <Container className="pb-5 pt-5 mt-5">
      <h1 className="my-4 text-center">Rutinas Asignadas</h1>
      {rutinas.length > 0 ? (
        <>
          {/* Selector de rutinas */}
          <Form.Group controlId="selectRutina" className="">
            <Form.Label>Selecciona una rutina:</Form.Label>
            <Form.Select
              value={selectedRutina ? selectedRutina._id : ""}
              onChange={(e) => {
                const rutinaSeleccionada = rutinas.find(
                  (r) => r._id === e.target.value
                );
                setSelectedRutina(rutinaSeleccionada);
              }}
              className="mb-5"
            >
              <option value="">Seleccionar una rutina</option>
              {rutinas.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {selectedRutina && (
            <>
              <h3>{selectedRutina.nombre}</h3>
              <p>{selectedRutina.descripcion}</p>
              <Nav
                variant="tabs"
                activeKey={activeSemana}
                onSelect={(key) => setActiveSemana(parseInt(key))}
              >
                {selectedRutina.semanas.map((semana, index) => (
                  <Nav.Item key={index} className="bg-light">
                    <Nav.Link eventKey={index} className="text-black">
                      Semana {semana.numeroSemana}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>

              {selectedRutina.semanas.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-black">
                    Semana {selectedRutina.semanas[activeSemana].numeroSemana}
                  </h4>
                  {selectedRutina.semanas[activeSemana].dias.map(
                    (dia, dayIndex) => (
                      <DiaRutina
                        key={dayIndex}
                        dia={dia}
                        selectedRutinaId={selectedRutina._id}
                        comentariosDiarios={comentariosDiarios}
                        handleShowEjercicio={handleShowEjercicio}
                        handleComentarioDiarioChange={
                          handleComentarioDiarioChange
                        }
                      />
                    )
                  )}
                </div>
              )}
              <Button
                variant="primary"
                className="mt-4"
                onClick={handleSaveProgress}
              >
                Guardar Progreso
              </Button>
            </>
          )}
        </>
      ) : (
        <p>Cargando rutinas...</p>
      )}

      {/* Modal para Detalles del Ejercicio */}
      <EjercicioModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedEjercicio={selectedEjercicio}
        selectedRutinaId={selectedRutina ? selectedRutina._id : null} // Validación añadida
        getEmbedUrl={getEmbedUrl}
        handleEjercicioChange={(nuevoValor) =>
          setSelectedEjercicio({
            ...selectedEjercicio,
            peso_utilizado: nuevoValor,
          })
        }
      />
    </Container>
  );
};

export default VerRutinas;
