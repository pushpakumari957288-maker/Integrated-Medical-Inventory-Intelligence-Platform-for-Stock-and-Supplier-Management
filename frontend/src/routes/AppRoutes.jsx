import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import ProtectedRoute from "../components/ProtectedRoutes";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/AdminDashboard";
import PharmacistDashboard from "../pages/PharmacistDashboard";
import StaffDashboard from "../pages/StaffDashboard";
import Unauthorized from "../pages/Unauthorized";

// Helper component to redirect logged in users away from login/register pages
const PublicOnlyRoute = ({ children }) => {
    const { user } = useAuth();
    if (user) {
        const role = (user.role || "").toUpperCase();
        if (role === "ADMIN") return <Navigate to="/admin" replace />;
        if (role === "PHARMACIST") return <Navigate to="/pharmacist" replace />;
        return <Navigate to="/staff" replace />;
    }
    return children;
};

// Root route dispatcher based on auth status
const HomeRedirect = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    const role = (user.role || "").toUpperCase();
    if (role === "ADMIN") return <Navigate to="/admin" replace />;
    if (role === "PHARMACIST") return <Navigate to="/pharmacist" replace />;
    return <Navigate to="/staff" replace />;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomeRedirect />} />

            <Route
                path="/login"
                element={
                    <PublicOnlyRoute>
                        <Login />
                    </PublicOnlyRoute>
                }
            />

            <Route
                path="/register"
                element={
                    <PublicOnlyRoute>
                        <Register />
                    </PublicOnlyRoute>
                }
            />

            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/pharmacist"
                element={
                    <ProtectedRoute allowedRoles={["PHARMACIST"]}>
                        <PharmacistDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/staff"
                element={
                    <ProtectedRoute allowedRoles={["STAFF", "USER"]}>
                        <StaffDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/unauthorized"
                element={<Unauthorized />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;