import React, { useState, useEffect } from 'react';
import { fetchCollections, Collection, uploadDocument } from '../services/apiService';
import './UploadDocumentButton.css';

const ALLOWED_EXTENSIONS = ['pdf', 'txt', 'html', 'docx'];

const UploadDocumentButton: React.FC = () => {
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [title, setTitle] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
        setError('Erreur lors du chargement des collections.');
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
    setError(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension && ALLOWED_EXTENSIONS.includes(fileExtension)) {
        setSelectedFile(file);
        setError(null); // Clear any previous error
      } else {
        setSelectedFile(null);
        setError(`Format de fichier non pris en charge. Formats autorisés : ${ALLOWED_EXTENSIONS.join(', ')}.`);
      }
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedCollection || title.trim() === '') {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await uploadDocument(selectedFile, selectedCollection.collection_id, selectedCollection.name, title);
      closeUploadModal();

      const event = new CustomEvent('documentsUpdated');
      window.dispatchEvent(event);
    } catch (error: any) {
      console.error('Erreur lors du téléchargement du document :', error);
      setError('Une erreur inattendue est survenue lors du téléchargement du document.');
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

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

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
            <input type="file" onChange={handleFileSelect} accept={ALLOWED_EXTENSIONS.map(ext => `.${ext}`).join(', ')} />

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
