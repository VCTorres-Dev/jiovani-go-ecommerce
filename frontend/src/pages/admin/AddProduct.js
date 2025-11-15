import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ProductForm';
import { createProduct } from '../../services/productService';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Define a stable object for the initial form data
  const initialFormData = {
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    gender: 'dama',
    stock: '',
    isFeatured: false,
  };

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await createProduct(formData);
      toast.success('¡Producto creado con éxito!');
      navigate('/admin/products');
    } catch (err) {
      toast.error('Error al crear el producto. Por favor, revisa los datos e inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Añadir Nuevo Producto</h1>
      <ProductForm onSubmit={handleSubmit} initialData={initialFormData} isLoading={isLoading} />
    </div>
  );
};

export default AddProduct;
