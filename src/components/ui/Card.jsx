import { clsx } from 'clsx';

const Card = ({ 
  children, 
  variant = 'default', 
  header, 
  footer, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'bg-white border border-gray-200 rounded-xl';
  
  const variants = {
    default: 'p-6',
    hover: 'p-6 hover:shadow-lg transition',
    interactive: 'p-6 hover:shadow-lg hover:border-cyan-600 cursor-pointer transition',
  };
  
  return (
    <div className={clsx(baseClasses, variants[variant], className)} {...props}>
      {header && (
        <div className="border-b border-gray-200 pb-4 mb-4">
          {header}
        </div>
      )}
      {children}
      {footer && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
