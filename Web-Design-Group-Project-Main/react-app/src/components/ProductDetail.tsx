import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, ListGroup, Badge } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from './Header/Header';
import './ProductDetail.css';

type ProductDetailParams = {
  id: string;
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<ProductDetailParams>();
  const productId = id || '1'; // Default to '1' if id is undefined
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const navigate = useNavigate();

  const goBack = () => {
    window.history.back();
  };

  // In a real app, you would fetch product data from an API based on the ID
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Dummy data for example
      setProduct({
        id: productId,
        name: "Premium Leather Sofa",
        price: 1299.99,
        description: "Luxurious leather sofa with high-quality craftsmanship. This comfortable and elegant piece will be the centerpiece of your living room.",
        material: "Genuine leather",
        color: "Brown",
        dimensions: {
          width: 220,
          height: 85,
          depth: 90,
          unit: "cm"
        },
        image: "/images/product-placeholder-1.jpg"
      });
      setLoading(false);
    }, 800);
  }, [productId]);

  const addToCart = () => {
    setQuantity(prev => prev + 1);
    
    // In a real app, you would save this to cart state or localStorage
    const savedCart = localStorage.getItem('cart');
    let cartItems = savedCart ? JSON.parse(savedCart) : {};
    
    cartItems[productId] = (cartItems[productId] || 0) + 1;
    localStorage.setItem('cart', JSON.stringify(cartItems));
  };

  const removeFromCart = () => {
    if (quantity > 0) {
      setQuantity(prev => prev - 1);
      
      // Update localStorage
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        let cartItems = JSON.parse(savedCart);
        if (cartItems[productId] && cartItems[productId] > 0) {
          cartItems[productId] -= 1;
          if (cartItems[productId] === 0) {
            delete cartItems[productId];
          }
          localStorage.setItem('cart', JSON.stringify(cartItems));
        }
      }
    }
  };

  const proceedToCheckout = () => {
    // Navigate to the cart page
    navigate('/cart');
  };

  // Load cart data from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      if (cartItems[productId]) {
        setQuantity(cartItems[productId]);
      }
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="product-detail-page">
        <Header />
        <Container className="mt-5 pt-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </Container>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <Header />
        <Container className="mt-5 pt-5">
          <div className="alert alert-danger">
            Product not found. <Link to="/collection/all">Return to collection</Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Header />
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button 
            variant="outline-secondary" 
            className="back-button"
            onClick={goBack}
          >
            <i className="fas fa-arrow-left me-2"></i>Back to Previous Page
          </Button>
          <div style={{ width: '170px' }}></div> {/* Empty div for balance */}
        </div>
        
        <Row>
          {/* Product Image */}
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="product-image-container">
              <img 
                src={product.image} 
                alt={product.name}
                className="product-main-image"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = '/images/product-placeholder-1.jpg';
                }}
              />
            </div>
          </Col>
          
          {/* Product Details */}
          <Col lg={6}>
            <div className="product-info">
              <h1 className="product-title">{product.name}</h1>
              
              <div className="product-price mb-4">
                ${product.price.toFixed(2)}
              </div>
              
              <div className="product-description mb-4">
                {product.description}
              </div>
              
              <Card className="mb-4">
                <Card.Header>Product Details</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Material:</strong> {product.material}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Color:</strong> {product.color}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Dimensions:</strong> {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} {product.dimensions.unit}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
              
              <div className="cart-actions">
                <div className="mb-4">
                  {quantity > 0 ? (
                    <div className="quantity-control">
                      <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        className="quantity-btn minus-btn"
                        onClick={removeFromCart}
                      >
                        –
                      </Button>
                      <span className="quantity-display">{quantity}</span>
                      <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        className="quantity-btn plus-btn"
                        onClick={addToCart}
                      >
                        +
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="primary" 
                      className="add-to-cart-btn"
                      onClick={addToCart}
                    >
                      Add to Cart
                    </Button>
                  )}
                </div>
                
                {quantity > 0 && (
                  <Button 
                    variant="success" 
                    className="checkout-btn w-100"
                    onClick={proceedToCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductDetail; 