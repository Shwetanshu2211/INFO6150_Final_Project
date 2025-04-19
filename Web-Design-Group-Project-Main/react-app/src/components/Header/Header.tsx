import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faShoppingBag, faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if current page is homepage
  const isHomepage = location.pathname === '/homepage';

  useEffect(() => {
    // Check if user is logged in on component mount
    checkAuthStatus();
    // Get initial cart count
    updateCartCount();
    
    // Add event listener for storage changes (in case cart is updated in another tab)
    window.addEventListener('storage', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || 'User');
      } catch (error) {
        console.error('Error parsing user data', error);
      }
    } else {
      setIsLoggedIn(false);
      setUserName('');
    }
  };
  
  const updateCartCount = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        let count = 0;
        // Sum up quantities of all items
        Object.values(cartData).forEach((quantity: any) => {
          count += Number(quantity);
        });
        setCartItemCount(count);
      } catch (error) {
        console.error('Error parsing cart data', error);
        setCartItemCount(0);
      }
    } else {
      setCartItemCount(0);
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };
  
  const handleCartClick = () => {
    if (isLoggedIn) {
      navigate('/cart');
    } else {
      navigate('/login');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/homepage');
  };
  
  const scrollToSection = (sectionId: string) => {
    if (isHomepage) {
      // If already on homepage, scroll to section
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If not on homepage, navigate to homepage with section hash
      navigate(`/homepage#${sectionId}`);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="left-section">
          {/* Placeholder for store finder */}
        </div>
        <div className="center-section">
          <Link to="/homepage" className="logo-link">
            <h1 className="logo">Fusion Furnish</h1>
          </Link>
        </div>
        <div className="right-section">
          <div className="cart-icon-container" onClick={handleCartClick}>
            <FontAwesomeIcon icon={faShoppingBag} className="cart-icon" />
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </div>
          
          {isLoggedIn ? (
            <div className="profile-container">
              <div className="profile-icon" onClick={handleProfileClick}>
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="profile-dropdown">
                <span className="welcome-text">Welcome, {userName}</span>
                <Link to="/profile" className="dropdown-item">My Profile</Link>
                <Link to="/order-history" className="dropdown-item">Order History</Link>
                <button onClick={handleSignOut} className="dropdown-item sign-out-btn">Sign Out</button>
              </div>
            </div>
          ) : (
            <Button 
              variant="dark" 
              className="sign-in-btn btn-standard-dark"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
      <nav className="nav">
        <div className="menu-icon">
          <FontAwesomeIcon icon={faBars} />
        </div>
        <ul className="nav-links">
          <li><a href="#explore-now" onClick={(e) => {e.preventDefault(); scrollToSection('explore-now');}}>Explore</a></li>
          <li><a href="#offerings" onClick={(e) => {e.preventDefault(); scrollToSection('offerings');}}>Our Offerings</a></li>
          <li><a href="#about-us" onClick={(e) => {e.preventDefault(); scrollToSection('about-us');}}>About Us</a></li>
          <li><a href="#meet-designers" onClick={(e) => {e.preventDefault(); scrollToSection('meet-designers');}}>Designers</a></li>
          <li><a href="#assistance-faq" onClick={(e) => {e.preventDefault(); scrollToSection('assistance-faq');}}>FAQs</a></li>
          <li><a href="#reviews" onClick={(e) => {e.preventDefault(); scrollToSection('reviews');}}>Reviews</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header; 