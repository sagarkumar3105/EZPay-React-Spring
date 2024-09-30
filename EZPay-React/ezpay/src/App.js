import './App.css';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Register from './components/Register/Register';
import LoginPage from './components/LoginPage/LoginPage';
import ProfileHome from './components/ProfileHome/ProfileHome';
import InitialProfileUpdatePage from './components/InitialProfileUpdatePage/InitialProfileUpdatePage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import ViewProfile from './components/ViewProfile/ViewProfile';
import PasswordRecovery from './components/PasswordRecovery/PasswordRecovery';
import PasswordReset from './components/PasswordReset/PasswordReset';
import UpdateProfile from './components/UpdateProfile/UpdateProfile'; // Import your Update Profile component
import Dashboard from "./components/Dashboard/Dashboard"
/*
@Author: Sagar Kumar
*/

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
              <Dashboard />
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
              <UpdateProfile />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
