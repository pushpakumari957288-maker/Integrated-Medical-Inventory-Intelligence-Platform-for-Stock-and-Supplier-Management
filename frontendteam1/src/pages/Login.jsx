import { Link } from "react-router-dom";

function Login() {
  return (
    <div>
      <h1>MediStock Login</h1>

      <form>
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            placeholder="Enter your email"
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            placeholder="Enter your password"
          />
        </div>

        <br />

        <button type="submit">
          Login
        </button>
      </form>

      <p>
        Don't have an account?{" "}
        <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;