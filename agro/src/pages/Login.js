import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const from = location.state?.from || "/";

  useEffect(() => {
    if (location.state?.message) {
      setInfoMsg(location.state.message);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axios.post(
        "http://localhost:8000/api-token-auth/",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("isLoggedIn", "true"); // optional
        navigate(from, { replace: true });
      } else {
        setErrorMsg("Login failed: no token returned");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.data?.non_field_errors) {
        setErrorMsg(err.response.data.non_field_errors.join(" "));
      } else {
        setErrorMsg("Login failed. Check your credentials.");
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
      <h2>Login</h2>
      {infoMsg && <div style={{ color: "green", marginBottom: 10 }}>{infoMsg}</div>}
      {errorMsg && <div style={{ color: "red", marginBottom: 10 }}>{errorMsg}</div>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{
            padding: 10,
            background: "#7b1fa2",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            marginTop: 10,
          }}
        >
          Login
        </button>
        <div style={{ textAlign: "center", marginTop: 10 }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#7b1fa2", textDecoration: "none", fontWeight: "bold" }}>
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
