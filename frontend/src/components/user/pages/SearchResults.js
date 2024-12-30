import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchProductList from '../components/SearchProductList';
import FilterSidebar from '../components/FilterSidebar';
import '../../../styles/SearchResults.css';
import { API_URL } from '../../../config/config';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtreler için state
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [companies, setCompanies] = useState([]);

  // Cloudinary URL kontrolü için yardımcı fonksiyon
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300";
    return imagePath.includes('cloudinary.com') ? imagePath : `${API_URL}${imagePath}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/api/products/search?q=${query}`
        );

        if (!response.ok) {
          throw new Error('Une erreur est survenue lors de la recherche');
        }

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message);
        }

        setProducts(data.data);
        setFilteredProducts(data.data);

        // Benzersiz kategoriler
        const uniqueCategories = [
          ...new Map(
            data.data
              .map((p) => p.categoriesa_id || []) // Kategorileri al
              .flat()
              .map((cat) => [cat._id, cat])
          ).values(),
        ].map((cat) => ({
          _id: cat._id,
          nom: cat.name || 'Unnamed Category',
        }));

        // Benzersiz alt kategoriler
        const uniqueSubcategories = [
          ...new Map(
            data.data
              .map((p) => p.subcategories_id || []) // Alt kategorileri al
              .flat()
              .map((sub) => [sub._id, sub])
          ).values(),
        ].map((sub) => ({
          _id: sub._id,
          nom: sub.name || 'Unnamed Subcategory',
        }));

        // Benzersiz şirketler
        const uniqueCompanies = [
          ...new Map(
            data.data
              .map((p) => p.Company_id || null)
              .filter(Boolean) // Şirketleri filtrele
              .map((comp) => [comp._id, comp])
          ).values(),
        ].map((comp) => ({
          _id: comp._id,
          nom: comp.nom || 'Unnamed Company',
        }));

        setCategories(uniqueCategories);
        setSubcategories(uniqueSubcategories);
        setCompanies(uniqueCompanies);
      } catch (error) {
        console.error('Search error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  const filterProducts = (filters) => {
    let filtered = [...products];

    if (filters.categories?.length > 0) {
      filtered = filtered.filter((product) => {
        const productCategories =
          product.categoriesa_id?.map((cat) => cat._id) || [];
        return filters.categories.some((catId) =>
          productCategories.includes(catId)
        );
      });
    }

    if (filters.subcategories?.length > 0) {
      filtered = filtered.filter((product) => {
        const productSubcategories =
          product.subcategories_id?.map((sub) => sub._id) || [];
        return filters.subcategories.some((subId) =>
          productSubcategories.includes(subId)
        );
      });
    }

    if (filters.companies?.length > 0) {
      filtered = filtered.filter((product) =>
        filters.companies.includes(product.Company_id?._id)
      );
    }

    // Fiyat filtresi
    if (filters.minPrice || filters.maxPrice) {
      filtered = filtered.filter((product) => {
        const price = product.discountedPrice || product.oldPrice;
        const min = filters.minPrice ? Number(filters.minPrice) : 0;
        const max = filters.maxPrice ? Number(filters.maxPrice) : Infinity;
        return price >= min && price <= max;
      });
    }

    // İndirim filtresi
    if (filters.hasDiscount) {
      filtered = filtered.filter((product) => 
        product.discountedPrice && 
        product.discountedPrice > 0 && 
        product.discountedPrice < product.oldPrice
      );
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (newFilters) => {
    filterProducts(newFilters);
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
          <h4 className="alert-heading">Erreur de recherche</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="search-header mb-4">
        <h2>Résultats pour "{query}"</h2>
        <p className="text-muted">
          {filteredProducts.length} produit(s) trouvé(s)
        </p>
      </div>

      <div className="search-content">
        <aside className="filter-sidebar">
          <FilterSidebar
            categories={categories}
            subcategories={subcategories}
            companies={companies}
            onFilterChange={handleFilterChange}
          />
        </aside>

        <main className="products-area">
          {filteredProducts.length > 0 ? (
            <SearchProductList 
              products={filteredProducts}
              categories={categories}
              subcategories={subcategories}
              companies={companies}
              onFilterChange={handleFilterChange}
            />
          ) : (
            <div className="text-center">
              <p className="mb-3">Aucun produit ne correspond à vos critères.</p>
              <p className="text-muted">Essayez de modifier vos filtres.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchResults;
