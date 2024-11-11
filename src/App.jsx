import React from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from '../src/pages/Auth/Login';
import Otp from '../src/pages/Auth/Otp';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from './routes/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import ForgotPassword from './pages/Auth/ForgotPassword';
import CampusManagement from './pages/CampusManagement/CampusManagement';
import AcademicYearManagement from './pages/AcademicYearManagement';
import AddCampus from './pages/CampusManagement/AddCampus';
import UpdateCampus from './pages/CampusManagement/UpdateCampus';
import ProgramManagement from './pages/ProgramManagement/ProgramManagement';
import CourseManagement from './pages/ProgramManagement/CourseManagement';
import SessionManagement from './pages/ProgramManagement/SessionManagement';
import TopicManagement from './pages/ProgramManagement/TopicManagement';
import BatchManagement from './pages/BatchManagement';
import StudentManagement from './pages/StudentManagement/StudentManagement';
import AddStudent from './pages/StudentManagement/AddStudent';
import UpdateStudent from './pages/StudentManagement/UpdateStudent';
import AddFaculty from "./pages/FacultyManagement/AddFaculty";
import FacultyExperience from "./pages/FacultyManagement/FacultyExperience";
import UpdateFaculty from "./pages/FacultyManagement/UpdateFaculty";
import FacultyManagement from "./pages/FacultyManagement/FacultyManagement";
import LeaveManagement from './pages/LeaveManagement';
import AccountManagement from './pages/AccountManagement';
import ScheduleManagement from './pages/ScheduleManagement';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/otp",
    element: <Otp />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute role={["ADMIN", "SUPER_ADMIN", "STAFF", "FACULTY", "STUDENT"]}>
        <Dashboard />
      </PrivateRoute>
    )
  },
  {
    path: "/student-management",
    element: (
      <PrivateRoute role={["ADMIN", "SUPER_ADMIN", "STAFF"]}>
        <StudentManagement />
      </PrivateRoute>
    ),
  },
  {
    path: "/add-student",
    element: (
      <PrivateRoute role={["ADMIN", "SUPER_ADMIN", "STAFF"]}>
        <AddStudent />
      </PrivateRoute>
    ),
  },
  {
    path: "/edit-student/:studentId?",
    element: (
      <PrivateRoute role={["ADMIN", "SUPER_ADMIN", "STAFF"]}>
        <UpdateStudent />
      </PrivateRoute>
    ),
  },
  {
    path: "/manage-batch",
    element: (
      <PrivateRoute role={["ADMIN", "SUPER_ADMIN", "STAFF"]}>
        <BatchManagement />
      </PrivateRoute>
    ),
  },
  {
    path: "/campus-management",
    element: (
      <PrivateRoute role={["ADMIN", "SUPER_ADMIN"]}>
        <CampusManagement />
      </PrivateRoute>
    )
  },
  {
    path: "/add-campus",
    element: (
      <PrivateRoute role={["SUPER_ADMIN"]}>
        <AddCampus />
      </PrivateRoute>
    )
  },
  {
    path: "/update-campus/:campusId?",
    element: (
      <PrivateRoute role={["SUPER_ADMIN"]}>
        <UpdateCampus />
      </PrivateRoute>
    )
  },
  {
    path: "/program-management",
    element: (
      <PrivateRoute role={["SUPER_ADMIN"]}>
        <ProgramManagement />
      </PrivateRoute>
    ),
  },
  {
    path: "/course-management",
    element: (
      <PrivateRoute role={["ADMIN", "SUPER_ADMIN"]}>
        <CourseManagement />
      </PrivateRoute>
    ),
  },
  {
    path: "/session-management",
    element: (
      <PrivateRoute role={["ADMIN", "SUPER_ADMIN"]}>
        <SessionManagement />
      </PrivateRoute>
    ),
  },
  {
    path: "/topic-management",
    element: (
      <PrivateRoute role={["ADMIN", "SUPER_ADMIN"]}>
        <TopicManagement />
      </PrivateRoute>
    ),
  },
  {
    path: "/faculty-management",
    element: (
      <PrivateRoute role={["ADMIN", "SUPER_ADMIN"]}>
        <FacultyManagement />
      </PrivateRoute>
    ),
  },
  {
    path: "/add-faculty",
    element: (
      <PrivateRoute role={["ADMIN", "SUPER_ADMIN"]}>
        <AddFaculty />
      </PrivateRoute>
    ),
  },
  {
    path: "/faculty-experience/:facultyId/:facultyName",
    element: (
      <PrivateRoute role={["ADMIN", "SUPER_ADMIN"]}>
        <FacultyExperience />
      </PrivateRoute>
    ),
  },
  {
    path: "/edit-faculty/:facultyId?",
    element: (
      <PrivateRoute role={["ADMIN", "SUPER_ADMIN"]}>
        <UpdateFaculty />
      </PrivateRoute>
    ),
  },
  {
    path: "/reports",
    element: (
      <PrivateRoute role={["ADMIN", "SUPER_ADMIN", "STAFF", "FACULTY"]}>
        <Reports />
      </PrivateRoute>
    )
  },
  {
    path: "/schedule-management",
    element: (
      <PrivateRoute role={["ADMIN", "SUPER_ADMIN", "STAFF"]}>
        <ScheduleManagement />
      </PrivateRoute>
    ),
  },
  {
    path: "/account-management",
    element: (
      <PrivateRoute role={["ADMIN", "SUPER_ADMIN", "STAFF"]}>
        <AccountManagement />
      </PrivateRoute>
    ),
  },
  {
    path: "/leave-management",
    element: (
      <PrivateRoute role={["ADMIN", "SUPER_ADMIN", "STAFF", "STUDENT"]}>
        <LeaveManagement />
      </PrivateRoute>
    )
  },
  {
    path: "/academicyear-management",
    element: (
      <PrivateRoute role={["ADMIN", "SUPER_ADMIN", "STAFF", "FACULTY"]}>
        <AcademicYearManagement />
      </PrivateRoute>
    )
  },
  {
    path: '/reset-password',
    element: <ForgotPassword />
  },

]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
