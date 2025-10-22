import { clsx } from 'clsx';

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  required = false,
  error,
  helper,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props 
}) => {
  const baseClasses = 'w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent placeholder:text-slate-400';
  
  const errorClasses = 'border-red-500 focus:ring-red-600';
  const disabledClasses = 'bg-gray-100 cursor-not-allowed opacity-60';
  
  const iconPadding = Icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-semibold text-slate-900 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className={clsx(
            'absolute top-1/2 -translate-y-1/2',
            iconPosition === 'left' ? 'left-3' : 'right-3'
          )}>
            <Icon className="w-5 h-5 text-slate-400" />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={clsx(
            baseClasses,
            error && errorClasses,
            disabled && disabledClasses,
            iconPadding,
            className
          )}
          {...props}
        />
      </div>
      {helper && !error && (
        <p className="text-xs text-slate-500">{helper}</p>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
