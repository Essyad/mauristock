import React from "react";
import "../../../styles/Footer.css"; // Custom styles for the footer

const Footer = () => {
  return (
    <footer className="bg-light text-dark py-4">
      <div className="container">
        <div className="row">
          {/* About Section */}
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold mb-3">About Mauristock</h5>
            <p className="text-muted">
              Mauristock is your go-to place for everything from exclusive promotions to top-rated online courses. We aim to make life simpler for you.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#promotions" className="text-dark text-decoration-none">
                  Promotions
                </a>
              </li>
              <li>
                <a href="#courses" className="text-dark text-decoration-none">
                  Online Courses
                </a>
              </li>
              <li>
                <a href="#card" className="text-dark text-decoration-none">
                  Mauristock Card
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold mb-3">Contact Us</h5>
            <p className="text-muted mb-2">
              <i className="bi bi-envelope me-2"></i> support@mauristock.com
            </p>
            <p className="text-muted mb-2">
              <i className="bi bi-phone me-2"></i> +230 123 4567
            </p>
            <div className="mt-3">
              <a href="#facebook" className="text-dark me-3">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#instagram" className="text-dark me-3">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#twitter" className="text-dark">
                <i className="bi bi-twitter"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center mt-4">
          <p className="text-muted small mb-0">
            &copy; {new Date().getFullYear()} Developed by El-Hilal.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

