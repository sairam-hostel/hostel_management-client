import React from 'react'
import Login from './app/auth/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentDashboard from './app/Home/student_dashboard/StudentDashboard';
import AdminDashboard from './app/Home/admin_dashboard/AdminDashboard';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/student/dashboard" element={<StudentDashboard />} />

        
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App