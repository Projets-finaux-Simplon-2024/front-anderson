import React, { useEffect, useState } from 'react';
import { fetchUsers, fetchCollections, fetchDocuments, fetchRoles, deleteDocument, User, Collection, Document, Role } from '../services/apiService';
import { FaInfoCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

const DocumentTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await fetchUsers();
        const collectionsData = await fetchCollections();
        const documentsData = await fetchDocuments();
        const rolesData = await fetchRoles();

        setUsers(usersData);
        setCollections(collectionsData);
        setDocuments(documentsData);
        setRoles(rolesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Écouter l'événement de mise à jour des documents
    const handleDocumentUpdate = () => {
      fetchDocuments().then(setDocuments);
    };

    window.addEventListener('documentsUpdated', handleDocumentUpdate);

    // Nettoyer l'écouteur d'événements lors du démontage du composant
    return () => {
      window.removeEventListener('documentsUpdated', handleDocumentUpdate);
    };
  }, []);

  const getCollectionName = (collectionId: number) => {
    const collection = collections.find((col) => col.collection_id === collectionId);
    return collection ? collection.name : 'Unknown';
  };

  const getUserInfoByUsername = (username: string) => {
    return users.find((usr) => usr.username === username);
  };

  const getRoleNameAndDescription = (roleId: number) => {
    const role = roles.find((r) => r.role_id === roleId);
    return role ? { name: role.role_name, description: role.description } : { name: 'Rôle inconnu', description: '' };
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = async (documentId: number) => {
    try {
      await deleteDocument(documentId);
      setDocuments(documents.filter((doc) => doc.document_id !== documentId));
      setShowModal(false);
      setDocumentToDelete(null);

      // Émettre l'événement pour mettre à jour les documents
      const event = new CustomEvent('documentsUpdated');
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const openModal = (documentId: number) => {
    setDocumentToDelete(documentId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setDocumentToDelete(null);
  };

  return (
    <div>
      <table className="tftable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom du document</th>
            <th>Nom d'origine</th>
            <th>Date de création</th>
            <th>Dernière modification</th>
            <th>Nombre de morceaux</th>
            <th>Posté par</th>
            <th>Collection</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.document_id}>
              <td>{doc.document_id}</td>
              <td>{doc.title}</td>
              <td>{doc.title_document}</td>
              <td>{formatDate(doc.date_de_creation)}</td>
              <td>{new Date(doc.created_at).toLocaleString()}</td>
              <td>{doc.number_of_chunks}</td>
              <td>
                {doc.posted_by}
                <FaInfoCircle id={`user-info-icon-${doc.document_id}`} className="icon" />
                <Tooltip id={`user-tooltip-${doc.document_id}`} anchorSelect={`#user-info-icon-${doc.document_id}`} place="top">
                  {(() => {
                    const user = getUserInfoByUsername(doc.posted_by);
                    if (user) {
                      const { name, description } = getRoleNameAndDescription(user.role_id);
                      return (
                        <div>
                          <p>Email: {user.email}</p>
                          <p>Rôle: {name}</p>
                          <p>Description: {description}</p>
                        </div>
                      );
                    } else {
                      return <p>Informations utilisateur non disponibles</p>;
                    }
                  })()}
                </Tooltip>
              </td>
              <td>
                {getCollectionName(doc.collection_id)}
                <FaInfoCircle id={`collection-info-icon-${doc.document_id}`} className="icon" />
                <Tooltip id={`collection-tooltip-${doc.document_id}`} anchorSelect={`#collection-info-icon-${doc.document_id}`} place="top">
                  {(() => {
                    const collection = collections.find((col) => col.collection_id === doc.collection_id);
                    return collection ? (
                      <div>
                        <p>Description: {collection.description}</p>
                        <p>Date de création: {formatDate(collection.date_de_creation)}</p>
                        <p>Dernière modification: {new Date(collection.derniere_modification).toLocaleString()}</p>
                        <p>État du bucket: {collection.etat_bucket}</p>
                      </div>
                    ) : (
                      <p>Informations de collection non disponibles</p>
                    );
                  })()}
                </Tooltip>
              </td>
              <td>
                <button onClick={() => openModal(doc.document_id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Êtes-vous sûr de vouloir supprimer ce document ?</p>
            <button onClick={() => handleDelete(documentToDelete!)}>Oui</button>
            <button onClick={closeModal}>Non</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentTable;
