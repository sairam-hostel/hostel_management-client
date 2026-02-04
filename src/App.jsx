import ProtectedRoute from './component/ProtectedRoute';
import React from 'react'
import Login from './app/auth/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentLayout from './app/student/student';
import StudentDashboard from './app/student/student dashborad/StudentDashboard';
import Outpass from "./app/student/requests/outpass/Outpass";
import OutpassForm from "./app/student/requests/outpass/OutpassForm";
import OutpassDetails from "./app/student/requests/outpass/OutpassDetails";
import MessCount from './app/student/requests/mess/MessCount';
import Request from './app/student/requests/Request';
import AdminLayout from './app/admin/AdminLayout';
import StudentList from './app/admin/students/StudentList';
import LeaveManagement from './app/admin/leave-management/LeaveManagement';
import Notification from './app/student/notification/Notification';
import NotificationDetails from './app/student/notification/NotificationDetails';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Complaints from './app/student/complaints/Complaints';
import ComplaintDetails from './app/student/complaints/ComplaintDetails';
import StudentForm from './app/admin/students/StudentForm';
import FacultyList from './app/admin/faculty/FacultyList';
import FacultyForm from './app/admin/faculty/FacultyForm';
import FacultyDetails from './app/admin/faculty/FacultyDetails';
import NoticeList from './app/admin/notices/NoticeList';
import NoticeForm from './app/admin/notices/NoticeForm';
import NoticeDetails from './app/admin/notices/NoticeDetails';
import StudentDetails from './app/admin/students/StudentDetails';
import AdminDashboard from './app/admin/dashboard/AdminDashboard';
import ComplaintList from './app/admin/complaints/ComplaintList';
import AdminComplaintDetails from './app/admin/complaints/ComplaintDetails';
import Settings from './app/admin/settings/Settings';
import Personalisation from './app/admin/settings/Personalisation';
import Security from './app/admin/settings/Security';
import Rules from './app/admin/settings/Rules';
import Profile from './app/admin/profile/Profile';

const App = () => {
  return (
    <Router>
      <ThemeProvider>
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
              <Route path="outpass/apply" element={<OutpassForm />} />
              <Route path="outpass/:id" element={<OutpassDetails />} />
              <Route path="requests" element={<Request />} />
              <Route path="mess-count" element={<MessCount />} />
              <Route path="notification" element={<Notification />} />
              <Route path="notification/:id" element={<NotificationDetails />} />
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
              <Route path="settings" element={<Settings />} />
              <Route path="settings/personalisation" element={<Personalisation />} />
              <Route path="settings/security" element={<Security />} />
              <Route path="settings/rules" element={<Rules />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
          </Routes>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App