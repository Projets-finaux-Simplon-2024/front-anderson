import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchUsers, fetchCollections, fetchRoles, deleteCollection, fetchDocuments, User, Collection, Role, Document } from '../services/apiService';
import { FaInfoCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import PatchCollectionButton from './PatchCollectionButton'; 
import { RootState } from '../app/store'; 

const CollectionTable: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [collectionToDelete, setCollectionToDelete] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const auth = useSelector((state: RootState) => state.auth); 

  const loadCollections = async () => {
    try {
      const collectionsData = await fetchCollections();
      setCollections(collectionsData);
    } catch (error) {
      console.error('Erreur lors du chargement des collections :', error);
    }
  };

  const loadDocuments = async () => {
    try {
      const documentsData = await fetchDocuments();
      setDocuments(documentsData);
    } catch (error) {
      console.error('Erreur lors du chargement des documents :', error);
    }
  };

  const loadUsersAndRoles = async () => {
    try {
      const usersData = await fetchUsers();
      const rolesData = await fetchRoles();
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs et des rôles :', error);
    }
  };

  useEffect(() => {
    loadCollections();
    loadDocuments();
    loadUsersAndRoles();

    const handleCollectionsUpdated = () => {
      loadCollections();
    };

    window.addEventListener('collectionsUpdated', handleCollectionsUpdated);

    return () => {
      window.removeEventListener('collectionsUpdated', handleCollectionsUpdated);
    };
  }, []);

  const getUserInfo = (userId: number) => {
    return users.find(user => user.user_id === userId);
  };

  const getRoleNameAndDescription = (roleId: number) => {
    const role = roles.find(r => r.role_id === roleId);
    return role ? { name: role.role_name, description: role.description } : { name: 'Rôle inconnu', description: '' };
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = async () => {
    const hasDocuments = documents.some(doc => doc.collection_id === collectionToDelete);

    if (hasDocuments) {
      setErrorMessage('Impossible de supprimer la collection. Des documents sont encore présents.');
      return;
    }

    try {
      await deleteCollection(collectionToDelete!); 
      setCollections(collections.filter((col) => col.collection_id !== collectionToDelete));
      setShowModal(false);
      setCollectionToDelete(null);

      const event = new CustomEvent('collectionsUpdated');
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Erreur lors de la suppression de la collection :', error);
    }
  };

  const openModal = (collectionId: number) => {
    setErrorMessage(null); // Réinitialiser le message d'erreur
    setCollectionToDelete(collectionId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCollectionToDelete(null);
    setErrorMessage(null); // Réinitialiser le message d'erreur lors de la fermeture de la modale
  };

  return (
    <div>
      <table className="tftable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Créateur</th>
            <th>Date de création</th>
            <th>Dernière modification</th>
            <th>État du bucket</th>
            <th>Modifier</th>
            <th>Supprimer</th>
          </tr>
        </thead>
        <tbody>
          {collections.map(collection => (
            <tr key={collection.collection_id}>
              <td>{collection.collection_id}</td>
              <td>{collection.name}</td>
              <td>{collection.description}</td>
              <td>
                {(() => {
                  const user = getUserInfo(collection.user_id);
                  if (user) {
                    const { name, description } = getRoleNameAndDescription(user.role_id);
                    return (
                      <>
                        {user.username}
                        <FaInfoCircle id={`user-info-icon-${collection.collection_id}`} className="icon" />
                        <Tooltip id={`user-tooltip-${collection.collection_id}`} anchorSelect={`#user-info-icon-${collection.collection_id}`} place="top">
                          <p>Email: {user.email}</p>
                          <p>Rôle: {name}</p>
                          <p>Description: {description}</p>
                        </Tooltip>
                      </>
                    );
                  } else {
                    return 'Utilisateur inconnu';
                  }
                })()}
              </td>
              <td>{formatDate(collection.date_de_creation)}</td>
              <td>{new Date(collection.derniere_modification).toLocaleString()}</td>
              <td>{collection.etat_bucket}</td>
              <td>
                <PatchCollectionButton 
                  collection={collection} 
                  disabled={!auth.role?.author_patch_collection} 
                />
              </td>
              <td>
                <button 
                  onClick={() => openModal(collection.collection_id)} 
                  disabled={!auth.role?.author_delete_collection} 
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
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <p>Êtes-vous sûr de vouloir supprimer cette collection ?</p>
            <button onClick={handleDelete}>Oui</button>
            <button onClick={closeModal}>Non</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionTable;
