import React, { useState } from 'react';
import { useLogin } from '../features/auth/hooks';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './HomePage.css'; // Assurez-vous de créer ce fichier CSS

const HomePage: React.FC = () => {
  const login = useLogin();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(username, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || null);
    }
  };

  return (
    <div className="login-container">
      <img src="/images/icons8-néo-144.png" alt="Néo" className="neo-image" />
      <h1 className="login-title">Anderson</h1>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="username" className="login-label">Nom d'utilisateur :</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="login-label">Mot de passe :</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <button type="submit" className="login-button">Connexion</button>
      </form>

      {error && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setError(null)}>&times;</span>
            <p>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
