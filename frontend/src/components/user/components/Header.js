import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IoBagHandleOutline } from "react-icons/io5";
import logo from 'logo.png';  // Use the logo you provided
import "../../../styles/Header.css"; // Custom styles for the header
import { API_URL } from '../../../config/config';

const Header = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");  // State for the search query
  const [searchResults, setSearchResults] = useState([]);  // State for search results
  const navigate = useNavigate();

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search bar visibility
  const handleSearchClick = () => {
    setIsSearching(true);
  };

  const handleCloseSearch = () => {
    setIsSearching(false);
    setSearchQuery("");  // Clear search query when closing the search bar
  };

  // Fetch search results from the backend
  useEffect(() => {
    if (searchQuery.length >= 3) {  // Trigger search only if query is long enough
      const fetchSearchResults = async () => {
        try {
          const response = await fetch(`${API_URL}/api/categories?search=${searchQuery}`);
          const data = await response.json();
          setSearchResults(data);  // Update search results state
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };

      fetchSearchResults();
    } else {
      setSearchResults([]);  // Clear results if the search query is too short
    }
  }, [searchQuery]);

  // Handle search submit
  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`); // Redirect to search results page
    }
  };

  return (
    <header className="bg-white shadow-sm py-2">
      <div className="container d-flex align-items-center justify-content-between">
        {/* Logo Section */}
        <div className="d-flex align-items-center">
          <Link to="/">
            <img
              src={logo}
              alt="Home Icon"
              className="me-2"
              style={{ width: "100px" }}
            />
          </Link>
        </div>

        {/* Search Bar */}
        {isSearching ? (
          <div className="search-bar w-75 d-flex align-items-center">
            <div className="input-group w-75">
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Rechercher un produit"
                autoFocus
                value={searchQuery}
                onChange={handleSearchChange}  // Track input value
                onKeyDown={handleSearchSubmit} // Handle "Enter" key submit
                aria-label="Search products"
              />
              <span className="input-group-text bg-light border-0">
                <i className="bi bi-search text-danger"></i>
              </span>
            </div>
            <button
              className="btn btn-link text-dark ms-2"
              onClick={handleCloseSearch}
              aria-label="Close search bar"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        ) : (
          <div className="search-bar w-50">
            <div className="input-group">
              <span
                className="input-group-text bg-light border-0"
                onClick={handleSearchClick}
              >
                <i className="bi bi-search text-danger"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Rechercher un produit"
                onClick={handleSearchClick}
                value={searchQuery}
                onChange={handleSearchChange} // Track input value
                aria-label="Search products"
              />
            </div>
          </div>
        )}

        {/* Navigation Links (Desktop) */}
        {!isSearching && (
          <nav className="d-flex align-items-center d-none d-md-flex">
            <a
              href="/promotions"
              className="text-secondary me-3 text-decoration-none"
            >
              <i className="bi bi-percent me-1"></i> Promotions
            </a>
            <a
              href="#card"
              className="text-secondary me-3 text-decoration-none d-flex align-items-center"
            >
              <IoBagHandleOutline className="me-1" /> Carte Mauristock
            </a>
          </nav>
        )}
      </div>

      {/* Search Results (Only visible when searching) */}
      {isSearching && searchResults.length > 0 && (
        <div className="search-results">
          <ul>
            {searchResults.map((result) => (
              <li key={result._id}>
                <a href={`/categories/${result._id}`}>{result.nom}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottom Navigation for Small Screens */}
      <nav className="top-nav d-flex justify-content-around d-md-none py-2 bg-light border-top mt-3">
        <a href="/home" className="text-primary text-decoration-none">
          <i className="bi bi-house-door"></i>
          <span>Accueil</span>
        </a>

        <a href="/promotions" className="text-secondary text-decoration-none">
          <i className="bi bi-percent"></i>
          <span>Promotions</span>
        </a>
        <a href="#card" className="text-secondary text-decoration-none">
          <i className="bi bi-card-text"></i>
          <span>Carte Mauristock</span>
        </a>
      </nav>
    </header>
  );
};

export default Header;