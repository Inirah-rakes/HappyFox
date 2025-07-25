import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <>
      <Navbar /> {/* Global navbar */}
      <main>
        <Outlet /> {/* Renders the child page content */}
      </main>
    </>
  );
};

export default Layout;
