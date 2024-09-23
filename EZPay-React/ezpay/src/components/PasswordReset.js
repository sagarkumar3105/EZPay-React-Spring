import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PasswordReset.css';

const PasswordReset = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isResetting, setIsResetting] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const API_URL = process.env.REACT_APP_SPRING_API_URL;
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token'); // Extract token from URL
    const navigate = useNavigate();

    // Effect to check if the token is present
    useEffect(() => {
        if (!token) {
            const alertUser = async () => {
                alert('Invalid access! Please use the link provided in your email.');
                navigate('/login'); // Redirect after the alert
            };
            alertUser();
        }
    }, [token, navigate]);

    // Validate password for letters, numbers, and special characters
    const validatePassword = (password) => {
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return passwordPattern.test(password);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        // Reset error messages
        setPasswordError('');

        // Validate new password
        if (!validatePassword(newPassword)) {
            setPasswordError("Password must include letters, numbers, and special characters, and be at least 6 characters long.");
            return;
        }
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        setIsResetting(true);
        try {
            const response = await fetch(`${API_URL}/api/password/reset?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data = await response.text();
            setMessage(data);
            alert(data); // Show success message
            navigate('/login'); // Redirect to login after alert
        } catch (error) {
            setMessage(error.message || 'Error occurred while resetting password.');
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <div className='passwordReset'>
            <h2 id="passwordReseth2">Reset Password</h2>
            <form onSubmit={handleResetPassword} id="resetForm">
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />

                {passwordError && <p className="error-message">{passwordError}</p>}
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={isResetting}>
                    {isResetting ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default PasswordReset;
