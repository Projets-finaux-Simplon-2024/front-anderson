// src/components/ProtectedRoute.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../app/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = useSelector((state: RootState) => state.auth.token);

  if (!token) {
    // Redirection vers la page de connexion avec un message si le token est manquant
    return <Navigate to="/" replace state={{ message: 'Session expirée, veuillez vous reconnecter.' }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
