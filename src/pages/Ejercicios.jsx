import React, { useState, useEffect } from "react";
import { Table, Button, Container, Modal } from "react-bootstrap";
import axios from "axios";
import UpdateExerciseModal from "../components/UpdateExerciseModal";
import AddExerciseModal from "../components/AddExerciseModal";

const Ejercicios = () => {
  const [ejercicios, setEjercicios] = useState([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedEjercicio, setSelectedEjercicio] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // Controlar el modal de agregar

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

  // Obtener ejercicios del backend
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/ejercicios`)
      .then((response) => setEjercicios(response.data))
      .catch((error) =>
        console.error("Error al obtener los ejercicios:", error)
      );
  }, []);

  // Mostrar el modal del video
  const handleShowVideo = (url) => {
    setVideoUrl(getEmbedUrl(url)); // Convertir la URL al formato embed
    setShowVideoModal(true);
  };

  // Cerrar el modal del video
  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
    setVideoUrl("");
  };

  // Eliminar un ejercicio
  const handleDelete = (id) => {
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/api/ejercicios/${id}`)
      .then(() => {
        alert("Ejercicio eliminado correctamente");
        setEjercicios(ejercicios.filter((ejercicio) => ejercicio._id !== id));
      })
      .catch((error) =>
        console.error("Error al eliminar el ejercicio:", error)
      );
  };

  // Abrir el modal de actualización
  const handleUpdate = (ejercicio) => {
    setSelectedEjercicio(ejercicio);
    setShowUpdateModal(true);
  };

  // Manejar la actualización del ejercicio
  const handleExerciseUpdated = (updatedEjercicio) => {
    setEjercicios((prevEjercicios) =>
      prevEjercicios.map((ejercicio) =>
        ejercicio._id === updatedEjercicio._id ? updatedEjercicio : ejercicio
      )
    );
  };

  // Manejar la creación de un nuevo ejercicio
  const handleExerciseAdded = (newEjercicio) => {
    setEjercicios([...ejercicios, newEjercicio]);
  };

  return (
    <Container className="pb-5 pt-5 mt-5">
      <h1 className="my-4 text-center">Ejercicios</h1>

      {/* Botón para abrir el modal de agregar */}
      <Button
        className="mb-4"
        variant="primary"
        onClick={() => setShowAddModal(true)}
      >
        Agregar Nuevo Ejercicio
      </Button>

      {/* Tabla de ejercicios */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Dificultad</th>
            <th>Tipo</th>
            <th>Video</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ejercicios.map((ejercicio) => (
            <tr key={ejercicio._id}>
              <td>{ejercicio.nombre}</td>
              <td>{ejercicio.descripcion}</td>
              <td>{ejercicio.dificultad}</td>
              <td>{ejercicio.tipo}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleShowVideo(ejercicio.video_url)}
                >
                  Ver Video
                </Button>
              </td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleUpdate(ejercicio)}
                  className="me-2"
                >
                  Actualizar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(ejercicio._id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para agregar un ejercicio */}
      <AddExerciseModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAdd={handleExerciseAdded}
      />

      {/* Modal para mostrar el video */}
      <Modal show={showVideoModal} onHide={handleCloseVideoModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Video del Ejercicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {videoUrl ? (
            <div className="ratio ratio-16x9">
              <iframe
                src={videoUrl}
                title="Video del Ejercicio"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <p>No hay video disponible.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseVideoModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para actualizar el ejercicio */}
      {selectedEjercicio && (
        <UpdateExerciseModal
          show={showUpdateModal}
          onHide={() => setShowUpdateModal(false)}
          ejercicio={selectedEjercicio}
          onUpdate={handleExerciseUpdated}
        />
      )}
    </Container>
  );
};

export default Ejercicios;
