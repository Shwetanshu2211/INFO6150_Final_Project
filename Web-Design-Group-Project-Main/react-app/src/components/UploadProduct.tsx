import React, { useState } from 'react';
import { Container, Form, Button, Navbar, Nav } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import './UploadProduct.css';

interface ProductData {
  title: string;
  description: string;
  price: string;
  image: File | null;
}

const UploadProduct: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductData>({
    title: '',
    description: '',
    price: '',
    image: null
  });
  const [error, setError] = useState<string>('');

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Force redirect to the main Auth page (login/signup)
    navigate('/', { replace: true });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5001/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to upload product');
      }

      // Navigate back to the gallery or dashboard after successful upload
      navigate('/gallery');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload product');
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="px-3">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/homepage">Home</Nav.Link>
          <Nav.Link as={Link} to="/gallery">Gallery</Nav.Link>
          <Nav.Link as={Link} to="/orders">Orders</Nav.Link>
          <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
        </Nav>
        <Button variant="outline-light" size="sm" onClick={handleLogout}>Sign Out</Button>
      </Navbar>

      <Container className="mt-5">
        <h2 className="text-center mb-4">Upload Your Craft</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <Form onSubmit={handleSubmit} className="upload-form">
          <Form.Group className="mb-3">
            <Form.Label>Product Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Product Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price ($)</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Product Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
          </Form.Group>

          <Button variant="dark" type="submit" className="w-100">
            Upload Product
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default UploadProduct; 