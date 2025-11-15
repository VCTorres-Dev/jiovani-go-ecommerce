import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMessages } from '../../services/messageService';
import { format } from 'date-fns';
import { FaEye, FaFilter } from 'react-icons/fa';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(''); // '', 'read', 'unread'

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await getMessages(filter);
        setMessages(data);
      } catch (err) {
        setError('Error al cargar los mensajes. ' + err.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [filter]);

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Bandeja de Entrada</h1>
        <div className="flex items-center gap-4">
          <FaFilter className="text-gray-500" />
          <button onClick={() => setFilter('')} className={`px-4 py-2 rounded-lg font-semibold ${filter === '' ? 'bg-gold-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Todos</button>
          <button onClick={() => setFilter('unread')} className={`px-4 py-2 rounded-lg font-semibold ${filter === 'unread' ? 'bg-gold-600 text-white' : 'bg-gray-200 text-gray-700'}`}>No Leídos</button>
          <button onClick={() => setFilter('read')} className={`px-4 py-2 rounded-lg font-semibold ${filter === 'read' ? 'bg-gold-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Leídos</button>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Cargando mensajes...</div>
      ) : error ? (
        <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asunto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">De</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {messages.length > 0 ? messages.map(msg => (
                <tr key={msg._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {!msg.leido && <span className="h-3 w-3 bg-blue-500 rounded-full block" title="No leído"></span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{msg.asunto.replace(/-/g, ' ')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{msg.nombre} ({msg.email})</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{format(new Date(msg.createdAt), 'dd/MM/yyyy HH:mm')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/admin/messages/${msg._id}`} className="text-gold-600 hover:text-gold-800 flex items-center justify-end gap-2">
                      <FaEye /> Ver Mensaje
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">No hay mensajes que coincidan con el filtro.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
