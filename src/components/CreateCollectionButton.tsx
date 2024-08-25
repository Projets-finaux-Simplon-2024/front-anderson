import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { createCollection } from '../services/apiService';
import { RootState } from '../app/store'; // Importez le type pour accéder à l'état de Redux

const CreateCollectionButton: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [collectionName, setCollectionName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [creating, setCreating] = useState<boolean>(false);

  const auth = useSelector((state: RootState) => state.auth); // Sélectionner l'état auth de Redux

  const handleCreate = async () => {
    if (collectionName === '') return;

    setCreating(true);
    try {
      await createCollection(collectionName, description);
      closeUploadModal();

      // Émettre un événement personnalisé pour informer de la mise à jour
      const event = new CustomEvent('collectionsUpdated');
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Erreur lors de la création de la collection :', error);
    } finally {
      setCreating(false);
    }
  };

  const openUploadModal = () => {
    setShowModal(true);
  };

  const closeUploadModal = () => {
    setShowModal(false);
    setCollectionName('');
    setDescription('');
  };

  return (
    <div>
      <button 
        onClick={openUploadModal} 
        disabled={!auth.role?.author_post_collection} // Désactiver le bouton si l'utilisateur n'a pas les droits
      >
        Créer une collection
      </button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Créer une collection</h2>

            <label>Nom de la collection :</label>
            <input
              type="text"
              placeholder="Nom de la collection"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
            />

            <label>Description :</label>
            <textarea
              placeholder="Description de la collection"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <div className="modal-buttons">
              <button onClick={closeUploadModal}>Annuler</button>
              <button onClick={handleCreate} disabled={creating || collectionName === ''}>
                {creating ? 'Chargement...' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCollectionButton;
