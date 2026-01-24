import ProtectedRoute from './component/ProtectedRoute';
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
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './context/ToastContext';
import Complaints from './app/student/complaints/Complaints';
import ComplaintDetails from './app/student/complaints/ComplaintDetails';
import StudentForm from './app/admin/StudentForm';
import FacultyList from './app/admin/FacultyList';
import FacultyForm from './app/admin/FacultyForm';
import FacultyDetails from './app/admin/FacultyDetails';
import NoticeList from './app/admin/NoticeList';
import NoticeForm from './app/admin/NoticeForm';
import NoticeDetails from './app/admin/NoticeDetails';
import StudentDetails from './app/admin/StudentDetails';
import AdminDashboard from './app/admin/AdminDashboard';
import ComplaintList from './app/admin/ComplaintList';
import AdminComplaintDetails from './app/admin/ComplaintDetails';

const App = () => {
  return (
    <Router>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route element={<ProtectedRoute allowedRole="student" />}>
            <Route path="/student" element={
              <NotificationProvider>
                <StudentLayout />
              </NotificationProvider>
            }>
              <Route index element={<StudentDashboard />} />
              <Route path="outpass" element={<Outpass />} />
              <Route path="notification" element={<Notification />} />
              <Route path="complaints" element={<Complaints />} />
              <Route path="complaints/:id" element={<ComplaintDetails />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRole="admin" />}>
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
              <Route path="complaints" element={<ComplaintList />} />
              <Route path="complaints/:id" element={<AdminComplaintDetails />} />
            </Route>
          </Route>
        </Routes>
      </ToastProvider>
    </Router>
  );
}

export default App