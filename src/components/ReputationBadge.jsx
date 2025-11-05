import React from 'react';
import { Star, Award } from 'lucide-react';

export default function ReputationBadge({ score, size = 'md', showDetails = false, className = '' }) {
  const getRating = (score) => {
    if (score >= 90) return { stars: 5, label: 'Excellent', color: 'emerald' };
    if (score >= 75) return { stars: 4, label: 'Great', color: 'cyan' };
    if (score >= 60) return { stars: 3, label: 'Good', color: 'amber' };
    if (score >= 40) return { stars: 2, label: 'Fair', color: 'orange' };
    return { stars: 1, label: 'Poor', color: 'red' };
  };

  const rating = getRating(score || 0);
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const starSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const getStarColor = (rating) => {
    const colors = {
      emerald: 'fill-emerald-500 text-emerald-500',
      cyan: 'fill-cyan-500 text-cyan-500',
      amber: 'fill-amber-500 text-amber-500',
      orange: 'fill-orange-500 text-orange-500',
      red: 'fill-red-500 text-red-500'
    };
    return colors[rating.color] || 'fill-slate-300 text-slate-300';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Stars */}
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`
              ${starSizeClasses[size]}
              ${star <= rating.stars ? getStarColor(rating) : 'text-slate-300'}
            `}
          />
        ))}
      </div>

      {/* Score */}
      <span className={`font-semibold ${sizeClasses[size]} text-slate-700`}>
        {score || 0}
      </span>

      {/* Badge for top performers */}
      {score >= 90 && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
          <Award className="w-3 h-3" />
          Top Performer
        </span>
      )}

      {/* Details tooltip */}
      {showDetails && (
        <span className="ml-2 text-xs text-slate-500">({rating.label})</span>
      )}
    </div>
  );
}
