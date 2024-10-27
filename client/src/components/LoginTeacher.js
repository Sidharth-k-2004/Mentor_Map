

import React, { useState } from 'react';
import './LoginPage.css';
import userIcon from '../images/login_user.svg';
import lockIcon from '../images/Login_password.svg';
import { Link, useNavigate } from 'react-router-dom';

const LoginPageTeacher = () => {
  const [tid, settid] = useState(''); // Change 'username' to 'srn'
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!tid || !password) {
      setErrorMessage('TID and password are required.');
      return;
    }

    try {
      console.log(tid);
      const response = await fetch('http://localhost:5000/facultylogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tid, password }),
      });

      if (response.ok) {
        console.log('User logged in successfully!');
        navigate('/teacherDashboard');
      } else {
        const message = await response.text(); // Get the error message from the response
        setErrorMessage(message); // Set the error message for display
        console.error('Failed to login user:', message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('Network error, please try again.'); // Update the error message
    }
  };

  return (
    <div className="background">
      <div className="container-login">
        <h2 className="header-login">Login</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
        <div className="inputContainer">
          <input
            type="text"
            placeholder="Faculty ID" // Update placeholder to match the field
            className="input"
            style={{ backgroundImage: `url(${userIcon})` }}
            value={tid}
            onChange={(e) => settid(e.target.value)} // Change here
          />
        </div>
        <div className="inputContainer">
          <input
            type="password"
            placeholder="Password"
            className="input"
            style={{ backgroundImage: `url(${lockIcon})` }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="login-button" onClick={handleLogin}>Login</button>
        <p className="signupText">
          New here? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPageTeacher;

