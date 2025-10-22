import { TrendingUp } from 'lucide-react';

const StatsCard = ({ 
  title = 'Stat Title',
  value = '0',
  label = 'Label',
  subtext = '',
  icon: Icon,
  iconBgColor = 'bg-cyan-100',
  iconColor = 'text-cyan-600',
  trend,
  trendUp = true
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          {Icon && <Icon className={`w-6 h-6 ${iconColor}`} />}
        </div>
        
        {trend && (
          <div className={`text-xs font-medium flex items-center gap-1 ${
            trendUp ? 'text-emerald-600' : 'text-red-600'
          }`}>
            <TrendingUp className={`w-3 h-3 ${!trendUp && 'rotate-180'}`} />
            <span>{trend}</span>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        <div className="text-sm font-medium text-slate-600 mt-1">{label}</div>
        {subtext && (
          <div className="text-xs text-slate-400 mt-1">{subtext}</div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
