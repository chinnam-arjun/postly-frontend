import { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ open, onClose, title, children, className = '' }) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => event.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, open]);
  if (!open) return null;
  return <div className="fixed inset-0 z-[110] grid place-items-center p-4" style={{ background: 'var(--color-overlay)' }} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}><section role="dialog" aria-modal="true" aria-label={title} className={`ui-card relative max-h-[90vh] w-full overflow-auto ${className}`}><button type="button" onClick={onClose} aria-label="Close dialog" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full" style={{ background: 'var(--color-surface-muted)', color: 'var(--color-text-secondary)' }}><X size={18} /></button>{children}</section></div>;
};
