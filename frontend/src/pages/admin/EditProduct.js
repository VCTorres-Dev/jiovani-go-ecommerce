import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ProductForm';
import { getProductById, updateProduct } from '../../services/productService';
import { toast } from 'react-toastify';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const product = await getProductById(id);
        setInitialData(product);
      } catch (err) {
        toast.error('No se pudo cargar el producto para editar.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await updateProduct(id, formData);
      toast.success('¡Producto actualizado con éxito!');
      navigate('/admin/products');
    } catch (err) {
      toast.error('Error al actualizar el producto. Por favor, revisa los datos e inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!initialData && isLoading) return <div>Cargando datos del producto...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Editar Producto</h1>
      {initialData && <ProductForm onSubmit={handleSubmit} initialData={initialData} isLoading={isLoading} />}
    </div>
  );
};

export default EditProduct;
