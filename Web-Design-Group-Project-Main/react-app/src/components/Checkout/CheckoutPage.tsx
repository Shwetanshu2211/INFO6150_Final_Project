import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './CheckoutPage.css';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'your_publishable_key');

// Add a style to hide any payment method images
const hidePaymentMethodsStyle = {
  display: 'none !important'
};

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingDetails {
  fullName: string;
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
}

interface PaymentDetails {
  nameOnCard: string;
}

const CheckoutForm: React.FC<{
  onSuccess: () => void;
  amount: number;
  nameOnCard: string;
}> = ({ onSuccess, amount, nameOnCard }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const handleChange = (event: any) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5001/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
        }),
      });

      if (!response.ok) throw new Error('Failed to create payment intent');

      const { clientSecret } = await response.json();

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: nameOnCard,
          },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during payment');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="mb-3">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
                padding: '10px',
                backgroundColor: '#fff',
              },
              invalid: {
                color: '#9e2146',
              },
            },
            hidePostalCode: true,
          }}
          onChange={handleChange}
        />
      </div>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      <Button 
        type="submit" 
        disabled={!stripe || processing || disabled} 
        className="mt-4 w-100 custom-pay-button"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </Button>
    </Form>
  );
};

const CheckoutPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: '',
    addressLine1: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phoneNumber: '',
  });
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    nameOnCard: '',
  });
  const [validated, setValidated] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadCartItems();
    
    // Cleanup function when component unmounts
    return () => {
      // If we're in the confirmation step, ensure cart data is cleared
      if (step === 'confirmation') {
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('storage'));
      }
    };
  }, []);

  // Effect to remove "Return to Homepage" buttons
  useEffect(() => {
    const removeReturnHomeButtons = () => {
      const buttons = document.querySelectorAll('button, a');
      buttons.forEach(button => {
        if (button.textContent?.includes('Return to Homepage')) {
          (button as HTMLElement).style.display = 'none';
        }
      });
    };
    
    // Run on component mount and when confirmation step is active
    removeReturnHomeButtons();
    
    // Set interval to repeatedly check and remove such buttons
    const intervalId = setInterval(removeReturnHomeButtons, 500);
    
    return () => clearInterval(intervalId);
  }, [step]);

  const loadCartItems = async () => {
    setLoading(true);
    // Get cart data from localStorage
    const savedCart = localStorage.getItem('cart');
    
    if (!savedCart || Object.keys(JSON.parse(savedCart)).length === 0) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    const cartData = JSON.parse(savedCart);
    
    // In a real app, you would fetch product details from an API
    // For now, we'll simulate with dummy data
    const items: CartItem[] = [];
    
    // Convert the cart object to an array of items with product details
    Object.keys(cartData).forEach(productId => {
      // Here we would normally fetch product details from an API
      // For demo, using hardcoded product for all items
      items.push({
        id: productId,
        name: productId === '1' ? "Premium Leather Sofa" : `Product ${productId}`,
        price: 1299.99,
        quantity: cartData[productId],
        image: "/images/product-placeholder-1.jpg"
      });
    });
    
    setCartItems(items);
    setLoading(false);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    // Calculate tax (e.g., 8.25%)
    return calculateSubtotal() * 0.0825;
  };

  const calculateShipping = () => {
    // Calculate shipping (free for orders over $1000)
    return calculateSubtotal() > 1000 ? 0 : 19.99;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  const handleShippingSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    event.preventDefault();
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    
    setValidated(true);
    setStep('payment');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
    formType: 'shipping' | 'payment'
  ) => {
    const { name, value } = e.target;
    
    if (formType === 'shipping') {
      // For phone number, only allow digits
      if (name === 'phoneNumber') {
        const numericValue = value.replace(/\D/g, '');
        setShippingDetails(prev => ({
          ...prev,
          [name]: numericValue
        }));
      } 
      // For zip code, only allow digits
      else if (name === 'zipCode') {
        const numericValue = value.replace(/\D/g, '');
        setShippingDetails(prev => ({
          ...prev,
          [name]: numericValue
        }));
      }
      else {
        setShippingDetails(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setPaymentDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const processOrder = () => {
    // In a real app, this would send order data to the backend
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Generate random order number
      const newOrderNumber = `FF-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(newOrderNumber);
      
      // Clear cart
      localStorage.removeItem('cart');
      
      // Dispatch storage event to update other components
      window.dispatchEvent(new Event('storage'));
      
      // Set order as completed and show confirmation
      setOrderCompleted(true);
      setStep('confirmation');
      setLoading(false);
    }, 2000);
  };

  const goBack = () => {
    if (step === 'payment') {
      setStep('shipping');
    } else {
      navigate('/cart');
    }
  };

  const goToShipping = () => {
    setStep('shipping');
  };

  const goToPayment = () => {
    setStep('payment');
  };

  const handlePaymentSuccess = () => {
    processOrder();
    setStep('confirmation');
  };

  const handlePaymentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // The actual payment processing is handled by the CheckoutForm component
    // This form submission is just for the name on card
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <Header />
        <Container className="checkout-container">
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Processing your order...</p>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0 && !orderCompleted) {
    return (
      <div className="checkout-page">
        <Header />
        <Container className="checkout-container">
          <Alert variant="info" className="text-center">
            Your cart is empty. <Button variant="link" onClick={() => navigate('/collection/all')}>Continue shopping</Button>
          </Alert>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Header />
      <Container className="checkout-container">
        <h1 className="mb-4">Checkout</h1>
        
        {/* Checkout Steps */}
        <div className="checkout-steps mb-4">
          <div className={`step ${step === 'shipping' || step === 'payment' || step === 'confirmation' ? 'active' : ''}`} onClick={goToShipping}>
            <div className="step-number">1</div>
            <div className="step-label">Shipping</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${step === 'payment' || step === 'confirmation' ? 'active' : ''}`} onClick={step === 'confirmation' ? goToPayment : undefined}>
            <div className="step-number">2</div>
            <div className="step-label">Payment</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${step === 'confirmation' ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Confirmation</div>
          </div>
        </div>
        
        <Row>
          {/* Left Column - Forms */}
          <Col lg={8}>
            {step === 'shipping' && (
              <Card className="mb-4">
                <Card.Header>
                  <h4 className="mb-0">Shipping Information</h4>
                </Card.Header>
                <Card.Body>
                  <Form noValidate validated={validated} onSubmit={handleShippingSubmit}>
                    <Row>
                      <Col md={12} className="mb-3">
                        <Form.Group controlId="fullName">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            name="fullName"
                            value={shippingDetails.fullName}
                            onChange={(e: any) => handleInputChange(e, 'shipping')}
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide your full name.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      <Col md={12} className="mb-3">
                        <Form.Group controlId="addressLine1">
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            name="addressLine1"
                            value={shippingDetails.addressLine1}
                            onChange={(e: any) => handleInputChange(e, 'shipping')}
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide your address.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      <Col md={5} className="mb-3">
                        <Form.Group controlId="city">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            name="city"
                            value={shippingDetails.city}
                            onChange={(e: any) => handleInputChange(e, 'shipping')}
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide your city.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      <Col md={4} className="mb-3">
                        <Form.Group controlId="state">
                          <Form.Label>State</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            name="state"
                            value={shippingDetails.state}
                            onChange={(e: any) => handleInputChange(e, 'shipping')}
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide your state.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      <Col md={3} className="mb-3">
                        <Form.Group controlId="zipCode">
                          <Form.Label>Zip Code</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            name="zipCode"
                            value={shippingDetails.zipCode}
                            onChange={(e: any) => handleInputChange(e, 'shipping')}
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide your zip code.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      <Col md={12} className="mb-3">
                        <Form.Group controlId="phoneNumber">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            required
                            type="tel"
                            name="phoneNumber"
                            value={shippingDetails.phoneNumber}
                            onChange={(e: any) => handleInputChange(e, 'shipping')}
                            pattern="[0-9]+"
                          />
                          <Form.Text className="text-muted">
                            
                          </Form.Text>
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid phone number (digits only).
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <div className="d-flex justify-content-between mt-4">
                      <Button 
                        variant="outline-secondary" 
                        onClick={goBack}
                      >
                        Return to Cart
                      </Button>
                      <Button 
                        variant="primary" 
                        type="submit"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            )}
            
            {step === 'payment' && (
              <Card className="mb-4">
                <Card.Header>
                  <h4 className="mb-0">Payment Information</h4>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Name on Card</Form.Label>
                    <Form.Control
                      type="text"
                      name="nameOnCard"
                      value={paymentDetails.nameOnCard}
                      onChange={(e) => handleInputChange(e, 'payment')}
                      required
                      placeholder="Enter the name as it appears on your card"
                    />
                  </Form.Group>
                  <Elements stripe={stripePromise}>
                    <CheckoutForm 
                      onSuccess={handlePaymentSuccess}
                      amount={calculateTotal()}
                      nameOnCard={paymentDetails.nameOnCard}
                    />
                  </Elements>
                </Card.Body>
              </Card>
            )}
            
            {/* Apply style to hide any payment methods images */}
            <div style={hidePaymentMethodsStyle} className="payment-cards payment-methods accepted-cards">
              {/* This ensures any payment method images are hidden */}
            </div>
            
            {step === 'confirmation' && (
              <Card className="mb-4 confirmation-card">
                <Card.Body className="text-center">
                  <div className="confirmation-icon">✓</div>
                  <h2 className="mb-3">Order Confirmed!</h2>
                  <p className="mb-4">Thank you for your purchase. Your order has been placed and is being processed.</p>
                  
                  <div className="order-details mb-4">
                    <h5>Order Number: <span className="order-number">{orderNumber || 'FF-000000'}</span></h5>
                    <p>A confirmation email has been sent to your email address.</p>
                  </div>
                  
                  {shippingDetails.fullName && (
                    <div className="shipping-info mb-4">
                      <h5>Shipping Details</h5>
                      <p>
                        {shippingDetails.fullName}<br />
                        {shippingDetails.addressLine1}<br />
                        {shippingDetails.city}, {shippingDetails.state} {shippingDetails.zipCode}<br />
                        {shippingDetails.country}
                      </p>
                    </div>
                  )}
                  
                  <div className="d-flex justify-content-center mt-4">
                    <Button 
                      variant="success" 
                      className="mx-2"
                      onClick={() => navigate('/collection/all')}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
          
          {/* Right Column - Order Summary */}
          <Col lg={4}>
            <Card className="order-summary sticky-top" style={{ top: '20px' }}>
              <Card.Header className="order-summary-header">
                <h4 className="mb-0">Order Summary</h4>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush" className="price-breakdown">
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Tax:</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Shipping:</span>
                    <span>{calculateShipping() === 0 ? 'Free' : `$${calculateShipping().toFixed(2)}`}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between fw-bold total-row">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default CheckoutPage; 