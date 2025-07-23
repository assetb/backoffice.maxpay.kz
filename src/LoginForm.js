import React, { useState } from "react";
import config from "./config";
import GatewayAuthService from "./gatewayAuthService";
import "./styles.css"; // Импорт файла стилей

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const authService = new GatewayAuthService(config.API_BASE_URL);

  const handleSubmit = async event => {
    event.preventDefault();

    if (username.trim() === "" || password.trim() === "") {
      setError("Пожалуйста, введите логин и пароль");
      return;
    }

    try {
      const result = await authService.login(username, password);

      if (result.success && result.data && result.data.role === 'merchant') {
        onLogin(result.data);
      } else {
        setError(result.error || 'Неверные учетные данные');
      }
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
      setError('Ошибка соединения с сервером');
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
