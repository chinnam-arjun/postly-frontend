import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, FileText, Moon, PenSquare, Search, Sun, User, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NavbarProfileDropdown from './NavBarProfileDropDown';
import PostLayout from '../../components/posts/postLayout/PostLayout';
import { searchAPI } from '../../redux_apis/search';
import { followThunk } from '../../redux_thunks/userThunk';
import { useTheme } from '../../context/ThemeContext';

const tabs = [
  { id: 'people', label: 'People' },
  { id: 'posts', label: 'Posts' },
  { id: 'articles', label: 'Articles' },
];

const authorId = (item) => String(item?.author?._id || item?.author?.id || item?.author || '');
const isFollowing = (user, id) => (user?.followingIds || user?.following || [])
  .some((item) => String(typeof item === 'object' ? item._id || item.id : item) === String(id));

const Header = ({ isSearchOpen, setIsSearchOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { preference, resolvedTheme, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('people');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [lockedArticle, setLockedArticle] = useState(null);
  const [following, setFollowing] = useState(false);
  const requestId = useRef(0);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSelectedPost(null);
    setLockedArticle(null);
    setLoading(false);
    setError('');
  };

  const saveSearchContext = () => {
    const payload = { query, activeTab };
    sessionStorage.setItem('postly-search-context', JSON.stringify(payload));
  };

  useEffect(() => {
    const handleOpenSearchEvent = (event) => {
      const detail = event?.detail || {};
      if (!detail || typeof detail !== 'object') return;
      setQuery(detail.query || '');
      setActiveTab(detail.activeTab || 'people');
      setIsSearchOpen(true);
    };

    window.addEventListener('postly-open-search', handleOpenSearchEvent);
    return () => window.removeEventListener('postly-open-search', handleOpenSearchEvent);
  }, []);

  useEffect(() => {
    const cleanQuery = query.trim();
    requestId.current += 1;
    const currentRequest = requestId.current;
    if (!isSearchOpen) {
      return undefined;
    }

    if (!cleanQuery) {
      setResults([]);
      setLoading(false);
      setError('');
      return undefined;
    }

    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const nextResults = await searchAPI({ query: cleanQuery, type: activeTab });
        if (currentRequest === requestId.current && isSearchOpen) setResults(nextResults);
      } catch (searchError) {
        if (currentRequest === requestId.current && isSearchOpen) {
          setResults([]);
          setError(searchError?.response?.data?.message || 'Unable to search right now.');
        }
      } finally {
        if (currentRequest === requestId.current && isSearchOpen) setLoading(false);
      }
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [activeTab, isSearchOpen, query]);

  const openArticle = (article) => {
    const id = authorId(article);
    if (id && String(user?._id) !== id && !isFollowing(user, id)) {
      setLockedArticle(article);
      return;
    }
    saveSearchContext();
    closeSearch();
    navigate(`/lists/${article._id}`);
  };

  const followAndOpenArticle = async () => {
    const id = authorId(lockedArticle);
    if (!id) return;
    setFollowing(true);
    try {
      await dispatch(followThunk(id)).unwrap();
      const storyId = lockedArticle._id;
      setLockedArticle(null);
      saveSearchContext();
      closeSearch();
      navigate(`/lists/${storyId}`);
    } catch {
      setError('Unable to follow this author. Please try again.');
    } finally {
      setFollowing(false);
    }
  };

  return (
    <header className="fixed w-full top-0 z-50 border-b px-4 sm:px-6 lg:px-8 h-16 flex items-center bg-surface-elevated border-border">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center min-w-[40px]">
          <button onClick={() => navigate('/lists/create')} className="md:hidden p-2 text-gray-400 hover:bg-gray-800 rounded-full transition-colors"><PenSquare size={24} /></button>
          <div className="hidden md:flex font-bold text-xl items-center gap-1 cursor-pointer" onClick={() => navigate('/')}><span>📝</span><span className="text-purple-500">POST</span><span className="text-blue-500">LY</span></div>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="md:hidden font-bold text-lg flex items-center gap-1 cursor-pointer" onClick={() => navigate('/')}><span>📝</span><span className="text-purple-600">P</span><span className="text-blue-600">L</span></div>
          <button type="button" onClick={() => setIsSearchOpen(true)} className="hidden md:flex w-full max-w-2xl mx-8 relative items-center text-left pl-12 pr-4 py-2.5 rounded-full bg-surface-muted border border-border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all">
            <Search className="absolute left-4 text-text-secondary" size={20} />
            <span className="text-text-secondary">Search people, posts, or articles...</span>
          </button>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 min-w-[40px] justify-end">
          <button className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all font-medium" onClick={() => navigate('/lists/create')}><PenSquare size={18} /><span>Write</span></button>
          <button type="button" onClick={toggleTheme} title={`Theme: ${preference}. Click to change`} aria-label={`Theme: ${preference}. Click to change`} className="grid h-10 w-10 place-items-center rounded-full transition-colors bg-surface-muted text-text-secondary">
            {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <NavbarProfileDropdown />
        </div>
      </div>

      {isSearchOpen && <div className="fixed inset-0 z-[100] flex flex-col bg-background">
        <div className="h-16 flex items-center px-4 sm:px-8 border-b border-border gap-4 bg-surface-elevated">
          <button onClick={closeSearch} className="p-2 rounded-full text-text-secondary hover:bg-surface-muted"><ArrowLeft size={24} /></button>
          <div className="flex-1 relative"><Search className="absolute left-0 top-1/2 -translate-y-1/2 text-text-secondary" size={20} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search people, posts, or articles..." className="w-full pl-8 py-2 text-lg bg-transparent text-text-primary focus:outline-none placeholder:text-text-secondary" /></div>
          <button onClick={closeSearch} className="p-2 text-text-secondary hover:text-text-primary"><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-background">
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2 border-b mb-4">{tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-sm font-semibold border-b-2 ${activeTab === tab.id ? 'border-purple-400 text-purple-300' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>{tab.label}</button>)}</div>
            {!query.trim() && <EmptySearch />}
            {query.trim() && loading && <p className="py-10 text-center text-sm text-gray-400">Searching...</p>}
            {query.trim() && !loading && error && <p className="py-10 text-center text-sm text-red-400">{error}</p>}
            {query.trim() && !loading && !error && results.length === 0 && <p className="py-10 text-center text-sm text-gray-400">No {activeTab} found.</p>}
            {!loading && !error && results.map((result) => <SearchResult key={result._id} type={activeTab} result={result} onClick={() => {
              saveSearchContext();
              if (activeTab === 'people') {
                closeSearch();
                navigate(`/profile/${result._id}`, { state: { fromSearch: true } });
                return;
              }
              if (activeTab === 'posts') {
                closeSearch();
                setSelectedPost(result);
                return;
              }
              if (activeTab === 'articles') openArticle(result);
            }} />)}
          </div>
        </div>
        {selectedPost && <PostOverlay post={selectedPost} onClose={() => setSelectedPost(null)} />}
        {lockedArticle && <FollowGate article={lockedArticle} loading={following} onClose={() => setLockedArticle(null)} onFollow={followAndOpenArticle} />}
      </div>}
    </header>
  );
};

const EmptySearch = () => <div className="text-center mt-20"><Search size={48} className="mx-auto text-text-primary mb-4" /><h3 className="text-text-secondary text-lg">Search Postly</h3><p className="text-text-secondary text-sm">Find people, posts, and articles.</p></div>;

const SearchResult = ({ type, result, onClick }) => {
  const author = result.author || {};
  const person = type === 'people' ? result : author;
  const image = type === 'posts' ? result.images?.[0]?.url || result.images?.[0] : result.thumbnailUrl;
  return <button onClick={onClick} className="w-full flex items-center gap-3 p-4 text-left border-b border-border hover:bg-surface-muted transition-colors">
    {type === 'people' ? (person.profile ? <img src={person.profile} alt="" className="w-11 h-11 rounded-full object-cover" /> : <span className="w-11 h-11 rounded-full bg-surface-muted grid place-items-center text-purple-300"><User size={20} /></span>) : (image ? <img src={image} alt="" className="w-12 h-12 rounded-lg object-cover" /> : <span className="w-12 h-12 rounded-lg bg-surface-muted grid place-items-center text-purple-300"><FileText size={20} /></span>)}
    <span className="min-w-0"><span className="block text-sm font-semibold text-text-primary truncate">{type === 'people' ? person.name || person.username : result.title}</span><span className="block text-xs text-text-secondary truncate">{type === 'people' ? `@${person.username}` : `by @${author.username || 'unknown'}`}</span></span>
  </button>;
};

const PostOverlay = ({ post, onClose }) => <div className="fixed inset-0 z-[110] bg-black/70 p-4 flex items-center justify-center" onClick={(event) => event.target === event.currentTarget && onClose()}><div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto relative"><button onClick={onClose} className="absolute right-3 top-3 z-10 rounded-full bg-gray-950/90 p-2 text-gray-300 hover:text-white"><X size={20} /></button><PostLayout post={post} /></div></div>;

const FollowGate = ({ article, loading, onClose, onFollow }) => (
  <div className="fixed inset-0 z-[110] bg-black/70 p-4 flex items-center justify-center">
    <div className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <button onClick={onClose} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18} /></button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl border border-gray-800 bg-gray-900/80 px-3 py-3">
        <img
          src={article.author?.profilepic || article.author?.profile || 'https://via.placeholder.com/64'}
          alt={article.author?.username || 'Author'}
          className="h-11 w-11 rounded-full object-cover border border-gray-700"
        />
        <div className="flex-1 text-left min-w-0">
          <p className="truncate text-sm font-semibold text-white">@{article.author?.username || 'this author'}</p>
          <p className="text-[11px] text-gray-400">Author</p>
        </div>
        <button
          onClick={onFollow}
          disabled={loading}
          className="rounded-full bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-500 disabled:opacity-60"
        >
          {loading ? 'Following...' : 'Follow'}
        </button>
      </div>

      <div className="mt-6 text-center">
        <FileText className="mx-auto text-purple-300" />
        <h2 className="mt-4 text-lg font-semibold text-white">Please follow the author to read this article</h2>
        <p className="mt-2 text-sm text-gray-400 line-clamp-2">{article.title}</p>
      </div>

      <button onClick={onClose} className="mt-6 w-full text-left text-sm text-gray-300 hover:text-white">
        ← Back to search results
      </button>
    </div>
  </div>
);

export default Header;
