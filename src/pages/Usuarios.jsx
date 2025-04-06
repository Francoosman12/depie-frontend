import React, { useState, useEffect } from "react";
import { Table, Button, Container, Form } from "react-bootstrap";
import axios from "axios";
import UpdateUserModal from "../components/UpdateUserModal";
import AddUserModal from "../components/AddUserModal";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]); // Estado para los usuarios filtrados
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Obtener usuarios del backend
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios`)
      .then((response) => {
        setUsuarios(response.data);
        setFilteredUsuarios(response.data); // Inicialmente, los usuarios filtrados son todos los usuarios
      })
      .catch((error) => console.error("Error al obtener los usuarios:", error));
  }, []);

  // Manejar la búsqueda
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase(); // Convertir a minúsculas para búsqueda insensible a mayúsculas
    setSearchTerm(term);

    const filtered = usuarios.filter(
      (usuario) =>
        usuario.nombre.toLowerCase().includes(term) || // Buscar por nombre
        usuario.email.toLowerCase().includes(term) // Buscar por email
    );

    setFilteredUsuarios(filtered);
  };

  // Manejar la creación de un nuevo usuario
  const handleUserAdded = (newUsuario) => {
    const updatedUsuarios = [...usuarios, newUsuario];
    setUsuarios(updatedUsuarios);
    setFilteredUsuarios(updatedUsuarios); // Actualizar también los usuarios filtrados
  };

  // Manejar la actualización del usuario
  const handleUserUpdated = (updatedUsuario) => {
    const updatedUsuarios = usuarios.map((usuario) =>
      usuario._id === updatedUsuario._id ? updatedUsuario : usuario
    );
    setUsuarios(updatedUsuarios);
    setFilteredUsuarios(updatedUsuarios); // Actualizar también los usuarios filtrados
  };

  // Eliminar un usuario
  const handleDelete = (id) => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/${id}`)
      .then(() => {
        alert("Usuario eliminado correctamente");
        const updatedUsuarios = usuarios.filter(
          (usuario) => usuario._id !== id
        );
        setUsuarios(updatedUsuarios);
        setFilteredUsuarios(updatedUsuarios); // Actualizar también los usuarios filtrados
      })
      .catch((error) => console.error("Error al eliminar el usuario:", error));
  };

  return (
    <Container className="pb-5 pt-5 mt-5">
      <h1 className="my-4 text-center">Usuarios</h1>

      {/* Botón para abrir el modal de agregar usuario */}
      <Button
        className="mb-4"
        variant="primary"
        onClick={() => setShowAddModal(true)}
      >
        Agregar Usuario
      </Button>

      {/* Input de búsqueda */}
      <Form.Group className="mb-4" controlId="searchInput">
        <Form.Control
          type="text"
          placeholder="Buscar usuario por nombre o email"
          value={searchTerm}
          onChange={handleSearch}
        />
      </Form.Group>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsuarios.map((usuario) => (
            <tr key={usuario._id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.email}</td>
              <td>{usuario.rol}</td>
              <td>
                {usuario.activo ? (
                  <span className="text-success">Activo</span>
                ) : (
                  <span className="text-danger">Inactivo</span>
                )}
              </td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => {
                    setSelectedUsuario(usuario);
                    setShowUpdateModal(true);
                  }}
                  className="me-2"
                >
                  Actualizar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(usuario._id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para agregar usuario */}
      <AddUserModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAdd={handleUserAdded}
      />

      {/* Modal para actualizar usuario */}
      {selectedUsuario && (
        <UpdateUserModal
          show={showUpdateModal}
          onHide={() => setShowUpdateModal(false)}
          usuario={selectedUsuario}
          onUpdate={handleUserUpdated}
        />
      )}
    </Container>
  );
};

export default Usuarios;
