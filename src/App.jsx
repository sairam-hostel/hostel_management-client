import React from 'react'
import Login from './app/auth/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentLayout from './app/student/student';
import StudentDashboard from './app/student/student dashborad/StudentDashboard';
import Outpass from './app/student/Outpass';
import AdminLayout from './app/admin/AdminLayout';
import StudentList from './app/admin/StudentList';
import LeaveManagement from './app/admin/LeaveManagement';
import StudentForm from './app/admin/StudentForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="outpass" element={<Outpass />} />
        </Route>
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<StudentList />} />
          <Route path="leave-management" element={<LeaveManagement />} />
          <Route path="create-student" element={<StudentForm />} />
          <Route path="student/edit/:id" element={<StudentForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App