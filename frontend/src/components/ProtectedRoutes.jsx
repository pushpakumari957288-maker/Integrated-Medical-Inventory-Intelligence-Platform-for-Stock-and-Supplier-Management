import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    // User is not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const userRole = (user.role || "").toUpperCase();
    const formattedAllowed = (allowedRoles || []).map((r) => r.toUpperCase());

    // User is logged in, but doesn't have permission
    if (allowedRoles && allowedRoles.length > 0 && !formattedAllowed.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Access granted
    return children;
};

export default ProtectedRoute;