import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/Navbar";
import Home from "./pages/Home";
import Ejercicios from "./pages/Ejercicios";
import Usuarios from "./pages/Usuarios";
import Rutinas from "./pages/Rutinas";
import VerRutinas from "./pages/VerRutinas";
import Registro from "./pages/Registro";
import RutinasCreadas from "./pages/RutinasCreadas";
import LoginModal from "./components/LoginModal";
import ProtectedRoute from "./components/ProtectedRoute";
import MiPerfil from "./pages/MiPerfil";
import FichasAlumnos from "./pages/FichasAlumnos";
import NotAuthorized from "./pages/NotAuthorized";
import Pagos from "./pages/Pagos";

const App = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);

  // Recuperar el usuario desde Local Storage al montar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);

      if (!parsedUser.activo) {
        alert("Tu cuenta está inactiva. Contacta al administrador.");
        localStorage.removeItem("user");
        localStorage.removeItem("token"); // Borra el token también
        return;
      }

      setUser(parsedUser);
    }
  }, []);

  // Función para manejar el login y almacenar al usuario en Local Storage
  const handleLogin = (loggedInUser) => {
    if (!loggedInUser.activo) {
      alert("Tu cuenta está inactiva. Contacta al administrador.");
      return; // No permite que un usuario inactivo se loguee
    }

    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    setUser(null); // Limpia el estado del usuario
    localStorage.removeItem("user"); // Elimina del Local Storage
  };

  return (
    <Router>
      <NavigationBar
        showLogin={() => setShowLoginModal(true)}
        user={user}
        setUser={handleLogout}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Registro />} />
        <Route
          path="/ver-rutina"
          element={
            <ProtectedRoute user={user} requiredRole="alumno">
              <VerRutinas user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ejercicios"
          element={
            <ProtectedRoute user={user} requiredRole="profesor">
              <Ejercicios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute user={user} requiredRole="profesor">
              <Usuarios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rutinas"
          element={
            <ProtectedRoute user={user} requiredRole="profesor">
              <Rutinas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rutinas-creadas"
          element={
            <ProtectedRoute user={user} requiredRole="profesor">
              <RutinasCreadas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mi-perfil"
          element={
            <ProtectedRoute user={user} requiredRole="alumno">
              <MiPerfil user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fichas-alumnos"
          element={
            <ProtectedRoute user={user} requiredRole="profesor">
              <FichasAlumnos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pagos"
          element={
            <ProtectedRoute user={user} requiredRole="profesor">
              <Pagos />
            </ProtectedRoute>
          }
        />
        <Route path="/not-authorized" element={<NotAuthorized />} />
      </Routes>
      <LoginModal
        show={showLoginModal}
        handleClose={() => setShowLoginModal(false)}
        setUser={handleLogin}
      />
    </Router>
  );
};

export default App;
