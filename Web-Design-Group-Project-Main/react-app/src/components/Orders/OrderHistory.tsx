import React, { useState, useEffect } from 'react';
import { Container, Table, Card, Badge, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './OrderHistory.css';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled';
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Load orders
    loadOrders();
  }, [navigate]);

  const loadOrders = async () => {
    setLoading(true);
    
    // In a real app, you would fetch orders from an API
    // For demo purposes, using static data
    setTimeout(() => {
      const mockOrders: Order[] = [
        {
          id: 'FF-123456',
          date: '2023-11-15',
          total: 1299.99,
          status: 'Delivered',
          items: [
            {
              id: '1',
              name: 'Premium Leather Sofa',
              quantity: 1,
              price: 1299.99,
              image: '/images/product-placeholder-1.jpg'
            }
          ]
        },
        {
          id: 'FF-789012',
          date: '2023-10-28',
          total: 799.98,
          status: 'Shipped',
          items: [
            {
              id: '2',
              name: 'Modern Coffee Table',
              quantity: 1,
              price: 399.99,
              image: '/images/product-placeholder-1.jpg'
            },
            {
              id: '3',
              name: 'Wooden Side Table',
              quantity: 1,
              price: 399.99,
              image: '/images/product-placeholder-1.jpg'
            }
          ]
        },
        {
          id: 'FF-345678',
          date: '2023-09-10',
          total: 2499.97,
          status: 'Delivered',
          items: [
            {
              id: '4',
              name: 'Dining Table Set',
              quantity: 1,
              price: 1499.99,
              image: '/images/product-placeholder-1.jpg'
            },
            {
              id: '5',
              name: 'Floor Lamp',
              quantity: 1,
              price: 199.99,
              image: '/images/product-placeholder-1.jpg'
            },
            {
              id: '6',
              name: 'Area Rug',
              quantity: 1,
              price: 799.99,
              image: '/images/product-placeholder-1.jpg'
            }
          ]
        }
      ];
      
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'Delivered':
        return 'success';
      case 'Shipped':
        return 'info';
      case 'Processing':
        return 'warning';
      case 'Cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="order-history-page">
      <Header />
      <Container className="order-history-container">
        <h1 className="mb-4">Order History</h1>
        
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center">
            <Card.Body>
              <Card.Title>No Orders Found</Card.Title>
              <Card.Text>
                You haven't placed any orders yet. Browse our collection to find something you'll love!
              </Card.Text>
              <Button 
                variant="primary" 
                onClick={() => navigate('/collection/all')}
              >
                Start Shopping
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <>
            {orders.map((order) => (
              <Card className="order-card mb-4" key={order.id}>
                <Card.Header>
                  <Row className="align-items-center">
                    <Col>
                      <h5 className="mb-0">Order #{order.id}</h5>
                    </Col>
                    <Col className="text-center">
                      <span className="order-date">{formatDate(order.date)}</span>
                    </Col>
                    <Col className="text-end">
                      <Badge bg={getStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  <Table responsive className="order-items-table mb-0">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="order-item-image me-3"
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null;
                                  currentTarget.src = '/images/product-placeholder-1.jpg';
                                }}
                              />
                              <div>
                                <div className="order-item-name">{item.name}</div>
                                <div className="order-item-id">ID: {item.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>{item.quantity}</td>
                          <td>${item.price.toFixed(2)}</td>
                          <td>${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
                <Card.Footer className="bg-white">
                  <Row>
                    <Col md={6} className="d-flex align-items-center">
                      <Button 
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => navigate('/collection/all')}
                        className="me-2"
                      >
                        Continue Shopping
                      </Button>
                    </Col>
                    <Col md={6}>
                      <div className="text-end">
                        <div className="fw-bold">Order Total: ${order.total.toFixed(2)}</div>
                      </div>
                    </Col>
                  </Row>
                </Card.Footer>
              </Card>
            ))}
          </>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default OrderHistory; 