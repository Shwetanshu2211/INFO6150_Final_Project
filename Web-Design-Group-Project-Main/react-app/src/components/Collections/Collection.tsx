import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Toast } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './Collection.css';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  dimensions: {
    length: number;
    breadth: number;
    height: number;
  };
}

const Collection: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Sofas');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Category mapping for API calls and URL handling
  const categoryMapping: { [key: string]: string } = {
    'Sofas': 'sofa',
    'Dining Tables': 'dining-table',
    'TV Cabinets': 'tv-cabinet',
    'Wardrobes': 'wardrobe',
    'Tables & More': 'tables',
    'Customization': 'custom'
  };

  // API category mapping (what the backend expects)
  const apiCategoryMapping: { [key: string]: string } = {
    'Sofas': 'Sofa',
    'Dining Tables': 'Dining Table',
    'TV Cabinets': 'TV Cabinet',
    'Wardrobes': 'Wardrobe',
    'Tables & More': 'Tables',
    'Customization': 'Custom'
  };

  // Initialize active category based on URL parameter
  useEffect(() => {
    if (category) {
      // Decode the URL parameter
      const decodedCategory = decodeURIComponent(category);
      
      // Find the display category from the URL parameter
      const displayCategory = Object.entries(categoryMapping).find(
        ([_, urlCategory]) => urlCategory.toLowerCase() === decodedCategory.toLowerCase()
      )?.[0] || 'Sofas'; // Default to 'Sofas' instead of 'All Products'
      
      setActiveCategory(displayCategory);
    } else {
      setActiveCategory('Sofas'); // Default to 'Sofas' instead of 'All Products'
    }
  }, [category]);

  // Fetch products when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiCategory = apiCategoryMapping[activeCategory];
        const url = `http://localhost:5001/api/products${apiCategory ? `?category=${encodeURIComponent(apiCategory)}` : ''}`;
        console.log('Fetching from:', url);
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        console.log('Received products:', data.products);
        setProducts(data.products);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  const handleCategoryChange = (newCategory: string) => {
    if (newCategory === activeCategory) return;
    
    const urlCategory = categoryMapping[newCategory];
    navigate(`/collection/${urlCategory}`);
    setActiveCategory(newCategory);
  };

  const handleAddToCart = (product: Product) => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        setToastMessage('Please log in to add items to cart');
        setShowToast(true);
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      // Get existing cart or initialize new one
      const savedCart = localStorage.getItem('cart');
      let cartData = savedCart ? JSON.parse(savedCart) : {};
      
      // Add or increment product quantity
      if (cartData[product._id]) {
        cartData[product._id] += 1;
      } else {
        cartData[product._id] = 1;
      }
      
      // Save updated cart
      localStorage.setItem('cart', JSON.stringify(cartData));
      
      // Show success message
      setToastMessage(`${product.title} added to cart!`);
      setShowToast(true);
      
      // Navigate to cart view after a short delay
      setTimeout(() => navigate('/cart'), 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setToastMessage('Error adding item to cart');
      setShowToast(true);
    }
  };

  if (loading) {
    return (
      <div className="collection-page">
        <Header />
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="collection-page">
        <Header />
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  const categories = Object.keys(categoryMapping);

  return (
    <div className="collection-page">
      <Header />
      <Container>
        {/* Toast notification */}
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 1000
          }}
        >
          <Toast 
            show={showToast} 
            onClose={() => setShowToast(false)}
            delay={3000}
            autohide
            bg="dark"
            className="text-white"
          >
            <Toast.Header closeButton={false}>
              <strong className="me-auto">Notification</strong>
            </Toast.Header>
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        </div>

        <div className="collection-header text-center my-5">
          <h1>Our Collection</h1>
          <p className="lead">Browse our exclusive selection of high-quality furniture designed for comfort and style.</p>
          
          <div className="filter-section my-4">
            <h2 className="filter-title">Filter by Category</h2>
            <div className="category-buttons">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "success" : "outline-dark"}
                  className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Row className="g-4">
          {products.length === 0 ? (
            <Col xs={12}>
              <div className="text-center py-5">
                <h3>No products found in this category</h3>
                <p>Try selecting a different category or check back later.</p>
              </div>
            </Col>
          ) : (
            products.map((product) => (
              <Col key={product._id} xs={12} md={6} lg={4}>
                <Card className="product-card h-100">
                  <div className="product-image-container">
                    <Card.Img
                      variant="top"
                      src={`http://localhost:5001${product.image}`}
                      className="product-img"
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = 'https://placehold.co/600x400/e9ecef/6c757d?text=Product+Image';
                      }}
                    />
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="product-title">{product.title}</Card.Title>
                    <Card.Text className="product-description">{product.description}</Card.Text>
                    <div className="mt-auto">
                      <div className="price-section mb-3">
                        <span className="price">${product.price.toFixed(2)}</span>
                      </div>
                      <Button
                        variant="dark"
                        className="w-100 add-to-cart-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Collection; 