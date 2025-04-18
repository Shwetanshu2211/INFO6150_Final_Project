import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import backgroundImage from '../../images/signUp_background.jpg';
import logoImage from '../../images/logo.png';

interface UserData {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  securityQuestion?: string;
  securityAnswer?: string;
  role?: string;
}

const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState<UserData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must include uppercase, number, and special character';
    }

    if (isSignUp) {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.securityAnswer) {
        newErrors.securityAnswer = 'Security answer is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const API_URL = 'http://localhost:5001/api';
      const endpoint = isSignUp ? '/users/register' : '/users/login';
      
      let requestData;
      if (isSignUp) {
        requestData = {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          securityQuestion: "What was your first pet's name?",
          securityAnswer: formData.securityAnswer,
          role: "customer"
        };
      } else {
        requestData = {
          email: formData.email,
          password: formData.password
        };
      }

      console.log('Attempting to connect to:', `${API_URL}${endpoint}`);
      console.log('Request data:', requestData);

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);
      
      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      if (!data.token || !data.user) {
        throw new Error('Invalid response format: missing token or user data');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      console.log('Authentication successful');
      console.log('User role:', data.user.role);
      console.log('Stored token:', data.token.substring(0, 10) + '...');

      // Role-based redirection

      switch (data.user.role) {
        case 'customer':
          console.log('Redirecting to homepage');
          navigate('/homepage');
          break;
        case 'artist':
          console.log('Redirecting to artist dashboard');
          navigate('/artists/dashboard');
          break;
        case 'admin':
          console.log('Redirecting to admin table');
          navigate('/admin/table');
          break;
        default:
          console.log('No matching role, redirecting to home');
          navigate('/');

      }
    } catch (err) {
      console.error('Authentication error:', err);
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          setApiError('Unable to connect to the server. Please make sure the backend server is running on port 5001.');
        } else if (err.message.includes('Invalid response format')) {
          setApiError('Server returned an invalid response. Please try again later.');
        } else {
          setApiError(err.message);
        }
      } else {
        setApiError('An unexpected error occurred during authentication');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="auth-container">
      <Row>
        <Col md={5} className="image-section" style={{ '--background-image': `url(${backgroundImage})` } as React.CSSProperties}>
          <div className="logo-container">
            <img src={logoImage} alt="logo" className="logo" />
          </div>
        </Col>
        <Col md={7} className="form-section">
          <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
          {apiError && <Alert variant="danger">{apiError}</Alert>}
          <Form onSubmit={handleSubmit} className="auth-form">
            {isSignUp && (
              <>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    isInvalid={!!errors.firstName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    isInvalid={!!errors.lastName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </>
            )}

            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                isInvalid={!!errors.email}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                isInvalid={!!errors.password}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            {isSignUp && (
              <Form.Group className="mb-3">
                <Form.Label>Security Question</Form.Label>
                <p className="text-muted mb-2">What was your first pet's name?</p>
                <Form.Control
                  type="text"
                  name="securityAnswer"
                  placeholder="Enter your answer"
                  value={formData.securityAnswer}
                  onChange={handleInputChange}
                  isInvalid={!!errors.securityAnswer}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.securityAnswer}
                </Form.Control.Feedback>
              </Form.Group>
            )}

            <Button 
              variant="dark" 
              type="submit" 
              className="w-100 mb-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                isSignUp ? 'Register' : 'Login'
              )}
            </Button>

            <p className="text-center">
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="toggle-link"
              >
                {isSignUp
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Sign Up"}
              </Button>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Auth; 