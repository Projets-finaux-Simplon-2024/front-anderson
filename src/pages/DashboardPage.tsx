import React from 'react';
import UserProfile from '../components/UserProfile';
import LogoutButton from '../components/LogoutButton';
import DocumentTable from '../components/DocumentTable';
import UploadDocumentButton from '../components/UploadDocumentButton';
import CollectionTable from '../components/CollectionTable';
import CreateCollectionButton from '../components/CreateCollectionButton';
import UserTable from '../components/UserTable';
import CreateUserButton from '../components/CreateUserButton';
import Tabs from '../components/Tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

const DashboardPage: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth); // Sélectionner l'état auth de Redux

  const tabs = [
    {
      label: 'Documents',
      content: (
        <>
          <UploadDocumentButton />
          <DocumentTable />
        </>
      ),
    },
    {
      label: 'Collections',
      content: (
        <>
          <CreateCollectionButton />
          <CollectionTable />
        </>
      ),
    },
    auth.role?.author_delete_user && {
      label: 'Gestion des utilisateurs',
      content: (
        <>
          <CreateUserButton />
          <UserTable />
        </>
      ),
    },
  ].filter(Boolean); // Supprime les éléments undefined si l'utilisateur n'a pas accès

  return (
    <div>
      <img src="/images/icons8-néo-144.png" alt="Néo" />
      <h1>Tableau de bord</h1>
      <UserProfile />
      <Tabs tabs={tabs as any} />
      <LogoutButton />
    </div>
  );
};

export default DashboardPage;
