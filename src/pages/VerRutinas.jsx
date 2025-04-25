import React, { useState, useEffect } from "react";
import { Container, Form, Nav, Button } from "react-bootstrap";
import axios from "axios";
import EjercicioModal from "../components/EjercicioModal";
import DiaRutina from "../components/DiaRutina";
import getEmbedUrl from "../utils/getEmbedUrl";

const VerRutinas = ({ user }) => {
  const [rutinas, setRutinas] = useState([]); // Todas las rutinas disponibles
  const [selectedRutina, setSelectedRutina] = useState(null); // Rutina seleccionada
  const [selectedEjercicio, setSelectedEjercicio] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeSemana, setActiveSemana] = useState(0); // Estado para manejar la semana activa
  const [comentariosDiarios, setComentariosDiarios] = useState({}); // Comentarios diarios del alumno

  // Obtener todas las rutinas del usuario
  useEffect(() => {
    if (user) {
      axios
        .get(
          `${import.meta.env.VITE_BACKEND_URL}/api/rutinas?alumno_id=${
            user._id
          }`
        )
        .then((response) => {
          const rutinasDelAlumno = response.data;
          setRutinas(rutinasDelAlumno);

          if (rutinasDelAlumno.length > 0) {
            setSelectedRutina(rutinasDelAlumno[0]);

            // 🔍 Verificar estructura de los ejercicios dentro de la rutina
            rutinasDelAlumno[0]?.semanas.forEach((semana, index) => {
              semana.dias.forEach((dia, dayIndex) => {
                dia.ejercicios.forEach((ejercicio, exIndex) => {
                  // ✅ Revisar si la URL existe
                });
              });
            });
          }
        })
        .catch((error) => console.error("Error al obtener rutinas:", error));
    }
  }, []); // Ejecutar solo al cargar la página

  const handleShowEjercicio = (ejercicio, numeroSemana, dia) => {
    const videoUrl =
      ejercicio.video_url || ejercicio.ejercicio_id?.video_url || ""; // ✅ Asegurar que siempre haya una URL

    if (!videoUrl) {
      console.warn(
        "⚠️ Este ejercicio no tiene una URL de video definida. Revisa la base de datos."
      );
    }

    setSelectedEjercicio({
      ...ejercicio,
      numeroSemana,
      dia,
      video_url: videoUrl, // ✅ Asignar la URL correctamente
    });

    setShowModal(true);
  };

  // Manejar el cambio del comentario diario del alumno
  const handleComentarioDiarioChange = (dia, comentario) => {
    setComentariosDiarios({ ...comentariosDiarios, [dia]: comentario });
  };

  // Guardar el progreso del alumno (comentarios diarios)
  const handleSaveProgress = () => {
    if (!selectedRutina) return;
    const progreso = { comentariosDiarios, rutina: selectedRutina._id };

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/progreso`, progreso)
      .then(() => alert("Progreso guardado exitosamente"))
      .catch((error) => {
        console.error("Error al guardar el progreso:", error);
        alert("Hubo un error al guardar el progreso.");
      });
  };

  const fetchRutinaActualizada = (rutinaId) => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/rutinas/${rutinaId}`)
      .then((response) => {
        setSelectedRutina(response.data); // Actualizar la rutina sin recargar la página
      })
      .catch((error) => console.error("Error al actualizar rutina:", error));
  };

  const handleEjercicioChange = (rutinaId) => {
    fetchRutinaActualizada(rutinaId);
  };

  return (
    <Container className="pb-5 pt-5 mt-5">
      <h1 className="my-4 text-center">Rutinas Asignadas</h1>
      {rutinas.length > 0 ? (
        <>
          {/* Selector de rutinas */}
          <Form.Group controlId="selectRutina">
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

              {/* Pestañas de semanas */}
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

              {/* Mostrar solo la semana activa */}
              {selectedRutina.semanas.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-black">
                    Semana {selectedRutina.semanas[activeSemana]?.numeroSemana}
                  </h4>
                  {selectedRutina.semanas[activeSemana]?.dias.map(
                    (dia, dayIndex) => (
                      <DiaRutina
                        key={dayIndex}
                        dia={dia}
                        numeroSemana={
                          selectedRutina.semanas[activeSemana].numeroSemana
                        }
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
        selectedRutinaId={selectedRutina ? selectedRutina._id : null}
        handleEjercicioChange={(nuevoEjercicio) =>
          setSelectedEjercicio({ ...selectedEjercicio, ...nuevoEjercicio })
        }
        setSelectedEjercicio={setSelectedEjercicio} // ✅ Pasar la función al modal
      />
    </Container>
  );
};

export default VerRutinas;
