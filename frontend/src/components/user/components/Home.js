import React from 'react';
import { Helmet } from 'react-helmet';
import FeaturedProducts from './FeaturedProducts';
import CategoryShowcase from './CategoryShowcase';
import PromotionalBanner from './PromotionalBanner';

const Home = () => (
  <div className="home-container">
    <Helmet>
      <title>mauristock</title>
      <meta name="description" content="Welcome to the homepage of mauristock." />
      <meta name="keywords" content="homepage, stock, product, online shopping" />
      <meta property="og:title" content="mauristock" />
      <meta property="og:description" content="Welcome to the homepage of mauristock." />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      {/* Add the missing meta tags here */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://mauristock.com" />
      <meta property="og:image" content="/og-image.jpg" />
      <meta property="og:site_name" content="mauristock" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="mauristock" />
      <meta name="twitter:description" content="Welcome to the homepage of mauristock." />
      <meta name="twitter:image" content="/og-image.jpg" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href="https://mauristock.com" />
    </Helmet>

    {/* Homepage Content */}
    <PromotionalBanner />
    
    <section className="featured-categories">
      <h2>Browse Categories</h2>
      <CategoryShowcase />
    </section>

    <section className="featured-products">
      <h2>Featured Products</h2>
      <FeaturedProducts />
    </section>

    <section className="special-offers">
      <h2>Special Offers</h2>
      {/* Add special offers component */}
    </section>

    {/* Add more sections as needed */}
  </div>
);

export default Home;