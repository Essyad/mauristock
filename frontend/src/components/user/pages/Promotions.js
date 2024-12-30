import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../../../styles/ProductGrid.css';
import { API_URL } from '../../../config/config';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/promotions`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch promotions: ${response.statusText}`);
        }
        
        const data = await response.json();
        setPromotions(data);
      } catch (error) {
        console.error('Error fetching promotions:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // Cloudinary URL kontrolü için yardımcı fonksiyon
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300";
    return imagePath.includes('cloudinary.com') ? imagePath : `${API_URL}${imagePath}`;
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info" role="alert">
          Aucune promotion disponible pour le moment.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Promotions</h1>
      <div className="product-grid">
        {promotions.map(product => (
          <div key={product._id} className="product-grid-item">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Promotions;
