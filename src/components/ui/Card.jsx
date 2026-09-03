export const Card = ({ className = '', children, ...props }) => <section className={`ui-card ${className}`} {...props}>{children}</section>;
