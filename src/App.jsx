import React from 'react'
import Login from './app/auth/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentLayout from './app/student/student';
import StudentDashboard from './app/student/student dashborad/StudentDashboard';
import Outpass from './app/student/outpass/Outpass';
import AdminLayout from './app/admin/AdminLayout';
import StudentList from './app/admin/StudentList';
import LeaveManagement from './app/admin/LeaveManagement';
import Notification from './app/student/notification/Notification';
import StudentForm from './app/admin/StudentForm';
import FacultyList from './app/admin/FacultyList';
import FacultyForm from './app/admin/FacultyForm';
import FacultyDetails from './app/admin/FacultyDetails';
import NoticeList from './app/admin/NoticeList';
import NoticeForm from './app/admin/NoticeForm';
import NoticeDetails from './app/admin/NoticeDetails';
import StudentDetails from './app/admin/StudentDetails';
import AdminDashboard from './app/admin/AdminDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="outpass" element={<Outpass />} />
          <Route path="notification" element={<Notification />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<StudentList />} />
          <Route path="leave-management" element={<LeaveManagement />} />
          <Route path="create-student" element={<StudentForm />} />
          <Route path="student/view/:id" element={<StudentDetails />} />
          <Route path="student/edit/:id" element={<StudentForm />} />
          <Route path="faculty" element={<FacultyList />} />
          <Route path="create-faculty" element={<FacultyForm />} />
          <Route path="faculty/view/:id" element={<FacultyDetails />} />
          <Route path="faculty/edit/:id" element={<FacultyForm />} />
          <Route path="notices" element={<NoticeList />} />
          <Route path="create-notice" element={<NoticeForm />} />
          <Route path="notices/view/:id" element={<NoticeDetails />} />
          <Route path="notices/edit/:id" element={<NoticeForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App