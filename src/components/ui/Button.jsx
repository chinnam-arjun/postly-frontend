import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'ui-button-primary', secondary: 'ui-button-secondary', outline: 'ui-button-outline',
  ghost: 'ui-button-ghost', danger: 'ui-button-danger', success: 'ui-button-success',
};

export const Button = ({ variant = 'primary', loading = false, className = '', children, type = 'button', disabled, ...props }) => (
  <button type={type} disabled={disabled || loading} className={`ui-button ${variants[variant]} ${className}`} {...props}>
    {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
    {children}
  </button>
);
