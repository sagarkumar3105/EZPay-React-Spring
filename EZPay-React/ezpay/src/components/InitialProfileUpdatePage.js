import "./InitialProfileUpdatePage.css";
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

export default function InitialProfileUpdatePage(){

      
    const [profileData, setProfileData] = useState({
        customerId: localStorage.getItem("customerId"),
        name: '',
        email: '',
        mobileNumber: '',
        address: '',
        dob: '',
        gender: '',
        profilePictureUrl: '',
        bankAccountNumber: '',
        ifscCode: '',
        accountType: ''
      });
      const navigate = useNavigate();
      
      const handleChange = (e) => {
        setProfileData({
          ...profileData,
          [e.target.name]: e.target.value
        });
      };

      const handleSubmit = async (e) => {
        console.log(profileData)
        e.preventDefault();
    
        
        const response = await fetch('http://localhost:8005/api/add-profile-details', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
          });
    
          if (response.ok) {
            alert('Profile updated successfully');
            navigate('/profileHome'); // Redirect to profile page after successful update
          } else {
            const errorMsg = await response.text();
            alert('Profile update failed: ' + errorMsg);
            console.log(profileData);
          }
        };
    
   return(
    <>
    <h1>Complete Your Profile</h1>
    <div className="profile-update-container">
    
    <form onSubmit={handleSubmit} className="profile-update-form">
        <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
            type="text"
            id="name"
            name="name"
            value={profileData.name}
            onChange={handleChange}
            required
        />
        </div>

        <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
            type="email"
            id="email"
            name="email"
            value={profileData.email}
            onChange={handleChange}
            required
        />
        </div>

        <div className="form-group">
        <label htmlFor="mobileNumber">Mobile Number:</label>
        <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            value={profileData.mobileNumber}
            onChange={handleChange}
            required
        />
        </div>

        <div className="form-group">
        <label htmlFor="address">Address:</label>
        <input
            type="text"
            id="address"
            name="address"
            value={profileData.address}
            onChange={handleChange} />
        </div>

        <div className="form-group">
        <label htmlFor="dateOfBirth">Date of Birth (dd-mm-yyyy):</label>
        <input
            type="date"
            id="dateOfBirth"
            name="dob"
            value={profileData.dob}
            onChange={handleChange}
            required
        />
        </div>

        <div className="form-group">
        <label htmlFor="gender">Gender:</label>
        <select
            id="gender"
            name="gender"
            value={profileData.gender}
            onChange={handleChange}
            required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
        </select>
        </div>

        <div className="form-group">
        <label htmlFor="profilePictureUrl">Profile Picture URL:</label>
        <input
            type="url"
            id="profilePictureUrl"
            name="profilePictureUrl"
            value={profileData.profilePictureUrl}
            onChange={handleChange} />
        </div>

        <div className="form-group">
        <label htmlFor="bankAccountNumber">Bank Account Number:</label>
        <input
            type="text"
            id="bankAccountNumber"
            name="bankAccountNumber"
            value={profileData.bankAccountNumber}
            onChange={handleChange}
            required />
        </div>

        <div className="form-group">
        <label htmlFor="ifscCode">IFSC Code:</label>
        <input
            type="text"
            id="ifscCode"
            name="ifscCode"
            value={profileData.ifscCode}
            onChange={handleChange}
            required/>
        </div>

        <div className="form-group">
        <label htmlFor="accountType">Account Type:</label>
        <select
            id="accountType"
            name="accountType"
            value={profileData.accountType}
            onChange={handleChange}
            required>
            <option value="">Select Account Type</option>
            <option value="1">Savings</option>
            <option value="2">Current</option>
        </select>
        </div>

        <button type="submit" className="submit-button">
        Update Profile
        </button>
    </form>
    </div>
    </>
 );
}