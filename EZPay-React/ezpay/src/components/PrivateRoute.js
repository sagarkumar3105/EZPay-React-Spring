import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('customerId') !== null; // Check if the user is logged in
  const isProfileInfoSet = localStorage.getItem('isProfileInfoSet') === 'true'; // Check profile info flag

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isProfileInfoSet) {
    // If the profile info is not set, allow only access to profile update
    if (window.location.pathname !== '/initial-profile-update') {
      alert('Please complete your profile information before proceeding.');
      return <Navigate to="/initial-profile-update" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
