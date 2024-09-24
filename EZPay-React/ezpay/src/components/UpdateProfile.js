import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UpdateProfile.css';

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    address: '',
    profilePictureURL: '',
  });
  const [newValues, setNewValues] = useState({
    newName: '',
    newEmail: '',
    newMobileNumber: '',
    newAddress: '',
    newProfilePictureURL: '',
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
          profilePictureURL: data.profilePictureURL || '',
        });
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

        // Prepare updated data
        const updatedData = {};

        // Only include fields that have been changed
        if (changedFields.newName) updatedData.name = newValues.newName;
        if (changedFields.newEmail) updatedData.email = newValues.newEmail;
        if (changedFields.newMobileNumber) updatedData.mobileNumber = newValues.newMobileNumber;
        if (changedFields.newAddress) updatedData.address = newValues.newAddress;
        if (changedFields.newProfilePictureURL) updatedData.profilePictureURL = newValues.newProfilePictureURL;

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
        // Reset states as needed

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
      <h2>Update Profile</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Name: <span className="old-value">{formData.name}</span></label>
          <input
            type="text"
            name="newName"
            value={newValues.newName} // Controlled input for new value
            onChange={handleChange}
            placeholder="Enter new name"
            style={getInputStyle('newName')}
          />
        </div>
        <div className="input-container">
          <label>Email: <span className="old-value">{formData.email}</span></label>
          <input
            type="email"
            name="newEmail"
            value={newValues.newEmail} // Controlled input for new value
            onChange={handleChange}
            placeholder="Enter new email"
            style={getInputStyle('newEmail')}
          />
        </div>
        <div className="input-container">
          <label>Mobile Number: <span className="old-value">{formData.mobileNumber}</span></label>
          <input
            type="text"
            name="newMobileNumber"
            value={newValues.newMobileNumber} // Controlled input for new value
            onChange={handleChange}
            placeholder="Enter new mobile number"
            style={getInputStyle('newMobileNumber')}
          />
        </div>
        <div className="input-container">
          <label>Address: <span className="old-value">{formData.address}</span></label>
          <input
            type="text"
            name="newAddress"
            value={newValues.newAddress} // Controlled input for new value
            onChange={handleChange}
            placeholder="Enter new address"
            style={getInputStyle('newAddress')}
          />
        </div>
        <div className="input-container">
          <label>Profile Picture URL: <span className="old-value">{formData.profilePictureURL}</span></label>
          <input
            type="text"
            name="newProfilePictureURL"
            value={newValues.newProfilePictureURL} // Controlled input for new value
            onChange={handleChange}
            placeholder="Enter new profile picture URL"
            style={getInputStyle('newProfilePictureURL')}
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
