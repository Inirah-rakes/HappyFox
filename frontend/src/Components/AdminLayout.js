import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../Components/AdminNavbar'; // Import the new AdminNavbar component

const AdminLayout = () => {
  return (
    <>
      <AdminNavbar /> {/* Global admin navbar */}
      <main>
        <Outlet /> {/* Renders the child admin page content */}
      </main>
    </>
  );
};

export default AdminLayout;
