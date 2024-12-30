import React from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/ProductCard.css';
import { API_URL } from '../../../config/config';

const ProductCard = ({ product }) => {
  // Cloudinary URL kontrolü
  const imageUrl = product.picture?.includes('cloudinary.com') 
    ? product.picture 
    : `${API_URL}${product.picture}` || "https://via.placeholder.com/300";

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      {product.discountedPrice && (
        <span className="discount-badge">
          {Math.round(((product.oldPrice - product.discountedPrice) / product.oldPrice) * 100)}% OFF
        </span>
      )}
      <button className="add-to-cart" onClick={(e) => {
        e.preventDefault();
        // Sepete ekleme fonksiyonu buraya gelecek
      }}>
        +
      </button>
      <div className="product-image">
        <img 
          src={imageUrl}
          alt={product.nom}
        />
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.nom}</h3>
        <div className="product-price">
          {product.discountedPrice ? (
            <>
              <span className="price-value">{product.discountedPrice.toFixed(2)}</span>
              <span className="original-price">{product.oldPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="price-value">{product.oldPrice.toFixed(2)}</span>
          )}
          <span className="price-currency">MRU</span>
        </div>
        <div className="product-description">{product.description}</div>
      </div>
    </Link>
  );
};

export default ProductCard; 