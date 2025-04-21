import React, { useState } from "react";
import { Nav, Table, Button, Form } from "react-bootstrap";

const SemanaRutina = ({
  semanas,
  ejercicios,
  comentarioProfesor,
  handleInputChange,
  handleComentarioProfesorChange,
  handleRemoveEjercicio,
  handleAddEjercicio,
  handleRepetirEjercicios, // Nueva función para repetir ejercicios
}) => {
  const [activeSemana, setActiveSemana] = useState(0); // Semana activa (por índice)

  return (
    <div>
      <Nav
        variant="tabs"
        activeKey={activeSemana}
        onSelect={(key) => setActiveSemana(parseInt(key))}
        className="mb-4 bg-light"
      >
        {semanas.map((semana, index) => (
          <Nav.Item key={index}>
            <Nav.Link eventKey={index}>Semana {semana.numeroSemana}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {/* Comentario del Profesor */}
      <Form.Group controlId="comentarioProfesor">
        <Form.Label>Comentario del Profesor</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={comentarioProfesor}
          onChange={(e) => handleComentarioProfesorChange(e.target.value)}
          placeholder="Escribe un comentario general para la rutina"
        />
      </Form.Group>

      {semanas.length > 0 && (
        <div>
          <h4 className="mt-4">Semana {semanas[activeSemana].numeroSemana}</h4>
          {activeSemana > 0 && (
            <Button
              variant="outline-secondary"
              className="mb-3"
              onClick={() =>
                handleRepetirEjercicios(semanas[activeSemana].numeroSemana)
              }
            >
              Repetir ejercicios de Semana{" "}
              {semanas[activeSemana].numeroSemana - 1}
            </Button>
          )}
          {semanas[activeSemana].dias.map((dia) => (
            <div key={dia.dia} className="mb-3">
              <h5>{dia.dia}</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Ejercicio</th>
                    <th>Bloque</th>
                    <th>Series</th>
                    <th>Repeticiones</th>
                    <th>Peso Sugerido</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {dia.ejercicios.map((ejercicio, index) => (
                    <tr key={index}>
                      <td>{ejercicio.nombre}</td>
                      <td>
                        <Form.Select
                          value={ejercicio.bloque || "A"}
                          onChange={(e) =>
                            handleInputChange(
                              semanas[activeSemana].numeroSemana,
                              dia.dia,
                              index,
                              "bloque",
                              e.target.value
                            )
                          }
                          className="form-control-sm"
                        >
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="E">E</option>
                          <option value="F">F</option>
                          <option value="Calentamiento">Calentamiento</option>
                          <option value="Parte Final">Parte Final</option>
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          value={ejercicio.series}
                          onChange={(e) =>
                            handleInputChange(
                              semanas[activeSemana].numeroSemana,
                              dia.dia,
                              index,
                              "series",
                              e.target.value
                            )
                          }
                          className="form-control-sm"
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={ejercicio.repeticiones}
                          onChange={(e) =>
                            handleInputChange(
                              semanas[activeSemana].numeroSemana,
                              dia.dia,
                              index,
                              "repeticiones",
                              e.target.value
                            )
                          }
                          className="form-control-sm"
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={ejercicio.peso_sugerido}
                          onChange={(e) =>
                            handleInputChange(
                              semanas[activeSemana].numeroSemana,
                              dia.dia,
                              index,
                              "peso_sugerido",
                              e.target.value
                            )
                          }
                          className="form-control-sm"
                        />
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            handleRemoveEjercicio(
                              semanas[activeSemana].numeroSemana,
                              dia.dia,
                              index
                            )
                          }
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Agregar Ejercicio */}
              <Form.Group
                controlId={`selectEjercicio-${semanas[activeSemana].numeroSemana}-${dia.dia}`}
              >
                <Form.Label>Agregar Ejercicio</Form.Label>
                <Form.Select
                  onChange={(e) =>
                    handleAddEjercicio(
                      semanas[activeSemana].numeroSemana,
                      dia.dia,
                      ejercicios.find((ej) => ej._id === e.target.value)
                    )
                  }
                >
                  <option value="">Seleccionar Ejercicio</option>
                  {ejercicios.map((ejercicio) => (
                    <option key={ejercicio._id} value={ejercicio._id}>
                      {ejercicio.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SemanaRutina;
