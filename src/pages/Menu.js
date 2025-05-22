import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu.css';
import axios from 'axios';

const Menu = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const categories = ['breakfast', 'lunch', 'refreshment']; // Define your categories

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  // Fetch menu items from the database
  useEffect(() => {
    axios.get('http://localhost:8000/api/menus')
      .then((response) => {
        setMenuItems(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching menu data:', error);
        setIsLoading(false);
      });
  }, []);

  const handleOrder = (menuId, price) => {
    if (!isLoggedIn) {
      navigate('/Signin');
      return;
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not authenticated. Please log in.');
      return;
    }
  
    const quantity = 1;
    const totalPrice = price * quantity;
  
    axios.post('http://localhost:8000/api/orders', {
      menu_id: menuId,
      quantity: quantity,
      total_price: totalPrice,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert('Your order has been placed successfully!');
    })
    .catch((error) => {
      console.error('Error placing order:', error.response?.data);
      alert('Failed to place order.');
    });
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Group items by category
  const menuByCategory = categories.map(category => ({
    name: category,
    items: menuItems.filter(item => item.category === category)
  }));

  return (
    <div className="menu-page">
      <h1>Our Menu</h1>
      
      {menuByCategory.map((category) => (
        <div key={category.name} className="menu-category">
          <h2 className="category-title">
            {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
          </h2>
          
          {category.items.length === 0 ? (
            <p className="no-items">No {category.name} items available</p>
          ) : (
            <div className="menu-items">
              {category.items.map((item) => (
                <div key={item.id} className="menu-item">
                  <img
                    src={`http://localhost:8000/storage/${item.image}`}
                    alt={item.title}
                    className="menu-item-image"
                  />
                  <div className="menu-item-details">
                    <h3>{item.title}</h3>
                    <p className="description">{item.description}</p>
                    <p className="price">${item.price}</p>
                    <button 
                      className="order-button" 
                      onClick={() => handleOrder(item.id, item.price)}
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Menu;