import React, { useState, useEffect } from "react";
import ProductCard from './ProductCard';
import '../../../styles/ProductGrid.css';
import { API_URL } from '../../../config/config';

const ProductList = ({ categoryId, filters }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append('categoryId', categoryId);

        // Şirket filtresi
        if (filters.companies?.length) {
          queryParams.append('companies', filters.companies.join(','));
        }

        // Alt kategori filtresi
        if (filters.subcategories?.length) {
          queryParams.append('subcategories', filters.subcategories.join(','));
        }

        // Fiyat filtresi
        if (filters.minPrice && !isNaN(filters.minPrice)) {
          queryParams.append('minPrice', filters.minPrice.toString());
        }
        if (filters.maxPrice && !isNaN(filters.maxPrice)) {
          queryParams.append('maxPrice', filters.maxPrice.toString());
        }

        // Diğer filtreler
        if (filters.features?.length) {
          queryParams.append('features', filters.features.join(','));
        }
        if (filters.hasDiscount) {
          queryParams.append('hasDiscount', 'true');
        }

        const url = `${API_URL}/api/products?${queryParams}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, filters]);

  if (loading) {
    return (
      <div className="text-center mt-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center mt-4">
        <p>Aucun produit disponible.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product._id} className="product-grid-item">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductList;