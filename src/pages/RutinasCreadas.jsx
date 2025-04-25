import React, { useState, useEffect } from "react";
import {
  Table,
  Container,
  Alert,
  Button,
  Form,
  Spinner,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import SemanaRutina from "../components/SemanaRutina"; // Importar SemanaRutina

const RutinasCreadas = () => {
  const [rutinas, setRutinas] = useState([]);
  const [filteredRutinas, setFilteredRutinas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false); // Controlar el modal
  const [selectedRutina, setSelectedRutina] = useState(null); // Rutina seleccionada
  const [ejerciciosDisponibles, setEjerciciosDisponibles] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/ejercicios`)
      .then((response) => {
        setEjerciciosDisponibles(response.data); // Guardar todos los ejercicios disponibles
      })
      .catch((error) => console.error("Error al obtener ejercicios:", error));
  }, []);

  // Obtener rutinas desde el backend
  useEffect(() => {
    const fetchRutinas = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/rutinas`
        );
        setRutinas(response.data);
        setFilteredRutinas(response.data);
      } catch (err) {
        console.error("Error al obtener rutinas:", err);
        setError("Hubo un error al cargar las rutinas.");
      } finally {
        setLoading(false);
      }
    };

    fetchRutinas();
  }, []);

  // Filtrar rutinas según el término de búsqueda
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = rutinas.filter(
      (rutina) =>
        rutina.nombre.toLowerCase().includes(term) || // Buscar por nombre de rutina
        rutina.alumno_id?.nombre?.toLowerCase().includes(term) // Buscar por nombre del usuario
    );
    setFilteredRutinas(filtered);
  };

  // Abrir el modal para editar una rutina
  const handleEdit = (rutina) => {
    setSelectedRutina(rutina); // Guardar la rutina seleccionada
    setModalShow(true); // Mostrar el modal
  };

  // Cerrar el modal
  const handleModalClose = () => {
    setModalShow(false);
    setSelectedRutina(null); // Limpiar rutina seleccionada
  };

  // Manejar los cambios dentro de SemanaRutina
  const handleUpdate = async () => {
    const updatedRutina = { ...selectedRutina };

    updatedRutina.semanas.forEach((semana) => {
      semana.dias.forEach((dia) => {
        dia.ejercicios.forEach((ejercicio) => {
          if (!ejercicio.ejercicio_id) {
            console.warn(
              `⚠️ El ejercicio "${ejercicio.nombre}" no tiene un ejercicio_id. Se está corrigiendo.`
            );
            const ejercicioExistente = ejerciciosDisponibles.find(
              (e) => e.nombre === ejercicio.nombre
            );
            if (ejercicioExistente) {
              ejercicio.ejercicio_id = ejercicioExistente._id; // ✅ Reasignar ejercicio_id si se encuentra
            }
          }
        });
      });
    });

    console.log("Rutina corregida antes de actualizar:", updatedRutina);

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/rutinas/${updatedRutina._id}`,
        updatedRutina
      );
      alert("Rutina actualizada exitosamente.");
      setRutinas((prev) =>
        prev.map((rutina) =>
          rutina._id === updatedRutina._id ? updatedRutina : rutina
        )
      );
      setFilteredRutinas((prev) =>
        prev.map((rutina) =>
          rutina._id === updatedRutina._id ? updatedRutina : rutina
        )
      );
      handleModalClose();
    } catch (err) {
      console.error("Error al actualizar rutina:", err);
      alert("Hubo un error al actualizar la rutina.");
    }
  };

  // Manejar eliminación de rutina
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta rutina?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/rutinas/${id}`
        );
        setRutinas((prev) => prev.filter((rutina) => rutina._id !== id));
        setFilteredRutinas((prev) =>
          prev.filter((rutina) => rutina._id !== id)
        );
        alert("Rutina eliminada exitosamente.");
      } catch (err) {
        console.error("Error al eliminar rutina:", err);
        alert("Hubo un error al eliminar la rutina.");
      }
    }
  };

  return (
    <Container className="pb-5 pt-5 mt-5">
      <h1 className="text-center mb-4">Rutinas Creadas</h1>

      {/* Buscador */}
      <Form.Group className="mb-4" controlId="searchInput">
        <Form.Control
          type="text"
          placeholder="Buscar por usuario o nombre de rutina"
          value={searchTerm}
          onChange={handleSearch}
        />
      </Form.Group>

      {/* Mostrar errores */}
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      )}

      {/* Tabla */}
      {!loading && filteredRutinas.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre de la Rutina</th>
              <th>Descripción</th>
              <th>Usuario</th>
              <th>Fecha de Inicio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRutinas.map((rutina, index) => (
              <tr key={rutina._id}>
                <td>{index + 1}</td>
                <td>{rutina.nombre}</td>
                <td>{rutina.descripcion}</td>
                <td>{rutina.alumno_id?.nombre || "No asignado"}</td>
                <td>
                  {new Date(rutina.fecha_asignacion).toLocaleDateString()}
                </td>
                <td>
                  <Button
                    className="btn-warning btn-sm me-2"
                    onClick={() => handleEdit(rutina)}
                  >
                    Actualizar
                  </Button>
                  <Button
                    className="btn-danger btn-sm"
                    onClick={() => handleDelete(rutina._id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {!loading && filteredRutinas.length === 0 && (
        <Alert variant="info">No se encontraron rutinas.</Alert>
      )}

      {/* Modal para editar rutina */}
      <Modal show={modalShow} onHide={handleModalClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Rutina</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRutina && (
            <SemanaRutina
              semanas={selectedRutina.semanas}
              ejercicios={ejerciciosDisponibles} // ✅ Pasar todos los ejercicios disponibles
              comentarioProfesor={selectedRutina.comentario}
              handleInputChange={(semana, dia, index, campo, valor) => {
                const updatedRutina = { ...selectedRutina };
                const semanaEditable = updatedRutina.semanas.find(
                  (s) => s.numeroSemana === semana
                );
                const diaEditable = semanaEditable.dias.find(
                  (d) => d.dia === dia
                );
                diaEditable.ejercicios[index][campo] = valor;
                setSelectedRutina(updatedRutina);
              }}
              handleComentarioProfesorChange={(comentario) => {
                setSelectedRutina((prev) => ({ ...prev, comentario }));
              }}
              handleRemoveEjercicio={(semana, dia, index) => {
                const updatedRutina = { ...selectedRutina };
                const semanaEditable = updatedRutina.semanas.find(
                  (s) => s.numeroSemana === semana
                );
                const diaEditable = semanaEditable.dias.find(
                  (d) => d.dia === dia
                );
                diaEditable.ejercicios.splice(index, 1);
                setSelectedRutina(updatedRutina);
              }}
              handleAddEjercicio={(semana, dia, ejercicio) => {
                const updatedRutina = { ...selectedRutina };
                const semanaEditable = updatedRutina.semanas.find(
                  (s) => s.numeroSemana === semana
                );
                const diaEditable = semanaEditable.dias.find(
                  (d) => d.dia === dia
                );
                diaEditable.ejercicios.push(ejercicio);
                setSelectedRutina(updatedRutina);
              }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RutinasCreadas;
