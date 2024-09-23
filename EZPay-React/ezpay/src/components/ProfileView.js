import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import '../css/ProfileUpdate.css'; 

const ProfileView = () => {
  const [customerId, setCustomerId] = useState('');
  const [profile, setProfile] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [message, setMessage] = useState(''); 
  const [error, setError] = useState(''); // State to store validation errors
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility for validation errors
  const navigate = useNavigate(); // Hook to navigate between routes
  /**Author: Sandarbha Komujwar
     Date: 20/09/2024
     Validation function
     */
  const validateCustomerId = () => {
    // Validate if the customer ID is not empty and contains only digits
    if (!customerId.trim()) {
      setError('Customer ID cannot be empty.'); // Set error message for empty input
      setShowPopup(true); // Show popup if validation fails
      return false; // Return false to indicate failed validation
    }

    // Ensure customer ID is a valid number (adjust according to required format)
    if (!/^\d+$/.test(customerId)) {
      setError('Customer ID should contain only numbers.'); // Set error message for invalid format
      setShowPopup(true); // Show popup if validation fails
      return false; // Return false to indicate failed validation
    }

    // Clear error state if validation passes
    setError('');
    setShowPopup(false); // Hide popup if no validation errors
    return true; // Return true to indicate successful validation
  };

  const fetchProfile = async () => {
    // Run validation before attempting to fetch profile
    if (!validateCustomerId()) {
      return; // Stop execution if validation fails
    }

    setLoading(true); // Set loading state to true while fetching data
    setMessage(''); // Clear any previous success/error messages

    try {
      // Assuming the use of an authorization token, else remove 'Authorization' header if not needed
      const response = await fetch(`http://localhost:8094/customers/by-id/${customerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-auth-token-here' // Replace with actual token if needed
        }
      });

      // Check if the response is successful (status code 200)
      if (response.ok) {
        const data = await response.json(); // Parse the JSON response data
        if (Object.keys(data).length === 0) {
          setMessage('Customer ID does not exist.'); // Set message if no customer is found
          setProfile(null); // Clear profile data if customer doesn't exist
        } else {
          setProfile(data); // Set profile data if customer is found
        }
      } else {
        setMessage('Failed to fetch profile.'); // Set message if request fails
      }
    } catch (error) {
      // Handle any errors that occur during fetch
      console.error('Error fetching profile:', error);
      setMessage('Error fetching profile. Please try again later.'); // Display generic error message
    }

    setLoading(false); // Set loading state to false once fetching is complete
  };

  return (
    <div className="container">
      <h1>View Profile</h1> {/* Title for the page */}
      
      {/* Input field for Customer ID */}
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Customer ID" // Placeholder text for input field
          value={customerId} // Controlled component bound to customerId state
          onChange={(e) => setCustomerId(e.target.value)} // Update state on input change
          style={{ width: '400px', padding: '10px', marginBottom: '20px' }} // Inline styling for input field
          onFocus={() => setShowPopup(false)} // Hide popup on focus to reset error state
        />
        
        {/* Popup for error message */}
        {showPopup && (
          <div className="popup-boxx">
            {error} {/* Display validation error message */}
          </div>
        )}
      </div>

      {/* Fetch Profile button */}
      <button className="fetch-btn" onClick={fetchProfile}>
        Fetch Profile
      </button>

      {/* Display success/error message */}
      {message && <div className="message-error">{message}</div>} {/* Show message if available */}
      {loading && <p>Loading...</p>} {/* Show loading text if loading state is true */}

      {/* Display profile information if available */}
      {profile && (
        <div className="profile-info">
          <p><strong>Name:</strong> {profile.name}</p> {/* Display Name */}
          <p><strong>Email:</strong> {profile.email}</p> {/* Display Email */}
          <p><strong>Mobile Number:</strong> {profile.mobileNumber}</p> {/* Display Mobile Number */}
          <p><strong>Address:</strong> {profile.address}</p> {/* Display Address */}
          <p><strong>IFSC Code:</strong> {profile.ifscCode}</p> {/* Display IFSC Code */}
          <p><strong>Account Number:</strong> {profile.accNo}</p> {/* Display Account Number */}
          <p><strong>Date of Birth:</strong> {profile.dob}</p> {/* Display Date of Birth */}
          <p><strong>Gender:</strong> {profile.gender}</p> {/* Display Gender */}

          {/* Button to update profile */}
          <button className="update-btn" onClick={() => navigate(`/update-profile/${customerId}`)}>
            Update Profile
          </button>
        </div>
      )}

      {/* Back button to navigate to the previous page */}
      {message && (
        <div className="back-btn-container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
