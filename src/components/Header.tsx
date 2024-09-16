import React from 'react';
import UserProfile from './UserProfile'; // Import du UserProfile
import './Header.css'; // Pense à styliser le header avec ce fichier CSS

const Header: React.FC = () => {
  return (
    <div className="header-container">
      {/* Section de gauche : Bonjour et icônes depuis UserProfile */}
      <UserProfile />

      {/* Section de droite : Dashboard et image de Néo */}
      <div className="header-right">
        <h1>Dashboard Anderson</h1>
        <img src="/images/icons8-néo-144.png" alt="Néo" className="header-logo" />
      </div>
    </div>
  );
};

export default Header;
