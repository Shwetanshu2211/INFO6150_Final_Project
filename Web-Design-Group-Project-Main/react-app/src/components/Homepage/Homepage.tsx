import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faSearch, faShoppingBag, faBars } from '@fortawesome/free-solid-svg-icons';
import './Homepage.css';

const Homepage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleMenu = () => {
    const navLinks = document.querySelector(".nav-links");
    navLinks?.classList.toggle("active");
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="left-section">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <a href="ComingSoonPage.html" className="store-link">Find a store.</a>
          </div>
          <div className="center-section">
            <h1 className="logo">Fusion Furnish</h1>
          </div>
          <div className="right-section">
            <input
              type="text"
              placeholder="What can we help you find?"
              className="search-bar"
            />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <FontAwesomeIcon icon={faShoppingBag} className="cart-icon" />
            <button className="btn btn-dark sign-in-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </div>
        <nav className="nav">
          <div className="menu-icon" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faBars} />
          </div>
          <ul className="nav-links">
            <li><a href="#explore-now">Explore</a></li>
            <li><a href="#offerings">Our Offerings</a></li>
            <li><a href="#about-us">About Us</a></li>
            <li><a href="#meet-designers">Designers</a></li>
            <li><a href="#assistance-faq">FAQs</a></li>
            <li><a href="#Reviews">Reviews</a></li>
            <li><a href="order-history.html">Order History</a></li>
          </ul>
        </nav>
      </header>

      <section id="explore-now" className="section py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-fluid p-0">
          <h2 className="text-center mb-4" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.5rem',
            fontWeight: 600,
            color: '#000000',
            letterSpacing: '1px'
          }}>
            Explore Now
          </h2>
          
          <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel" style={{ height: '100vh', width: '100vw' }}>
            <div className="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            
            <div className="carousel-inner h-100">
              <div className="carousel-item active h-100">
                <img src="/images/furniture1.jpg" className="d-block w-100 h-100" alt="Furniture 1" style={{ objectFit: 'cover' }} />
                <div className="carousel-caption text-left" style={{
                  top: '20%',
                  left: '10%',
                  maxWidth: '500px',
                  fontFamily: "'Playfair Display', serif",
                  color: '#f4f4f4'
                }}>
                  <h3 style={{
                    fontSize: '2.5rem',
                    fontWeight: 600,
                    letterSpacing: '1px',
                    marginBottom: '1rem'
                  }}>
                    Hello, Neighbor!
                  </h3>
                  <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: '#e0e0e0' }}>
                    Discover furniture that feels like home. Let us bring your vision to life—book a private appointment and experience design tailored just for you.
                  </p>
                </div>
              </div>

              <div className="carousel-item h-100">
                <img src="/images/furniture4.jpg" className="d-block w-100 h-100" alt="Furniture 2" style={{ objectFit: 'cover' }} />
                <div className="carousel-caption text-left" style={{
                  top: '20%',
                  left: '10%',
                  maxWidth: '500px',
                  fontFamily: "'Playfair Display', serif",
                  color: '#f4f4f4'
                }}>
                  <h3 style={{
                    fontSize: '2.5rem',
                    fontWeight: 600,
                    letterSpacing: '1px',
                    marginBottom: '1rem'
                  }}>
                    Up Close & Personal.
                  </h3>
                  <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: '#e0e0e0' }}>
                    Your space deserves a personal touch. Schedule a private consultation and let's create something extraordinary together.
                  </p>
                </div>
              </div>

              <div className="carousel-item h-100">
                <img src="/images/furniture6.jpg" className="d-block w-100 h-100" alt="Furniture 3" style={{ objectFit: 'cover' }} />
                <div className="carousel-caption text-left" style={{
                  top: '20%',
                  left: '10%',
                  maxWidth: '500px',
                  fontFamily: "'Playfair Display', serif",
                  color: '#f4f4f4'
                }}>
                  <h3 style={{
                    fontSize: '2.5rem',
                    fontWeight: 600,
                    letterSpacing: '1px',
                    marginBottom: '1rem'
                  }}>
                    Design Made for You.
                  </h3>
                  <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: '#e0e0e0' }}>
                    From concept to creation, we're here to make your dream space a reality. Book a one-on-one appointment and let's get started!
                  </p>
                </div>
              </div>
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>

          <p className="mt-4" style={{
            fontFamily: "'Lora', serif",
            fontSize: '1.2rem',
            color: '#4a4a4a',
            lineHeight: 1.8,
            maxWidth: '800px',
            paddingLeft: '20px'
          }}>
            Discover our latest furniture collections and find the perfect pieces for your home.
          </p>
        </div>
      </section>
    </>
  );
};

export default Homepage; 