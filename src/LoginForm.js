import React, { useState } from "react";
import axios from "axios";
import "./styles.css"; // Импорт файла стилей

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async event => {
    event.preventDefault();

    if (username.trim() === "" || password.trim() === "") {
      setError("Пожалуйста, введите логин и пароль");
      return;
    }

    // Разрешенные пользователи (локальная проверка)
    const validUsers = {
      p2pBackOfficeUser: "2Jz-uZA-s8i-jRQ!",
      manager: "safepay_uZA-s8i"
    };

    if (validUsers[username] && validUsers[username] === password) {
      onLogin();
      return;
    }

    // Попытка авторизации через API
    try {
      const response = await axios.post("https://api.safepay.kg/admin/api/login", {
        email: username,
        password: password
      });

      if (response.data.success) {
        onLogin();
      } else {
        setError("Неверные учетные данные");
      }
    } catch (error) {
      console.error("Ошибка при авторизации:", error);
      setError("Ошибка соединения с сервером");
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <h2 className="LoginLabel">Вход в систему</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Логин (email):</label>
            <input type="text" id="username" value={username} onChange={event => setUsername(event.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль:</label>
            <input type="password" id="password" value={password} onChange={event => setPassword(event.target.value)} />
          </div>
          <div>
            <button className="login" type="submit">
              Войти
            </button>
          </div>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
