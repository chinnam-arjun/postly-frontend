import React from 'react';
import { Home, Library, List, User, Search, CameraIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const NavBar = ({ setIsSearchOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

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
      navigate(item.path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 px-4 flex flex-row items-center justify-around z-40 bg-surface-elevated border-t border-border md:top-16 md:left-0 md:w-16 md:h-[calc(100vh-64px)] md:flex-col md:justify-start md:pt-8 md:border-t-0 md:border-r">
      {navItems.map((item) => {
        const Icon = item.icon;
        
        // Hide search icon on desktop/tablet
          if (item.id === 'search') {
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
                className="p-2 text-text-secondary hover:text-primary md:hidden transition-colors"
            >
              <Icon size={24} />
            </button>
          );
        }

        const isActive = item.path === '/' ? location.pathname === '/' || location.pathname === '/feed' : location.pathname.startsWith(item.path);
        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item)}
            className={`p-3 md:mb-4 rounded-xl transition-all duration-200 flex flex-col items-center group relative ${isActive ? 'text-primary bg-primary-10' : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'}`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] mt-1 md:hidden font-medium">{item.label}</span>
            
            {/* Tooltip for Desktop */}
            <span className="hidden md:group-hover:block absolute left-14 bg-surface-elevated text-text-primary text-xs px-2 py-1 rounded ml-2 whitespace-nowrap z-50 border border-border">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default NavBar;
