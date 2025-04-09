import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditProfileModal = ({
  show,
  handleClose,
  updatedPerfil,
  handleInputChange,
  handleSaveChanges,
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Perfil</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={updatedPerfil.nombre || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={updatedPerfil.email || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              value={updatedPerfil.telefono || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Peso Actual (kg)</Form.Label>
            <Form.Control
              type="number"
              name="pesoActual"
              value={updatedPerfil.pesoActual || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Altura (cm)</Form.Label>
            <Form.Control
              type="number"
              name="altura"
              value={updatedPerfil.altura || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nivel de Experiencia</Form.Label>
            {/* Menu desplegable (Select) */}
            <Form.Select
              name="nivelExperiencia"
              value={updatedPerfil.nivelExperiencia || ""}
              onChange={handleInputChange}
            >
              <option value="">Selecciona tu nivel</option>
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Objetivos</Form.Label>
            <Form.Control
              type="text"
              name="objetivos"
              value={updatedPerfil.objetivos || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Condiciones Médicas</Form.Label>
            <Form.Control
              type="text"
              name="condicionesMedicas"
              value={updatedPerfil.condicionesMedicas || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileModal;
