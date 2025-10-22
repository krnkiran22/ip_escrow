import { clsx } from 'clsx';

const Badge = ({ 
  children, 
  variant = 'neutral', 
  icon: Icon, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium';
  
  const variants = {
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-cyan-100 text-cyan-700',
    neutral: 'bg-slate-100 text-slate-700',
  };
  
  return (
    <span className={clsx(baseClasses, variants[variant], className)} {...props}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
};

export default Badge;
