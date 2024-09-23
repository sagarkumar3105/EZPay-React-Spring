import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import LoginPage from './components/LoginPage';
import ProfileHome from './components/ProfileHome';
import InitialProfileUpdatePage from './components/InitialProfileUpdatePage';
import PrivateRoute from './components/PrivateRoute';
import ViewProfile from './components/ViewProfile';
import PasswordRecovery from './components/PasswordRecovery';
import PasswordReset from './components/PasswordReset';
import ProfileUpdate from './components/ProfileUpdate'; // Import your Update Profile component

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Password Recovery and Reset Routes */}
          <Route path="/password/forgot" element={<PasswordRecovery />} />
          <Route path="/password/reset" element={<PasswordReset />} />

          {/* Protected Route */}
          <Route path="/profileHome" element={
            <PrivateRoute>
              <ProfileHome />
            </PrivateRoute>
          } />

          <Route path="/initial-profile-update" element={
            <PrivateRoute>
              <InitialProfileUpdatePage />
            </PrivateRoute>
          } />

          <Route path="/view-profile" element={
            <PrivateRoute>
              <ViewProfile />
            </PrivateRoute>
          } />

          {/* Add the new Update Profile route here */}
          <Route path="/update-profile" element={
            <PrivateRoute>
              <ProfileUpdate />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
