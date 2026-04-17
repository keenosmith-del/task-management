import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <div className="auth-bg"></div>

      <div className="app-shell">
        {loggedIn ? (
          <Tasks />
        ) : (
          <div className="auth-container">
            <div className={`auth-view ${!showRegister ? "active" : "hidden"}`}>
              <Login 
                onLogin={() => setLoggedIn(true)} 
                onRegister={() => setShowRegister(true)} 
              />
            </div>

            <div className={`auth-view ${showRegister ? "active" : "hidden"}`}>
              <Register onRegister={() => setShowRegister(false)} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;