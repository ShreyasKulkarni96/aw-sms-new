import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Import jwtDecode function from jwt-decode library

const PrivateRoute = ({ role, children }) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      // Redirect to login page if token is missing
      return <Navigate to="/login" />;
    }

    const decodedToken = jwtDecode(token); // Use jwtDecode to decode the token
    const curTime = new Date();
    const tokenExpiryTime = new Date(decodedToken.exp * 1000);
    console.log("Decoded Token:", decodedToken);

    if (!role || !Array.isArray(role) || !role.includes(decodedToken.role)) {
      // Redirect to unauthorized page if roles are missing or user role is not allowed
      return <Navigate to="/unauthorized" />;
    }

    if (tokenExpiryTime > curTime) {
      // If token is valid and user role is allowed, render the route
      return <>{children}</>;
    } else {
      // Redirect to login page if token is expired
      return <Navigate to="/" />;
    }
  } catch (error) {
    // Handle token decoding errors
    console.error('PrivateRoute error:', error);
    // Redirect to login page or dashboard page
    return <Navigate to="/dashboard" />;
  }
};

export default PrivateRoute;
