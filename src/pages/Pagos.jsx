import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Button, Table } from "react-bootstrap";
import ModalPago from "../components/ModalPago";

const Pagos = () => {
  const [pagos, setPagos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);

  useEffect(() => {
    obtenerPagos();
  }, []);

  const obtenerPagos = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/pagos`
      );
      setPagos(response.data);
    } catch (error) {
      console.error("Error al obtener pagos:", error);
      setPagos([]);
    }
  };

  const crearPago = async (formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/pagos`,
        formData
      );
      console.log("Pago creado:", response.data);
      obtenerPagos();
    } catch (error) {
      console.error("Error al crear el pago:", error);
    }
  };

  const actualizarPago = async (id, formData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/pagos/${id}`,
        formData
      );
      console.log("Pago actualizado:", response.data);
      obtenerPagos();
    } catch (error) {
      console.error("Error al actualizar el pago:", error);
    }
  };

  const imprimirFactura = (pago) => {
    const facturaHTML = `
      <html>
        <head>
          <title>Factura de Pago</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              text-align: center;
            }
            .factura-container {
              width: 80%;
              margin: auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 8px;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 20px;
            }
            .factura-detalle {
              text-align: left;
              margin-top: 20px;
            }
            .factura-detalle p {
              margin: 5px 0;
            }
            .factura-footer {
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="factura-container">
            <h1>Factura Electrónica</h1>
            <div class="factura-detalle">
              <p><strong>Usuario:</strong> ${pago.usuario.nombre}</p>
              <p><strong>Membresía:</strong> ${pago.membresia}</p>
              <p><strong>Método de Pago:</strong> ${pago.metodoPago}</p>
              <p><strong>Monto:</strong> $${pago.monto}</p>
              <p><strong>Fecha de Pago:</strong> ${new Date(
                pago.fechaPago
              ).toLocaleDateString()}</p>
              <p><strong>Fecha de Expiración:</strong> ${new Date(
                pago.fechaExpiracion
              ).toLocaleDateString()}</p>
              <p><strong>Descripción:</strong> ${pago.descripcion}</p>
              <p><strong>Descuento:</strong> ${pago.descuento}%</p>
            </div>
            <div class="factura-footer">
              <p>Gracias por su pago</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const ventanaImpresion = window.open("", "_blank");
    ventanaImpresion.document.write(facturaHTML);
    ventanaImpresion.document.close();
    ventanaImpresion.focus();
    ventanaImpresion.print();
    ventanaImpresion.close();
  };

  const descargarExcel = () => {
    const datos = pagos.map((pago) => ({
      Usuario: pago.usuario.nombre,
      Membresía: pago.membresia,
      Monto: pago.monto,
      Descuento: pago.descuento,
      FechaPago: new Date(pago.fechaPago).toLocaleDateString(),
      FechaExpiración: new Date(pago.fechaExpiracion).toLocaleDateString(),
      Descripción: pago.descripcion,
    }));
    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Pagos");
    XLSX.writeFile(libro, "Pagos.xlsx");
  };

  const calcularEstadoPago = (fechaExpiracion) => {
    const hoy = new Date();
    const fechaExp = new Date(fechaExpiracion);

    // Diferencia en días entre la fecha actual y la fecha de expiración
    const diferenciaDias = (fechaExp - hoy) / (1000 * 60 * 60 * 24);

    if (fechaExp < hoy) {
      return "expirado"; // Si ya expiró
    } else if (diferenciaDias <= 5) {
      return "cercaDeExpirar"; // Dentro de los próximos 5 días
    }
    return "activo"; // Si aún falta más de 5 días para expirar
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
      <h2>Listado de Pagos</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Membresía</th>
            <th>Monto</th>
            <th>Fecha de Pago</th>
            <th>Fecha de Expiración</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pagos.map((pago) => {
            const estadoPago = calcularEstadoPago(pago.fechaExpiracion);
            return (
              <tr
                key={pago._id}
                style={{
                  backgroundColor:
                    estadoPago === "expirado"
                      ? "#ffcccc"
                      : estadoPago === "cercaDeExpirar"
                      ? "#fff3cd"
                      : "white",
                }}
              >
                <td>{pago.usuario.nombre}</td>
                <td>{pago.membresia}</td>
                <td>${pago.monto}</td>
                <td>{new Date(pago.fechaPago).toLocaleDateString()}</td>
                <td>{new Date(pago.fechaExpiracion).toLocaleDateString()}</td>
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
                    variant="secondary"
                    size="sm"
                    onClick={() => imprimirFactura(pago)}
                  >
                    Imprimir Factura
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Button variant="success" onClick={descargarExcel}>
        Descargar Excel
      </Button>
    </div>
  );
};

export default Pagos;
