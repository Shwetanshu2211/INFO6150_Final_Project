import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, Button, Alert, Modal } from 'react-bootstrap';
import Header from '../Header/Header';
import './CustomizeProduct.css';

const CustomizeProduct: React.FC = () => {
  const [productType, setProductType] = useState('sofa');
  const [material, setMaterial] = useState('fabric');
  const [color, setColor] = useState('beige');
  const [dimensions, setDimensions] = useState({ width: 200, height: 85, depth: 90 });
  const [message, setMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');

  const goBack = () => {
    window.history.back();
  };

  // Handle redirection after success modal is shown
  useEffect(() => {
    let redirectTimer: NodeJS.Timeout;
    if (showSuccessModal) {
      redirectTimer = setTimeout(() => {
        goBack();
      }, 3000); // Redirect after 3 seconds
    }
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [showSuccessModal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the customization to the backend
    setMessage('Your customization request has been submitted successfully!');
    setShowSuccessModal(true);
  };

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDimensions({
      ...dimensions,
      [name]: parseInt(value)
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setShowAlert(true);
        setMessage('File size too large. Please upload an image smaller than 5MB.');
        return;
      }
      
      // Check file type
      if (!file.type.match('image.*')) {
        setShowAlert(true);
        setMessage('Please upload an image file (jpg, png, etc.)');
        return;
      }
      
      setReferenceImage(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="customize-product">
      <Header />
      <Container className="mt-5 pt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button 
            variant="outline-secondary" 
            className="back-button"
            onClick={goBack}
          >
            <i className="fas fa-arrow-left me-2"></i>Back to Previous Page
          </Button>
          <h1 className="text-center mb-0">Customize Your Furniture</h1>
          <div style={{ width: '170px' }}></div> {/* Empty div for balance */}
        </div>
        
        <p className="text-center lead mb-5">
          Design your perfect piece of furniture to match your space and style.
        </p>

        {showAlert && (
          <Alert 
            variant="danger" 
            onClose={() => setShowAlert(false)} 
            dismissible
            className="mb-4"
          >
            {message}
          </Alert>
        )}

        <Row>
          <Col lg={6} className="mb-4 mb-lg-0">
            <Card className="reference-image-card">
              <Card.Body>
                <h3 className="mb-3 text-center">Upload Reference Image</h3>
                <p className="text-center text-muted mb-4">
                  Share an example or reference image to help our designers understand your vision
                </p>
                
                <div className="upload-area">
                  {imagePreviewUrl ? (
                    <div className="reference-image-preview">
                      <img 
                        src={imagePreviewUrl} 
                        alt="Reference" 
                        className="reference-image"
                      />
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        className="remove-image-btn"
                        onClick={() => {
                          setReferenceImage(null);
                          setImagePreviewUrl('');
                        }}
                      >
                        <i className="fas fa-times"></i> Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <i className="fas fa-cloud-upload-alt"></i>
                      <p>Drag & drop your image here or click to browse</p>
                      <Form.Control
                        type="file"
                        className="file-input"
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                    </div>
                  )}
                </div>

                <div className="image-requirements mt-3">
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Accepted formats: JPG, PNG, GIF • Max file size: 5MB
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Product Type</Form.Label>
                    <Form.Select
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                    >
                      <option value="sofa">Sofa</option>
                      <option value="chair">Chair</option>
                      <option value="table">Table</option>
                      <option value="bed">Bed</option>
                      <option value="wardrobe">Wardrobe</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Material</Form.Label>
                    <Form.Select
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                    >
                      <option value="fabric">Fabric</option>
                      <option value="leather">Leather</option>
                      <option value="wood">Wood</option>
                      <option value="metal">Metal</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Color</Form.Label>
                    <div className="color-options">
                      {['beige', 'black', 'brown', 'white'].map((c) => (
                        <div
                          key={c}
                          className={`color-option ${color === c ? 'selected' : ''}`}
                          style={{ backgroundColor: c }}
                          onClick={() => setColor(c)}
                        />
                      ))}
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Dimensions (cm)</Form.Label>
                    <Row>
                      <Col xs={4}>
                        <Form.Label>Width</Form.Label>
                        <Form.Control
                          type="number"
                          name="width"
                          value={dimensions.width}
                          onChange={handleDimensionChange}
                          min="50"
                          max="300"
                        />
                      </Col>
                      <Col xs={4}>
                        <Form.Label>Height</Form.Label>
                        <Form.Control
                          type="number"
                          name="height"
                          value={dimensions.height}
                          onChange={handleDimensionChange}
                          min="30"
                          max="200"
                        />
                      </Col>
                      <Col xs={4}>
                        <Form.Label>Depth</Form.Label>
                        <Form.Control
                          type="number"
                          name="depth"
                          value={dimensions.depth}
                          onChange={handleDimensionChange}
                          min="30"
                          max="150"
                        />
                      </Col>
                    </Row>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Additional Requirements</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Any specific requirements or notes..." />
                  </Form.Group>

                  <div className="d-grid">
                    <Button variant="primary" type="submit" className="customize-submit-btn">
                      Submit Customization Request
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Success Modal */}
        <Modal 
          show={showSuccessModal} 
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header className="success-modal-header">
            <Modal.Title>Success!</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center py-4">
            <div className="success-icon mb-3">
              <i className="fas fa-check-circle"></i>
            </div>
            <h4>{message}</h4>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default CustomizeProduct; 