import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/depie.png";
import "../styles/Navbar.css";

const NavigationBar = ({ showLogin, user, setUser }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // Nuevo estado para detectar móviles
  const navigate = useNavigate(); // Hook para redirección

  const [isNavbarOpen, setNavbarOpen] = useState(false); // Estado para controlar el menú hamburguesa

  // Detectar el tamaño del dispositivo
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Móviles y tablets: ancho menor a 768px
    };

    handleResize(); // Ejecutar al montar el componente
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
  };

  // Manejar el cierre del menú hamburguesa
  const handleNavClick = () => {
    setNavbarOpen(false); // Cerrar el menú hamburguesa
  };

  return (
    <Navbar
      className={`navigation-bar ${isScrolled ? "scrolled" : ""}`}
      expand="sm"
      fixed="top"
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
          onClick={() => setNavbarOpen(!isNavbarOpen)}
          className={`navbar-toggler ${isNavbarOpen ? "open" : ""}`}
        />
        <Navbar.Collapse id="navbar-nav" className={isNavbarOpen ? "show" : ""}>
          <Nav className="ms-auto" onClick={handleNavClick}>
            <Nav.Link className="text-white nav-item-hover" as={Link} to="/">
              Inicio
            </Nav.Link>
            {user?.activo && user?.rol === "alumno" && (
              <>
                <Nav.Link
                  className="text-white nav-item-hover"
                  as={Link}
                  to="/mi-perfil"
                >
                  Mi Perfil
                </Nav.Link>
                <Nav.Link
                  className="text-white nav-item-hover"
                  as={Link}
                  to="/ver-rutina"
                >
                  Mi Rutina
                </Nav.Link>
              </>
            )}
            {user?.activo && user?.rol === "profesor" && (
              <>
                <Nav.Link
                  className="text-white nav-item-hover"
                  as={Link}
                  to="/ejercicios"
                >
                  Ejercicios
                </Nav.Link>
                <Nav.Link
                  className="text-white nav-item-hover"
                  as={Link}
                  to="/usuarios"
                >
                  Usuarios
                </Nav.Link>
                <Nav.Link
                  className="text-white nav-item-hover"
                  as={Link}
                  to="/rutinas"
                >
                  Rutinas
                </Nav.Link>
                <Nav.Link
                  className="text-white nav-item-hover"
                  as={Link}
                  to="/fichas-alumnos"
                >
                  Fichas de Alumnos
                </Nav.Link>
                <Nav.Link
                  className="text-white nav-item-hover"
                  as={Link}
                  to="/pagos"
                >
                  Pagos
                </Nav.Link>
              </>
            )}
            {!user ? (
              <Button
                variant="outline-light nav-item-hover"
                onClick={showLogin}
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
