import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.ok ? res.json() : Promise.reject(new Error("نام کاربری یا رمز عبور نادرست است.")))
      .then(user => {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        navigate("/dashboard");
      })
      .catch(err => setError(err));
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f5f5f5",
      direction: "rtl",
      fontFamily: "Vazirmatn, sans-serif"
    }}>
      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        width: "300px",
        textAlign: "center"
      }}>
        <h2>ورود به سیستم</h2>
        {error && <p style={{ color: "red" }}>{error.message || error.toString()}</p>}
        <input
          type="text"
          placeholder="نام کاربری"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "4px" }}
        />
        <input
          type="password"
          placeholder="رمز عبور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "4px" }}
        />
        <button
          onClick={handleLogin}
          style={{ width: "100%", padding: "10px", backgroundColor: "#223F98", color: "white", border: "none", borderRadius: "4px" }}
        >
          ورود
        </button>
      </div>
    </div>
  );
}
