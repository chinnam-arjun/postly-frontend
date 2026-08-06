import { useEffect, useRef, useState } from 'react';
import { Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { canUseWebShare, sharePostUsingNative } from '../../utils/sharePost.js';
import ShareOptionsMenu from './ShareOptionsMenu.jsx';

const SharePostButton = ({ post }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNativeShareClick = async () => {
    try {
      await sharePostUsingNative(post);
      toast.success('Sharing dialog opened.');
    } catch (error) {
      const isAbort = error?.name === 'AbortError' || /aborted|cancelled|canceled/i.test(error?.message || '');
      if (isAbort) {
        toast('Sharing was cancelled.');
        return;
      }
      toast.error(error.message || 'Native sharing failed.');
      setMenuOpen(true);
    }
  };

  const handleShareClick = async () => {
    if (!post?._id && !post?.id) {
      toast.error('Unable to share this post right now.');
      return;
    }

    if (canUseWebShare()) {
      await handleNativeShareClick();
      return;
    }

    toast('Native sharing is unavailable in this browser. Use a fallback option.', {
      icon: '🔗',
    });
    setMenuOpen((current) => !current);
  };

  return (
    <div ref={buttonRef} className="relative inline-flex">
      <button
        type="button"
        onClick={handleShareClick}
        className="inline-flex items-center justify-center rounded-full p-2 text-gray-400 transition-colors hover:text-gray-200"
        aria-label="Share post"
      >
        <Share2 size={22} />
      </button>

      {menuOpen && <ShareOptionsMenu post={post} onClose={() => setMenuOpen(false)} />}
    </div>
  );
};

export default SharePostButton;
