import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface LoginCredentials {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // This is a mock login - replace with your actual login API call
      const response = await mockLoginAPI(credentials);
      
      // Store user data in localStorage or your state management solution
      localStorage.setItem('user', JSON.stringify(response));

      // Redirect based on user role
      if (response.role === 'Admin') {
        navigate('/admin/user-management');
      } else {
        navigate('/dashboard'); // or wherever regular users should go
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  // Mock API call - replace with your actual API call
  const mockLoginAPI = async (creds: LoginCredentials): Promise<any> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation - replace with actual validation
    if (creds.email === 'admin@example.com' && creds.password === 'admin123') {
      return {
        id: 1,
        email: creds.email,
        role: 'Admin',
        name: 'Admin User'
      };
    } else if (creds.email === 'user@example.com' && creds.password === 'user123') {
      return {
        id: 2,
        email: creds.email,
        role: 'User',
        name: 'Regular User'
      };
    }
    throw new Error('Invalid credentials');
  };

  return (
    <Container className="mt-5">
      <div className="mx-auto" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Login; 