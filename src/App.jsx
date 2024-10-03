import React from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from '../src/pages/Auth/Login';
import Otp from '../src/pages/Auth/Otp';
import { ToastContainer } from "react-toastify";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/otp",
    element: <Otp />,
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
