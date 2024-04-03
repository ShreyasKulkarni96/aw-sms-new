import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Import jwtDecode function from jwt-decode library

const PrivateRoute = ({ role, children }) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      return <Navigate to="/login" />;
    }

    const decodedToken = jwtDecode(token);
    const curTime = new Date();
    const tokenExpiryTime = new Date(decodedToken.exp * 1000);
    console.log("Decoded Token:", decodedToken);

    if (!role || !Array.isArray(role) || !role.includes(decodedToken.role)) {
      return <Navigate to="/unauthorized" />;
    }

    if (tokenExpiryTime > curTime) {
      return <>{children}</>;
    } else {
      return <Navigate to="/" />;
    }
  } catch (error) {
    console.error('PrivateRoute error:', error);
    return <Navigate to="/dashboard" />;
  }
};

export default PrivateRoute;
