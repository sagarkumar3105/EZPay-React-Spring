import React from 'react';
import './ProfileManagementHome.css'; // Import the CSS file specific to the home page

const Home = () => {
  return (
    <div className="home-container">
      <h1>Profile Management</h1>
      <a href="/view-profile" className="button">View Profile</a>
    </div>
  );
};

export default Home;
