import { Calendar, ShieldCheck, Download, Copy } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const IPAssetCard = ({ asset }) => {
  const {
    type = 'Document',
    title = 'Untitled Asset',
    registrationDate = 'Jan 15, 2025',
    ipAssetId = '0xabcd...1234',
    derivatives = 3,
    revenue = 1240,
    licenses = 5,
    coOwners = 2,
  } = asset || {};
  
  const typeIcons = {
    Document: '📄',
    Image: '🖼️',
    Code: '💻',
    Music: '🎵',
    Video: '🎬',
  };
  
  const typeColors = {
    Document: 'from-blue-400 to-blue-600',
    Image: 'from-purple-400 to-purple-600',
    Code: 'from-green-400 to-green-600',
    Music: 'from-pink-400 to-pink-600',
    Video: 'from-orange-400 to-orange-600',
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition group cursor-pointer">
      {/* Preview Section */}
      <div className={`aspect-video bg-gradient-to-br ${typeColors[type] || typeColors.Document} relative overflow-hidden flex items-center justify-center`}>
        <div className="text-6xl">{typeIcons[type] || typeIcons.Document}</div>
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <Button variant="secondary" className="bg-white text-slate-900">
            View Details
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <Badge variant="info">{type}</Badge>
        </div>
        
        <h3 className="text-lg font-semibold text-slate-900 mt-3 line-clamp-2">
          {title}
        </h3>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">Registered {registrationDate}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-600">Verified on Story Protocol</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="font-mono text-xs text-slate-500 truncate flex-1">{ipAssetId}</span>
            <Copy className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer flex-shrink-0" />
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-slate-900">{derivatives}</div>
            <div className="text-xs text-slate-600">Derivatives</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-slate-900">${revenue}</div>
            <div className="text-xs text-slate-600">Revenue</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-slate-900">{licenses}</div>
            <div className="text-xs text-slate-600">Licenses</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-slate-900">{coOwners}</div>
            <div className="text-xs text-slate-600">Co-owners</div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <Button size="sm" className="flex-1">View Details</Button>
          <Button size="sm" variant="secondary" className="flex-shrink-0">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IPAssetCard;
