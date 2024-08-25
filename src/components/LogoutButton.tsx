// src/components/LogoutButton.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { clearAuthData } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { persistor } from '../app/store';

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Purge l'état persistant
    persistor.purge().then(() => {
      // Réinitialise l'état Redux
      dispatch(clearAuthData());
      // Redirige l'utilisateur vers la page d'accueil ou de connexion
      navigate('/');
    });
  };

  return (
    <button onClick={handleLogout}>
      Déconnexion
    </button>
  );
};

export default LogoutButton;