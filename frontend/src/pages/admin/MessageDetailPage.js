import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMessageById, updateMessage, deleteMessage } from '../../services/messageService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaCheckCircle, FaTrash } from 'react-icons/fa';

const MessageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true);
        const data = await getMessageById(id);
        setMessage(data);
        // Marcar como leído al abrir, si no lo está ya
        if (!data.leido) {
          await updateMessage(id, { leido: true });
          setMessage(prev => ({ ...prev, leido: true }));
        }
      } catch (err) {
        setError('Error al cargar el mensaje: ' + err.toString());
        toast.error('Error al cargar el mensaje.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [id]);

  const handleUpdateStatus = async (field, value) => {
    try {
      const updatedMessage = await updateMessage(id, { [field]: value });
      setMessage(updatedMessage);
      toast.success(`Mensaje marcado como ${value ? 'leído' : 'no leído'}`);
    } catch (err) {
      toast.error('Error al actualizar el estado del mensaje.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este mensaje? Esta acción es irreversible.')) {
      try {
        await deleteMessage(id);
        toast.success('Mensaje eliminado correctamente.');
        navigate('/admin/messages');
      } catch (err) {
        toast.error('Error al eliminar el mensaje.');
      }
    }
  };

  if (loading) return <div className="text-center p-10">Cargando detalle del mensaje...</div>;
  if (error) return <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;
  if (!message) return <div className="text-center p-10">Mensaje no encontrado.</div>;

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <button onClick={() => navigate('/admin/messages')} className="flex items-center gap-2 text-gold-600 hover:text-gold-800 font-semibold mb-6">
        <FaArrowLeft /> Volver a la Bandeja de Entrada
      </button>

      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">{message.asunto.replace(/-/g, ' ')}</h1>
          <p className="text-sm text-gray-500">Recibido el {format(new Date(message.createdAt), 'dd/MM/yyyy HH:mm')}</p>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna de detalles del remitente */}
          <div className="md:col-span-1 border-r pr-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Detalles del Remitente</h2>
            <div className="space-y-4">
              <p className="flex items-center gap-3"><FaUser className="text-gray-400"/> <strong>{`${message.nombre}${message.apellido ? ' ' + message.apellido : ''}`}</strong></p>
              <p className="flex items-center gap-3"><FaEnvelope className="text-gray-400"/> <a href={`mailto:${message.email}`} className="text-blue-600 hover:underline">{message.email}</a></p>
              {message.telefono && (<p className="flex items-center gap-3"><FaPhone className="text-gray-400"/> {message.telefono}</p>)}
            </div>
          </div>

          {/* Columna del mensaje y acciones */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Mensaje</h2>
            <div className="bg-gray-50 p-4 rounded-lg text-gray-800 whitespace-pre-wrap">
              {message.mensaje}
            </div>

            <div className="mt-6 pt-6 border-t flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {!message.leido && (
                <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800`}>
                  <FaCheckCircle /> {message.leido ? 'Leído' : 'No Leído'}
                </span> )}
                {!message.respondido && (
                 <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800`}>
                  <FaCheckCircle /> {message.respondido ? 'Respondido' : 'Pendiente'}
                 </span> )}
              </div>
              <div className="flex items-center gap-3">
                 <button onClick={() => handleUpdateStatus('leido', !message.leido)} className="text-sm text-gray-600 hover:text-black">Marcar como {message.leido ? 'No Leído' : 'Leído'}</button>
                <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                  <FaTrash /> Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDetailPage;
