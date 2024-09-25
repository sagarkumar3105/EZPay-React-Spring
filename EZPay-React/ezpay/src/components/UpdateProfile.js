import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UpdateProfile.css';

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    address: '',
    profilePictureUrl: '',
  });
  const [newValues, setNewValues] = useState({
    newName: '',
    newEmail: '',
    newMobileNumber: '',
    newAddress: '',
    newprofilePictureUrl: '',
  });
  const [changedFields, setChangedFields] = useState({});
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerId = localStorage.getItem('customerId');
        const response = await fetch(`http://localhost:8005/customers/by-id/${customerId}`, {
          method: 'GET',
        });
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();

        setFormData({
          name: data.name || '',
          email: data.email || '',
          mobileNumber: data.mobileNumber || '',
          address: data.address || '',
          profilePictureUrl: data.profilePictureUrl || '',
        });
        // console.log(data)
      } catch (error) {
        console.error('Error fetching customer data:', error);
        setMessage('Error fetching data');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewValues({
      ...newValues,
      [name]: value,
    });
    setChangedFields({
      ...changedFields,
      [name]: true, // Mark this field as changed
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPasswordModal(true);
  };

  const handleConfirmUpdate = async () => {
    try {
        const customerId = localStorage.getItem('customerId');
        
        // Verify password
        const verifyResponse = await fetch('http://localhost:8005/customers/verify-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ customerId, password }),
        });

        if (!verifyResponse.ok) {
            const errorData = await verifyResponse.json();
            setPasswordError(errorData.message);
            return; // Stop further execution if password verification fails
        }

        // Prepare updated data - Only changed fields
        const updatedData = {
          customerId,
          name: newValues.newName || formData.name, // Fallback to existing values if the input is not changed
          email: newValues.newEmail || formData.email,
          mobileNumber: newValues.newMobileNumber || formData.mobileNumber,
          address: newValues.newAddress || formData.address,
          profilePictureUrl: newValues.newprofilePictureUrl || formData.profilePictureUrl,
        };

        // Update customer details
        const updateResponse = await fetch(`http://localhost:8005/customers/update?customerId=${customerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            setMessage(errorData.message);
            return;
        }

        setMessage('Profile updated successfully!');
        setShowPasswordModal(false); // Close modal after update

    } catch (error) {
        console.error('Error during update:', error);
        setMessage('Error updating profile');
    }
};

  const getInputStyle = (fieldName) => {
    return changedFields[fieldName] ? { backgroundColor: '#f0e5e5' } : {}; // Darker shade on change
  };

  return (
    <div className="container">
      <h2 className="welcome-title">Update Profile</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Name:</label>
          <input
            type="text"
            name="newName"
            value={newValues.newName} // Start empty, the user can type or leave it blank
            onChange={handleChange}
            placeholder={formData.name} // Show current name as a placeholder
            style={getInputStyle('newName')}
          />
        </div>
        <div className="input-container">
          <label>Email:</label>
          <input
            type="email"
            name="newEmail"
            value={newValues.newEmail} // Start empty, the user can type or leave it blank
            onChange={handleChange}
            placeholder={formData.email} // Show current email as a placeholder
            style={getInputStyle('newEmail')}
          />
        </div>
        <div className="input-container">
          <label>Mobile Number:</label>
          <input
            type="text"
            name="newMobileNumber"
            value={newValues.newMobileNumber} // Start empty
            onChange={handleChange}
            placeholder={formData.mobileNumber} // Show current mobile number as a placeholder
            style={getInputStyle('newMobileNumber')}
          />
        </div>
        <div className="input-container">
          <label>Address:</label>
          <input
            type="text"
            name="newAddress"
            value={newValues.newAddress} // Start empty
            onChange={handleChange}
            placeholder={formData.address} // Show current address as a placeholder
            style={getInputStyle('newAddress')}
          />
        </div>
        <div className="input-container">
          <label>Profile Picture URL:</label>
          <input
            type="text"
            name="newprofilePictureUrl"
            value={newValues.newprofilePictureUrl} // Start empty
            onChange={handleChange}
            placeholder={formData.profilePictureUrl} // Show current profile picture URL as a placeholder
            style={getInputStyle('newprofilePictureUrl')}
          />
        </div>
        <button className="button" type="submit">Update Profile</button>
        <button type="button" className="button" onClick={() => navigate('/view-profile')}>Cancel</button>
      </form>

      {showPasswordModal && (
        <div className="password-modal">
          <div className="modal-content">
            <h3 align="center">Confirm Update</h3>
            <p>Please enter your password to confirm the update:</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
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

export default UpdateProfile;
