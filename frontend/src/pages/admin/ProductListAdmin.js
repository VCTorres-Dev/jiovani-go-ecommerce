import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services/productService';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/ConfirmModal';
import { FaSearch, FaPlus } from 'react-icons/fa';
import useDebounce from '../../hooks/useDebounce'; // Hook personalizado para debounce

const ProductListAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms de retardo

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 10, search: debouncedSearchTerm };
      const data = await getProducts(params);
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error('No se pudieron cargar los productos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openDeleteModal = (productId) => {
    setProductToDelete(productId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete);
      toast.success('¡Producto eliminado con éxito!');
      fetchProducts(); // Recargar productos
    } catch (err) {
      toast.error('Error al eliminar el producto.');
      console.error(err);
    } finally {
      setIsModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h1 className="text-3xl font-bold text-gray-800">Gestionar Productos</h1>
        <Link to="/admin/products/add" className="bg-gold text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition-colors flex items-center">
          <FaPlus className="mr-2" /> Añadir Producto
        </Link>
      </div>

      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 focus:border-gold focus:outline-none transition-colors"
        />
        <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
      </div>

      <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Producto</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Precio</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center py-10">Cargando...</td></tr>
            ) : products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-12 h-12">
                        <img
  className="w-full h-full rounded-full object-cover"
  src={product.imageURL || product.imageUrl || '/images/default-product.png'}
  alt={product.name}
/>
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-900 font-semibold whitespace-no-wrap">{product.name}</p>
                        <p className="text-gray-500 text-xs whitespace-no-wrap">{product.gender === 'dama' ? 'Dama' : 'Varón'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">${product.price.toFixed(2)}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>
                      {product.stock} unidades
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                    <Link to={`/admin/products/edit/${product._id}`} className="text-indigo-600 hover:text-indigo-800 font-semibold">Editar</Link>
                    <button onClick={() => openDeleteModal(product._id)} className="text-red-600 hover:text-red-800 font-semibold ml-4">Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="text-center py-10">No se encontraron productos.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Anterior</button>
          <span className="text-gray-700">Página {currentPage} de {totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Siguiente</button>
        </div>
      )}

      <ConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmDelete} title="Confirmar Eliminación">
        <p>¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.</p>
      </ConfirmModal>
    </div>
  );
};

export default ProductListAdmin;
