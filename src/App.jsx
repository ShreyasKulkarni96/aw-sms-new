import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import Error from "./pages/Error";
import React from "react"
import AcademicYearManagement from "./pages/AcademicYearManagement"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from './pages/Auth/Login';
import Dashboard from "./pages/Dashboard";
import CampusManagement from "./pages/CampusManagement/CampusManagement";
import AddCampus from "./pages/CampusManagement/AddCampus";
import AccountManagement from "./pages/AccountManagement";
import ProgramManagement from "./pages/ProgramManagement/ProgramManagement";
import StudentManagement from "./pages/StudentManagement/StudentManagement";
import BatchManagement from "./pages/BatchManagement";
import FacultyManagement from "./pages/FacultyManagement/FacultyManagement";
import AddStudent from "./pages/StudentManagement/AddStudent";
import CourseManagement from "./pages/ProgramManagement/CourseManagement";
import SessionManagement from "./pages/ProgramManagement/SessionManagement";
import TopicManagement from "./pages/ProgramManagement/TopicManagement";
import ScheduleManagement from "./pages/ScheduleManagement";
import AddFaculty from "./pages/FacultyManagement/AddFaculty";
import FacultyExperience from "./pages/FacultyManagement/FacultyExperience";
import UpdateStudent from "./pages/StudentManagement/UpdateStudent";
import UpdateFaculty from "./pages/FacultyManagement/UpdateFaculty";
import LeaveManagement from "./pages/LeaveManagement/LeaveManagement";
import UpdateCampus from "./pages/CampusManagement/UpdateCampus";


const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <PrivateRoute role={["ADMIN", "SUPER_ADMIN", "STAFF", "FACULTY", "STUDENT"]} ><Dashboard /></PrivateRoute>
  },
  {
    path: '/student-management',
    element: <PrivateRoute role={["ADMIN", "SUPER_ADMIN", "STAFF"]} ><StudentManagement /></PrivateRoute>
  },
  {
    path: '/add-student',
    element: <PrivateRoute role={["ADMIN", "SUPER_ADMIN", "STAFF"]} ><AddStudent /></PrivateRoute>
  },
  {
    path: "/edit-student/:studentId?",
    element: <PrivateRoute role={["ADMIN", "SUPER_ADMIN", "STAFF"]} ><UpdateStudent /></PrivateRoute>
  },
  {
    path: '/manage-batch',
    element: <PrivateRoute role={["ADMIN", "SUPER_ADMIN", "STAFF"]} ><BatchManagement /></PrivateRoute>
  },
  {
    path: '/campus-management',
    element: <PrivateRoute role={["SUPER_ADMIN"]} ><CampusManagement /></PrivateRoute>
  },
  {
    path: '/add-campus',
    element: <PrivateRoute role={["SUPER_ADMIN"]} ><AddCampus /></PrivateRoute>
  },
  {
    path: '/edit-campus/:campusId?',
    element: <PrivateRoute role={["SUPER_ADMIN"]} ><UpdateCampus /></PrivateRoute>
  },
  {
    path: '/program-management',
    element: <PrivateRoute role={["SUPER_ADMIN"]} ><ProgramManagement /></PrivateRoute>
  },
  {
    path: '/course-management',
    element: <PrivateRoute role={["ADMIN", "SUPER_ADMIN"]} ><CourseManagement /></PrivateRoute>
  },
  {
    path: '/session-management',
    element: <PrivateRoute role={["ADMIN", "SUPER_ADMIN"]} ><SessionManagement /></PrivateRoute>
  },
  {
    path: '/topic-management',
    element: <PrivateRoute role={["ADMIN", "SUPER_ADMIN"]} ><TopicManagement /></PrivateRoute>
  },
  {
    path: '/faculty-management',
    element: <PrivateRoute role={["ADMIN", "SUPER_ADMIN"]} ><FacultyManagement /></PrivateRoute>
  },
  {
    path: '/add-faculty',
    element: <PrivateRoute role={["ADMIN", "SUPER_ADMIN"]} ><AddFaculty /></PrivateRoute>
  },
  {
    path: '/faculty-experience/:facultyId/:facultyName',
    element: <PrivateRoute role={["ADMIN", "SUPER_ADMIN"]} ><FacultyExperience /></PrivateRoute>
  },
  {
    path: "/edit-faculty/:facultyId?",
    element: <PrivateRoute role={["ADMIN", "SUPER_ADMIN"]} ><UpdateFaculty /></PrivateRoute>
  },
  {
    path: '/account-management',
    element: <PrivateRoute role={["ADMIN", "SUPER_ADMIN", "STAFF"]} ><AccountManagement /></PrivateRoute>
  },
  {
    path: '/academicyear-management',
    element: <PrivateRoute role={["ADMIN", "SUPER_ADMIN", "STAFF"]} ><AcademicYearManagement /></PrivateRoute>
  },
  {
    path: '/schedule-management',
    element: <PrivateRoute role={["ADMIN", "SUPER_ADMIN", "STAFF"]} ><ScheduleManagement /></PrivateRoute>
  },
  {
    path: '/leave-management',
    element: <PrivateRoute role={["ADMIN", "SUPER_ADMIN", "STAFF", "STUDENT"]} ><LeaveManagement /></PrivateRoute>
  }
])

function App() {

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}

export default App

