import React, { useState, useEffect } from 'react';

const ProductForm = ({ onSubmit, initialData, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
        imageURL: '',
        gender: 'dama',
    stock: '',
    isFeatured: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        price: initialData.price || '',
        description: initialData.description || '',
                imageURL: initialData.imageURL || '',
                gender: initialData.gender || 'dama',
        stock: initialData.stock || '',
        isFeatured: initialData.isFeatured || false,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
          <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
          <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="4" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"></textarea>
      </div>

            <div>
        <label htmlFor="imageURL" className="block text-sm font-medium text-gray-700">URL de la Imagen (Opcional)</label>
        <input type="text" name="imageURL" id="imageURL" value={formData.imageURL} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Género</label>
        <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
          <option value="dama">Dama</option>
          <option value="varon">Varón</option>
          
        </select>
      </div>

      <div className="flex items-center">
        <input type="checkbox" name="isFeatured" id="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
        <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">¿Es un producto destacado?</label>
      </div>

      <div>
        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
          {isLoading ? 'Guardando...' : 'Guardar Producto'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
