import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProfileUpdate.css';

const ProfileUpdate = () => {
  const { customerId } = useParams(); 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    address: '',
    ifscCode: '',
    accNo: '',
  });
  const [errors, setErrors] = useState({}); // For validation errors
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState({}); // For showing popups next to inputs
  const [lastUpdatedData, setLastUpdatedData] = useState({});
  const navigate = useNavigate();

  // Fetch customer data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8094/customers/by-id/${customerId}`);
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
          setLastUpdatedData(data);
        } else {
          console.error('Failed to fetch customer data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [customerId]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Hide popup when user starts editing
    setShowPopup({ ...showPopup, [e.target.name]: false });
  };
  /**Author:Sandarbha Komujwar
     Date:20/09/2024
     Validation function
  **/
  const validate = () => {
    let formErrors = {};
    let popupErrors = {};

  /**    Validate name: it should not be empty or contain numbers
   - The name field is required.
   - The name can only contain letters and spaces (no numbers or special characters).
   */
    if (!formData.name.trim()) {
      formErrors.name = "Name is required";
      popupErrors.name = true;
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      formErrors.name = "Name must contain only letters";
      popupErrors.name = true;
    }

    /**  Validate email: should not be empty or invalid
         - The email field is required.
         - The email should follow the correct email format (e.g., user@example.com).
    */
    if (!formData.email.trim()) {
      formErrors.email = "Email is required";
      popupErrors.email = true;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      formErrors.email = "Valid email is required";
      popupErrors.email = true;
    }

    /**  Validate mobile number: should not be empty or invalid
       - The mobile number field is required.
        - The mobile number must contain exactly 10 digits.
    */

    if (!formData.mobileNumber.trim()) {
      formErrors.mobileNumber = "Mobile number is required";
      popupErrors.mobileNumber = true;
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      formErrors.mobileNumber = "Mobile number must be exactly 10 digits";
      popupErrors.mobileNumber = true;
    }

  // Validate address: should not be empty
  // - The address field is required.
    if (!formData.address.trim()) {
      formErrors.address = "Address is required";
      popupErrors.address = true;
    }

    /**
    Validate IFSC code with different error messages for format issues
        - The IFSC code field is required.
        - The IFSC code must be exactly 11 characters long.
        - The IFSC code format must follow 'AAAA0XXXXXX' where 'A' is a letter, '0' is a mandatory digit, and 'X' is a number.
      */

      if (!formData.ifscCode.trim()) {
      formErrors.ifscCode = "IFSC Code is required";
      popupErrors.ifscCode = true;
    } else if (formData.ifscCode.length !== 11) {
      formErrors.ifscCode = "IFSC Code must be exactly 11 characters";
      popupErrors.ifscCode = true;
    } else if (!/^[A-Z]{4}0\d{6}$/.test(formData.ifscCode)) {
      formErrors.ifscCode = "IFSC Code must be in the format 'AAAA0XXXXXX'";
      popupErrors.ifscCode = true;
    }
 /** Validate account number: should not be empty, too short, non-numeric, or exceed 17 digits
   - The account number field is required.
   - The account number must be at least 8 characters long and only contain digits.
   - The account number must not exceed 17 digits.
*/ 
if (!formData.accNo.trim()) {
  formErrors.accNo = "Account number is required";
  popupErrors.accNo = true;
} else if (!/^\d+$/.test(formData.accNo)) {
  formErrors.accNo = "Account number must be numeric only";
  popupErrors.accNo = true;
} else if (formData.accNo.length < 8) {
  formErrors.accNo = "Account number must be at least 8 digits";
  popupErrors.accNo = true;
} else if (formData.accNo.length > 17) {
  formErrors.accNo = "Account number must not exceed 17 digits";
  popupErrors.accNo = true;
}


    setErrors(formErrors);  // Store validation errors
    setShowPopup(popupErrors); // Show or hide popups based on validation status
    return Object.keys(formErrors).length === 0; // Return true if no errors, else false
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check validation
    if (!validate()) {
      setMessage('Please fix the validation errors.');
      return;
    }

    if (JSON.stringify(formData) === JSON.stringify(lastUpdatedData)) {
      setMessage('Profile has already been updated');
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append('name', formData.name || lastUpdatedData.name);
    formDataObj.append('email', formData.email || lastUpdatedData.email);
    formDataObj.append('mobileNumber', formData.mobileNumber || lastUpdatedData.mobileNumber);
    formDataObj.append('address', formData.address || lastUpdatedData.address);
    formDataObj.append('ifscCode', formData.ifscCode || lastUpdatedData.ifscCode);
    formDataObj.append('accNo', formData.accNo || lastUpdatedData.accNo);

    const response = await fetch(`http://localhost:8094/customers/update`, {
      method: 'PUT',
      headers: {
        'customerId': customerId,
      },
      body: formDataObj,
    });

    if (response.ok) {
      setMessage('Profile updated successfully!');
      setLastUpdatedData(formData); // Update the lastUpdatedData
    } else {
      setMessage('Failed to update profile');
    }
  };

  return (
    <div className="container">
      <h2>Update Profile</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          {showPopup.name && <div className="popup-box">{errors.name}</div>}
        </div>
        <div className="input-container">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {showPopup.email && <div className="popup-box">{errors.email}</div>}
        </div>
        <div className="input-container">
          <label>Mobile Number</label>
          <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
          {showPopup.mobileNumber && <div className="popup-box">{errors.mobileNumber}</div>}
        </div>
        <div className="input-container">
          <label>Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
          {showPopup.address && <div className="popup-box">{errors.address}</div>}
        </div>
        <div className="input-container">
          <label>IFSC Code</label>
          <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
          {showPopup.ifscCode && <div className="popup-box">{errors.ifscCode}</div>}
        </div>
        <div className="input-container">
          <label>Account Number</label>
          <input type="text" name="accNo" value={formData.accNo} onChange={handleChange} />
          {showPopup.accNo && <div className="popup-box">{errors.accNo}</div>}
        </div>

        <button className="button" type="submit" onClick={() => navigate('/')}>
          Update Details
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdate;
