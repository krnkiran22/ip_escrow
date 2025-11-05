import { Loader2 } from 'lucide-react';

const Spinner = ({ size = 'medium', color = 'primary', text, className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };
  
  const colorClasses = {
    primary: 'text-cyan-600',
    white: 'text-white',
    gray: 'text-slate-400',
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    danger: 'text-red-600'
  };
  
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} />
      {text && <p className="text-sm text-slate-600">{text}</p>}
    </div>
  );
};

// Full page loading overlay
export const LoadingOverlay = ({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <Spinner size="large" text={text} />
    </div>
  );
};

export default Spinner;
