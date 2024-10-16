import React, { useState } from 'react';
import './SignUpPage.css';
import userIcon from '../images/login_user.svg';
import lockIcon from '../images/Login_password.svg';
import { Link, useNavigate } from 'react-router-dom';
const SignUpPageTeacher = () => {
  const [tid, settid] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  
  const [department, setdepartment] = useState('');  

  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost:5000/faculty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          T_ID: tid,             
          NAME: name,           
          EMAIL: email,         
          PASS: password,      
          DEPT_ID: department   
        }),
      });
  
      if (response.ok) {
        console.log('signed up successfully!');
        navigate('/facultylogin'); // Redirect to login page after successful signup
      } else {
        console.error('Failed to sign up user');
        // Handle error (show error message, etc.)
      }
    } catch (error) {
      console.error('Error signing up user:', error);
      // Handle network error or other exceptions
    }
  };
  

  return (
    <div className="background">
      <div className="container-signup">
        <h2 className="header-signup">Sign Up</h2>
        <div className="inputContainer">
          <input
            type="text"
            placeholder="Tid"
            className="input"
            style={{ backgroundImage: `url(${userIcon})` }}
            value={tid}
            onChange={(e) => settid(e.target.value)}
          />
        </div>
        <div className="inputContainer">
          <input
            type="text"
            placeholder="Full Name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="inputContainer">
          <input
            type="email"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="inputContainer">
          <input
            type="password"
            placeholder="Create Password"
            className="input"
            style={{ backgroundImage: `url(${lockIcon})` }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="inputContainer">
          <input
            type="text"
            placeholder="Department"
            className="input"
            value={department}
            onChange={(e) => setdepartment(e.target.value)}
          />
        </div>
        <button className="Signup-button" onClick={handleSignUp}>
          Sign Up
        </button>
        <p className="loginText">
          Already have an account? <Link to="/loginteacher">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPageTeacher;
