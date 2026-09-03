import { User } from 'lucide-react';
export const Avatar = ({ src, alt = '', className = '' }) => src ? <img src={src} alt={alt} className={`ui-avatar ${className}`} /> : <span className={`ui-avatar ui-avatar-fallback ${className}`}><User size={16} /></span>;
