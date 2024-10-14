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
    path: "/reports",
    element: (
      <PrivateRoute role={["ADMIN", "SUPER_ADMIN", "STAFF", "FACULTY", "STUDENT"]}>
        <Reports />
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
