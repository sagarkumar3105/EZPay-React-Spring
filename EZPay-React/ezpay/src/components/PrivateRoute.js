
import React from 'react';
import { Navigate } from 'react-router-dom';

// This component will wrap around protected routes
const PrivateRoute = ({ children }) => {
  const customerId = localStorage.getItem('customerId');

  return customerId ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
