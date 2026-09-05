import { useEffect, useRef } from 'react';
import { Copy, MessageSquare, Globe2, ExternalLink, Mail, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { copyTextToClipboard, getPostShareUrl, getShareLinks } from '../../utils/sharePost.js';

const shareItems = [
  {
    id: 'copy',
    label: 'Copy link',
    icon: Copy,
    action: async (post) => {
      const url = getPostShareUrl(post._id || post.id);
      await copyTextToClipboard(url);
      toast.success('Link copied to clipboard.');
    },
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageSquare,
    action: async (post) => {
      window.open(getShareLinks(post).whatsapp, '_blank', 'noopener,noreferrer');
    },
  },
  {
    id: 'telegram',
    label: 'Telegram',
    icon: Globe2,
    action: async (post) => {
      window.open(getShareLinks(post).telegram, '_blank', 'noopener,noreferrer');
    },
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: ExternalLink,
    action: async (post) => {
      window.open(getShareLinks(post).facebook, '_blank', 'noopener,noreferrer');
    },
  },
  {
    id: 'email',
    label: 'Email',
    icon: Mail,
    action: async (post) => {
      window.open(getShareLinks(post).email, '_blank', 'noopener,noreferrer');
    },
  },
];

const ShareOptionsMenu = ({ post, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleAction = async (item) => {
    try {
      await item.action(post);
      onClose();
    } catch (error) {
      toast.error(error?.message || 'Unable to complete share action.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-overlay px-4 py-6 sm:items-center sm:px-6">
      <div
        ref={menuRef}
        className="w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-surface-elevated shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3 text-xs uppercase tracking-[0.22em] text-text-muted">
          <span>Share post</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-text-secondary transition-colors hover:text-text-primary"
            aria-label="Close share menu"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-1 p-2">
          {shareItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleAction(item)}
                className="flex w-full items-center gap-2 rounded-2xl px-3 py-3 text-left text-sm text-text-primary transition hover:bg-primary-10 hover:text-text-primary"
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShareOptionsMenu;
