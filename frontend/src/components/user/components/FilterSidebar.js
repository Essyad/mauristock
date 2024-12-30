import React, { useState } from "react";
import "../../../styles/FilterSidebar.css";

const FilterSidebar = ({
  categories = [],
  subcategories = [],
  companies = [],
  onFilterChange,
  closeSidebar, 
}) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [hasDiscount, setHasDiscount] = useState(false);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategories((prevSelected) =>
      prevSelected.includes(subcategoryId)
        ? prevSelected.filter((id) => id !== subcategoryId)
        : [...prevSelected, subcategoryId]
    );
  };

  const handleCompanyChange = (companyId) => {
    setSelectedCompanies((prevSelected) =>
      prevSelected.includes(companyId)
        ? prevSelected.filter((id) => id !== companyId)
        : [...prevSelected, companyId]
    );
  };

  const handlePriceChange = (type, value) => {
    if (value === "" || /^\d*$/.test(value)) {
      setPriceRange((prev) => ({
        ...prev,
        [type]: value,
      }));
    }
  };

  const applyFilter = () => {
    const filters = {
      categories: selectedCategories,
      subcategories: selectedSubcategories,
      companies: selectedCompanies,
      minPrice: priceRange.min ? parseInt(priceRange.min, 10) : undefined,
      maxPrice: priceRange.max ? parseInt(priceRange.max, 10) : undefined,
      hasDiscount,
    };
    onFilterChange(filters);
    if (closeSidebar) {
      closeSidebar(); // Close the sidebar
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSelectedCompanies([]);
    setPriceRange({ min: "", max: "" });
    setHasDiscount(false);
    onFilterChange({});
    if (closeSidebar) {
      closeSidebar(); // Close the sidebar
    }
  };

  return (
    <div className="filter-content p-3 border rounded bg-light">
      <h5 className="text-center mb-4">Filtres</h5>

      <div className="category-filter mb-4">
        <h6 className="text-primary">Catégories ({categories.length})</h6>
        <ul className="list-group">
          {categories.map((cat) => (
            <li key={cat._id} className="list-group-item">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`cat-${cat._id}`}
                  checked={selectedCategories.includes(cat._id)}
                  onChange={() => handleCategoryChange(cat._id)}
                />
                <label className="form-check-label" htmlFor={`cat-${cat._id}`}>
                  {cat.nom || cat.name}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="subcategory-filter mb-4">
        <h6 className="text-primary">Sous-catégories ({subcategories.length})</h6>
        <ul className="list-group">
          {subcategories.map((sub) => (
            <li key={sub._id} className="list-group-item">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`sub-${sub._id}`}
                  checked={selectedSubcategories.includes(sub._id)}
                  onChange={() => handleSubcategoryChange(sub._id)}
                />
                <label className="form-check-label" htmlFor={`sub-${sub._id}`}>
                  {sub.nom || sub.name}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="company-filter mb-4">
        <h6 className="text-primary">Entreprises ({companies.length})</h6>
        <ul className="list-group">
          {companies.map((comp) => (
            <li key={comp._id} className="list-group-item">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`comp-${comp._id}`}
                  checked={selectedCompanies.includes(comp._id)}
                  onChange={() => handleCompanyChange(comp._id)}
                />
                <label className="form-check-label" htmlFor={`comp-${comp._id}`}>
                  {comp.nom || comp.name}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="price-filter mb-4">
        <h6 className="text-primary">Prix (MRU)</h6>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Min (MRU)"
            value={priceRange.min}
            onChange={(e) => handlePriceChange("min", e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Max (MRU)"
            value={priceRange.max}
            onChange={(e) => handlePriceChange("max", e.target.value)}
          />
        </div>
      </div>

      <div className="discount-filter mb-4">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="discount-check"
            checked={hasDiscount}
            onChange={(e) => setHasDiscount(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="discount-check">
            Seulement avec des réductions
          </label>
        </div>
      </div>

      <div className="filter-actions mt-4 d-flex justify-content-between">
        <button
          className="btn btn-outline-secondary"
          onClick={clearFilters}
        >
          Tout effacer
        </button>
        <button className="btn btn-primary" onClick={applyFilter} >
          Appliquer
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
