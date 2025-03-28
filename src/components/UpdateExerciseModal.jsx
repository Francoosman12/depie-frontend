import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const UpdateExerciseModal = ({ show, onHide, ejercicio, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombre: ejercicio.nombre || "",
    descripcion: ejercicio.descripcion || "",
    dificultad: ejercicio.dificultad || "Principiante",
    tipo: ejercicio.tipo || "Fuerza",
    video_url: ejercicio.video_url || "",
  });

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Enviar formulario para actualizar el ejercicio
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/api/ejercicios/${ejercicio._id}`,
        formData
      )
      .then((response) => {
        alert("Ejercicio actualizado exitosamente");
        onUpdate(response.data); // Notificar al padre que los datos han sido actualizados
        onHide(); // Cerrar el modal
      })
      .catch((error) => {
        console.error("Error al actualizar el ejercicio:", error);
        alert("Ocurrió un error al actualizar el ejercicio");
      });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Actualizar Ejercicio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDescripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows={3}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDificultad">
            <Form.Label>Dificultad</Form.Label>
            <Form.Select
              name="dificultad"
              value={formData.dificultad}
              onChange={handleInputChange}
            >
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTipo">
            <Form.Label>Tipo</Form.Label>
            <Form.Select
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
            >
              <option value="Fuerza">Fuerza</option>
              <option value="Cardio">Cardio</option>
              <option value="Flexibilidad">Flexibilidad</option>
              <option value="Otro">Otro</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formVideoUrl">
            <Form.Label>URL del Video</Form.Label>
            <Form.Control
              type="url"
              name="video_url"
              value={formData.video_url}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Guardar Cambios
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateExerciseModal;
