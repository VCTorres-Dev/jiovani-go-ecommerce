import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = ({ user, loading }) => {
  console.log('[AdminRoute] Estado:', { loading, user: user ? { id: user.id, role: user.role, username: user.username } : null });
  
  // Mientras se verifica la autenticación, mostrar un indicador de carga.
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si la carga ha terminado y el usuario no es admin, redirigir a login.
  if (!user || user.role !== 'admin') {
    console.log('[AdminRoute] Redirigiendo a login, razón:', !user ? 'no hay usuario' : 'usuario no es admin');
    return <Navigate to="/login" replace />;
  }

  console.log('[AdminRoute] Acceso permitido, mostrando contenido admin');
  // Si la carga ha terminado y el usuario es admin, mostrar el contenido.
  return <Outlet />;
};

export default AdminRoute;
