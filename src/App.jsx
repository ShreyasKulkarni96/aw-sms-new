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
    path: '/manage-batch',
    element: <BatchManagement />
  },
  {
    path: '/student-management',
    element: <StudentManagement />
  },
  {
    path: '/add-student'
  },
  {
    path: '/edit-student/:studentId?'
  },
  {
    path: '/program-management',
    element: <ProgramManagement />
  },
  {
    path: '/account-management',
    element: <AccountManagement />
  },
  {
    path: '/academicyear-management',
    element: <AcademicYearManagement />
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
