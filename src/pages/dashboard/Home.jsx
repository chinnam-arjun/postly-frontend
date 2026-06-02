/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Header from './Header';
import NavBar from './NavBar';
import Feed from '../../components/posts/Feed';

const Home = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  return (
    <div className='min-h-screen bg-gray-950 relative text-gray-100'>
      {/* Header: Fixed at top */}
      <div className='w-full h-16 z-50'>
        <Header isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
      </div>
      <div className='flex'>
        {/* Navigation: Sidebar on Desktop, Bottom Bar on Mobile */}
        <NavBar setIsSearchOpen={setIsSearchOpen} />
        {/* Main Content Area */}
        <main className="flex-1 pb-20 md:pb-0 md:pl-16 mt-0">
          <div className="p-0">
              <div className='flex flex-col w-full m-0 box-border max-w-screen'>
                <Feed  />
              </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;