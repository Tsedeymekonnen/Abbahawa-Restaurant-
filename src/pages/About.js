import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>About Us</h1>
        <p>Discover the story behind Abbahawa Restaurant.</p>
      </div>

      <div className="about-content">
        <div className="about-image">
          <img src={require('../assets/about-image.jpg')} alt="About Us" />
        </div>
        <div className="about-text">
          <h2>Our Story</h2>
          <p>
            Abbahawa Restaurant was founded in 2020 with a passion for delivering exceptional dining experiences. 
            Our chefs use only the freshest ingredients to create dishes that delight your taste buds.
          </p>
          <p>
            We believe in the power of good food to bring people together. Whether it's a family dinner, 
            a romantic date, or a celebration, we strive to make every moment special.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;