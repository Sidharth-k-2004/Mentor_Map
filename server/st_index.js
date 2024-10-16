import React from 'react';
import ReactDOM from 'react-dom/client';
import './Student_Dash.css'; // Use the renamed CSS file
import StudentDashboard from './Student_Dash'; // Use the renamed JS file

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StudentDashboard />
  </React.StrictMode>
);
