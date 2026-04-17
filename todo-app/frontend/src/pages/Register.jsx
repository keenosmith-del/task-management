import { useState, useRef } from "react";
import API_URL from "../config";

function Register({ onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [toast, setToast] = useState("");
  const [shake, setShake] = useState("");

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username && !password) {
      setToast("Please fill in all fields");
      setShake("both");

      emailRef.current?.focus();

      setTimeout(() => setShake(""), 300);
      setTimeout(() => setToast(""), 2500);
      return;
    }

    if (!username) {
      setToast("Email required");
      setShake("email");

      emailRef.current?.focus();

      setTimeout(() => setShake(false), 300);
      setTimeout(() => setToast(""), 2500);
      return;
    }

    if (!password) {
      setToast("Password required");
      setShake("password");

      passwordRef.current?.focus();

      setTimeout(() => setShake(false), 300);
      setTimeout(() => setToast(""), 2500);
      return;
    }

    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      setToast("Registration successful");
      setTimeout(() => {
        setToast("");
        onRegister();
      }, 1500);
    } else {
      setToast(data.message);
      setTimeout(() => setToast(""), 2500);
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card auth-card">

        <div className="avatar-circle"></div>

        <h2 className="title">Create Account</h2>

        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={onRegister}>Login</span>
        </p>

        <form onSubmit={handleRegister}>
          <div className={`input-group ${shake === "both" || shake === "email" ? "shake" : ""}`}>
            <label>Email</label>
            <input
                ref={emailRef}
                type="text"
                placeholder="you@gmail.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
          </div>

          <div className={`input-group ${shake === "both" || shake === "password" ? "shake" : ""}`}>
            <label>Password</label>
            <input
              ref={passwordRef}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="primary-btn">
            Register
          </button>
      </form>

        <div className="conditions">
            <p>
              terms and conditions © built by keenosmith 2026 j♡
            </p>
          </div>
      </div>
      {toast && <div className="toast show">{toast}</div>}
    </div>
  );
}

export default Register;