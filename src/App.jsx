import React from 'react'
import Login from './app/auth/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentLayout from './app/student/student';
import StudentDashboard from './app/student/student dashborad/StudentDashboard';
import Outpass from './app/student/Outpass';
import AdminDashboard from './app/admin/AdminDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="outpass" element={<Outpass />} />
        </Route>
        
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App