import React from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import logoDepie from "../assets/depie1.jpg"; // Importa el logotipo desde assets

const Factura = ({ pago }) => {
  if (!pago) {
    return <p>No hay información disponible para la factura.</p>;
  }

  // Función para imprimir la factura
  const imprimirFactura = () => {
    window.print();
  };

  return (
    <Container className="border rounded p-4 shadow-sm mt-3">
      {/* Encabezado */}
      <Row className="border-bottom pb-3 mb-4">
        <Col>
          <h2 className="text-warning">DePie Entrenamiento</h2>
          <p className="text-muted">Fecha: {new Date().toLocaleDateString()}</p>
        </Col>
        <Col className="text-end">
          {/* Logo de la empresa */}
          <img
            src={logoDepie} // Utiliza el nombre de la variable importada
            alt="Logotipo"
            className="img-fluid"
            style={{ maxHeight: "50px" }}
          />
        </Col>
      </Row>

      {/* Información del Cliente */}
      <Row className="mb-3">
        <Col>
          <h4 className="text-secondary">Información del Cliente</h4>
          <p>
            <strong>Nombre:</strong> {pago.usuario.nombre}
          </p>
          <p>
            <strong>Membresía:</strong> {pago.membresia}
          </p>
          <p>
            <strong>Método de Pago:</strong> {pago.metodoPago}
          </p>
        </Col>
      </Row>

      {/* Detalles del Pago */}
      <Row className="mb-3">
        <Col>
          <h4 className="text-secondary">Detalles del Pago</h4>
          <Table bordered>
            <tbody>
              <tr>
                <td>
                  <strong>Monto:</strong>
                </td>
                <td>${pago.monto}</td>
              </tr>
              <tr>
                <td>
                  <strong>Fecha de Pago:</strong>
                </td>
                <td>{new Date(pago.fechaPago).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td>
                  <strong>Fecha de Expiración:</strong>
                </td>
                <td>{new Date(pago.fechaExpiracion).toLocaleDateString()}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Descripción */}
      <Row>
        <Col>
          <h4 className="text-secondary">Descripción</h4>
          <p className="text-muted">{pago.descripcion}</p>
        </Col>
      </Row>

      {/* Pie de Página */}
      <Row className="border-top mt-4 pt-3 text-center">
        <Col>
          <p className="text-muted">
            Gracias por confiar en nuestros servicios.
          </p>
          <p className="text-muted small">
            Este documento es una factura válida emitida por DePie
            Entrenamiento.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Factura;
