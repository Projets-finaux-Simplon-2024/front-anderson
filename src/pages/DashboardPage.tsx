import React from 'react';
import UserProfile from '../components/UserProfile';
import LogoutButton from '../components/LogoutButton';
import DocumentTable from '../components/DocumentTable';
import UploadDocumentButton from '../components/UploadDocumentButton';
import CollectionTable from '../components/CollectionTable';
import CreateCollectionButton from '../components/CreateCollectionButton';
import Tabs from '../components/Tabs';

const DashboardPage: React.FC = () => {
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
  ];

  return (
    <div>
      <h1>Tableau de bord</h1>
      <UserProfile />
      <Tabs tabs={tabs} />
      <LogoutButton />
    </div>
  );
};

export default DashboardPage;
