import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';
import { FaKey, FaInfoCircle } from 'react-icons/fa';
import { RootState } from '../app/store';
import './UserProfile.css'; // Import du fichier CSS

const UserProfile: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);

  const [timeLeft, setTimeLeft] = useState<number>(auth?.expires_in ? auth.expires_in * 60 : 0);

  useEffect(() => {
    if (!auth || timeLeft === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [auth, timeLeft]);

  if (!auth) return null;

  const { username, user_id, access_token, role } = auth;

  const formatTimeLeft = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const formatPermission = (key: string) => {
    switch (key) {
      case 'author_get_doc': return 'Afficher les documents';
      case 'author_post_doc': return 'Poster un document';
      case 'author_put_doc': return 'Modifier un document';
      case 'author_patch_doc': return 'Apporter des modifications à un document';
      case 'author_delete_doc': return 'Supprimer un document';
      case 'author_get_collection': return 'Afficher les collections';
      case 'author_post_collection': return 'Créer une collection';
      case 'author_put_collection': return 'Modifier une collection';
      case 'author_patch_collection': return 'Apporter des modifications à une collection';
      case 'author_delete_collection': return 'Supprimer une collection';
      case 'author_get_user': return 'Afficher les utilisateurs';
      case 'author_post_user': return 'Ajouter un utilisateur';
      case 'author_put_user': return 'Modifier un utilisateur';
      case 'author_patch_user': return 'Apporter des modifications à un utilisateur';
      case 'author_delete_user': return 'Supprimer un utilisateur';
      default: return key;
    }
  };

  return (
    <div className="user-profile-container">
      <div className="username-container">
        <h1>Bonjour, {username}</h1>
      </div>

      <div className="icons-container">
        <div className="icon-wrapper">
          <FaKey className="icon" id="token-icon" />
          <Tooltip id="token-tooltip" anchorSelect="#token-icon" place="top" style={{ backgroundColor: 'rgba(0, 0, 0, 1)', color: 'white', padding: '10px', borderRadius: '5px', zIndex: 1000 }}>
            <p>Token: {access_token}</p>
            <p>Expire dans : {formatTimeLeft(timeLeft)}</p>
          </Tooltip>
        </div>

        <div className="icon-wrapper">
          <FaInfoCircle className="icon" id="info-icon" />
          <Tooltip id="info-tooltip" anchorSelect="#info-icon" place="top" style={{ backgroundColor: 'rgba(0, 0, 0, 1)', color: 'white', padding: '10px', borderRadius: '5px', zIndex: 1000 }}>
            <p>Mon id : {user_id}</p>
            <p>Mon rôle : {role?.role_name}</p>
            <p>Mes droits : </p>
            <ul className="role-list">
              {role && Object.entries(role).map(([key, value]) => 
                key.startsWith('author') && (
                  <li key={key}>
                    {formatPermission(key)} : {value ? '✔️' : '❌'}
                  </li>
                )
              )}
            </ul>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
