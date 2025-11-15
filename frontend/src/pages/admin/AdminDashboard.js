import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaUsers, FaBoxOpen, FaEnvelopeOpenText } from "react-icons/fa";

const AdminCard = ({ to, icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
    <h2 className="text-2xl font-semibold text-gray-700 mb-2">{title}</h2>
    <p className="text-gray-600 mb-4">{description}</p>
    <Link to={to} className="font-semibold text-gold hover:text-yellow-600 transition-colors duration-300 flex items-center">
      {icon} &rarr;
    </Link>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 border-b pb-4">Panel de Administración</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Card para Gestionar Productos */}
        <AdminCard
          to="/admin/products"
          icon={<FaBoxOpen className="text-orange-500" />}
          title="Gestionar Productos"
          description="Añadir, editar o eliminar productos del catálogo."
        />

        {/* Card para Gestionar Usuarios */}
        <AdminCard
          to="/admin/users"
          icon={<FaUsers className="text-blue-500" />}
          title="Gestionar Usuarios"
          description="Ver, editar roles o eliminar usuarios."
        />

        {/* Card para Analíticas */}
        <AdminCard
          to="/admin/analytics"
          icon={<FaChartLine className="text-green-500" />}
          title="Analíticas"
          description="Visualizar estadísticas de ventas y rendimiento."
        />

        {/* Card para Mensajes */}
        <AdminCard
          to="/admin/messages"
          icon={<FaEnvelopeOpenText className="text-purple-500" />}
          title="Mensajes"
          description="Gestiona los mensajes de los clientes"
        />

        


        {/* Card para Ver Pedidos (Placeholder) */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Ver Pedidos</h2>
          <p className="text-gray-600 mb-4">Consultar el historial de pedidos de los clientes.</p>
          <span className="font-semibold text-gray-400 cursor-not-allowed">Próximamente</span>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
