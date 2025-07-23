// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import LoginForm from "./LoginForm";
import Payments from "./Payments";
import "./App.css";
import "./styles.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Состояние для отслеживания статуса авторизации
  const [user, setUser] = useState(null);

  // Функция для обработки успешной авторизации
  const handleLogin = (data) => {
    setUser(data);
    setIsLoggedIn(true); // Устанавливаем статус авторизации в true
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {/* Условный рендеринг: если пользователь авторизован, отображаем меню и маршруты, иначе отображаем форму входа */}
          {isLoggedIn ? (
            <>
              <div className="user-info">
                {user && user.merchant_id && (
                  <span>Merchant ID: {user.merchant_id}</span>
                )}
              </div>
              <nav>
                <ul>
                  <li>
                    <NavLink to="/Payments" className="nav-link" activeClassName="active">
                      Payments
                    </NavLink>
                  </li>
                </ul>
              </nav>
              <Routes>
                <Route path="/Payments" element={<Payments />} />
              </Routes>
            </>
          ) : (
            <LoginForm onLogin={handleLogin} />
          )}
        </header>
      </div>
    </Router>
  );
}

export default App;
