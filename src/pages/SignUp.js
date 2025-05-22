import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    personalArea: '',
    floor: '',
    department: ''
  });
  const [error, setError] = useState('');

  const personalAreas = ['Coffee', 'Daleti', 'Head Office', 'Mogle', 'Transport', 'Zaki'];
  const floors = ['Ground', 'Mid', 'First', 'Second', 'Third', 'Fourth', 'Fifth'];
  const departments = [
    'Administrator', 'Internal Audit', 'Default', 'Export', 'Finance',
    'Fleet operation', 'General service', 'Human Resource', 'ICT',
    'MD office', 'Monitoring and Evaluation', 'Organizational Development',
    'President office', 'Production', 'Quality', 'Procurement',
    'Sales and Marketing', 'Warehouse', 'Technic'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.confirmPassword || 
        !formData.personalArea || !formData.floor || !formData.department) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          personal_area: formData.personalArea,
          floor: formData.floor,
          department: formData.department
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        navigate('/signin');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="input-field"
          required
        />
        
        <div className="select-group">
          <label>Personal Area:</label>
          <select 
            name="personalArea" 
            value={formData.personalArea}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Select Personal Area</option>
            {personalAreas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        <div className="select-group">
          <label>Floor:</label>
          <select 
            name="floor" 
            value={formData.floor}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Select Floor</option>
            {floors.map(floor => (
              <option key={floor} value={floor}>{floor}</option>
            ))}
          </select>
        </div>

        <div className="select-group">
          <label>Department:</label>
          <select 
            name="department" 
            value={formData.department}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-btn">Sign Up</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <p>Already have an account? <a href="/signin">Sign In</a></p>
    </div>
  );
};

export default SignUp;