import React from 'react';
import '../css/Home.css'; // Import the CSS file specific to the home page

const Home_profile = () => {
  return (
    <div className="home-container">
      <h1>Profile Management</h1>
      <a href="/view-profile" className="button">View Profile</a>
    </div>
  );
};

export default Home_profile;
