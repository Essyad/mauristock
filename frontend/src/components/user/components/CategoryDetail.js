import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import FilterSidebar from "./FilterSidebar";
import ProductList from "./ProductList";
import "../../../styles/CategoryDetail.css";
import { FaFilter } from "react-icons/fa";
import { API_URL } from '../../../config/config';

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: "",
    subcategories: [],
    companies: [],
    minPrice: "",
    maxPrice: "",
    hasDiscount: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch categories and category details
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/categories`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchCategoryDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/categories/${categoryId}`);
        if (!response.ok) throw new Error("Failed to fetch category details");
        const data = await response.json();

        setCategory(data);
        
        // Boş filtrelerle ürünleri getir
        fetchProducts({});
      } catch (err) {
        console.error("Error fetching category details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchCategoryDetails();
  }, [categoryId]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters({
      ...filters,
      ...newFilters,
      minPrice: newFilters.minPrice || "",
      maxPrice: newFilters.maxPrice || "",
      hasDiscount: newFilters.hasDiscount || false
    });
  };

  const renderCategoryName = (category) => {
    if (!category || typeof category.name !== 'string') {
      return "Kategori";
    }
    return category.name.split(" ").map((word, index) => (
      <span key={index} className="category-name-line">
        {word}
      </span>
    ));
  };

  const fetchProducts = async (filters = {}) => {
    try {

      const queryParams = new URLSearchParams();
      queryParams.append('categoryId', categoryId);

      // Şirket filtresi
      if (filters.companies?.length) {
        queryParams.append('companies', filters.companies.join(','));
      }

      // Fiyat filtresi
      if (typeof filters.minPrice === 'number') {
        queryParams.append('minPrice', filters.minPrice.toString());
      }
      if (typeof filters.maxPrice === 'number') {
        queryParams.append('maxPrice', filters.maxPrice.toString());
      }

      // Diğer filtreler...
      if (filters.subcategories?.length) {
        queryParams.append('subcategories', filters.subcategories.join(','));
      }
      if (filters.features?.length) {
        queryParams.append('features', filters.features.join(','));
      }
      if (filters.hasDiscount) {
        queryParams.append('hasDiscount', 'true');
      }

      const url = `${API_URL}/api/products?${queryParams}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Cloudinary URL kontrolü için yardımcı fonksiyon
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/50";
    return imagePath.includes('cloudinary.com') ? imagePath : `${API_URL}${imagePath}`;
  };

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div className="category-detail-container">
      {/* Mobile Filter Toggle Button */}
      <button 
        className="mobile-filter-toggle d-md-none" 
        onClick={toggleSidebar}
      >
        <FaFilter />
      </button>

      {/* Categories Overview */}
      <div className="categories-overview">
        {Array.isArray(categories) && categories.map((cat) => (
          <Link
            to={`/categories/${cat._id}`}
            key={cat._id || 'default-key'}
            className={`category-thumbnail ${cat._id === categoryId ? "active" : ""}`}
          >
            <img
              src={getImageUrl(cat.logo)}
              alt={typeof cat.nom === 'string' ? cat.nom : "Kategori"}
              className="category-image"
            />
            <span className="category-name">
              {renderCategoryName(cat)}
            </span>
          </Link>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="category-main">
        {/* Mobile Sidebar Container */}
        <aside className={`mobile-sidebar ${isSidebarOpen ? 'show' : ''} d-md-none`}>
          
          <FilterSidebar
            subcategories={category?.subcategories_id || []}
            companies={category?.companies_id || []}
            onFilterChange={handleFilterChange}
            closeSidebar={toggleSidebar}
          />
        </aside>

        {/* Desktop Sidebar */}
        <aside className="desktop-sidebar d-none d-md-block">
          <FilterSidebar
            subcategories={category?.subcategories_id || []}
            companies={category?.companies_id || []}
            onFilterChange={handleFilterChange}
            
          />
        </aside>

        {/* Overlay for mobile */}
        <div 
          className={`sidebar-overlay d-md-none ${isSidebarOpen ? 'show' : ''}`}
          onClick={toggleSidebar}
        />

        {/* Products */}
        <main className="products-area">
          {category && (
            <>
              <h2 className="category-title">
                {typeof category.nom === 'string' && 
                  category.nom.split(" ").map((word, index) => (
                    <span key={index} className="category-title-line">
                      {word}
                    </span>
                  ))
                }
              </h2>
              <p>{typeof category?.description === 'string' ? category.description : ""}</p>
            </>
          )}
          <ProductList categoryId={categoryId} filters={filters} />
        </main>
      </div>
    </div>
  );
};

export default CategoryDetail;
