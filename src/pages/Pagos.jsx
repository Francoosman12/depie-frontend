import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import ModalPago from "../components/ModalPago";
import Factura from "../components/Factura";

const Pagos = () => {
  const [pagos, setPagos] = useState([]);
  const [filteredPagos, setFilteredPagos] = useState([]); // Estado para pagos filtrados
  const [searchTerm, setSearchTerm] = useState(""); // Búsqueda por usuario o membresía
  const [showModal, setShowModal] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [showFacturaModal, setShowFacturaModal] = useState(false); // Estado del modal de Factura
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null); // Factura a mostrar

  useEffect(() => {
    obtenerPagos();
  }, []);

  // Obtener los pagos desde la API
  const obtenerPagos = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/pagos`
      );
      setPagos(response.data);
      setFilteredPagos(response.data); // Inicialmente los pagos filtrados son todos
    } catch (error) {
      console.error("Error al obtener pagos:", error);
      setPagos([]);
    }
  };

  // Crear un nuevo pago
  const crearPago = async (formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/pagos`,
        formData
      );
      console.log("Pago creado:", response.data);
      obtenerPagos(); // Actualiza la lista de pagos
    } catch (error) {
      console.error("Error al crear el pago:", error);
    }
  };

  // Actualizar un pago existente
  const actualizarPago = async (id, formData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/pagos/${id}`,
        formData
      );
      console.log("Pago actualizado:", response.data);
      obtenerPagos(); // Actualiza la lista de pagos
    } catch (error) {
      console.error("Error al actualizar el pago:", error);
    }
  };

  // Eliminar un pago
  const eliminarPago = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/pagos/${id}`);
      console.log("Pago eliminado:", id);
      setPagos(pagos.filter((pago) => pago._id !== id));
      setFilteredPagos(filteredPagos.filter((pago) => pago._id !== id));
    } catch (error) {
      console.error("Error al eliminar el pago:", error);
    }
  };

  // Determinar el estado del pago según las fechas
  const determinarEstadoPago = (fechaPago, fechaExpiracion) => {
    const hoy = new Date().setHours(0, 0, 0, 0); // Fecha actual sin hora
    const fechaPagado = new Date(fechaPago).setHours(0, 0, 0, 0);
    const fechaExpirado = new Date(fechaExpiracion).setHours(0, 0, 0, 0);

    if (fechaPagado <= fechaExpirado) {
      return "Pagado";
    } else if (hoy > fechaExpirado) {
      return "Vencido";
    } else if (fechaExpirado - hoy <= 259200000) {
      // 3 días en milisegundos
      return "Próximo a vencer";
    }
    return "Activo";
  };

  // Manejar la búsqueda por usuario o membresía
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = pagos.filter(
      (pago) =>
        pago.usuario.nombre.toLowerCase().includes(term) ||
        pago.membresia.toLowerCase().includes(term)
    );

    setFilteredPagos(filtered);
  };

  // Abrir modal para ver la factura
  const verFactura = (pago) => {
    setFacturaSeleccionada(pago);
    setShowFacturaModal(true);
  };

  // Descargar los datos visibles en Excel
  const descargarExcel = () => {
    const datos = filteredPagos.map((pago) => ({
      Usuario: pago.usuario.nombre,
      Membresía: pago.membresia,
      Monto: pago.monto,
      Descuento: pago.descuento,
      Estado: determinarEstadoPago(pago.fechaPago, pago.fechaExpiracion),
      FechaPago: new Date(pago.fechaPago).toLocaleDateString(),
      FechaExpiración: new Date(pago.fechaExpiracion).toLocaleDateString(),
      Descripción: pago.descripcion,
    }));
    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Pagos");
    XLSX.writeFile(libro, "Pagos.xlsx");
  };

  return (
    <div className="p-5 mt-5">
      <h1>Gestión de Pagos</h1>
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => {
          setPagoSeleccionado(null);
          setShowModal(true);
        }}
      >
        Crear Nuevo Pago
      </Button>
      <ModalPago
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={(formData) => {
          if (pagoSeleccionado) {
            actualizarPago(pagoSeleccionado._id, formData);
          } else {
            crearPago(formData);
          }
          setShowModal(false);
        }}
        initialData={pagoSeleccionado}
      />

      {/* Filtros */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Group controlId="searchInput">
            <Form.Control
              type="text"
              placeholder="Buscar por usuario o membresía"
              value={searchTerm}
              onChange={handleSearch}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Tabla */}
      <h2>Listado de Pagos</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Membresía</th>
            <th>Monto</th>
            <th>Fecha de Pago</th>
            <th>Fecha de Expiración</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredPagos.map((pago) => {
            const estado = determinarEstadoPago(
              pago.fechaPago,
              pago.fechaExpiracion
            );
            return (
              <tr
                key={pago._id}
                style={{
                  backgroundColor:
                    estado === "Pagado"
                      ? "#d4edda" // Verde claro
                      : estado === "Vencido"
                      ? "#f8d7da" // Rojo claro
                      : estado === "Próximo a vencer"
                      ? "#fff3cd" // Amarillo claro
                      : "white", // Blanco por defecto
                }}
              >
                <td>{pago.usuario.nombre}</td>
                <td>{pago.membresia}</td>
                <td>${pago.monto}</td>
                <td>{new Date(pago.fechaPago).toLocaleDateString()}</td>
                <td>{new Date(pago.fechaExpiracion).toLocaleDateString()}</td>
                <td>{estado}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => {
                      setPagoSeleccionado(pago);
                      setShowModal(true);
                    }}
                  >
                    Editar
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => eliminarPago(pago._id)}
                  >
                    Eliminar
                  </Button>{" "}
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => verFactura(pago)}
                  >
                    Ver Factura
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Modal para Factura */}
      <Modal
        show={showFacturaModal}
        onHide={() => setShowFacturaModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Factura</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {facturaSeleccionada && <Factura pago={facturaSeleccionada} />}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowFacturaModal(false)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Button variant="success" onClick={descargarExcel}>
        Descargar Excel
      </Button>
    </div>
  );
};

export default Pagos;
