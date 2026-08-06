import { useEffect, useRef, useState } from 'react';
import {
  Share2,
  Copy,
  MessageSquare,
  Mail,
  Globe2,
  ExternalLink,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  canUseWebShare,
  copyTextToClipboard,
  getPostShareData,
  getPostShareUrl,
  getShareLinks,
  sharePostUsingNative,
} from '../../utils/sharePost.js';

const shareFallbackItems = [
  {
    id: 'copy',
    label: 'Copy link',
    icon: Copy,
    action: (post) => copyTextToClipboard(getPostShareUrl(post._id || post.id)),
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageSquare,
    url: (post) => getShareLinks(post).whatsapp,
  },
  {
    id: 'telegram',
    label: 'Telegram',
    icon: Globe2,
    url: (post) => getShareLinks(post).telegram,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: ExternalLink,
    url: (post) => getShareLinks(post).facebook,
  },
  {
    id: 'email',
    label: 'Email',
    icon: Mail,
    url: (post) => getShareLinks(post).email,
  },
];

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

  const handleFallbackAction = async (item) => {
    try {
      if (item.action) {
        await item.action(post);
        toast.success('Link copied to clipboard');
      } else if (item.url) {
        window.open(item.url(post), '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      toast.error(error.message || 'Unable to share this post.');
    } finally {
      setMenuOpen(false);
    }
  };

  const shareData = getPostShareData(post);

  return (
    <div ref={buttonRef} className="relative">
      <button
        type="button"
        onClick={handleShareClick}
        className="inline-flex items-center justify-center rounded-full p-2 text-gray-400 transition-colors hover:text-gray-200"
        aria-label="Share post"
      >
        <Share2 size={22} />
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-3xl border border-gray-800 bg-gray-950 shadow-xl shadow-black/40">
          <div className="border-b border-gray-800/70 px-4 py-3 text-xs uppercase tracking-[0.22em] text-gray-500">
            Share post
          </div>
          <div className="space-y-1 p-2">
            <button
              type="button"
              onClick={async () => {
                try {
                  await copyTextToClipboard(getPostShareUrl(post._id || post.id));
                  toast.success('Link copied successfully.');
                } catch (error) {
                  toast.error(error.message || 'Copy failed.');
                } finally {
                  setMenuOpen(false);
                }
              }}
              className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm text-gray-200 transition hover:bg-gray-900"
            >
              <Copy size={16} />
              Copy link
            </button>
            {shareFallbackItems
              .filter((item) => item.id !== 'copy')
              .map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleFallbackAction(item)}
                    className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm text-gray-200 transition hover:bg-gray-900"
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                );
              })}
            <div className="mt-2 rounded-2xl bg-gray-900/80 px-3 py-2 text-xs text-gray-500">
              {shareData.text}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharePostButton;
