import React from 'react';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  return (
    <div className="home">
      {/* Video Section */}
      <section id="home" className="video-section">
        <video autoPlay loop muted className="video-background">
          <source src={require('../assets/video.mp4')} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="welcome-text">
          <h1>Welcome to Abbahawa Restaurant</h1>
        </div>
      </section>

      {/* Why Good Food Matters Section */}
      <section id="about" className="food-section">
        <div className="container">
          <h2>About Us</h2>
          <div className="columns">
            <div className="column">
              <h3>Who We Are</h3>
              <p>Abbahawa Restaurant is a place where tradition meets taste, offering authentic flavors crafted with passion and quality ingredients.</p>
              </div>
            <div className="column">
              <h3>Mission</h3>
              <p>Our mission is to provide a delightful dining experience by serving delicious, high-quality meals that celebrate Ethiopian and international cuisine.</p>
            </div>
            <div className="column">
              <h3>Vision</h3>
              <p>We envision becoming the go-to destination for food lovers, where every meal brings people together in a warm and welcoming atmosphere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose-us" className="choose-us-section">
        <div className="background-image">
          <div className="overlay">
            <div className="container">
            <h2 style={{ color: 'white' }}>Why Choose Us?</h2>
              <div className="columns">
                <div className="column">
                  <p>We use only the freshest ingredients to create mouth-watering dishes.</p>
                </div>
                <div className="column">
                  <p>Our chefs are passionate about delivering exceptional flavors.</p>
                </div>
                <div className="column">
                  <p>We provide a cozy and welcoming atmosphere for all our guests.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
<section id="contact" className="contact-section">
  <div className="background-image-contact">
    <div className="overlay-contact">
      <div className="container">
    
        <div className="contact-grid">
          <div className="contact-info">
          <h2 style={{ color: 'white' }}>Contact Us</h2>
            <div className="contact-item">
              
              <FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" />
              <p>123 Main Street, City, Country</p>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faPhone} className="contact-icon" />
              <p>+123 456 7890 , +123 456 7890 , +123 456 7890</p>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
              <p>info@abbahawa.com</p>
            </div>
          </div>
        
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
  );
};


export default Home;