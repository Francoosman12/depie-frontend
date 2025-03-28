import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "", // Confirmación de contraseña
    fechaNacimiento: "",
    genero: "Masculino",
    pesoActual: "",
    altura: "", // Nuevo: Altura en cm
    objetivos: "",
    nivelExperiencia: "Principiante",
    condicionesMedicas: "", // Nuevo: Condiciones médicas del usuario
    rol: "alumno",
    metodoRegistro: "email",
    activo: true,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar el envío del formulario con validación
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError(
        "Las contraseñas no coinciden. Por favor, verifica e inténtalo de nuevo."
      );
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/usuarios`,
        formData
      );
      setSuccess(true);
      setError("");
      alert("Usuario registrado exitosamente");
      // Reiniciar el formulario después del registro
      setFormData({
        nombre: "",
        email: "",
        password: "",
        confirmPassword: "",
        fechaNacimiento: "",
        genero: "Masculino",
        pesoActual: "",
        altura: "", // Reiniciar altura
        objetivos: "",
        nivelExperiencia: "Principiante",
        condicionesMedicas: "", // Reiniciar condiciones médicas
        rol: "alumno",
        metodoRegistro: "email",
        activo: true,
      });
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setError("Hubo un error al registrar al usuario. Inténtalo de nuevo.");
    }
  };

  return (
    <Container className="vh-100 d-flex align-items-center justify-content-center pb-5 pt-5 mt-5">
      <div style={{ maxWidth: "600px", width: "100%" }}>
        <h1 className="text-center mb-4 pb-5 pt-5 mt-5">Registro de Usuario</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && (
          <Alert variant="success">Usuario registrado con éxito</Alert>
        )}
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
              <Form.Group controlId="formConfirmPassword">
                <Form.Label>Confirmar Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
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
          </Row>
          <Row className="mb-3">
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
                  placeholder="Ej: hipertensión, diabetes, lesiones"
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
          </Row>
          <Button variant="primary" type="submit" className="w-100">
            Registrar Usuario
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Registro;
