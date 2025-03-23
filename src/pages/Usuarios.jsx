import React, { useState, useEffect } from "react";
import { Table, Button, Container } from "react-bootstrap";
import axios from "axios";
import UpdateUserModal from "../components/UpdateUserModal";
import AddUserModal from "../components/AddUserModal"; // Importar el nuevo modal

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // Controla el modal de agregar usuario

  // Obtener usuarios del backend
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/usuarios`)
      .then((response) => setUsuarios(response.data))
      .catch((error) => console.error("Error al obtener los usuarios:", error));
  }, []);

  // Manejar la creación de un nuevo usuario
  const handleUserAdded = (newUsuario) => {
    setUsuarios([...usuarios, newUsuario]);
  };

  // Manejar la actualización del usuario
  const handleUserUpdated = (updatedUsuario) => {
    setUsuarios((prevUsuarios) =>
      prevUsuarios.map((usuario) =>
        usuario._id === updatedUsuario._id ? updatedUsuario : usuario
      )
    );
  };

  // Eliminar un usuario
  const handleDelete = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/api/usuarios/${id}`)
      .then(() => {
        alert("Usuario eliminado correctamente");
        setUsuarios(usuarios.filter((usuario) => usuario._id !== id));
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
          {usuarios.map((usuario) => (
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
