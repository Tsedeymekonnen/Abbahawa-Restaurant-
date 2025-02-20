import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu.css';
import axios from 'axios';

const Menu = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuItems, setMenuItems] = useState([]); // Store menu items fetched from DB
  const [isLoading, setIsLoading] = useState(true); // To track loading state

  // Check if user is logged in (retrieved from localStorage)
  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  // Fetch menu items from the database ONCE when component mounts
  useEffect(() => {
    axios.get('http://localhost:8000/api/menus')
      .then((response) => {
        setMenuItems(response.data); // Store fetched menu data
        setIsLoading(false); // Data fetching complete
      })
      .catch((error) => {
        console.error('Error fetching menu data:', error);
        setIsLoading(false); // Stop loading on error
      });
  }, []); // <- Fixed dependency array (runs only once)

  const handleOrder = (menuId, price) => {
    if (!isLoggedIn) {
      navigate('/Signin'); // Redirect to sign-in page if not logged in
      return;
    }
  
    const token = localStorage.getItem('token'); // Retrieve the JWT token
    if (!token) {
      alert('You are not authenticated. Please log in.');
      return;
    }
  
    const quantity = 1; // Assuming the quantity is 1 for simplicity
    const totalPrice = price * quantity; // Calculate total price
  
    axios.post('http://localhost:8000/api/orders', {
      menu_id: menuId,
      quantity: quantity,
      total_price: totalPrice, // Include the calculated total price
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert('Your order has been placed successfully!');
    })
    .catch((error) => {
      console.error('Error placing order:', error.response?.data); // Log validation errors
      alert('Failed to place order.');
    });
  };
  
  if (isLoading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

  return (
    <div className="menu-page">
      <h1>Our Menu</h1>
      <div className="menu-items">
        {menuItems.map((item) => (
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
              <button className="order-button" onClick={() => handleOrder(item.id, item.price)}>
  Order Now
</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
