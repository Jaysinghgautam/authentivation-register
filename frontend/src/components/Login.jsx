 import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const API_URL = import.meta.env.VITE_API_URL || " ";

    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });

      console.log("Login response:", response.data);

      if (response.data.message === "Success") {
        alert("✅ Login successful!");
        navigate("/home");
      } else if (response.data.error) {
        alert(`❌ ${response.data.error}`);
      } else {
        alert("⚠️ Unexpected response from server.");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert("🚨 Server error. Please try again later.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center text-center vh-100"
      style={{
        backgroundImage:
          "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))",
      }}
    >
      <div className="bg-white p-3 rounded" style={{ width: "40%" }}>
        <h2 className="mb-3 text-primary">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label htmlFor="exampleInputEmail1" className="form-label">
              <strong>Email Id</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              className="form-control"
              id="exampleInputEmail1"
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="mb-3 text-start">
            <label htmlFor="exampleInputPassword1" className="form-label">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="form-control"
              id="exampleInputPassword1"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        <p className="container my-2">Don&apos;t have an account?</p>
        <Link to="/register" className="btn btn-secondary">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
