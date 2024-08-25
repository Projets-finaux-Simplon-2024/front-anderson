import React, { useEffect, useState } from 'react';
import { fetchUsers, fetchRoles, deleteUser, User, Role } from '../services/apiService';
import { FaInfoCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const loadUsersAndRoles = async () => {
      try {
        const usersData = await fetchUsers();
        const rolesData = await fetchRoles();
        setUsers(usersData);
        setRoles(rolesData);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs ou des rôles :', error);
      }
    };

    loadUsersAndRoles();

    const handleUsersUpdated = () => {
      loadUsersAndRoles();
    };

    window.addEventListener('usersUpdated', handleUsersUpdated);

    return () => {
      window.removeEventListener('usersUpdated', handleUsersUpdated);
    };
  }, []);

  const getRoleInfo = (roleId: number) => {
    return roles.find(role => role.role_id === roleId);
  };

  const handleDelete = async (userId: number) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter((user) => user.user_id !== userId));
      setShowModal(false);
      setUserToDelete(null);

      // Émettre l'événement pour mettre à jour les utilisateurs
      const event = new CustomEvent('usersUpdated');
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur :', error);
    }
  };

  const openModal = (userId: number) => {
    setUserToDelete(userId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setUserToDelete(null);
  };

  return (
    <div>
      <table className="tftable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom d'utilisateur</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Supprimer</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                {(() => {
                  const role = getRoleInfo(user.role_id);
                  if (role) {
                    return (
                      <>
                        {role.role_name}
                        <FaInfoCircle id={`role-info-icon-${user.user_id}`} className="icon" />
                        <Tooltip id={`role-tooltip-${user.user_id}`} anchorSelect={`#role-info-icon-${user.user_id}`} place="top">
                          <p>Description: {role.description}</p>
                        </Tooltip>
                      </>
                    );
                  } else {
                    return 'Rôle inconnu';
                  }
                })()}
              </td>
              <td>
                <button 
                  onClick={() => openModal(user.user_id)} 
                  disabled={!auth.role?.author_delete_user} // Désactiver le bouton si l'utilisateur n'a pas les droits
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
            <button onClick={() => handleDelete(userToDelete!)}>Oui</button>
            <button onClick={closeModal}>Non</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
