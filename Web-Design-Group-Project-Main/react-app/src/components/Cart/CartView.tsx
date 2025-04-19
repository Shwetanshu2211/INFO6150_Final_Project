import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, ListGroup, Table, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './CartView.css';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const CartView: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    setLoading(true);
    try {
      // Get cart data from localStorage
      const savedCart = localStorage.getItem('cart');
      
      if (!savedCart || Object.keys(JSON.parse(savedCart)).length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const cartData = JSON.parse(savedCart);
      
      // Fetch product details for each item in cart
      const items: CartItem[] = [];
      
      for (const productId of Object.keys(cartData)) {
        try {
          const response = await fetch(`http://localhost:5001/api/products/${productId}`);
          if (!response.ok) throw new Error('Failed to fetch product');
          
          const product = await response.json();
          items.push({
            id: product._id,
            name: product.title,
            price: product.price,
            quantity: cartData[productId],
            image: `http://localhost:5001${product.image}`
          });
        } catch (error) {
          console.error(`Error fetching product ${productId}:`, error);
        }
      }
      
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    
    // Update state
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId ? {...item, quantity: newQuantity} : item
      )
    );
    
    // Update localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      let cartData = JSON.parse(savedCart);
      cartData[productId] = newQuantity;
      localStorage.setItem('cart', JSON.stringify(cartData));
    }
  };

  const removeItem = (productId: string) => {
    // Update state
    setCartItems(prev => prev.filter(item => item.id !== productId));
    
    // Update localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      let cartData = JSON.parse(savedCart);
      delete cartData[productId];
      localStorage.setItem('cart', JSON.stringify(cartData));
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { redirectPath: '/checkout' } });
      return;
    }

    // Check if cart is not empty
    if (cartItems.length === 0) {
      return;
    }

    // Navigate to checkout page
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/collection/sofas');
  };

  return (
    <div className="cart-view-page">
      <Header />
      <Container className="cart-container">
        <h1 className="mb-4">Your Shopping Cart</h1>
        
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <Alert variant="info" className="text-center">
            Your cart is empty. <Button variant="link" onClick={handleContinueShopping}>Continue shopping</Button>
          </Alert>
        ) : (
          <>
            <Row>
              <Col md={8}>
                <Card className="mb-4">
                  <Card.Body>
                    <Table responsive className="cart-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map(item => (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="cart-item-image me-3"
                                  onError={({ currentTarget }) => {
                                    currentTarget.onerror = null;
                                    currentTarget.src = 'https://placehold.co/600x400/e9ecef/6c757d?text=Product+Image';
                                  }}
                                />
                                <div>
                                  <div className="cart-item-name">{item.name}</div>
                                  <div className="cart-item-id">ID: {item.id}</div>
                                </div>
                              </div>
                            </td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>
                              <div className="quantity-control">
                                <Button 
                                  variant="outline-secondary" 
                                  size="sm" 
                                  className="quantity-btn"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  –
                                </Button>
                                <span className="quantity-display">{item.quantity}</span>
                                <Button 
                                  variant="outline-secondary" 
                                  size="sm" 
                                  className="quantity-btn"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  +
                                </Button>
                              </div>
                            </td>
                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                            <td>
                              <Button 
                                variant="light" 
                                size="sm" 
                                className="remove-btn"
                                onClick={() => removeItem(item.id)}
                              >
                                ×
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <div className="d-flex justify-content-between mt-3">
                      <Button 
                        variant="outline-secondary" 
                        onClick={handleContinueShopping}
                      >
                        Continue Shopping
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        className="clear-cart-btn"
                        onClick={clearCart}
                      >
                        Clear Cart
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={4}>
                <Card className="cart-summary">
                  <Card.Header>Order Summary</Card.Header>
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span>Subtotal:</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span>Shipping:</span>
                        <span>Free</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between fw-bold">
                        <span>Total:</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </ListGroup.Item>
                    </ListGroup>
                    <Button 
                      variant="success" 
                      className="checkout-btn w-100 mt-3"
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default CartView; 