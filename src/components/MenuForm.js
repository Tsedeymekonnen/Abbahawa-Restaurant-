import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const MenuForm = () => {
  const [formData, setFormData] = useState({ 
    title: "", 
    description: "", 
    price: "", 
    category: "lunch", // Default to lunch
    image: null 
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8000/api/menus/${id}`)
        .then(response => setFormData({ ...response.data, image: null }))
        .catch(error => console.error(error));
    }
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFormData({ ...formData, image: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category); // Add category
    if (formData.image) data.append("image", formData.image);

    try {
      if (id) {
        await axios.post(`http://localhost:8000/api/menus/${id}`, data);
      } else {
        await axios.post("http://localhost:8000/api/menus", data);
      }
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>{id ? "Edit Menu" : "Add Menu"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea name="description" className="form-control" value={formData.description} onChange={handleChange} required></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input type="number" name="price" className="form-control" value={formData.price} onChange={handleChange} required />
        </div>
        {/* Add Category Select */}
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select name="category" className="form-control" value={formData.category} onChange={handleChange} required>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="refreshment">Refreshment</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input type="file" name="image" className="form-control" onChange={handleFileChange} />
        </div>
        <button type="submit" className="btn btn-primary">
          {id ? "Update" : "Add"} Menu
        </button>
      </form>
    </div>
  );
};

export default MenuForm;