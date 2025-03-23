import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

const AddExerciseModal = ({ show, onHide, onAdd }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    dificultad: "Principiante",
    tipo: "Fuerza",
    video_url: "",
  });

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Enviar el formulario para agregar un nuevo ejercicio
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/ejercicios`, formData)
      .then((response) => {
        alert("Ejercicio agregado exitosamente");
        onAdd(response.data); // Notificar al padre que un ejercicio fue agregado
        onHide(); // Cerrar el modal
        setFormData({
          nombre: "",
          descripcion: "",
          dificultad: "Principiante",
          tipo: "Fuerza",
          video_url: "",
        }); // Limpiar el formulario
      })
      .catch((error) => {
        console.error("Error al agregar el ejercicio:", error);
        alert("Ocurrió un error al agregar el ejercicio");
      });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Ejercicio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="align-items-end">
            <Col md={12} className="mb-3">
              <Form.Group controlId="formNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={12} className="mb-3">
              <Form.Group controlId="formDescripcion">
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
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group controlId="formDificultad">
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
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group controlId="formTipo">
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
            </Col>
            <Col md={12} className="mb-3">
              <Form.Group controlId="formVideoUrl">
                <Form.Label>URL del Video</Form.Label>
                <Form.Control
                  type="url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Button variant="primary" type="submit">
                Agregar Ejercicio
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddExerciseModal;
