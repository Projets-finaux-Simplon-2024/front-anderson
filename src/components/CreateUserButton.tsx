import React, { useState, useEffect } from 'react';
import { fetchRoles, createUser, Role } from '../services/apiService';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './CreateUserButton.css';

const CreateUserButton: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [roleId, setRoleId] = useState<number | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [creating, setCreating] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false); // État pour la visibilité du mot de passe
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const rolesData = await fetchRoles();
        setRoles(rolesData);
        if (rolesData.length > 0) {
          setRoleId(rolesData[0].role_id); // Sélectionnez le premier rôle par défaut
        }
      } catch (error) {
        console.error('Erreur lors du chargement des rôles :', error);
      }
    };

    loadRoles();
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 5 && password.length <= 10;
  };

  const handleCreate = async () => {
    setEmailError(null);
    setPasswordError(null);

    if (!validateEmail(email)) {
      setEmailError("L'email doit être au format correct (exemple@domaine.com).");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("Le mot de passe doit contenir entre 5 et 10 caractères.");
      return;
    }

    if (username === '' || email === '' || password === '' || roleId === null) return;

    setCreating(true);
    try {
      await createUser(username, email, password, roleId);
      closeUploadModal();

      // Émettre un événement personnalisé pour informer de la mise à jour
      const event = new CustomEvent('usersUpdated');
      window.dispatchEvent(event);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        setErrorMessage(error.response.data.detail);
      } else {
        setErrorMessage("Une erreur est survenue lors de la création de l'utilisateur.");
      }
    } finally {
      setCreating(false);
    }
  };

  const openUploadModal = () => {
    setShowModal(true);
  };

  const closeUploadModal = () => {
    setShowModal(false);
    setUsername('');
    setEmail('');
    setPassword('');
    setRoleId(roles.length > 0 ? roles[0].role_id : null); // Réinitialiser le rôle sélectionné
    setEmailError(null);
    setPasswordError(null);
    setErrorMessage(null);
  };

  return (
    <div>
      <button onClick={openUploadModal}>Créer un utilisateur</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Créer un utilisateur</h2>
            <label>Nom d'utilisateur :</label>
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label>Email :</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p style={{ color: 'red' }}>{emailError}</p>}

            <label>Mot de passe :</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}

            <label>Rôle :</label>
            <select
              value={roleId || ''}
              onChange={(e) => setRoleId(Number(e.target.value))}
            >
              {roles.map((role) => (
                <option key={role.role_id} value={role.role_id}>
                  {role.role_name}
                </option>
              ))}
            </select>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            <div className="modal-buttons">
              <button onClick={closeUploadModal}>Annuler</button>
              <button 
                onClick={handleCreate} 
                disabled={creating || username === '' || email === '' || password === '' || roleId === null}
              >
                {creating ? 'Chargement...' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateUserButton;
