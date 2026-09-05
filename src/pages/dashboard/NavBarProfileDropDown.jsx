import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Settings, User, Bookmark, LogOut, Plus, ChevronDown } from 'lucide-react';
import { clearAuth } from '../../redux_slices/authSlice';

const NavbarProfileDropdown = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    dispatch(clearAuth());
    localStorage.removeItem('token');
    navigate('/signin');
  };

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all duration-150
          ${open ? 'border-violet-500' : 'border-gray-700 hover:border-violet-400'}`}
      >
        <img
          src={user.profile || 'https://via.placeholder.com/150'}
          alt={user.username}
          className="w-full h-full object-cover"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] w-60 bg-surface-elevated border border-border rounded-2xl overflow-hidden shadow-2xl z-50
          animate-in fade-in slide-in-from-top-2 duration-150">

          {/* Header */}
          <div className="flex items-center gap-3 p-4 bg-surface-elevated border-b border-border">
            <img
              src={user.profile || 'https://via.placeholder.com/150'}
              alt={user.username}
              className="w-11 h-11 rounded-full object-cover border-2 border-gray-700"
            />
            <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{user.username}</p>
                <p className="text-xs text-text-muted truncate">@{user.username}</p>
            </div>
          </div>

          {/* Menu items */}
          <div className="p-1.5 space-y-0.5">
            <button onClick={() => { navigate(`/profile`); setOpen(false); }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:bg-surface-muted hover:text-text-primary transition-colors">
              <User size={16} /> View profile
            </button>
            <button onClick={() => { navigate('/saved'); setOpen(false); }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:bg-surface-muted hover:text-text-primary transition-colors">
              <Bookmark size={16} /> Saved posts
            </button>
            <button onClick={() => { navigate('/settings'); setOpen(false); }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:bg-surface-muted hover:text-text-primary transition-colors">
              <Settings size={16} /> Settings
            </button>
          </div>

          <div className="border-t border-gray-700 mx-1.5" />

          {/* Switch account */}
          <div className="p-1.5">
            <p className="text-xs text-text-muted uppercase tracking-wide px-3 py-1.5">switch account</p>
            <button className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-gray-700 transition-colors">
              <img src={user.profile} className="w-7 h-7 rounded-full object-cover border border-gray-600" />
              <span className="text-sm text-text-secondary truncate">{user.username}</span>
              <span className="ml-auto w-2 h-2 rounded-full bg-green-400" />
            </button>
            <button className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-violet-400 hover:bg-violet-500/10 transition-colors text-sm">
              <Plus size={15} /> Add account
            </button>
          </div>

          <div className="border-t border-gray-700 mx-1.5" />

          {/* Logout */}
          <div className="p-1.5">
            <button onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut size={16} /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarProfileDropdown;