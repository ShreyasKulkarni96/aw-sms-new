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
import LeaveManagement from "./pages/LeaveManagement";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/campus-management',
    element: <CampusManagement />
  },
  {
    path: '/add-campus',
    element: <AddCampus />
  },
  {
    path: '/edit-campus/:campusId?'
  },
  {
    path: '/faculty-management',
    element: <FacultyManagement />
  },
  {
    path: '/manage-batch',
    element: <BatchManagement />
  },
  {
    path: '/student-management',
    element: <StudentManagement />
  },
  {
    path: '/add-student',
    element: <AddStudent />
  },
  {
    path: '/edit-student/:studentId?'
  },
  {
    path: '/program-management',
    element: <ProgramManagement />
  },
  {
    path: '/course-management',
    element: <CourseManagement />
  },
  {
    path: '/session-management',
    element: <SessionManagement />
  },
  {
    path: '/topic-management',
    element: <TopicManagement />
  },
  {
    path: '/account-management',
    element: <AccountManagement />
  },
  {
    path: '/academicyear-management',
    element: <AcademicYearManagement />
  },
  {
    path: '/leave-management',
    element: <LeaveManagement />
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
