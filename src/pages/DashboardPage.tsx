import React from 'react';
import UserProfile from '../components/UserProfile';
import LogoutButton from '../components/LogoutButton';
import DocumentTable from '../components/DocumentTable';
import UploadDocumentButton from '../components/UploadDocumentButton';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <h1>Tableau de bord</h1>
      <UserProfile />
      <UploadDocumentButton />
      <DocumentTable />
      <LogoutButton />
    </div>
  );
};

export default DashboardPage;
