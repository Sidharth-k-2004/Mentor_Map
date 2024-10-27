import React, { useState } from 'react';
import './SignUpPage.css';
import userIcon from '../images/login_user.svg';
import lockIcon from '../images/Login_password.svg';
import { Link, useNavigate } from 'react-router-dom';
const SignUpPage = () => {
  const [srn, setSrn] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [password, setPassword] = useState('');  
  const [department, setdepartment] = useState('');  

  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SRN: srn,             // SRN field for student table
          NAME: name,           // NAME field for student table
          CLASS: studentClass,  // CLASS field for student table
          EMAIL: email,         // EMAIL field for student table
          PASS: password,       // PASS field for student table
          DEPT_ID: department   // DEPT_ID field for student table
        }),
      });
  
      if (response.ok) {
        console.log('User signed up successfully!');
        navigate('/login'); // Redirect to login page after successful signup
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
            placeholder="SRN"
            className="input"
            style={{ backgroundImage: `url(${userIcon})` }}
            value={srn}
            onChange={(e) => setSrn(e.target.value)}
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
            type="text"
            placeholder="Class"
            className="input"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
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
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
