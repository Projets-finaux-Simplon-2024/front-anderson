import React, { useState } from 'react';
import { useLogin } from '../features/auth/hooks';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
    <div>
      <img src="/images/icons8-néo-144.png" alt="Néo" />
      <h1>Anderson</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Nom d'utilisateur :</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe :</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ flex: 1, paddingRight: '30px' }} // Ajout d'un padding pour l'espace de l'icône
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px', // Ajustement pour rapprocher l'icône du champ
                cursor: 'pointer',
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <button type="submit">Login</button>
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
