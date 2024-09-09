import React, { useState } from 'react';
import { Collection, patchCollection } from '../services/apiService';

export interface PatchCollectionButtonProps {
  collection: Collection;
  disabled?: boolean; // Ajout de la prop 'disabled'
}

const PatchCollectionButton: React.FC<PatchCollectionButtonProps> = ({ collection, disabled }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [collectionName, setCollectionName] = useState<string>(collection.name);
  const [description, setDescription] = useState<string>(collection.description);
  const [updating, setUpdating] = useState<boolean>(false);

  const handleUpdate = async () => {
    if (collectionName === '') return;

    setUpdating(true);
    try {
      await patchCollection(collection.collection_id, collectionName, description);
      closeModal();

      // Émettre un événement personnalisé pour informer de la mise à jour
      const event = new CustomEvent('collectionsUpdated');
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la collection :', error);
    } finally {
      setUpdating(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCollectionName(collection.name);
    setDescription(collection.description);
  };

  return (
    <div>
      <button onClick={openModal} disabled={disabled}>
        Modifier
      </button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Modifier la collection</h2>

            <label>Nom de la collection :</label>
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
            />

            <label>Description :</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <div className="modal-buttons">
              <button onClick={closeModal}>Annuler</button>
              <button onClick={handleUpdate} disabled={updating || collectionName === ''}>
                {updating ? 'Mise à jour...' : 'Valider'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatchCollectionButton;
