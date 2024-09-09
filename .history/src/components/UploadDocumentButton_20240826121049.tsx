import React, { useState, useEffect } from 'react';
import { fetchCollections, Collection, uploadDocument } from '../services/apiService';
import './UploadDocumentButton.css';

const UploadDocumentButton: React.FC = () => {
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [title, setTitle] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const collectionsData = await fetchCollections();
        setCollections(collectionsData);
        if (collectionsData.length > 0) {
          setSelectedCollection(collectionsData[0]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des collections :', error);
      }
    };

    loadCollections();
  }, []);

  const openUploadModal = () => {
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setSelectedCollection(collections.length > 0 ? collections[0] : null);
    setTitle('');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedCollection || title === '') return;

    setUploading(true);
    try {
      await uploadDocument(selectedFile, selectedCollection.collection_id, selectedCollection.name, title);
      closeUploadModal();

      // Émettre un événement personnalisé pour informer de la mise à jour
      const event = new CustomEvent('documentsUpdated');
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Erreur lors du téléchargement du document :', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <button onClick={openUploadModal} disabled={collections.length === 0}>
        Ajouter un document
      </button>

      {showUploadModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Ajouter un document</h2>
            
            <label>Collection :</label>
            <select
              value={selectedCollection?.collection_id || ''}
              onChange={(e) => {
                const collection = collections.find(col => col.collection_id === Number(e.target.value));
                setSelectedCollection(collection || null);
              }}
            >
              {collections.map((collection) => (
                <option key={collection.collection_id} value={collection.collection_id}>
                  {collection.name}
                </option>
              ))}
            </select>

            <label>Nom du document :</label>
            <input
              type="text"
              placeholder="Titre du document"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label>Fichier :</label>
            <input type="file" onChange={handleFileSelect} />

            <div className="modal-buttons">
              <button onClick={closeUploadModal}>Annuler</button>
              <button onClick={handleUpload} disabled={uploading || !selectedFile || !selectedCollection}>
                {uploading ? 'Chargement...' : 'Valider'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadDocumentButton;
