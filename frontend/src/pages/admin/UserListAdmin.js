import React, { useState, useEffect, useCallback } from 'react';
import { getUsers, deleteUser, updateUserRole } from '../../services/userService';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/ConfirmModal';
import { FaSearch, FaUserShield, FaUser, FaTrashAlt, FaSpinner } from 'react-icons/fa';
import useDebounce from '../../hooks/useDebounce';

const UserListAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 10, search: debouncedSearchTerm };
      const data = await getUsers(params);
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setTotalUsers(data.totalUsers || 0);
    } catch (err) {
      toast.error('No se pudieron cargar los usuarios.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    // Cuando el término de búsqueda cambia, resetea a la página 1
    if (debouncedSearchTerm !== undefined) { // Evita el reseteo en la carga inicial si no hay término
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // fetchUsers ya depende de currentPage y debouncedSearchTerm

  const openDeleteModal = (userId) => {
    setUserToDelete(userId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete);
      toast.success('¡Usuario eliminado con éxito!');
      fetchUsers(); // Recargar usuarios
    } catch (err) {
      toast.error(err.message || 'Error al eliminar el usuario.');
      console.error(err);
    } finally {
      setIsModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      toast.success('Rol de usuario actualizado.');
      fetchUsers(); // Recargar para reflejar el cambio
    } catch (err) {
      toast.error(err.message || 'No se pudo actualizar el rol.');
      console.error(err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-gray-800">Gestionar Usuarios</h1>
        {totalUsers > 0 && !loading && <span className='text-lg text-gray-600'>Total: {totalUsers}</span>}
      </div>

      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 focus:border-gold focus:outline-none transition-colors"
        />
        <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
      </div>

      <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gold/10">
              <th className="px-5 py-4 border-b-2 border-gold text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Usuario</th>
              <th className="px-5 py-4 border-b-2 border-gold text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Email</th>
              <th className="px-5 py-4 border-b-2 border-gold text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Rol</th>
              <th className="px-5 py-4 border-b-2 border-gold text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center py-10"><div className='flex justify-center items-center'><FaSpinner className='animate-spin text-gold text-4xl' /> <span className='ml-3 text-lg text-gray-600'>Cargando usuarios...</span></div></td></tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 font-semibold whitespace-no-wrap">{user.username}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-600 whitespace-no-wrap">{user.email}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className={`inline-flex items-center px-2 py-1 font-semibold leading-tight rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-900' : 'bg-blue-100 text-blue-900'}`}>
                      {user.role === 'admin' ? <FaUserShield className="mr-1" /> : <FaUser className="mr-1" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                    <div className='flex justify-center items-center space-x-3'>
                    {user.role === 'admin' ? (
                      <button onClick={() => handleRoleChange(user._id, 'user')} title="Quitar rol de Administrador" className="text-yellow-600 hover:text-yellow-800 p-2 rounded-full hover:bg-yellow-100 transition-colors">
                        <FaUserShield className="text-xl" />
                      </button>
                    ) : (
                      <button onClick={() => handleRoleChange(user._id, 'admin')} title="Hacer Administrador" className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 transition-colors">
                        <FaUserShield className="text-xl" />
                      </button>
                    )}
                    <button onClick={() => openDeleteModal(user._id)} title="Eliminar Usuario" className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition-colors">
                      <FaTrashAlt className="text-xl" />
                    </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="text-center py-10">No se encontraron usuarios.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-8">
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="px-6 py-2 bg-gold text-white rounded-lg shadow hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            Anterior
          </button>
          <span className="text-gray-700 font-medium">Página {currentPage} de {totalPages}</span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="px-6 py-2 bg-gold text-white rounded-lg shadow hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            Siguiente
          </button>
        </div>
      )}

      <ConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmDelete} title="Confirmar Eliminación">
        <p>¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.</p>
      </ConfirmModal>
    </div>
  );
};

export default UserListAdmin;
