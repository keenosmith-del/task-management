import { useState } from "react";
import { useRef } from "react";
import API_URL from "../config";

function Login({ onLogin, onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [toast, setToast] = useState("");

  // shake error
  const [shake, setShake] = useState("");

  const handleLogin = async (e) => {
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

    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    console.log(data);

    if (data.token) {
        localStorage.setItem("token", data.token);
        onLogin();
    } else {
        setToast(data.message);
        setTimeout(() => setToast(""), 2500);
      }
  };

  return (
    <div className="auth-page">
      <div className="glass-card login-card">

        <div className="avatar-circle"></div>

        <h2 className="title">Login</h2>

        <p className="auth-switch">
          New here?{" "}
          <span onClick={onRegister}>Create an account</span>
        </p>

        <form onSubmit={handleLogin}>
          <div className="row">
            <div className={`input-group ${shake === "both" || shake === "email" ? "shake" : ""}`}>
              <label>Email</label>
              <input
                autoFocus
                ref={emailRef}
                type="text"
                placeholder="you@gmail.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
          </div>

          <div className="conditions">
            <p>
              terms and conditions © built by keenosmith 2026 j♡
            </p>
          </div>

          <div className="login-actions">
            <button type="submit" className="primary-btn login-btn">
              Login →
            </button>
          </div>
        </form>
      </div>
      {toast && <div className="toast show">{toast}</div>}
  </div>
  );
}

export default Login;