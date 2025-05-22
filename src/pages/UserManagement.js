import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api'; // Change this to your actual Laravel API URL

const UserManagement = () => {
  const [currentUser, setCurrentUser] = useState(null); // logged-in user info
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(true);

  // Get token from localStorage (set after login)
  const token = localStorage.getItem('token');

  // Create axios instance with auth header
  const api = axios.create({
    baseURL: API_BASE,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  // Fetch logged-in user info
  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/user');
      setCurrentUser(res.data);
    } catch (error) {
      console.error('Error fetching current user:', error.response || error);
    }
  };

  // Fetch all users
 // Fetch all users and sort them alphabetically by email
const fetchUsers = async () => {
  try {
    const res = await api.get('/users');
    const sorted = res.data.sort((a, b) => a.email.localeCompare(b.email));
    setUsers(sorted);
  } catch (error) {
    console.error('Failed to fetch users:', error.response || error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (!token) {
      alert('You are not logged in. Please login first.');
      setLoading(false);
      return;
    }
    fetchCurrentUser();
    fetchUsers();
  }, [token]);

  // Start editing a user
  const startEditing = (user) => {
    setEditingUserId(user.id);
    setFormData({ email: user.email, password: '' });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingUserId(null);
    setFormData({ email: '', password: '' });
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save updated user
  const saveUser = async (id) => {
    try {
      await api.put(`/users/${id}`, formData);
      alert('User updated successfully');
      setEditingUserId(null);
      fetchUsers();
    } catch (error) {
      alert('Update failed: ' + (error.response?.data?.message || error.message));
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      alert('User deleted');
      fetchUsers();
    } catch (error) {
      alert('Delete failed: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!token) return <div>Please login to see users.</div>;

  return (
    <div style={{ maxWidth: '700px', margin: 'auto' }}>
      <h1>User Management</h1>
      {currentUser && (
        <div style={{ marginBottom: '20px' }}>
          <strong>Logged in as:</strong> {currentUser.email}
        </div>
      )}
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Password (edit only)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>
                No users found.
              </td>
            </tr>
          )}
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {editingUserId === user.id ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <input
                    type="password"
                    name="password"
                    placeholder="New password (optional)"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                  />
                ) : (
                  '******'
                )}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <>
                    <button onClick={() => saveUser(user.id)}>Save</button>{' '}
                    <button onClick={cancelEditing}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(user)}>Edit</button>{' '}
                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
