import React, { useState, useEffect } from 'react';
import './PasswordRecovery.css';
import { useNavigate } from 'react-router-dom';

const PasswordRecovery = () => {
    const [emailOrMobile, setEmailOrMobile] = useState('');
    const [newEmailOrMobile, setNewEmailOrMobile] = useState('');
    const [message, setMessage] = useState('');
    const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
    const [isRequestDisabled, setIsRequestDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0); // Countdown timer in seconds
    const API_URL = process.env.REACT_APP_SPRING_API_URL;

    const navigate = useNavigate();
    const [error,setError]=useState('');

const validateEmail=(email)=>{
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    }
    const handleChange = (e) => {
        const { value } = e.target;
        setEmailOrMobile(value);

        if (validateEmail(value)) {
            setError('');
        } else {
            setError('Please enter a valid email address');
        }
    };


    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/password/forgot?emailOrMobile=${encodeURIComponent(emailOrMobile)}`, {
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
            setIsEmailSubmitted(true);
            setIsRequestDisabled(true); // Disable the button after sending
        } catch (error) {
            setMessage(error.message || 'Error occurred while requesting password reset.');
        }
    };

    const handleSendResetLink = () => {
        if (isEmailSubmitted) {
            alert('Please check your inbox! A reset link will be sent again in 10 minutes');
            setCountdown(600); // Set countdown to 10 minutes (600 seconds)
        }
    };

    const handleChangeEmailOrMobile = () => {
        setEmailOrMobile(newEmailOrMobile);
        setNewEmailOrMobile(''); // Clear new input
        setIsEmailSubmitted(false); // Reset email submitted status
        setIsRequestDisabled(false); // Enable request button
        setMessage(''); // Clear message
        setCountdown(0); // Reset countdown
    };

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (countdown === 0 && isEmailSubmitted) {
            // Automatically send the reset link again after countdown expires
            handleForgotPassword(new Event('submit')); // Simulate a form submission
        }
        return () => clearInterval(timer); // Cleanup the timer on component unmount
    }, [countdown, isEmailSubmitted]);

    return (
        <div className='passwordRecovery'>
            <h2 id="passwordRecoveryh2">Password Recovery</h2>
            <form onSubmit={handleForgotPassword} id="recoveryForm">
                <h3 id="passwordRecoveryh3">{isEmailSubmitted ? 'Email Sent!' : 'Request Password Reset'}</h3>
                <input
                    type="text"
                    placeholder="Email or Mobile Number"
                    value={emailOrMobile}
                    onChange={handleChange}
                    required
                />
                <button type="submit" disabled={isRequestDisabled}>
                    Request Reset
                </button>
                {isEmailSubmitted && (
                    <div>
                        <p>Please check your email for a password reset link.</p>
                        <button onClick={handleSendResetLink}>Send Reset Link</button>
                        {countdown > 0 && (
                            <p>Time remaining: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</p>
                        )}
                    <button type="button" onClick={handleChangeEmailOrMobile}>
                        Change Email or Mobile Number
                    </button>
                </div>
                )}
            </form>
            {message && <p id='message'>{message}</p>}
        </div>
    );
};

export default PasswordRecovery;