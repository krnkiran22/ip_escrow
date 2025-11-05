const Avatar = ({ 
  src, 
  alt, 
  name, 
  size = 'medium', 
  shape = 'circle',
  online = false,
  className = '' 
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    small: 'w-8 h-8 text-sm',
    medium: 'w-10 h-10 text-base',
    large: 'w-12 h-12 text-lg',
    xlarge: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
    '3xl': 'w-24 h-24 text-3xl'
  };
  
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-lg';
  
  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  const initials = name ? getInitials(name) : '?';
  
  // Generate consistent color based on name
  const getColorClass = (name) => {
    if (!name) return 'bg-slate-400';
    const colors = [
      'bg-linear-to-br from-cyan-500 to-cyan-600',
      'bg-linear-to-br from-emerald-500 to-emerald-600',
      'bg-linear-to-br from-amber-500 to-amber-600',
      'bg-linear-to-br from-purple-500 to-purple-600',
      'bg-linear-to-br from-pink-500 to-pink-600',
      'bg-linear-to-br from-blue-500 to-blue-600',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };
  
  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`${sizeClasses[size]} ${shapeClass} overflow-hidden flex items-center justify-center bg-slate-100`}>
        {src ? (
          <img 
            src={src} 
            alt={alt || name || 'Avatar'} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${getColorClass(name)} text-white font-bold`}>
            {initials}
          </div>
        )}
      </div>
      
      {/* Online indicator */}
      {online && (
        <span className={`absolute bottom-0 right-0 block rounded-full bg-emerald-500 ring-2 ring-white ${
          size === 'xs' || size === 'small' ? 'w-2 h-2' : 'w-3 h-3'
        }`} />
      )}
    </div>
  );
};

export default Avatar;
