import React, { useEffect } from 'react';
import { Container, Row, Col, Carousel, Card, Button, Accordion } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCouch, faRecycle, faSmile } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import './Homepage.css';

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle hash navigation when component mounts
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  const handleViewCollection = (collectionType: string) => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Map the collection type to the correct category name
      const categoryMap: { [key: string]: string } = {
        'sofa': 'Sofa',
        'dining': 'Dining Table',
        'tv-cabinets': 'TV Cabinets',
        'wardrobe': 'Wardrobe',
        'tables': 'Tables'
      };
      
      const category = categoryMap[collectionType] || collectionType;
      // User is logged in, navigate to collection page
      navigate(`/collection/${category}`);
    } else {
      // User is not logged in, redirect to login page
      navigate('/login', { state: { redirectPath: `/collection/${collectionType}` } });
    }
  };

  const handleCustomize = () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // User is logged in, navigate to customization page
      navigate('/customize');
    } else {
      // User is not logged in, redirect to login page
      navigate('/login', { state: { redirectPath: '/customize' } });
    }
  };

  return (
    <div className="homepage">
      {/* Use Header component instead of inline HTML */}
      <Header />


      {/* Explore Now Section */}
      <section id="explore-now" className="section py-5 mb-5">
        <Container fluid className="p-0">
          <h2 className="text-center mb-4 section-title">Explore Now</h2>
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="./images/furniture1.jpg"
                alt="First slide"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = 'https://placehold.co/1200x600/e9ecef/6c757d?text=Furniture+Image';
                }}

              />
              <Carousel.Caption className="text-left">
                <h3>Hello, Neighbor!</h3>
                <p>Discover furniture that feels like home. Let us bring your vision to life—book a private appointment and experience design tailored just for you.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="./images/furniture4.jpg"
                alt="Second slide"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = 'https://placehold.co/1200x600/e9ecef/6c757d?text=Furniture+Image';
                }}

              />
              <Carousel.Caption className="text-left">
                <h3>Up Close & Personal.</h3>
                <p>Your space deserves a personal touch. Schedule a private consultation and let's create something extraordinary together.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="./images/furniture6.jpg"
                alt="Third slide"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = 'https://placehold.co/1200x600/e9ecef/6c757d?text=Furniture+Image';
                }}

              />
              <Carousel.Caption className="text-left">
                <h3>Design Made for You.</h3>
                <p>From concept to creation, we're here to make your dream space a reality. Book a one-on-one appointment and let's get started!</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Container>
      </section>

      {/* Offerings Section */}
      <section id="offerings" className="section py-5 bg-light">
        <Container>
          <h2 className="text-center mb-4 section-title">Our Offerings</h2>
          <Row className="g-4">
            <Col xs={12} md={6} lg={4}>
              <Card className="h-100 offering-card">
                <Card.Img 
                  variant="top" 
                  src="./images/sofa.jpg" 
                  className="offering-img"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = 'https://placehold.co/600x400/e9ecef/6c757d?text=Sofa+Image';
                  }}  
                />
                <Card.Body className="text-center">
                  <Card.Title className="offering-title">Sofa</Card.Title>
                  <Card.Text className="offering-description">
                  Luxurious sofas for your living room.
                  </Card.Text>
                  <Button 
                    variant="dark" 
                    className="w-100 view-collection-btn btn-standard-dark"
                    onClick={() => handleViewCollection('sofa')}
                  >
                    View Collection
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={6} lg={4}>
              <Card className="h-100 offering-card">
                <Card.Img 
                  variant="top" 
                  src="./images/diningtable.jpg" 
                  className="offering-img"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = 'https://placehold.co/600x400/e9ecef/6c757d?text=Dining+Table+Image';
                  }}  
                />

                <Card.Body className="text-center">
                  <Card.Title className="offering-title">Dining Table</Card.Title>
                  <Card.Text className="offering-description">
                    Elegant dining tables for memorable meals.
                  </Card.Text>
                  <Button 
                    variant="dark" 
                    className="w-100 view-collection-btn btn-standard-dark"
                    onClick={() => handleViewCollection('dining')}
                  >

                    View Collection
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={6} lg={4}>
              <Card className="h-100 offering-card">
                <Card.Img 
                  variant="top" 
                  src="./images/tv%20cabinet.jpg" 
                  className="offering-img"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = 'https://placehold.co/600x400/e9ecef/6c757d?text=TV+Cabinet+Image';
                  }}  
                />

                <Card.Body className="text-center">
                  <Card.Title className="offering-title">TV Cabinets</Card.Title>
                  <Card.Text className="offering-description">
                    Stylish TV cabinets for your entertainment space.
                  </Card.Text>
                  <Button 
                    variant="dark" 
                    className="w-100 view-collection-btn btn-standard-dark"
                    onClick={() => handleViewCollection('tv-cabinets')}
                  >
                    View Collection
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={6} lg={4}>
              <Card className="h-100 offering-card">
                <Card.Img 
                  variant="top" 
                  src="./images/wardrobe.jpg" 
                  className="offering-img"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = 'https://placehold.co/600x400/e9ecef/6c757d?text=Wardrobe+Image';
                  }}  
                />

                <Card.Body className="text-center">
                  <Card.Title className="offering-title">Wardrobe</Card.Title>
                  <Card.Text className="offering-description">
                    Spacious wardrobes for organized living.
                  </Card.Text>
                  <Button 
                    variant="dark" 
                    className="w-100 view-collection-btn btn-standard-dark"
                    onClick={() => handleViewCollection('wardrobe')}
                  >
                    View Collection
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={6} lg={4}>
              <Card className="h-100 offering-card">
                <Card.Img 
                  variant="top" 
                  src="./images/table.jpg" 
                  className="offering-img"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = 'https://placehold.co/600x400/e9ecef/6c757d?text=Table+Image';
                  }}  
                />
                <Card.Body className="text-center">
                  <Card.Title className="offering-title">Tables & More</Card.Title>
                  <Card.Text className="offering-description">
                    Versatile tables and more for every need.
                  </Card.Text>
                  <Button 
                    variant="dark" 
                    className="w-100 view-collection-btn btn-standard-dark"
                    onClick={() => handleViewCollection('tables')}
                  >
                    View Collection
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={6} lg={4}>
              <Card className="h-100 offering-card">
                <Card.Img 
                  variant="top" 
                  src="./images/customizenow.jpg" 
                  className="offering-img"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = 'https://placehold.co/600x400/e9ecef/6c757d?text=Customize+Now+Image';
                  }}  
                />
                <Card.Body className="text-center">
                  <Card.Title className="offering-title">Customization</Card.Title>
                  <Card.Text className="offering-description">
                    Got a unique design? Customize now!
                  </Card.Text>
                  <Button 
                    variant="warning" 
                    className="w-100 customize-btn"
                    onClick={handleCustomize}
                  >
                    Customize Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="about-section py-5">
        <Container>
          <h2 className="section-title text-center mb-5">About Us</h2>
          <Row className="align-items-center mb-5">
            <Col lg={6} className="text-center mb-4 mb-lg-0">
              <img 
                src="./images/AboutUs.jpg" 
                alt="About Us Interior" 
                className="about-img img-fluid rounded shadow" 
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = 'https://placehold.co/800x600/e9ecef/6c757d?text=About+Us+Image';
                }}
              />
            </Col>
            <Col lg={6} className="about-content">
              <h3 className="fw-bold mb-3">Welcome to Fusion Furnish – where design meets comfort</h3>
              <p>
                At <strong>Fusion Furnish</strong>, we craft elegant, durable, and innovative furniture that blends style,
                comfort, and functionality. Our commitment to quality craftsmanship and sustainability
                ensures timeless designs made from premium materials.
              </p>
              <p>
                Whether you prefer modern minimalism, classic elegance, or space-saving solutions, our
                collections cater to every taste and lifestyle. With seamless shopping, expert design
                guidance, and top-tier service, we make furnishing your space effortless.
              </p>
              <p>
                Transform your home with Fusion Furnish—where design meets comfort.
              </p>
              <Button variant="dark" className="mt-3 learn-more-btn btn-standard-dark">
                Learn More
              </Button>
            </Col>
          </Row>

          {/* Values Row */}
          <Row className="text-center values-row mt-5 pt-4">
            <Col md={4} className="value-item mb-4 mb-md-0">
              <FontAwesomeIcon icon={faCouch} size="3x" className="value-icon mb-3" />
              <h4 className="value-title fw-bold">Quality Craftsmanship</h4>
              <p className="value-description text-muted">Every piece is crafted with precision and care.</p>
            </Col>
            <Col md={4} className="value-item mb-4 mb-md-0">
              <FontAwesomeIcon icon={faRecycle} size="3x" className="value-icon mb-3" />
              <h4 className="value-title fw-bold">Sustainable Materials</h4>
              <p className="value-description text-muted">We use eco-friendly materials to protect our planet.</p>
            </Col>
            <Col md={4} className="value-item">
              <FontAwesomeIcon icon={faSmile} size="3x" className="value-icon mb-3" />
              <h4 className="value-title fw-bold">Customer Satisfaction</h4>
              <p className="value-description text-muted">Our customers are at the heart of everything we do.</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Meet Our Designers Section */}
      <section id="meet-designers" className="meet-designers section py-5">
        <Container>
          <h2 className="section-title text-center mb-5">Meet Our Designers</h2>
          <Carousel
            id="designerCarousel"
            interval={null}
            indicators={false}
            prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon custom-arrow" />}
            nextIcon={<span aria-hidden="true" className="carousel-control-next-icon custom-arrow" />}
          >
            {/* Designer 1 */}
            <Carousel.Item>
              <Row className="align-items-center justify-content-center">
                <Col md={5} className="text-center text-md-end mb-4 mb-md-0">
                  <img
                    src="/images/Tanyaimg.jpg"
                    alt="Designer 1 Tanya Bansal"
                    className="designer-img img-fluid"
                  />
                </Col>
                <Col md={7} className="designer-info text-center text-md-start">
                  <h3 className="designer-name">Tanya Bansal</h3>
                  <p className="designer-description">
                    Tanya Bansal is a creative web designer who specializes in sleek, intuitive, and user-focused designs. Her work combines modern aesthetics with seamless functionality, delivering websites that are both visually engaging and highly efficient.
                  </p>
                  <Button variant="dark" className="designer-know-more-btn">
                    Get to know more &rarr;
                  </Button>
                </Col>
              </Row>
            </Carousel.Item>
            
            {/* Designer 2 */}
            <Carousel.Item>
              <Row className="align-items-center justify-content-center">
                <Col md={5} className="text-center text-md-end mb-4 mb-md-0">
                  <img
                    src="/images/Nikhil.jpg"
                    alt="Designer 2 Nikhil Patwal"
                    className="designer-img img-fluid"
                  />
                </Col>
                <Col md={7} className="designer-info text-center text-md-start">
                  <h3 className="designer-name">Nikhil Patwal</h3>
                  <p className="designer-description">
                    Nikhil Patwal is a versatile website designer known for
                    creating sleek, user-friendly, and high-performing websites.
                    With a keen eye for detail and a focus on modern design
                    trends, he crafts intuitive digital experiences that are
                    both visually appealing and functionally seamless.
                  </p>
                  <Button variant="dark" className="designer-know-more-btn">
                    Get to know more &rarr;
                  </Button>
                </Col>
              </Row>
            </Carousel.Item>
            
            {/* Designer 3 */}
            <Carousel.Item>
              <Row className="align-items-center justify-content-center">
                <Col md={5} className="text-center text-md-end mb-4 mb-md-0">
                  <img
                    src="/images/Shwetanshu.jpg"
                    alt="Designer 3 Shwetanshu Deshmukh"
                    className="designer-img img-fluid"
                  />
                </Col>
                <Col md={7} className="designer-info text-center text-md-start">
                  <h3 className="designer-name">Shwetanshu Deshmukh</h3>
                  <p className="designer-description">
                    Shwetanshu Deshmukh is a creative web designer who specializes in sleek, intuitive, and user-focused designs. His work combines modern aesthetics with seamless functionality, delivering websites that are both visually engaging and highly efficient.
                  </p>
                  <Button variant="dark" className="designer-know-more-btn">
                    Get to know more &rarr;
                  </Button>
                </Col>
              </Row>
            </Carousel.Item>
            
            {/* Designer 4 */}
            <Carousel.Item>
              <Row className="align-items-center justify-content-center">
                <Col md={5} className="text-center text-md-end mb-4 mb-md-0">
                  <img
                    src="/images/Shravya.jpg"
                    alt="Designer 4 Shravya Ushake"
                    className="designer-img img-fluid"
                  />
                </Col>
                <Col md={7} className="designer-info text-center text-md-start">
                  <h3 className="designer-name">Shravya Ushake</h3>
                  <p className="designer-description">
                    Shravya Ushake is a passionate web designer known for
                    creating elegant, responsive, and user-friendly websites.
                    She focuses on clean layouts, intuitive navigation, and
                    modern design principles, ensuring a seamless digital
                    experience for every user.
                  </p>
                  <Button variant="dark" className="designer-know-more-btn">
                    Get to know more &rarr;
                  </Button>
                </Col>
              </Row>
            </Carousel.Item>
            
            {/* Designer 5 */}
            <Carousel.Item>
              <Row className="align-items-center justify-content-center">
                <Col md={5} className="text-center text-md-end mb-4 mb-md-0">
                  <img
                    src="/images/Sathwik.jpeg"
                    alt="Designer 5 Sathwik Maddula"
                    className="designer-img img-fluid"
                  />
                </Col>
                <Col md={7} className="designer-info text-center text-md-start">
                  <h3 className="designer-name">Sathwik Maddula</h3>
                  <p className="designer-description">
                    Sathwik Maddula specializes in designing dynamic and
                    visually compelling websites that enhance brand identity and
                    user engagement. With a focus on modern aesthetics,
                    performance optimization, and accessibility, he creates
                    digital experiences that are both innovative and impactful.
                  </p>
                  <Button variant="dark" className="designer-know-more-btn">
                    Get to know more &rarr;
                  </Button>
                </Col>
              </Row>
            </Carousel.Item>
          </Carousel>
        </Container>
      </section>

      {/* Need Assistance & FAQ Section */}
      <section id="assistance-faq" className="assistance-faq pt-2 pb-5">
        <Container>
          <Row className="align-items-start">
            {/* Left Column: Need Assistance */}
            <Col lg={6} className="mb-4 mb-lg-0">
              <h2 className="fw-bold assistance-title">
                Need assistance or have questions?
              </h2>
              <p className="assistance-text">
                Our dedicated team is here to help you with any inquiries you
                might have. Whether it's about our services, products, or
                something else – we're here to support you.
              </p>
            </Col>

            {/* Right Column: FAQs */}
            <Col lg={6}>
              <Accordion id="faqAccordion">
                {/* FAQ 1 */}
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    Chat with our expert interior designers
                  </Accordion.Header>
                  <Accordion.Body>
                    Our experienced designers are available to help you find the
                    perfect furniture for your space.
                  </Accordion.Body>
                </Accordion.Item>

                {/* FAQ 2 */}
                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    Find a store near you
                  </Accordion.Header>
                  <Accordion.Body>
                    Use our store locator to find the nearest showroom for an
                    in-person experience.
                  </Accordion.Body>
                </Accordion.Item>

                {/* FAQ 3 */}
                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                    Customer Service
                  </Accordion.Header>
                  <Accordion.Body>
                    Our support team is here to assist you with any questions
                    regarding orders, returns, or services.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-5">
        <Container>
          <h2 className="text-center mb-4">What customers say about us..</h2>
          <Row>
            <Col md={3}>
              <div className="review-box">
                <p>"Absolutely love the quality and craftsmanship of the sofa I purchased. It's elegant, comfortable, and fits perfectly in my living room!"</p>
                <h3>Priya Sharma</h3>
                <p>New York, USA</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="review-box">
                <p>"The dining table set is stunning! The wood finish is premium, and it adds a modern touch to my home. Worth every penny!"</p>
                <h3>Rahul Verma</h3>
                <p>Toronto, Canada</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="review-box">
                <p>"I was skeptical about ordering furniture online, but Fusion Furnish exceeded my expectations. The office chair is ergonomic and stylish!"</p>
                <h3>Sophia Williams</h3>
                <p>London, UK</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="review-box">
                <p>"Best investment ever! The bed frame I bought is sturdy, beautifully designed, and extremely comfortable. Highly recommended!"</p>
                <h3>David Brown</h3>
                <p>San Francisco, USA</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Homepage; 