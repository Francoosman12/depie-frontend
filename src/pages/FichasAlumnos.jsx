import React, { useState } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Alert,
  Spinner,
  Form,
} from "react-bootstrap";
import axios from "axios";

const FichasAlumnos = () => {
  const [alumnos, setAlumnos] = useState([]); // Estado para los alumnos
  const [filteredAlumnos, setFilteredAlumnos] = useState([]); // Estado para los alumnos filtrados
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [error, setError] = useState(""); // Estado para errores
  const [loading, setLoading] = useState(false); // Estado de carga
  const [modalVisible, setModalVisible] = useState(false); // Estado para mostrar modal
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null); // Alumno seleccionado

  // Función para cargar el listado de alumnos
  const cargarAlumnos = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/usuarios`
      );
      setAlumnos(response.data); // Guardar el listado de alumnos
      setFilteredAlumnos(response.data); // Inicialmente mostrar todos los alumnos
    } catch (err) {
      console.error("Error al cargar alumnos:", err);
      setError("Hubo un error al cargar el listado de alumnos.");
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase(); // Convertir el término de búsqueda a minúsculas
    setSearchTerm(term);

    const filtered = alumnos.filter(
      (alumno) =>
        alumno.nombre.toLowerCase().includes(term) || // Filtrar por nombre
        alumno.email.toLowerCase().includes(term) // Filtrar por email
    );

    setFilteredAlumnos(filtered);
  };

  // Función para manejar la apertura del modal
  const abrirModal = (alumno) => {
    setAlumnoSeleccionado(alumno); // Alumno cuya ficha se mostrará
    setModalVisible(true);
  };

  // Función para manejar el cierre del modal
  const cerrarModal = () => {
    setModalVisible(false);
    setAlumnoSeleccionado(null); // Limpiar selección
  };

  // Cargar listado de alumnos al montar el componente
  React.useEffect(() => {
    cargarAlumnos();
  }, []);

  return (
    <Container className="my-4 pb-5 pt-5 mt-5">
      <h1 className="text-center mb-4">Listado de Alumnos</h1>

      {/* Input de búsqueda */}
      <Form.Group className="mb-4" controlId="searchInput">
        <Form.Control
          type="text"
          placeholder="Buscar alumno por nombre o email"
          value={searchTerm}
          onChange={handleSearch}
        />
      </Form.Group>

      {/* Mostrar errores */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Mostrar spinner mientras se cargan los datos */}
      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      )}

      {/* Mostrar la tabla con los datos de los alumnos */}
      {!loading && filteredAlumnos.length > 0 && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlumnos.map((alumno, index) => (
              <tr key={alumno._id}>
                <td>{index + 1}</td>
                <td className="text-center">
                  <img
                    src={alumno.fotoPerfil || "https://via.placeholder.com/50"}
                    alt="Foto de Perfil"
                    className="rounded-circle"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td>{alumno.nombre}</td>
                <td>{alumno.email}</td>
                <td>{alumno.telefono || "No proporcionado"}</td>
                <td>
                  <Button variant="info" onClick={() => abrirModal(alumno)}>
                    Ver Ficha
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal para mostrar la ficha del alumno */}
      <Modal show={modalVisible} onHide={cerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ficha de {alumnoSeleccionado?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alumnoSeleccionado && (
            <div className="text-center">
              <img
                src={
                  alumnoSeleccionado.fotoPerfil ||
                  "https://via.placeholder.com/150"
                }
                alt="Foto de Perfil"
                className="rounded-circle mb-3"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <p>
                <strong>Email:</strong> {alumnoSeleccionado.email}
              </p>
              <p>
                <strong>Teléfono:</strong>{" "}
                {alumnoSeleccionado.telefono || "No proporcionado"}
              </p>
              <p>
                <strong>Peso Actual:</strong>{" "}
                {alumnoSeleccionado.pesoActual || "No registrado"} kg
              </p>
              <p>
                <strong>Altura:</strong>{" "}
                {alumnoSeleccionado.altura || "No registrada"} cm
              </p>
              <p>
                <strong>Nivel de Experiencia:</strong>{" "}
                {alumnoSeleccionado.nivelExperiencia || "No especificado"}
              </p>
              <p>
                <strong>Objetivos:</strong>{" "}
                {alumnoSeleccionado.objetivos || "No definidos"}
              </p>
              <p>
                <strong>Condiciones Médicas:</strong>{" "}
                {alumnoSeleccionado.condicionesMedicas || "Ninguna"}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FichasAlumnos;
