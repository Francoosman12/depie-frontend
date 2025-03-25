import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import SemanaRutina from "../components/SemanaRutina";

const Rutinas = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [ejercicios, setEjercicios] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState("");
  const [selectedEntrenador, setSelectedEntrenador] = useState("");
  const [semanas, setSemanas] = useState([
    {
      numeroSemana: 1,
      dias: [
        { dia: "Lunes", ejercicios: [] },
        { dia: "Martes", ejercicios: [] },
        { dia: "Miércoles", ejercicios: [] },
        { dia: "Jueves", ejercicios: [] },
        { dia: "Viernes", ejercicios: [] },
        { dia: "Sábado", ejercicios: [] },
        { dia: "Domingo", ejercicios: [] },
      ],
    },
    // Semanas 2, 3, 4...
  ]);
  const [nombreRutina, setNombreRutina] = useState("");
  const [descripcionRutina, setDescripcionRutina] = useState("");
  const [comentarioProfesor, setComentarioProfesor] = useState(""); // Comentario del profesor
  const [fechaInicio, setFechaInicio] = useState(""); // Fecha de inicio

  // Obtener usuarios y ejercicios
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/usuarios")
      .then((response) => setUsuarios(response.data))
      .catch((error) => console.error("Error al obtener usuarios:", error));

    axios
      .get("http://localhost:5000/api/ejercicios")
      .then((response) => setEjercicios(response.data))
      .catch((error) => console.error("Error al obtener ejercicios:", error));
  }, []);

  const handleAddEjercicio = (numeroSemana, dia, ejercicio) => {
    const updatedSemanas = semanas.map((semana) =>
      semana.numeroSemana === numeroSemana
        ? {
            ...semana,
            dias: semana.dias.map((d) =>
              d.dia === dia
                ? {
                    ...d,
                    ejercicios: [
                      ...d.ejercicios,
                      {
                        ejercicio_id: ejercicio._id,
                        nombre: ejercicio.nombre,
                        series: 3,
                        repeticiones: "8-12",
                        peso_sugerido: "Peso corporal",
                      },
                    ],
                  }
                : d
            ),
          }
        : semana
    );
    setSemanas(updatedSemanas);
  };

  const handleRemoveEjercicio = (numeroSemana, dia, index) => {
    const updatedSemanas = semanas.map((semana) =>
      semana.numeroSemana === numeroSemana
        ? {
            ...semana,
            dias: semana.dias.map((d) =>
              d.dia === dia
                ? {
                    ...d,
                    ejercicios: d.ejercicios.filter((_, i) => i !== index),
                  }
                : d
            ),
          }
        : semana
    );
    setSemanas(updatedSemanas);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevaRutina = {
      nombre: nombreRutina,
      descripcion: descripcionRutina,
      alumno_id: selectedUsuario,
      entrenador_id: selectedEntrenador,
      semanas,
      fecha_asignacion: fechaInicio,
      comentario_profesor: comentarioProfesor,
    };

    axios
      .post("http://localhost:5000/api/rutinas", nuevaRutina)
      .then(() => {
        alert("Rutina creada exitosamente");
        setNombreRutina("");
        setDescripcionRutina("");
        setComentarioProfesor("");
        setSelectedUsuario("");
        setSelectedEntrenador("");
        setFechaInicio("");
        setSemanas([
          {
            numeroSemana: 1,
            dias: [
              { dia: "Lunes", ejercicios: [] },
              { dia: "Martes", ejercicios: [] },
              { dia: "Miércoles", ejercicios: [] },
              { dia: "Jueves", ejercicios: [] },
              { dia: "Viernes", ejercicios: [] },
              { dia: "Sábado", ejercicios: [] },
              { dia: "Domingo", ejercicios: [] },
            ],
          },
        ]);
      })
      .catch((error) => {
        console.error("Error al crear la rutina:", error);
        alert("Ocurrió un error al crear la rutina");
      });
  };

  const handleInputChange = (numeroSemana, dia, index, field, value) => {
    const updatedSemanas = semanas.map((semana) =>
      semana.numeroSemana === numeroSemana
        ? {
            ...semana,
            dias: semana.dias.map((d) =>
              d.dia === dia
                ? {
                    ...d,
                    ejercicios: d.ejercicios.map((ejercicio, i) =>
                      i === index ? { ...ejercicio, [field]: value } : ejercicio
                    ),
                  }
                : d
            ),
          }
        : semana
    );
    setSemanas(updatedSemanas);
  };

  return (
    <Container className="pb-5 pt-5 mt-5">
      <h1 className="my-4 text-center">Crear Rutina</h1>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formNombreRutina">
              <Form.Label>Nombre de la Rutina</Form.Label>
              <Form.Control
                type="text"
                value={nombreRutina}
                onChange={(e) => setNombreRutina(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formDescripcionRutina">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                value={descripcionRutina}
                onChange={(e) => setDescripcionRutina(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formAlumno">
              <Form.Label>Alumno</Form.Label>
              <Form.Select
                value={selectedUsuario}
                onChange={(e) => setSelectedUsuario(e.target.value)}
                required
              >
                <option value="">Seleccionar Alumno</option>
                {usuarios.map((usuario) => (
                  <option key={usuario._id} value={usuario._id}>
                    {usuario.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formEntrenador">
              <Form.Label>Entrenador</Form.Label>
              <Form.Select
                value={selectedEntrenador}
                onChange={(e) => setSelectedEntrenador(e.target.value)}
                required
              >
                <option value="">Seleccionar Entrenador</option>
                {usuarios
                  .filter((usuario) => usuario.rol === "profesor")
                  .map((entrenador) => (
                    <option key={entrenador._id} value={entrenador._id}>
                      {entrenador.nombre}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formFechaInicio">
              <Form.Label>Fecha de Inicio</Form.Label>
              <Form.Control
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <SemanaRutina
          semanas={semanas}
          ejercicios={ejercicios}
          comentarioProfesor={comentarioProfesor}
          handleInputChange={handleInputChange}
          handleComentarioProfesorChange={(nuevoComentario) =>
            setComentarioProfesor(nuevoComentario)
          }
          handleRemoveEjercicio={handleRemoveEjercicio}
          handleAddEjercicio={handleAddEjercicio}
        />
        <Button variant="primary" type="submit">
          Guardar Rutina
        </Button>
      </Form>
    </Container>
  );
};

export default Rutinas;
