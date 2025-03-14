// LoginForm.js
import React, { useState } from 'react';
import './styles.css'; // Импорт файла стилей

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState(''); // Устанавливаем начальное значение пустой строки
  const [password, setPassword] = useState(''); // Устанавливаем начальное значение пустой строки
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (username.trim() === '' || password.trim() === '') { // Проверка на пустые поля
      setError('Пожалуйста, введите логин и пароль');
      return; // Прекращаем выполнение функции, если поля пустые
    }
    
    if (username === 'p2pBackOfficeUser' && password === '2Jz-uZA-s8i-jRQ!') {
      onLogin();
    } else {
      setError('Неверные учетные данные');
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <h2 className='LoginLabel'>Вход в систему</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Логин:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
            <div>
            <button className="login" type="submit">Войти</button>
            </div>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginForm;

