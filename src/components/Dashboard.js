import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import MenuList from "./MenuList";
import MenuForm from "./MenuForm";
import './dashboard.css';

const Dashboard = () => {
  return (
    <div className="container mt-4">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/dashboard">Dashboard</Link>
        <div className="navbar-nav">
          <Link className="nav-item nav-link" to="/dashboard">Menu List</Link>
          <Link className="nav-item nav-link" to="/dashboard/add">Add Menu</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<MenuList />} />
        <Route path="/add" element={<MenuForm />} />
        <Route path="/edit/:id" element={<MenuForm />} />
        
      </Routes>
    </div>
  );
};

export default Dashboard;
