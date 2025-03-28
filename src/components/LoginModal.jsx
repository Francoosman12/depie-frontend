import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ show, handleClose, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook para navegar a otras rutas

  // Manejo del inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }), // Enviar email y contraseña
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Usuario encontrado:", data.usuario);

        // Guardar token JWT y usuario en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.usuario));

        setUser(data.usuario); // Actualizar el estado global del usuario
        handleClose(); // Cerrar el modal
      } else {
        setError("Email o contraseña incorrectos. Intenta nuevamente.");
      }
    } catch (err) {
      setError("Error en el servidor. Inténtalo más tarde.");
      console.error("Error en el login:", err);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Iniciar Sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresa tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Iniciar Sesión
          </Button>
        </Form>

        {/* Mensaje para redirigir a la página de registro */}
        <div className="text-center mt-3">
          <p>¿No tienes cuenta?</p>
          <Button
            variant="link"
            onClick={() => {
              handleClose(); // Cierra el modal
              navigate("/registro"); // Redirige a la página de registro
            }}
          >
            Regístrate aquí
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
