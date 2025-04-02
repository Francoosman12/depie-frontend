import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select"; // Para listas desplegables
import DatePicker from "react-datepicker"; // Para el selector de fechas
import "react-datepicker/dist/react-datepicker.css"; // Estilo de DatePicker

const ModalPago = ({ show, handleClose, handleSave, initialData }) => {
  const [formData, setFormData] = useState({
    usuario: "",
    membresia: "",
    metodoPago: "",
    monto: "",
    descripcion: "",
    descuento: "",
    fechaPago: new Date(), // Fecha actual como inicial
    fechaExpiracion: new Date(), // Fecha inicial de expiración
  });

  const [usuarios, setUsuarios] = useState([]); // Lista de usuarios
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null); // Usuario seleccionado

  const opcionesMetodoPago = [
    { value: "efectivo", label: "Efectivo" },
    { value: "tarjeta", label: "Tarjeta" },
    { value: "transferencia", label: "Transferencia" },
    { value: "Paypal", label: "Paypal" },
  ];

  useEffect(() => {
    setFormData({
      usuario: initialData?.usuario || "",
      membresia: initialData?.membresia || "",
      metodoPago: initialData?.metodoPago || "",
      monto: initialData?.monto || "",
      descripcion: initialData?.descripcion || "",
      descuento: initialData?.descuento || "",
      fechaPago: initialData?.fechaPago
        ? new Date(initialData.fechaPago)
        : new Date(),
      fechaExpiracion: initialData?.fechaExpiracion
        ? new Date(initialData.fechaExpiracion)
        : new Date(),
    });

    if (initialData) {
      setUsuarioSeleccionado({
        value: initialData.usuario,
        label: initialData.usuarioNombre, // Este campo debe venir del backend
      });
    }
  }, [initialData]);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/usuarios`
        );
        const data = await response.json();
        const opcionesUsuarios = data.map((usuario) => ({
          value: usuario._id,
          label: usuario.nombre,
        }));
        setUsuarios(opcionesUsuarios);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    if (show) {
      obtenerUsuarios();
    }
  }, [show]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUsuarioChange = (selectedOption) => {
    setUsuarioSeleccionado(selectedOption);
    setFormData({ ...formData, usuario: selectedOption?.value || "" });
  };

  const handleMetodoPagoChange = (selectedOption) => {
    setFormData({ ...formData, metodoPago: selectedOption?.value || "" });
  };

  const handleFechaPagoChange = (date) => {
    setFormData({ ...formData, fechaPago: date });
  };

  const handleFechaExpiracionChange = (date) => {
    setFormData({ ...formData, fechaExpiracion: date });
  };

  const calcularDuracion = () => {
    const { fechaPago, fechaExpiracion } = formData;
    const diferencia =
      (new Date(fechaExpiracion) - new Date(fechaPago)) / (1000 * 60 * 60 * 24); // Diferencia en días
    return Math.max(Math.round(diferencia), 0); // Asegurarse de que no sea negativo
  };

  const handleSubmit = () => {
    if (
      !formData.usuario ||
      !formData.membresia ||
      !formData.monto ||
      !formData.fechaExpiracion
    ) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    const rutinaDuracion = calcularDuracion(); // Calcular duración automáticamente

    const formDataFinal = {
      ...formData,
      rutinaDuracion, // Incluir la duración calculada
    };

    handleSave(formDataFinal); // Envía los datos al controlador de guardar o actualizar
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? "Editar Pago" : "Crear Pago"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formUsuario">
            <Form.Label>Usuario</Form.Label>
            <Select
              options={usuarios}
              value={usuarioSeleccionado}
              onChange={handleUsuarioChange}
              placeholder="Selecciona un usuario"
              isClearable
            />
          </Form.Group>
          <Form.Group controlId="formMembresia">
            <Form.Label>Membresía</Form.Label>
            <Form.Control
              type="text"
              placeholder="Membresía"
              value={formData.membresia}
              name="membresia"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formMetodoPago">
            <Form.Label>Método de Pago</Form.Label>
            <Select
              options={opcionesMetodoPago}
              value={opcionesMetodoPago.find(
                (opcion) => opcion.value === formData.metodoPago
              )}
              onChange={handleMetodoPagoChange}
              placeholder="Selecciona un método de pago"
              isClearable
            />
          </Form.Group>
          <Form.Group controlId="formMonto">
            <Form.Label>Monto</Form.Label>
            <Form.Control
              type="number"
              placeholder="Monto"
              value={formData.monto}
              name="monto"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formFechaPago" className="pb-2 pt-3">
            <Form.Label>Fecha de Pago</Form.Label>
            <DatePicker
              selected={formData.fechaPago}
              onChange={handleFechaPagoChange}
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
          </Form.Group>
          <Form.Group controlId="formFechaExpiracion" className="pb-2">
            <Form.Label>Fecha de Expiración</Form.Label>
            <DatePicker
              selected={formData.fechaExpiracion}
              onChange={handleFechaExpiracionChange}
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
          </Form.Group>
          <Form.Group controlId="formDescripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              placeholder="Descripción"
              value={formData.descripcion}
              name="descripcion"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formDescuento">
            <Form.Label>Descuento (%)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Descuento (%)"
              value={formData.descuento}
              name="descuento"
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit}>
          {initialData ? "Actualizar Pago" : "Guardar Pago"}
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPago;
