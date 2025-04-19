import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import './UploadProduct.css';

interface Dimensions {
  length: number;
  breadth: number;
  height: number;
}

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  image: File | null;
  dimensions: Dimensions;
  category: string;
}

const UploadProduct: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: 0,
    image: null,
    dimensions: {
      length: 0,
      breadth: 0,
      height: 0
    },
    category: 'Tables'
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('dimensions.')) {
      const dimensionField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimensionField]: parseFloat(value)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'price' ? parseFloat(value) : value
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      if (!formData.image) {
        setError('Please select an image');
        return;
      }

      // Validate dimensions
      if (formData.dimensions.length <= 0 || 
          formData.dimensions.breadth <= 0 || 
          formData.dimensions.height <= 0) {
        setError('All dimensions must be greater than 0');
        return;
      }

      // Create FormData and append all fields
      const formDataToSend = new FormData();
      
      // Basic fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('category', formData.category);
      
      // Dimensions as JSON string
      const dimensionsData = {
        length: Number(formData.dimensions.length),
        breadth: Number(formData.dimensions.breadth),
        height: Number(formData.dimensions.height)
      };
      formDataToSend.append('dimensions', JSON.stringify(dimensionsData));
      
      // Image file
      formDataToSend.append('image', formData.image);

      // Log the data being sent
      console.log('Sending form data:', {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        dimensions: dimensionsData,
        image: formData.image.name
      });

      const response = await fetch('http://localhost:5001/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload product');
      }

      // Show success message
      alert('Product uploaded successfully!');
      navigate('/admin/user-management');
    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'Error uploading product. Please check if the server is running.');
    }
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <Button 
            variant="outline-light" 
            className="me-2" 
            onClick={() => navigate('/admin/user-management')}
          >
            Back to User Management
          </Button>
        </div>
      </nav>

      <Container className="mt-5 pt-5">
        <h2 className="text-center mb-4">Upload Your Craft</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit} className="upload-form">
          <Form.Group className="mb-3">
            <Form.Label>Product Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Product Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price ($)</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="Sofa">Sofa</option>
              <option value="Dining Table">Dining Table</option>
              <option value="TV Cabinets">TV Cabinets</option>
              <option value="Wardrobe">Wardrobe</option>
              <option value="Tables">Tables</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Dimensions (in inches)</Form.Label>
            <Row>
              <Col>
                <Form.Control
                  type="number"
                  name="dimensions.length"
                  value={formData.dimensions.length}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  placeholder="Length"
                  required
                />
              </Col>
              <Col>
                <Form.Control
                  type="number"
                  name="dimensions.breadth"
                  value={formData.dimensions.breadth}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  placeholder="Breadth"
                  required
                />
              </Col>
              <Col>
                <Form.Control
                  type="number"
                  name="dimensions.height"
                  value={formData.dimensions.height}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  placeholder="Height"
                  required
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Product Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              required
            />
          </Form.Group>

          <Button variant="dark" type="submit" className="w-100">
            Upload Product
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default UploadProduct; 