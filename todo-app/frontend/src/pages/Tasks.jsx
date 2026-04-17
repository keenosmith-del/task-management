import API_URL from "../config";
import { useState, useEffect, useRef } from "react";
import { Menu, User, Search, Plus, Bell, Moon, Settings } from "lucide-react";

function Tasks() {
  const mainInputRef = useRef(null);

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  // toast for add event
  const [toast, setToast] = useState("");
  const [showToast, setShowToast] = useState(false);

  // search task
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  // edit
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // GET tasks
  const fetchTasks = async () => {
    const res = await fetch(`${API_URL}/api/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.status === 401) {
      // handle expired/invalid token
      localStorage.removeItem("token");
      window.location.reload();
      return;
    }

    const data = await res.json();

    if (Array.isArray(data)) {
      setTasks(data);
    } else {
      console.error(data);
      setTasks([]);
    }
  };

  // trigger toast helper function
  const triggerToast = (message) => {
    setToast(message);
    setShowToast(true);

    if (window.toastTimeout) {
      clearTimeout(window.toastTimeout);
    }

    window.toastTimeout = setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // accordian sidebar onclick
  const [activeSection, setActiveSection] = useState(null);

  // uname and sidebar
  const [menuOpen, setMenuOpen] = useState(false);

  // weather
  const [weather, setWeather] = useState(null);

  const fetchWeather = async () => {
    try {
          const res = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=-26.2041&longitude=28.0473&current_weather=true"
          );

          const data = await res.json();
          setWeather(data.current_weather);
      } catch (err) {
        console.error("Weather error:", err);
      }
    };

  useEffect(() => {
    fetchTasks();
    fetchWeather();
  }, []);

  useEffect(() => {
    mainInputRef.current?.focus();
  }, []);

  // create task
  const handleAddTask = async (e) => {

    e.preventDefault();

    if (!task.trim()) {
      triggerToast("Please enter a task");
      return;
    }

    const res = await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ task })
    });

    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.reload();
      return;
    }

    const data = await res.json();

    if (res.ok) {
      setTask("");
      fetchTasks();
      mainInputRef.current?.focus();
    } else {
      triggerToast(data.message || "Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // edit
  const handleUpdate = async (id) => {
    const taskToUpdate = tasks.find(t => t._id === id);

    const res = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        task: editText,
        completed: taskToUpdate.completed
      })
    });

    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.reload();
      return;
    }

    if (res.ok) {
      setEditingId(null);
      setEditText("");
      fetchTasks();
    }
  };

  // delete 
  const handleDelete = async (id) => {
    const res = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.reload();
      return;
    }

    if (res.ok) {
      fetchTasks();
    }
  };

  // toggle 
  const handleToggle = async (id) => {

    // instant UI update
      setTasks(prev => {
      const updated = prev.map(t =>
        t._id === id ? { ...t, completed: !t.completed } : t
      );

      const taskToUpdate = prev.find(t => t._id === id);

      fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          task: taskToUpdate.task,
          completed: !taskToUpdate.completed
        })
      });

      return updated;
    });
  };

  // live dynamic cards
  // date 
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
        setNow(new Date());
      }, 60000); // updates every minute

      return () => clearInterval(interval);
    }, []);

  // weather upgrade 
  const getWeatherInfo = (code) => {
    if (code === 0) return { label: "Clear", icon: "☀️" };
    if (code <= 3) return { label: "Cloudy", icon: "☁️" };
    if (code <= 48) return { label: "Fog", icon: "😶‍🌫️" };
    if (code <= 67) return { label: "Rain", icon: "🌧️" };
    if (code <= 77) return { label: "Snow", icon: "❄️" };
    if (code <= 99) return { label: "Storm", icon: "⛈️" };

      return { label: "Unknown", icon: "❔" };
  };

  // clocks
  const [time, setTime] = useState(new Date());

  // ticking seconds 
  // might remove if too messy 
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000); // every second

    return () => clearInterval(interval);
  }, []);

  // helper
  const formatTime = (tz) => {
    return time.toLocaleTimeString("en-ZA", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // progress bar 
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  const progressPercent =
    totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

    const [darkMode, setDarkMode] = useState(true);
    const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    document.body.style.background = darkMode ? "#050507" : "#f5f5f5";
  }, [darkMode]);

  return (
    <div className="tasks-page">
        <div className={`sidebar ${menuOpen ? "open" : ""}`}>
  
            {/* MENU BUTTON */}
            <div 
              className="sidebar-item"
              onClick={() => {
                setMenuOpen(prev => {
                  const newState = !prev;

                  if (!newState) {
                    setActiveSection(null);
                  }

                  return newState;
                });
              }}
            >
              <Menu size={20} />
              {menuOpen && <span>Menu</span>}
            </div>

            <div className="sidebar-gap" />

            {/* ITEMS */}
            {/* profile */}
            <div className="sidebar-profile">
              <div 
                className="sidebar-item"
                onClick={() => {
                  if (!menuOpen) {
                    setMenuOpen(true);
                    return;
                  }
                  // no action when open (profile is static)
                }}
              >
                <User size={20} />
                {menuOpen && <span>Profile</span>}
              </div>

              {menuOpen && (
                <div className="profile-content">
                  <div className="profile-title">Hello, User</div> 
                  <div className="profile-sub">Welcome back</div>
                </div>
              )}
            </div>

            {/* search */}
            <div 
              className={`sidebar-item ${activeSection === "search" ? "active" : ""}`}
              onClick={() => {
                if (!menuOpen) {
                  setMenuOpen(true);
                  return;
                }

                setActiveSection(prev => 
                  prev === "search" ? null : "search"
                );
              }}
            >
              <Search size={20} />
              {menuOpen && <span>Search</span>}
            </div>

            {menuOpen && activeSection === "search" && (
              <div className="sidebar-dropdown">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="sidebar-search-input"
                />
              </div>
            )}

            {/* quick create */}
            <div 
              className={`sidebar-item ${activeSection === "create" ? "active" : ""}`}
              onClick={() => {
                if (!menuOpen) {
                  setMenuOpen(true);
                  return;
                }

                setActiveSection(prev => 
                  prev === "create" ? null : "create"
                );
              }}
            >
              <Plus size={20} />
              {menuOpen && <span>Create</span>}
            </div>

            {menuOpen && activeSection === "create" && (
              <div className="sidebar-dropdown">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddTask(e);
                  }}
                >
                  <input
                    type="text"
                    placeholder="Quick add task..."
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    className="sidebar-search-input"
                  />
                </form>
              </div>
            )}

            {/* notfications */}
            <div 
              className={`sidebar-item ${activeSection === "notifications" ? "active" : ""}`}
              onClick={() => {
                if (!menuOpen) {
                  setMenuOpen(true);
                  return;
                }

                setActiveSection(prev => 
                  prev === "notifications" ? null : "notifications"
                );
              }}
            >
              <Bell size={20} />
              {menuOpen && <span>Notifications</span>}
            </div>

            {menuOpen && activeSection === "notifications" && (
              <div className="sidebar-dropdown">
                <div className="dropdown-content">

                  {/* placeholder text for now */}
                  <div className="dropdown-sub">• You completed a task</div>
                  <div className="dropdown-sub">• New task added</div>
                  <div className="dropdown-sub">• Nothing due today</div>

                </div>
              </div>
            )}

            {/* appearance */}
            <div 
              className={`sidebar-item ${activeSection === "appearance" ? "active" : ""}`}
              onClick={() => {
                if (!menuOpen) {
                  setMenuOpen(true);
                  return;
                }

                setActiveSection(prev => 
                  prev === "appearance" ? null : "appearance"
                );
              }}
            >
              <Moon size={20} />
              {menuOpen && <span>Appearance</span>}
            </div>

            {menuOpen && activeSection === "appearance" && (
              <div className="sidebar-dropdown">

                <div className="toggle-row">
                  <div className="side-item-non-btn">
                    Dark mode
                  </div>
                  <div 
                    className={`toggle-switch ${darkMode ? "active" : ""}`}
                    onClick={() => setDarkMode(prev => !prev)}
                  >
                    <div className="toggle-knob" />
                  </div>
                </div>

                <div className="toggle-row">
                  <div className="side-item-non-btn">
                    Focus mode
                  </div>
                  <div 
                    className={`toggle-switch ${focusMode ? "active" : ""}`}
                    onClick={() => setFocusMode(prev => !prev)}
                  >
                    <div className="toggle-knob" />
                  </div>
                </div>

              </div>
            )}

            {/* account */}
            <div 
              className={`sidebar-item ${activeSection === "account" ? "active" : ""}`}
              onClick={() => {
                if (!menuOpen) {
                  setMenuOpen(true);
                  return;
                }

                setActiveSection(prev => 
                  prev === "account" ? null : "account"
                );
              }}
            >
              <Settings size={20} />
              {menuOpen && <span>Account</span>}
            </div>

            {menuOpen && activeSection === "account" && (
              <div className="sidebar-dropdown">
                <div className="dropdown-content">

                  <div 
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    Logout
                  </div>

                  <div className="dropdown-item">
                    Reset
                  </div>

                  <div className="dropdown-item danger">
                    Delete Account
                  </div>

                </div>
              </div>
            )}

            {/* dividers */}
            <div className="sidebar-gap" />

            <div className="conditions-slide">
              {menuOpen && <span>terms and conditions © built by keenosmith 2026 j♡</span>}
            </div>
      </div>

      <div className="dashboard">

        {/* LEFT SIDE */}
        <div className="left-panel">

          {/* top small cards */}
          {/* system date */}
          <div className="glass-card small-card date-card">
            <div className="date-day">
              {now.getDate()}
            </div>

            <div className="date-full">
              {now.toLocaleDateString("en-ZA", {
                weekday: "long",
                month: "long"
              })}
            </div>
          </div>

            {/* system weather */}
          <div className="glass-card small-card weather-card">
            <div className="weather-icon">
              {weather ? getWeatherInfo(weather.weathercode).icon : "…"}
            </div>

            <div className="weather-temp">
              {weather ? `${Math.round(weather.temperature)}°` : "--"}
            </div>

            <div className="weather-condition">
              {weather ? getWeatherInfo(weather.weathercode).label : "Loading..."}
            </div>

            <div className="weather-location">
              Johannesburg
            </div>
          </div>

          {/* wide cards */}
          {/* clocks wide card card 3 */}
          <div className="glass-card wide-card clock-card">
            <div className="clock-grid">

              <div className="clock-box">
                <div className="clock-time">
                  {formatTime("Africa/Johannesburg")}
                </div>
                <div className="clock-city">Johannesburg</div>
              </div>

              <div className="clock-box">
                <div className="clock-time">
                  {formatTime("Africa/Johannesburg")}
                </div>
                <div className="clock-city">Cape Town</div>
              </div>

              <div className="clock-box">
                <div className="clock-time">
                  {formatTime("Asia/Shanghai")}
                </div>
                <div className="clock-city">Shanghai</div>
              </div>
            </div>
          </div>

          {/* forex card */}
          <div className="glass-card wide-card forex-card">
            <div className="forex-row">
              <div className="forex-left">
                <span className="forex-pair">USD / ZAR</span>
                <span className="forex-label">US Dollar</span>
              </div>
              <div className="forex-right">
                <span className="forex-rate">18.45</span>
                <span className="forex-change up">+0.12%</span>
              </div>
            </div>

            <div className="forex-row">
              <div className="forex-left">
                <span className="forex-pair">EUR / ZAR</span>
                <span className="forex-label">Euro</span>
              </div>
              <div className="forex-right">
                <span className="forex-rate">19.90</span>
                <span className="forex-change down">-0.08%</span>
              </div>
            </div>

            <div className="forex-row">
              <div className="forex-left">
                <span className="forex-pair">GBP / ZAR</span>
                <span className="forex-label">British Pound</span>
              </div>
              <div className="forex-right">
                <span className="forex-rate">23.10</span>
                <span className="forex-change up">+0.05%</span>
              </div>
            </div>
          </div>

          <div className="glass-card wide-card progress-card">
            <div className="progress-header">
              <span>Task Progress</span>
              <span className="progress-count">
                {completedCount} / {totalCount}
              </span>
            </div>

            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.round(progressPercent)}%` }}></div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-panel">
          <div className="glass-card tasks-card">
            <div className="tasks-header">
              <h2>Tasks</h2>
            </div>

            {/* ADD TASK */}
            <form onSubmit={handleAddTask} className="task-input-row">
              <input
                ref={mainInputRef}
                type="text"
                placeholder="Add a new task..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
              <button type="submit">Add</button>
            </form>

            {/* TASK LIST */}
            <div className="task-list">
              {(() => {
                const filteredTasks = tasks.filter(t =>
                  t.task.toLowerCase().includes(searchQuery.toLowerCase())
                );

                if (tasks.length === 0) {
                  return (
                    <div className="no-results">
                      No tasks yet. Add your first task.
                    </div>
                  );
                }

                if (filteredTasks.length === 0) {
                  return (
                    <div className="no-results">
                      No results found
                    </div>
                  );
                }

                return filteredTasks.map((t) => (
                  <div key={t._id} className="task-item">

                    {editingId === t._id ? (
                      <>
                        <input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleUpdate(t._id);
                            }
                          }}
                        />
                        <button 
                          onClick={() => handleUpdate(t._id)}
                          className="task-save-btn"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="task-left">
                          
                          <div
                            className={`task-circle ${t.completed === true ? "checked" : ""}`}
                            onClick={() => handleToggle(t._id)}
                          >
                            {t.completed === true && "✓"}
                          </div>

                          <span className={t.completed ? "task-text completed" : "task-text"}>
                            {t.task}
                          </span>

                        </div>

                        <div className="task-actions">
                          <button
                            onClick={() => {
                              setEditingId(t._id);
                              setEditText(t.task);
                            }}
                          >
                            Edit
                          </button>

                          <button onClick={() => handleDelete(t._id)}>
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* toast notification */}
      <div className={`toast ${showToast ? "show" : ""}`}>
        {toast}
      </div>
    </div>
  );
}

export default Tasks;