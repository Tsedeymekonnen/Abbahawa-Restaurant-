import React, { useEffect, useState } from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token'); // assuming token is stored after login

  useEffect(() => {
    // Fetch logged-in user info
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError('Could not load user info. Please log in again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    const res = await fetch('http://localhost:8000/api/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(data.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      // Show field-specific errors or fallback message
      const errors = data.errors || data;
      setError(
        errors.current_password?.[0] ||
        errors.new_password?.[0] ||
        errors.new_password_confirmation?.[0] ||
        errors.message ||
        'Failed to change password.'
      );
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile Page</h2>

      {loading && <p>Loading user...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user && (
        <p>
          Welcome, <strong>{user.email}</strong>
        </p>
      )}

      <form onSubmit={handleChangePassword}>
        <label>Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />

        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <label>Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
<button 
  type="submit" 
  style={{ padding: '10px', border: 'none', cursor: 'pointer', color: 'blue' }}
>
  Change Password
</button>

      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ProfilePage;
