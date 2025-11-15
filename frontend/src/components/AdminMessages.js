import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    leido: "",
    asunto: "",
    prioridad: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Memoizar fetchMessages con useCallback
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...filters,
      });

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/contact?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages(response.data.mensajes);
      setTotalPages(response.data.totalPaginas);
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]); // Dependencias de fetchMessages

  // Memoizar fetchStats con useCallback
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/contact/stats/resumen`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
    }
  }, []); // fetchStats no tiene dependencias externas

  // Ahora useEffect puede incluir las funciones memoizadas
  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [fetchMessages, fetchStats]);

  const markAsRead = async (messageId, leido = true) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/contact/${messageId}/leido`,
        { leido },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error("Error al marcar mensaje:", error);
    }
  };

  const markAsResponded = async (messageId, respondido = true) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/contact/${messageId}/respondido`,
        { respondido },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error("Error al marcar como respondido:", error);
    }
  };

  const deleteMessage = async (messageId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este mensaje?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/contact/${messageId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchMessages();
        fetchStats();
      } catch (error) {
        console.error("Error al eliminar mensaje:", error);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "alta":
        return "bg-red-100 text-red-800";
      case "media":
        return "bg-yellow-100 text-yellow-800";
      case "baja":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSubjectText = (subject) => {
    const subjects = {
      "consulta-producto": "Consulta Producto",
      "informacion-compra": "Info. Compra",
      asesoramiento: "Asesoramiento",
      reclamo: "Reclamo",
      otro: "Otro",
    };
    return subjects[subject] || subject;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Mensajes
          </h1>
          <p className="text-gray-600">
            Administra los mensajes de contacto recibidos
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Mensajes
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">No Leídos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.noLeidos || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Respondidos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats.total || 0) - (stats.noRespondidos || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.232 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Prioridad Alta
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.prioridadAlta || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={filters.leido}
                onChange={(e) =>
                  setFilters({ ...filters, leido: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
              >
                <option value="">Todos</option>
                <option value="false">No leídos</option>
                <option value="true">Leídos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asunto
              </label>
              <select
                value={filters.asunto}
                onChange={(e) =>
                  setFilters({ ...filters, asunto: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
              >
                <option value="">Todos</option>
                <option value="consulta-producto">Consulta Producto</option>
                <option value="informacion-compra">Info. Compra</option>
                <option value="asesoramiento">Asesoramiento</option>
                <option value="reclamo">Reclamo</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad
              </label>
              <select
                value={filters.prioridad}
                onChange={(e) =>
                  setFilters({ ...filters, prioridad: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
              >
                <option value="">Todas</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Mensajes */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Mensajes Recibidos
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remitente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asunto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prioridad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {messages.map((message) => (
                    <tr
                      key={message._id}
                      className={`${!message.leido ? "bg-blue-50" : ""}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {message.nombre}
                          </div>
                          <div className="text-sm text-gray-500">
                            {message.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getSubjectText(message.asunto)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                            message.prioridad
                          )}`}
                        >
                          {message.prioridad}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(message.fechaEnvio).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {message.leido ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Leído
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              No leído
                            </span>
                          )}
                          {message.respondido && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              Respondido
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setSelectedMessage(message)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() =>
                            markAsRead(message._id, !message.leido)
                          }
                          className="text-green-600 hover:text-green-900"
                        >
                          {message.leido ? "No leído" : "Marcar leído"}
                        </button>
                        <button
                          onClick={() =>
                            markAsResponded(message._id, !message.respondido)
                          }
                          className="text-purple-600 hover:text-purple-900"
                        >
                          {message.respondido ? "No respondido" : "Respondido"}
                        </button>
                        <button
                          onClick={() => deleteMessage(message._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>

        {/* Modal de Detalle */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Detalle del Mensaje
                  </h3>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre:
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedMessage.nombre}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email:
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedMessage.email}
                    </p>
                  </div>
                  {selectedMessage.telefono && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Teléfono:
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedMessage.telefono}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Asunto:
                    </label>
                    <p className="text-sm text-gray-900">
                      {getSubjectText(selectedMessage.asunto)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mensaje:
                    </label>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {selectedMessage.mensaje}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fecha:
                    </label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedMessage.fechaEnvio).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
