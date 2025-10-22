import { clsx } from 'clsx';

const ProgressBar = ({ 
  percentage = 0, 
  variant = 'success', 
  showLabel = false,
  striped = false,
  size = 'md',
  className = '',
}) => {
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  const variants = {
    success: 'bg-emerald-600',
    warning: 'bg-amber-600',
    danger: 'bg-red-600',
    info: 'bg-cyan-600',
  };
  
  return (
    <div className={className}>
      {showLabel && (
        <div className="text-xs text-slate-600 text-right mb-1">{percentage}%</div>
      )}
      <div className={clsx('w-full bg-gray-200 rounded-full overflow-hidden', sizes[size])}>
        <div 
          className={clsx('h-full rounded-full transition-all duration-300', variants[variant])}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
