import React, { useState } from 'react';
import { Home, Library, List, User, Search, CameraIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ setIsSearchOpen }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'library', icon: Library, label: 'Library', path: '/library' },
    { id: 'lists', icon: List, label: 'Lists', path: '/lists' },
    { id: 'search', icon: Search, label: 'Search', mobileOnly: true }, // Search only for mobile
    { id: 'add-post', icon: CameraIcon, label: 'Add Post', path: '/addpost' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },

  ];

  const handleNavClick = (item) => {
    if (item.id === 'search') {
      setIsSearchOpen(true);
    } else {
      setActiveTab(item.id);
      navigate(item.path);
    }
  };

  return (
    <nav className="
      /* Mobile Styles */
      fixed bottom-0 left-0 w-full h-16 bg-gray-950/90 backdrop-blur-md border-t border-gray-800 px-4 flex flex-row items-center justify-around z-40
      /* Desktop/Tablet Styles */
      md:top-16 md:left-0 md:w-16 md:h-[calc(100vh-64px)] md:flex-col md:justify-start md:pt-8 md:border-t-0 md:border-r md:border-gray-800/50
    ">
      {navItems.map((item) => {
        const Icon = item.icon;
        
        // Hide search icon on desktop/tablet
        if (item.id === 'search') {
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className="p-2 text-gray-400 hover:text-purple-400 md:hidden transition-colors"
            >
              <Icon size={24} />
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item)}
            className={`p-3 md:mb-4 rounded-xl transition-all duration-200 flex flex-col items-center group relative
              ${activeTab === item.id ? 'text-purple-400 bg-purple-500/10' : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'}
            `}
          >
            <Icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="text-[10px] mt-1 md:hidden font-medium">{item.label}</span>
            
            {/* Tooltip for Desktop */}
            <span className="hidden md:group-hover:block absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded ml-2 whitespace-nowrap z-50">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default NavBar;