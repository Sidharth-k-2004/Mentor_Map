// import React, { useState } from 'react';
// import './LoginPage.css';
// import userIcon from '../images/login_user.svg';
// import lockIcon from '../images/Login_password.svg';
// import { Link,useNavigate} from 'react-router-dom';

// const LoginPage = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate=useNavigate();
//   const handleLogin = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password }), // Send username and password as JSON
//       });

//       if (response.ok) {
//         console.log('User logged in successfully!');
//         navigate('/algo');
//       } else {
//         console.error('Failed to login user');
//         // Handle error (show error message, etc.)
//       }
//     } catch (error) {
//       console.error('Error logging in:', error);
//       // Handle network error or other exceptions
//     }
//   };

 

//   return (
//     <div className="background">
//       <div className="container-login">
//         <h2 className="header-login">Login</h2>
//         <div className="inputContainer">
//           <input
//             type="text"
//             placeholder="Username"
//             className="input"
//             style={{ backgroundImage: `url(${userIcon})` }}
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//         </div>
//         <div className="inputContainer">
//           <input
//             type="password"
//             placeholder="Password"
//             className="input"
//             style={{ backgroundImage: `url(${lockIcon})` }}
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         <button className="login-button" onClick={handleLogin}>Login</button>
//         <p className="signupText">
//           New here?
//           <Link to="/signup">SignUp</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


import React, { useState } from 'react';
import './LoginPage.css';
import userIcon from '../images/login_user.svg';
import lockIcon from '../images/Login_password.svg';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [srn, setSrn] = useState(''); // Change 'username' to 'srn'
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!srn || !password) {
      setErrorMessage('SRN and password are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ srn, password }), // Send srn and password as JSON
      });

      if (response.ok) {
        console.log('User logged in successfully!');
        navigate('/studentDashboard');
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
            placeholder="SRN" // Update placeholder to match the field
            className="input"
            style={{ backgroundImage: `url(${userIcon})` }}
            value={srn}
            onChange={(e) => setSrn(e.target.value)} // Change here
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

export default LoginPage;

