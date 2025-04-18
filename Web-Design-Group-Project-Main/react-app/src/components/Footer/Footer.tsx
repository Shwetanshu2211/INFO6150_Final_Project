import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faPinterest, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="text-center text-md-start">
          <Col md={3} xs={6} className="mb-4">
            <h4>Company</h4>
            <ul className="list-unstyled">
              <li><a href="/coming-soon">About Us</a></li>
              <li><a href="/coming-soon">Our Services</a></li>
              <li><a href="/coming-soon">Privacy Policy</a></li>
              <li><a href="/coming-soon">Terms & Conditions</a></li>
            </ul>
          </Col>
          <Col md={3} xs={6} className="mb-4">
            <h4>Get Help</h4>
            <ul className="list-unstyled">
              <li><a href="/coming-soon">Shipping</a></li>
              <li><a href="/coming-soon">Returns</a></li>
              <li><a href="/coming-soon">Order Status</a></li>
              <li><a href="/coming-soon">Payment Options</a></li>
            </ul>
          </Col>
          <Col md={3} xs={6} className="mb-4">
            <h4>Collections</h4>
            <ul className="list-unstyled">
              <li><a href="/coming-soon">Sofa Collections</a></li>
              <li><a href="/coming-soon">Chair Collections</a></li>
              <li><a href="/coming-soon">Table Collections</a></li>
              <li><a href="/coming-soon">Accessories</a></li>
            </ul>
          </Col>
          <Col md={3} xs={6} className="mb-4">
            <h4>Follow Us</h4>
            <div className="social-links d-flex gap-2">
              <a href="https://www.facebook.com/">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="https://www.pinterest.com/">
                <FontAwesomeIcon icon={faPinterest} />
              </a>
              <a href="https://www.instagram.com/">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://www.linkedin.com/">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
            </div>
          </Col>
        </Row>
        <p className="text-center mt-4">&copy; All Rights Reserved.</p>
      </Container>
    </footer>
  );
};

export default Footer; 