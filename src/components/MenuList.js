import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MenuList = () => {
  const [menus, setMenus] = useState(() => {
    // Load from local storage if available (to prevent unnecessary fetch)
    const savedMenus = localStorage.getItem("menus");
    return savedMenus ? JSON.parse(savedMenus) : [];
  });
  const [fetched, setFetched] = useState(false); // Track if already fetched

  useEffect(() => {
    if (!fetched) { // Fetch only if not already fetched
      axios.get("http://localhost:8000/api/menus")
        .then(response => {
          setMenus(response.data);
          localStorage.setItem("menus", JSON.stringify(response.data)); // Save to local storage
          setFetched(true);
        })
        .catch(error => console.error(error));
    }
  }, [fetched]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await axios.delete(`http://localhost:8000/api/menus/${id}`);
      const updatedMenus = menus.filter(menu => menu.id !== id);
      setMenus(updatedMenus);
      localStorage.setItem("menus", JSON.stringify(updatedMenus)); // Update local storage
    }
  };

  return (
    <div>
      <h2>Menu List</h2>
      <Link to="/dashboard/add" className="btn btn-primary mb-3">Add New Menu</Link>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menus.map(menu => (
            <tr key={menu.id}>
              <td>{menu.title}</td>
              <td>{menu.description}</td>
              <td>{menu.price}</td>
              <td><img src={`http://localhost:8000/storage/${menu.image}`} alt={menu.title} width="50" /></td>
              <td>
                <Link to={`/dashboard/edit/${menu.id}`} className="btn btn-warning btn-sm">Edit</Link>
                <button onClick={() => handleDelete(menu.id)} className="btn btn-danger btn-sm mx-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default MenuList;
