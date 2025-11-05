import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />
      
      {/* Main Content */}
      <main 
        className={`transition-all duration-300 pt-20 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <Outlet />
      </main>
      
      <Footer className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-20' : 'ml-64'
      }`} />
    </div>
  );
};

export default DashboardLayout;
