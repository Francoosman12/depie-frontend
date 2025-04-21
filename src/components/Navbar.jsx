import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/depie.png";
import "../styles/Navbar.css";

const NavigationBar = ({ showLogin, user, setUser }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Controlar el menú hamburguesa
  const navigate = useNavigate(); // Hook para redirección

  // Detectar el scroll y actualizar el estado
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Cambia el estado si hay scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Manejar el cierre de sesión
  const handleLogout = () => {
    setUser(null); // Limpia el estado del usuario logueado
    localStorage.removeItem("user"); // Elimina del Local Storage
    navigate("/"); // Redirige al home
    setIsExpanded(false); // Cerrar el menú hamburguesa
  };

  // Manejar el cierre del menú hamburguesa al hacer clic en un enlace
  const handleNavClick = () => {
    setIsExpanded(false);
  };

  return (
    <Navbar
      className={`navigation-bar ${isScrolled ? "scrolled" : ""}`}
      expand="sm"
      fixed="top"
      expanded={isExpanded} // Controlar el estado del menú hamburguesa
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "contain",
            }}
          />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="navbar-nav"
          onClick={() => setIsExpanded(!isExpanded)} // Alternar el menú
          className={`navbar-toggler ${isExpanded ? "open" : ""}`}
        />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            {/* Enlace al Inicio */}
            <Nav.Link
              className="text-white nav-item-hover"
              as={Link}
              to="/"
              onClick={handleNavClick}
            >
              Inicio
            </Nav.Link>

            {user?.activo && user?.rol === "alumno" && (
              <>
                <Nav.Link
                  className="text-white nav-item-hover"
                  as={Link}
                  to="/mi-perfil"
                  onClick={handleNavClick}
                >
                  Mi Perfil
                </Nav.Link>
                <Nav.Link
                  className="text-white nav-item-hover"
                  as={Link}
                  to="/ver-rutina"
                  onClick={handleNavClick}
                >
                  Mi Rutina
                </Nav.Link>
              </>
            )}

            {user?.activo && user?.rol === "profesor" && (
              <>
                {/* Desplegable Rutinas */}
                <NavDropdown
                  title="Rutinas"
                  id="nav-dropdown-rutinas"
                  className="text-white nav-item-hover"
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/ejercicios"
                    onClick={handleNavClick}
                  >
                    Ejercicios
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/rutinas"
                    onClick={handleNavClick}
                  >
                    Crear Rutinas
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/rutinas-creadas"
                    onClick={handleNavClick}
                  >
                    Ver Rutinas Creadas
                  </NavDropdown.Item>
                </NavDropdown>

                {/* Desplegable Usuarios */}
                <NavDropdown
                  title="Usuarios"
                  id="nav-dropdown-usuarios"
                  className="text-white nav-item-hover"
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/usuarios"
                    onClick={handleNavClick}
                  >
                    Ver Usuarios
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/fichas-alumnos"
                    onClick={handleNavClick}
                  >
                    Fichas de Alumnos
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/pagos"
                    onClick={handleNavClick}
                  >
                    Pagos
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
            {!user ? (
              <Button
                variant="outline-light nav-item-hover"
                onClick={() => {
                  showLogin();
                  setIsExpanded(false);
                }}
                className="ms-3"
              >
                Login
              </Button>
            ) : (
              <Button
                variant="outline-danger nav-item-hover"
                onClick={handleLogout}
                className="ms-3"
              >
                Cerrar Sesión
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
