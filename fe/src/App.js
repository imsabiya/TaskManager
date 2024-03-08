import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import "./App.css";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ResetPwd from "./components/Auth/ForgotPwd";

const userId = sessionStorage.getItem("userId");
const token = sessionStorage.getItem("token");

const PrivateRoute = ({ path, element }) => {
  return token ? (
    ["/login", "/register", "/forgotPwd"].includes(path) ? (
      <Navigate to="/" />
    ) : (
      element
    )
  ) : (
    <Navigate to="/login" />
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!sessionStorage.getItem("token")
  );

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
  };

  useEffect(() => {
    setIsLoggedIn(!!sessionStorage.getItem("token"));
  }, [isLoggedIn]);

  return (
    <div className="App container mx-auto">
      <nav className="flex justify-between place-items-center bg-slate-400 p-4 rounded-md text-white">
        <h2 className="text-xl lg:text-3xl">
          <NavLink to="/" exact>
            TaskManager
          </NavLink>
        </h2>
        <ul className="flex gap-x-4 lg:gap-x-6 place-items-center text-lg">
          <li> All Tasks</li>
          {isLoggedIn ? (
            <li>
              <a href="/login" onClick={handleLogout}>
                LogOut
              </a>
            </li>
          ) : (
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path="/" exact element={<Home />} />
        {/* Only to user */}
        {token ? (
          <Route
            path="/login"
            element={<PrivateRoute path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />}
          />
        ) : (
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />
        )}
        {token ? (
          <Route
            path="/register"
            element={<PrivateRoute path="/register" element={<Register />} />}
          />
        ) : (
          <Route path="/register" element={<Register />} />
        )}
        {token ? (
          <Route
            path="/forgotPwd"
            element={<PrivateRoute path="/forgotPwd" element={<ResetPwd />} />}
          />
        ) : (
          <Route path="/forgotPwd" element={<ResetPwd />} />
        )}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
