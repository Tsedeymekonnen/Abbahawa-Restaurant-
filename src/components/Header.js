import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showDropdown, setShowDropdown] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserRole(user.role);
    } else {
      setUserRole(null);
    }
  }, [token]);

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) section.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(id);
      }, 100);
    } else {
      const section = document.getElementById(id);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="logo-container">
        <button onClick={() => scrollToSection('Menu')} className="logo-link">
          <img src={require('../assets/logo.jpg')} alt="Abbahawa Restaurant Logo" className="logo-img" />
        </button>
        <h1 className="restaurant-name">Abbahawa Canteen</h1>
      </div>

      <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
      </div>

      <nav className={`navbar ${isMenuOpen ? 'active' : ''}`}>
        <button onClick={() => scrollToSection('home')} className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}>
          Home
        </button>
        <button onClick={() => scrollToSection('about')} className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}>
          About
        </button>
        <button onClick={() => scrollToSection('why-choose-us')} className={`nav-link ${activeSection === 'why-choose-us' ? 'active' : ''}`}>
          Why Us
        </button>
        <button onClick={() => scrollToSection('contact')} className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}>
          Contact
        </button>
        <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}>
          Menu
        </Link>

        {token ? (
          <div
            className="profile-dropdown-container"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button className="profile-icon">
              <FontAwesomeIcon icon={faUser} />
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                {(userRole === 'super_admin') && (
                  <>
                    <Link to="/dashboard" className="dropdown-item">Dashboard</Link>
                    <Link to="/signup" className="dropdown-item">Sign up</Link>
                    <Link to="/UserManagement" className="dropdown-item">User Management</Link>
                  </>
                )}
                {(userRole === 'admin') && (
                  <>
                    <Link to="/dashboard" className="dropdown-item">Dashboard</Link>
                    {/* No sign up or user management here */}
                  </>
                )}

                {/* Regular users have no admin links */}

                <Link to="/Orders" className="dropdown-item">Order Report</Link>
                <Link to="/Profilepage" className="dropdown-item">Profile</Link>
                <button onClick={handleLogout} className="dropdown-item">
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/Signin">
            <button className="nav-link">Sign In</button>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
