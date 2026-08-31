import { Link } from "react-router-dom";

function Register() {
  return (
    <div>
      <h1>MediStock Register</h1>

      <form>
        <div>
          <label>Full Name</label>
          <br />
          <input
            type="text"
            placeholder="Enter your full name"
          />
        </div>

        <br />

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
            placeholder="Create a password"
          />
        </div>

        <br />

        <button type="submit">
          Register
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;