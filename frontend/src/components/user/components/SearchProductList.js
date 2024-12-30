import React, { useState } from 'react';
import ProductCard from './ProductCard';
import FilterSidebar from './FilterSidebar';
import { FaFilter } from 'react-icons/fa';
import '../../../styles/ProductGrid.css';

const SearchProductList = ({ 
  products, 
  categories,
  subcategories,
  companies,
  onFilterChange
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="search-results-container">
      {/* Mobile Filter Toggle Button */}
      <button 
        className="mobile-filter-toggle d-md-none" 
        onClick={toggleSidebar}
      >
        <FaFilter />
      </button>

      {/* Mobile Sidebar - Only for mobile */}
      <aside className={`mobile-sidebar d-md-none ${isSidebarOpen ? 'show' : ''}`}>
        <button 
          className="close-sidebar"
          onClick={toggleSidebar}
        >
          ×
        </button>
        <FilterSidebar
          categories={categories}
          subcategories={subcategories}
          companies={companies}
          onFilterChange={onFilterChange}
        />
      </aside>

      {/* Overlay for mobile */}
      <div 
        className={`sidebar-overlay d-md-none ${isSidebarOpen ? 'show' : ''}`}
        onClick={toggleSidebar}
      />

      {/* Products Grid */}
      <div className="product-grid">
        {products.map(product => (
          <div key={product._id} className="product-grid-item">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchProductList;
