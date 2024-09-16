import React from 'react';
import DocumentTable from '../components/DocumentTable';
import UploadDocumentButton from '../components/UploadDocumentButton';
import CollectionTable from '../components/CollectionTable';
import CreateCollectionButton from '../components/CreateCollectionButton';
import UserTable from '../components/UserTable';
import CreateUserButton from '../components/CreateUserButton';
import Tabs from '../components/Tabs';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

const DashboardPage: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);

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
  ].filter(Boolean);

  return (
    <div className="dashboard-container">
      <Header />
      <Tabs tabs={tabs as any} />
      <Footer /> {/* Ajout du Footer */}
    </div>
  );
};

export default DashboardPage;
