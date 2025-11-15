import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = ({ user, loading }) => {
  // Mientras se verifica la autenticación, mostrar un indicador de carga.
  if (loading) {
    return <div>Verificando acceso...</div>; // O un componente Spinner más elegante
  }

  // Si la carga ha terminado y el usuario no es admin, redirigir a login.
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // Si la carga ha terminado y el usuario es admin, mostrar el contenido.
  return <Outlet />;
};

export default AdminRoute;
