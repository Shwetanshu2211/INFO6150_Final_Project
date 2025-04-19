import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import Header from '../Header/Header';
import './CollectionView.css';

const CollectionView: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [activeCategory, setActiveCategory] = useState<string>(type || 'all');
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Load cart data from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // This would normally fetch products from an API based on the collection type
  const getCollectionTitle = () => {
    switch (type) {
      case 'sofa':
        return 'Sofa Collection';
      case 'dining':
        return 'Dining Table Collection';
      case 'tv-cabinets':
        return 'TV Cabinet Collection';
      case 'wardrobe':
        return 'Wardrobe Collection';
      case 'tables':
        return 'Tables & More Collection';
      default:
        return 'Product Collection';
    }
  };

  // Available product categories
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'sofa', name: 'Sofas' },
    { id: 'dining', name: 'Dining Tables' },
    { id: 'tv-cabinets', name: 'TV Cabinets' },
    { id: 'wardrobe', name: 'Wardrobes' },
    { id: 'tables', name: 'Tables & More' }
  ];

  // Handler for category change
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    // Scroll to top when category changes
    window.scrollTo(0, 0);
    // In a real application, you would fetch products based on the selected category
  };

  // Navigate to customization page
  const navigateToCustomization = () => {
    window.location.href = '/customize';
  };

  // Add product to cart
  const addToCart = (productId: number) => {
    setCartItems(prevItems => {
      const updatedCart = { ...prevItems };
      updatedCart[productId] = (updatedCart[productId] || 0) + 1;
      return updatedCart;
    });
  };

  // Remove product from cart
  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => {
      const updatedCart = { ...prevItems };
      if (updatedCart[productId] && updatedCart[productId] > 0) {
        updatedCart[productId] -= 1;
        if (updatedCart[productId] === 0) {
          delete updatedCart[productId];
        }
      }
      return updatedCart;
    });
  };

  // Get quantity of product in cart
  const getQuantity = (productId: number): number => {
    return cartItems[productId] || 0;
  };

  return (
    <div className="collection-view">
      <Header />
      <Container className="mt-5 pt-5">
        <p className="text-center lead mb-4">
          Browse our exclusive selection of high-quality furniture designed for comfort and style.
        </p>
        
        {/* Category Filter Navigation */}
        <div className="category-filter mb-5">
          <h4 className="text-center mb-3">Filter by Category</h4>
          <Nav className="category-nav justify-content-center" variant="pills">
            {categories.map(category => (
              <Nav.Item key={category.id}>
                <Nav.Link 
                  className={activeCategory === category.id ? 'active' : ''} 
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.name}
                </Nav.Link>
              </Nav.Item>
            ))}
            <Nav.Item>
              <Nav.Link 
                className="customization-link" 
                onClick={navigateToCustomization}
              >
                <i className="fas fa-magic mr-1"></i> Customization
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
        
        <Row className="g-4">
          {/* This is just placeholder content - in a real app, you'd map over product data filtered by category */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Col md={4} key={item}>
              <Card className="product-card h-100">
                <Link to={`/product/${item}`} className="product-link">
                  <Card.Img variant="top" src={`/images/product-placeholder-${item % 3 + 1}.jpg`} />
                </Link>
                <Card.Body>
                  <Link to={`/product/${item}`} className="product-title-link">
                    <Card.Title>Product {item}</Card.Title>
                  </Link>
                  <Card.Text>
                    High-quality furniture piece with premium materials and elegant design.
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="price">$599.99</span>
                    <div className="cart-action">
                      {getQuantity(item) > 0 ? (
                        <div className="quantity-control">
                          <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            className="quantity-btn minus-btn"
                            onClick={() => removeFromCart(item)}
                          >
                            –
                          </Button>
                          <span className="quantity-display">{getQuantity(item)}</span>
                          <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            className="quantity-btn plus-btn"
                            onClick={() => addToCart(item)}
                          >
                            +
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="dark" 
                          onClick={() => addToCart(item)}
                        >
                          Add to Cart
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default CollectionView; 