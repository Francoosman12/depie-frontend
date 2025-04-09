import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Alert,
  Spinner,
  Button,
} from "react-bootstrap";
import axios from "axios";
import EditProfileModal from "../components/EditProfileModal";

const MiPerfil = ({ user }) => {
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatedPerfil, setUpdatedPerfil] = useState({});

  useEffect(() => {
    if (user?._id) {
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/${user._id}`)
        .then((response) => {
          setPerfil(response.data);
          setUpdatedPerfil(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error al obtener los datos del perfil:", err);
          setError("Hubo un error al cargar el perfil.");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleShowEditModal = () => setShowEditModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "fotoPerfil") {
      // Guardar el archivo seleccionado en el estado
      setUpdatedPerfil((prevPerfil) => ({
        ...prevPerfil,
        [name]: files[0], // Usamos files[0] para obtener el archivo
      }));
    } else {
      setUpdatedPerfil((prevPerfil) => ({
        ...prevPerfil,
        [name]: value,
      }));
    }
  };

  const handleSaveChanges = () => {
    const data = {};

    // Agregar solo los campos que han cambiado
    for (const key in updatedPerfil) {
      if (updatedPerfil[key] !== perfil[key]) {
        data[key] = updatedPerfil[key];
      }
    }

    console.log("Datos que se enviarán:", data);

    setLoading(true);
    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/${user._id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setPerfil(response.data); // Actualizar el estado del perfil con los datos recibidos
        setShowEditModal(false); // Cerrar el modal
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al actualizar el perfil:", err);
        setError("Hubo un error al guardar los cambios. Inténtalo nuevamente.");
        setLoading(false);
      });
  };

  return (
    <Container className="py-5 mt-5 pt-5 pb-5">
      <h1 className="text-center text-primary mb-4 fw-bold"></h1>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      {perfil && (
        <Card className=" rounded p-4">
          <Row>
            <Col md={4} className="text-center mb-4">
              {/* Imagen del perfil (puedes agregar más tarde) */}
              {/* Imagen del perfil */}
              <div className="text-center mb-4">
                {perfil.fotoPerfil ? (
                  <img
                    src={perfil.fotoPerfil}
                    alt="Foto de Perfil"
                    className="rounded-circle border shadow-sm"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      margin: "0 auto",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-light border shadow-sm"
                    style={{
                      width: "150px",
                      height: "150px",
                      margin: "0 auto",
                    }}
                  >
                    <p className="text-muted text-center mt-5">Sin Foto</p>
                  </div>
                )}
              </div>
              <h3 className="mt-3 fw-bold">
                {perfil.nombre || "Usuario sin nombre"}
              </h3>
              <p className="text-muted">
                {perfil.role || "Rol no especificado"}
              </p>
              <Button
                variant="outline-primary"
                onClick={handleShowEditModal}
                className="rounded-pill fw-bold"
              >
                Editar Perfil
              </Button>
            </Col>
            <Col md={8}>
              <h4 className="fw-bold text-primary">Información de Contacto</h4>
              <Row className="mb-3">
                <Col md={6}>
                  <p className="mb-0 text-muted fw-bold">📧 Email:</p>
                  <p className="fs-5 ">{perfil.email || "No registrado"}</p>
                </Col>
                <Col md={6}>
                  <p className="mb-0 text-muted fw-bold">📞 Teléfono:</p>
                  <p className="fs-5">
                    {perfil.telefono || "No proporcionado"}
                  </p>
                </Col>
              </Row>
              <h4 className="fw-bold text-primary mt-4">Detalles Personales</h4>
              <Row>
                <Col md={6}>
                  <p className="mb-0 text-muted fw-bold">⚖️ Peso:</p>
                  <p className="fs-5 ">
                    {perfil.pesoActual
                      ? `${perfil.pesoActual} kg`
                      : "No registrado"}
                  </p>
                </Col>
                <Col md={6}>
                  <p className="mb-0 text-muted fw-bold">📏 Altura:</p>
                  <p className="fs-5">
                    {perfil.altura ? `${perfil.altura} cm` : "No registrada"}
                  </p>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col md={6}>
                  <p className="mb-0 text-muted fw-bold">
                    🧗 Nivel de Experiencia:
                  </p>
                  <p className="fs-5">
                    {perfil.nivelExperiencia || "No especificado"}
                  </p>
                </Col>
                <Col md={6}>
                  <p className="mb-0 text-muted fw-bold">🎯 Objetivos:</p>
                  <p className="fs-5">{perfil.objetivos || "No definidos"}</p>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col>
                  <p className="mb-0 text-muted fw-bold">
                    🩺 Condiciones Médicas:
                  </p>
                  <p className="fs-5">
                    {perfil.condicionesMedicas || "Ninguna"}
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      )}

      <EditProfileModal
        show={showEditModal}
        handleClose={handleCloseEditModal}
        updatedPerfil={updatedPerfil}
        handleInputChange={handleInputChange}
        handleSaveChanges={handleSaveChanges}
      />
    </Container>
  );
};

export default MiPerfil;
