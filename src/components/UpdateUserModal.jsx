import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

const UpdateUserModal = ({ show, onHide, usuario, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    fechaNacimiento: "",
    genero: "Masculino",
    pesoActual: "",
    altura: "",
    condicionesMedicas: "",
    objetivos: "",
    nivelExperiencia: "Principiante",
    rol: "alumno",
    metodoRegistro: "email",
    activo: true,
  });

  // Actualizar el formulario cuando se pase un nuevo usuario
  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || "",
        email: usuario.email || "",
        password: usuario.password || "",
        fechaNacimiento: usuario.fechaNacimiento
          ? usuario.fechaNacimiento.split("T")[0]
          : "",
        genero: usuario.genero || "Masculino",
        pesoActual: usuario.pesoActual || "",
        altura: usuario.altura || "",
        condicionesMedicas: usuario.condicionesMedicas || "",
        objetivos: usuario.objetivos || "",
        nivelExperiencia: usuario.nivelExperiencia || "Principiante",
        rol: usuario.rol || "alumno",
        metodoRegistro: usuario.metodoRegistro || "email",
        activo: usuario.activo !== undefined ? usuario.activo : true,
      });
    }
  }, [usuario]);

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/api/usuarios/${usuario._id}`,
        formData
      )
      .then((response) => {
        alert("Usuario actualizado correctamente");
        onUpdate(response.data); // Notificar al componente padre
        onHide(); // Cerrar el modal
      })
      .catch((error) => {
        console.error("Error al actualizar el usuario:", error);
        alert("Ocurrió un error al actualizar el usuario");
      });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Actualizar Usuario</Modal.Title>
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
              <Form.Group controlId="formAltura">
                <Form.Label>Altura (cm)</Form.Label>
                <Form.Control
                  type="number"
                  name="altura"
                  value={formData.altura}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
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
            <Col md={6}>
              <Form.Group controlId="formActivo">
                <Form.Label>Estado</Form.Label>
                <Form.Check
                  type="checkbox"
                  name="activo"
                  label="Usuario Activo"
                  checked={formData.activo}
                  onChange={handleCheckboxChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" type="submit">
            Guardar Cambios
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateUserModal;
