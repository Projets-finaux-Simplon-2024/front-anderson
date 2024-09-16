import React from 'react';
import LogoutButton from './LogoutButton'; // Assurez-vous que le bouton est bien importé
import './Footer.css'; // Import du CSS pour styliser le footer

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-right">
        <LogoutButton className="logout-btn" /> {/* Le bouton de déconnexion */}
      </div>
    </footer>
  );
};

export default Footer;
