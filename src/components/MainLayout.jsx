import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../pages/dashboard/Header';
import NavBar from '../pages/dashboard/NavBar';

const MainLayout = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className='min-h-screen bg-gray-950 relative text-gray-100'>
      {/* Header: Fixed at top */}
      <Header isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
      
      <div className='flex pt-16'>
        {/* Navigation: Sidebar on Desktop, Bottom Bar on Mobile */}
        <NavBar setIsSearchOpen={setIsSearchOpen} />
        
        {/* Main Content Area */}
        <main className="flex-1 pb-20 md:pb-0 md:pl-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
