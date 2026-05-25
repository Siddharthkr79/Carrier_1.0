import React from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex bg-surface-50 min-h-screen">
      <AdminSidebar />
      <main className="flex-grow overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
