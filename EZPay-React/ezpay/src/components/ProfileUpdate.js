import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileUpdate.css';

const ProfileUpdate = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    address: '',
  });
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');  // Password field state
  const [showPasswordModal, setShowPasswordModal] = useState(false);  // Modal state for password confirmation
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerId = localStorage.getItem('customerId');
        const response = await fetch(`http://localhost:8005/customers/by-id/${customerId}`, {
          method: 'GET',
        });
        const data = await response.json();

        setFormData({
          name: data.name || '',
          email: data.email || '',
          mobileNumber: data.mobileNumber || '',
          address: data.address || '',
        });
      } catch (error) {
        console.error('Error fetching customer data:', error);
        setMessage('Error fetching data');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Function to verify the password before allowing profile update
  const verifyPassword = async () => {
    const customerId = localStorage.getItem('customerId');
    try {
      const response = await fetch('http://localhost:8005/customers/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId, password }),
      });

      if (response.ok) {
        return true;  // Password is correct
      } else {
        setPasswordError('Incorrect password');
        return false;
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setPasswordError('Error verifying password');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Show the password modal
    setShowPasswordModal(true);
  };

  const handleConfirmUpdate = async () => {
    const passwordIsValid = await verifyPassword();
    
    if (passwordIsValid) {
      const customerId = localStorage.getItem('customerId'); 
      const updatedData = {
        name: formData.name,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        address: formData.address,
      };

      try {
        const response = await fetch(`http://localhost:8005/customers/update?customerId=${customerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        });

        if (response.ok) {
          setMessage('Profile updated successfully!');
          navigate('/view-profile');
        } else {
          console.error('Failed to update profile');
          setMessage('Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        setMessage('Error updating profile');
      }
    }
  };

  return (
    <div className="container">
      <h2>Update Profile</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-container">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-container">
          <label>Mobile Number</label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-container">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <button className="button" type="submit">Update Profile</button>
      </form>
      <button className="button" onClick={() => navigate('/view-profile')}>Cancel</button>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="password-modal">
          <div className="modal-content">
            <h3>Confirm Update</h3>
            <p>Please enter your password to confirm the update:</p>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
            <button className="modal-button confirm-btn" onClick={handleConfirmUpdate}>Confirm</button>
            <button className="modal-button cancel-btn" onClick={() => setShowPasswordModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileUpdate;
