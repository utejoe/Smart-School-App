// src/components/Layout/Layout.tsx
import React, { ReactNode } from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div className="layout-main" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Navbar />
        <div className="layout-content" style={{ padding: 24, flex: 1, backgroundColor: 'var(--background)' }}>
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
