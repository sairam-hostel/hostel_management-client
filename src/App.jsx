import React from 'react'
import Login from './app/auth/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentDashboard from './app/student/StudentDashboard';
import AdminDashboard from './app/admin/AdminDashboard';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/student" element={<StudentDashboard />} />

        
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App