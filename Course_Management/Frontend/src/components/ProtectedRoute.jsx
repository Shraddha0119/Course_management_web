import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Protects routes: requires login. Optionally restricts by role.
function ProtectedRoute({ children, roles }) {
  const { user, token } = useAuth();
  const location = useLocation();

  // Not logged in -> redirect to login
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role -> redirect to home
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;

