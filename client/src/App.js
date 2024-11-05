import React from 'react';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import { BrowserRouter as Router, Route,Routes} from 'react-router-dom';
import SignUpPageTeacher from './components/SignUpTeacher';
import LoginPageTeacher from './components/LoginTeacher';
import StudentDashboard from './components/StudentDashboard';
import TeachersDashboard from './components/TeacherDashboard';
import AdminAssignTeacher from './components/Admin';
function App() {
  return (
    <div >
    <Router>
      <Routes>
          <Route path="/" element={<SignUpPage />} /> 
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/faculty" element={<SignUpPageTeacher/>} />
          <Route path="/facultylogin" element={<LoginPageTeacher/>} />
          <Route path="/studentDashboard" element={<StudentDashboard/>} />
          <Route path="/teacherDashboard" element={<TeachersDashboard/>} />
          <Route path="/admin" element={<AdminAssignTeacher/>} />
      </Routes> 
    </Router>
    </div>
  );
}

export default App;
