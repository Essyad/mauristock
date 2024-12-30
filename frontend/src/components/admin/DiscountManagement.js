import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { API_URL } from '../../config/config';

export default function DiscountManagement() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [discountDuration, setDiscountDuration] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      const currentDate = new Date();

      // Filter products and add discount status information
      const availableProducts = response.data.filter((product) => {
        const discountEndDate = product.discountDuration ? new Date(product.discountDuration) : null;
        const isDiscountValid = discountEndDate ? discountEndDate > currentDate : false;
        
        // Add a visual indicator for products with active discounts
        product.hasActiveDiscount = isDiscountValid;
        
        return !isDiscountValid; // Only show products without active discounts
      });

      setProducts(availableProducts);
    } catch (error) {
      console.error('Failed to load products', error);
      setMessage('Erreur lors du chargement des produits');
    }
  };

  const calculateDiscountPrice = (oldPrice) => {
    if (!discountPercentage || isNaN(discountPercentage)) return oldPrice;
    const discount = (oldPrice * parseFloat(discountPercentage)) / 100;
    return (oldPrice - discount).toFixed(2);
  };

  const handleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId) // Deselect if already selected
        : [...prev, productId] // Add if not selected
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (selectedProducts.length === 0) {
      setMessage('Veuillez sélectionner au moins un produit.');
      return;
    }

    if (!discountPercentage || !discountDuration) {
      setMessage('Veuillez remplir tous les champs.');
      return;
    }

    try {
      await Promise.all(
        selectedProducts.map(async (productId) => {
          const product = products.find((p) => p._id === productId);
          const originalPrice = product.oldPrice;
          const discountedPrice = calculateDiscountPrice(originalPrice);
          
          const response = await api.put(`/products/${productId}/discount`, {
            discountedPrice: parseFloat(discountedPrice), // Convert to number
            discountDuration: new Date(discountDuration).toISOString(), // Format date properly
            discountPercentage: parseFloat(discountPercentage) // Add discount percentage
          });

          if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to apply discount');
          }
        })
      );

      setMessage('La remise a été appliquée avec succès pour les produits sélectionnés.');
      setSelectedProducts([]);
      setDiscountPercentage('');
      setDiscountDuration('');
      await fetchProducts(); // Refresh product list
    } catch (error) {
      console.error('Error applying discounts:', error);
      setMessage("Une erreur est survenue lors de l'application de la remise.");
    }
  };

  // Cloudinary URL kontrolü için yardımcı fonksiyon
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300";
    return imagePath.includes('cloudinary.com') ? imagePath : `${API_URL}${imagePath}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Gestion des remises</h2>

      {message && (
        <div
          className={`p-4 rounded ${
            message.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Pourcentage de remise</label>
          <input
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            placeholder="Exemple : 50 pour 50%"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date d'expiration de la remise</label>
          <input
            type="date"
            value={discountDuration}
            onChange={(e) => setDiscountDuration(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductSelection(product._id)}
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedProducts.includes(product._id)
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300'
              }`}
            >
              <img
                src={getImageUrl(product.picture)}
                alt={product.nom}
                className="h-20 w-20 object-cover rounded mb-2"
              />
              <h3 className="text-lg font-bold">{product.nom}</h3>
              <p className="text-gray-600">Prix original : {product.oldPrice} €</p>
              <p className="text-gray-800">
                Prix avec remise :{' '}
                <span className="text-green-600 font-bold">
                  {calculateDiscountPrice(product.oldPrice)} €
                </span>
              </p>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Appliquer la remise
        </button>
      </form>
    </div>
  );
}
