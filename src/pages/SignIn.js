import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css'; // Updated CSS for enhanced UI
import axios from 'axios'; // Import axios to make API requests

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Clear previous error message
    setError('');
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email: email,
        password: password,
      });
    
      console.log('Login Response:', response.data); // Debugging log
    
      if (response.data.token && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        navigate(response.data.user.role === 'admin' ? '/dashboard' : '/menu');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Login Error:', error.response ? error.response.data : error);
      setError('An error occurred. Please try again.');
    }
    
  };
  
  
  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="submit-btn">Sign In</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {/* <p>Don't have an account? <a href="/signup">Sign Up</a></p> */}
    </div>
  );
};

export default SignIn;
