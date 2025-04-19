import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import Header from '../Header/Header';
import './UserProfile.css';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

interface FormDataType {
  name: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load user data from localStorage on component mount
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData({
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          address: {
            street: parsedUser.address?.street || '',
            city: parsedUser.address?.city || '',
            state: parsedUser.address?.state || '',
            zipCode: parsedUser.address?.zipCode || '',
            country: parsedUser.address?.country || ''
          }
        });
      } catch (error) {
        console.error('Error parsing user data', error);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'address') {
        setFormData({
          ...formData,
          address: {
            ...formData.address,
            [child]: value
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch('http://localhost:5001/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          address: formData.address
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();
      
      // Update local storage with new user data
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      setMessage({ 
        text: 'Profile updated successfully!', 
        type: 'success' 
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        text: error instanceof Error ? error.message : 'An error occurred while updating profile', 
        type: 'danger' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-profile">
      <Header />
      
      <Container className="profile-container">
        <h1 className="text-center mb-4">My Profile</h1>
        
        {message.text && (
          <Alert variant={message.type as 'success' | 'danger'} dismissible>
            {message.text}
          </Alert>
        )}
        
        <Row>
          <Col md={4}>
            <Card className="profile-sidebar mb-4">
              <Card.Body className="text-center">
                <div className="profile-avatar mb-3">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <h4>{user?.name || 'User'}</h4>
                <p className="text-muted">{user?.role || 'Customer'}</p>
                <hr />
                <div className="d-grid">
                  <Button 
                    variant={isEditing ? "secondary" : "primary"} 
                    onClick={() => setIsEditing(!isEditing)}
                    className="mb-2"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={8}>
            <Card>
              <Card.Body>
                {isEditing ? (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    
                    <h5 className="mt-4">Address Information</h5>
                    <hr />
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Street Address</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="address.street" 
                        value={formData.address.street} 
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>City</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="address.city" 
                            value={formData.address.city} 
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>State/Province</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="address.state" 
                            value={formData.address.state} 
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Zip Code</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="address.zipCode" 
                            value={formData.address.zipCode} 
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Country</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="address.country" 
                            value={formData.address.country} 
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <div className="d-grid">
                      <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <div className="profile-details">
                    <Row className="mb-3">
                      <Col md={3} className="fw-bold">Name:</Col>
                      <Col md={9}>{user?.name || 'N/A'}</Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={3} className="fw-bold">Email:</Col>
                      <Col md={9}>{user?.email || 'N/A'}</Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={3} className="fw-bold">Role:</Col>
                      <Col md={9}>{user?.role || 'Customer'}</Col>
                    </Row>
                    
                    <h5 className="mt-4">Address Information</h5>
                    <hr />
                    
                    <Row className="mb-3">
                      <Col md={3} className="fw-bold">Street:</Col>
                      <Col md={9}>{user?.address?.street || 'N/A'}</Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={3} className="fw-bold">City:</Col>
                      <Col md={9}>{user?.address?.city || 'N/A'}</Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={3} className="fw-bold">State:</Col>
                      <Col md={9}>{user?.address?.state || 'N/A'}</Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={3} className="fw-bold">Zip Code:</Col>
                      <Col md={9}>{user?.address?.zipCode || 'N/A'}</Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={3} className="fw-bold">Country:</Col>
                      <Col md={9}>{user?.address?.country || 'N/A'}</Col>
                    </Row>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserProfile; 