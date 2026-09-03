import { useAuth } from "../context/useAuth";

const PharmacistDashboard = () => {

    const { user, logout } = useAuth();

    return (
        <div>

            <h1>Pharmacist Dashboard</h1>

            <p>Welcome, {user?.name}</p>

            <p>Role: {user?.role}</p>

            <button onClick={logout}>
                Logout
            </button>

        </div>
    );
};

export default PharmacistDashboard;