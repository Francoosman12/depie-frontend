import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

const AddUserModal = ({ show, onHide, onAdd }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    fechaNacimiento: "",
    genero: "Masculino",
    telefono: "",
    pesoActual: "",
    objetivos: "",
    nivelExperiencia: "Principiante",
    condicionesMedicas: "",
    rol: "alumno",
    metodoRegistro: "email",
    activo: true, // Por defecto, el usuario está activo
  });

  // Manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("API_URL:", process.env.REACT_APP_API_URL);

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/usuarios`, formData)
      .then((response) => {
        alert("Usuario agregado correctamente");
        onAdd(response.data); // Notifica al padre que un usuario ha sido agregado
        onHide(); // Cierra el modal
        setFormData({
          nombre: "",
          email: "",
          password: "",
          fechaNacimiento: "",
          genero: "Masculino",
          pesoActual: "",
          objetivos: "",
          nivelExperiencia: "Principiante",
          rol: "alumno",
          metodoRegistro: "email",
          activo: true,
        }); // Resetea el formulario
      })
      .catch((error) => {
        console.error("Error al agregar el usuario:", error);
        alert("Ocurrió un error al agregar el usuario");
      });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
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
            <Col md={6}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formFechaNacimiento">
                <Form.Label>Fecha de Nacimiento</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formGenero">
                <Form.Label>Género</Form.Label>
                <Form.Select
                  name="genero"
                  value={formData.genero}
                  onChange={handleInputChange}
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formPesoActual">
                <Form.Label>Peso Actual (kg)</Form.Label>
                <Form.Control
                  type="number"
                  name="pesoActual"
                  value={formData.pesoActual}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formTelefono">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="Ingresa el número de teléfono"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="formObjetivos">
                <Form.Label>Objetivos</Form.Label>
                <Form.Control
                  as="textarea"
                  name="objetivos"
                  value={formData.objetivos}
                  onChange={handleInputChange}
                  rows={3}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="formCondicionesMedicas">
                <Form.Label>Condiciones Médicas</Form.Label>
                <Form.Control
                  as="textarea"
                  name="condicionesMedicas"
                  value={formData.condicionesMedicas}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Ejemplo: Hipertensión, diabetes, ninguna"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formNivelExperiencia">
                <Form.Label>Nivel de Experiencia</Form.Label>
                <Form.Select
                  name="nivelExperiencia"
                  value={formData.nivelExperiencia}
                  onChange={handleInputChange}
                >
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formRol">
                <Form.Label>Rol</Form.Label>
                <Form.Select
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputChange}
                >
                  <option value="alumno">Alumno</option>
                  <option value="profesor">Profesor</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="formMetodoRegistro">
                <Form.Label>Método de Registro</Form.Label>
                <Form.Select
                  name="metodoRegistro"
                  value={formData.metodoRegistro}
                  onChange={handleInputChange}
                >
                  <option value="email">Email</option>
                  <option value="google">Google</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group controlId="formActivo">
                <Form.Check
                  type="checkbox"
                  name="activo"
                  label="Usuario Activo"
                  checked={formData.activo}
                  onChange={(e) =>
                    setFormData({ ...formData, activo: e.target.checked })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" type="submit" className="mt-3">
            Agregar Usuario
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddUserModal;
