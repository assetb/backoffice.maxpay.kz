// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import LoginForm from './LoginForm';
import P2P from './P2P';
import Tranzex from './Tranzex';
import Payments from './Payments';
import CashPayments from './CashPayments';
import './App.css';
import './styles.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Состояние для отслеживания статуса авторизации

  // Функция для обработки успешной авторизации
  const handleLogin = () => {
    setIsLoggedIn(true); // Устанавливаем статус авторизации в true
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {/* Условный рендеринг: если пользователь авторизован, отображаем меню и маршруты, иначе отображаем форму входа */}
          {isLoggedIn ? (
            <>
              <nav>
                <ul>
                  <li><NavLink to="/P2P" className="nav-link" activeClassName="active">P2P</NavLink></li>
                  <li><NavLink to="/tranzex" className="nav-link" activeClassName="active">Tranzex</NavLink></li>
                  <li><NavLink to="/Payments" className="nav-link" activeClassName="active">Payments</NavLink></li>
                  <li><NavLink to="/CashPayments" className="nav-link" activeClassName="active">CashPayments</NavLink></li>
                </ul>
              </nav>
              <Routes>
                <Route path="/P2P" element={<P2P />} />
                <Route path="/tranzex" element={<Tranzex />} />
                <Route path="/Payments" element={<Payments />} />
                <Route path="/CashPayments" element={<CashPayments />} />
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
