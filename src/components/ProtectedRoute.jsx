import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, user, requiredRole }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (!user.activo) {
      console.log("Usuario inactivo detectado. Redirigiendo a /not-authorized");
      navigate("/not-authorized");
    } else if (requiredRole && user.rol !== requiredRole) {
      navigate("/");
    }
  }, [user, requiredRole, navigate]);

  return user && user.activo ? children : null;
};

export default ProtectedRoute;
