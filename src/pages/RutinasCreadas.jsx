import React, { useState, useEffect } from "react";
import { Table, Container, Alert } from "react-bootstrap";
import axios from "axios";
import * as XLSX from "xlsx"; // Importar la librería

const RutinasCreadas = () => {
  const [rutinas, setRutinas] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/rutinas`) // Endpoint para obtener todas las rutinas
      .then((response) => {
        setRutinas(response.data);
      })
      .catch((err) => {
        console.error("Error al obtener rutinas:", err);
        setError("Hubo un error al cargar las rutinas.");
      });
  }, []);

  const calcularProgreso = (fechaInicio, fechaFin) => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const totalSemanas = 4; // Se asume que son 4 semanas

    const semanasTranscurridas =
      Math.abs(fin - inicio) / (1000 * 60 * 60 * 24) / 7;

    const progreso = Math.min((semanasTranscurridas / totalSemanas) * 100, 100); // Limitamos el progreso al 100%
    return progreso.toFixed(2); // Retorna el progreso con 2 decimales
  };

  const calcularFechaFin = (fechaAsignacion) => {
    const fechaInicio = new Date(fechaAsignacion);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + 28); // Sumar 28 días
    return fechaFin.toLocaleDateString(); // Formato de fecha legible
  };

  const descargarExcel = (rutina) => {
    // Crear los datos para el Excel
    const datos = [];

    rutina.semanas.forEach((semana) => {
      semana.dias.forEach((dia) => {
        dia.ejercicios.forEach((ejercicio, index) => {
          datos.push({
            Semana: `Semana ${semana.numeroSemana}`,
            Día: dia.dia,
            Ejercicio: ejercicio.nombre,
            Series: ejercicio.series,
            Repeticiones: ejercicio.repeticiones,
            Peso_Sugerido: ejercicio.peso_sugerido || "No especificado",
            Video: ejercicio.ejercicio_id?.video_url || "No disponible", // Agregar enlace al video
          });
        });
      });
    });

    // Crear un workbook (libro de trabajo)
    const libro = XLSX.utils.book_new();

    // Crear una hoja de cálculo a partir de los datos
    const hoja = XLSX.utils.json_to_sheet(datos);

    // Agregar la hoja al libro de trabajo
    XLSX.utils.book_append_sheet(libro, hoja, rutina.nombre);

    // Generar el archivo Excel y descargarlo
    XLSX.writeFile(libro, `${rutina.nombre}.xlsx`);
  };

  return (
    <Container className="pb-5 pt-5 mt-5">
      <h1 className="text-center mb-4">Rutinas Creadas</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre de la Rutina</th>
            <th>Descripción</th>
            <th>Usuario</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Finalización</th>
            <th>Progreso (%)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rutinas.map((rutina, index) => (
            <tr key={rutina._id}>
              <td>{index + 1}</td>
              <td>{rutina.nombre}</td>
              <td>{rutina.descripcion}</td>
              <td>{rutina.alumno_id?.nombre || "No asignado"}</td>
              <td>{new Date(rutina.fecha_asignacion).toLocaleDateString()}</td>
              <td>{calcularFechaFin(rutina.fecha_asignacion)}</td>
              <td>
                {calcularProgreso(
                  rutina.fecha_asignacion,
                  calcularFechaFin(rutina.fecha_asignacion)
                )}
                %
              </td>
              <td>
                {/* Botón para descargar el Excel */}
                <button
                  className="btn btn-info"
                  onClick={() => descargarExcel(rutina)}
                >
                  Ver Detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default RutinasCreadas;
