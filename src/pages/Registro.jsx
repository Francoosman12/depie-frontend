import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import "../styles/Registro.css";

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "", // Confirmación de contraseña
    fechaNacimiento: "",
    genero: "Masculino",
    pesoActual: "",
    telefono: "",
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
      // Crear un objeto FormData para manejar archivos
      const data = new FormData();
      for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
          data.append(key, formData[key]);
        }
      }

      // Realizar la solicitud al backend
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/usuarios`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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
        telefono: "",
        altura: "",
        objetivos: "",
        nivelExperiencia: "Principiante",
        condicionesMedicas: "",
        rol: "alumno",
        metodoRegistro: "email",
        activo: true,
        fotoPerfil: null, // Reinicia el campo de foto
      });
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setError("Hubo un error al registrar al usuario. Inténtalo de nuevo.");
    }
  };

  return (
    <Container
      fluid
      className="vh-90 d-flex align-items-center justify-content-center px-3 mt-5 pt-5 pb-5"
    >
      <div style={{ maxWidth: "600px", width: "100%" }}>
        <h1 className="text-center mb-4">Registro de Usuario</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && (
          <Alert variant="success">Usuario registrado con éxito</Alert>
        )}
        <Form onSubmit={handleSubmit}>
          {/* Nombre y Email */}
          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Group controlId="formNombre">
                <Form.Label>Nombre y Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
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
          {/* Contraseña y Confirmar Contraseña */}
          <Row className="mb-3">
            <Col xs={12} md={6}>
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
            <Col xs={12} md={6}>
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
          {/* Fecha de Nacimiento y Género */}
          <Row className="mb-3">
            <Col xs={12} md={6}>
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
            <Col xs={12} md={6}>
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
          {/* Peso Actual y Altura */}
          <Row className="mb-3">
            <Col xs={12} md={6}>
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
            <Col xs={12} md={6}>
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
            <Col xs={12} md={6}>
              <Form.Group controlId="formTelefono">
                <Form.Label>Telefono</Form.Label>
                <Form.Control
                  type="number"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          {/* Objetivos */}
          <Row className="mb-3">
            <Col xs={12}>
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
          {/* Condiciones Médicas */}
          <Row className="mb-3">
            <Col xs={12}>
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
          {/* Nivel de Experiencia */}
          <Row className="mb-3">
            <Col xs={12}>
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
          {/* Foto de Perfil */}
          <Row className="mb-3">
            <Col xs={12}>
              <Form.Group controlId="formFotoPerfil">
                <Form.Label>Foto de Perfil</Form.Label>
                <Form.Control
                  type="file"
                  name="fotoPerfil"
                  onChange={(e) =>
                    setFormData({ ...formData, fotoPerfil: e.target.files[0] })
                  }
                  accept="image/*" // Asegura que solo se puedan seleccionar imágenes
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          {/* Botón de Enviar */}
          <Button variant="primary" type="submit" className="w-100">
            Registrar Usuario
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Registro;
