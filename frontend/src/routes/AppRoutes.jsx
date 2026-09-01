import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import ProtectedRoute from "../components/ProtectedRoutes";
import AdminDashboard from "../pages/AdminDashboard";
import PharmacistDashboard from "../pages/PharmacistDashboard";
import StaffDashboard from "../pages/StaffDashboard";
import Unauthorized from "../pages/Unauthorized";

const Login = () => {

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (role) => {

        const userData = {
            userId: 1,
            name: "Test User",
            email: "test@medistock.com",
            role: role,
            token: "temporary-token"
        };

        login(userData);

        if (role === "ADMIN") {
            navigate("/admin");
        }

        if (role === "PHARMACIST") {
            navigate("/pharmacist");
        }

        if (role === "STAFF") {
            navigate("/staff");
        }
    };

    return (
        <div>

            <h1>Temporary Login</h1>

            <button onClick={() => handleLogin("ADMIN")}>
                Login as Admin
            </button>

            <button onClick={() => handleLogin("PHARMACIST")}>
                Login as Pharmacist
            </button>

            <button onClick={() => handleLogin("STAFF")}>
                Login as Staff
            </button>

        </div>
    );
};

const Register = () => {
    return <h1>Register Page</h1>;
};

const AppRoutes = () => {

    return (
        <Routes>

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

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
                    <ProtectedRoute allowedRoles={["STAFF"]}>
                        <StaffDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/unauthorized"
                element={<Unauthorized />}
            />

        </Routes>
    );
};

export default AppRoutes;