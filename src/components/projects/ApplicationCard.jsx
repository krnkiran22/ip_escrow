import { Star, ExternalLink } from 'lucide-react';
import Button from '../ui/Button';

const ApplicationCard = ({ application, onApprove, onReject, onMessage }) => {
  const {
    id = 1,
    applicant = {
      name: 'John Doe',
      avatar: 'JD',
      projectsCompleted: 23,
      rating: 4.9,
      portfolioUrl: '#'
    },
    proposal = 'This is a sample proposal text...',
    appliedDate = '2 days ago'
  } = application || {};
  
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${
          i < Math.floor(rating) 
            ? 'fill-amber-400 text-amber-400' 
            : 'text-slate-300'
        }`} 
      />
    ));
  };
  
  return (
    <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
            {applicant.avatar}
          </div>
          <div>
            <div className="text-base font-semibold text-slate-900">{applicant.name}</div>
            <div className="text-sm text-slate-600">
              {applicant.projectsCompleted} projects • {applicant.rating} rating
            </div>
            <div className="flex gap-0.5 mt-1">
              {renderStars(applicant.rating)}
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-500">Applied {appliedDate}</div>
      </div>
      
      <p className="text-sm text-slate-700 leading-relaxed line-clamp-3 mt-3">
        {proposal}
      </p>
      
      {applicant.portfolioUrl && (
        <a 
          href={applicant.portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1 mt-3"
        >
          View Portfolio
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
      
      <div className="mt-4 flex gap-2">
        <Button 
          size="sm" 
          variant="primary"
          onClick={() => onApprove && onApprove(id)}
        >
          Approve
        </Button>
        <Button 
          size="sm" 
          variant="secondary"
          className="border-red-600 text-red-600"
          onClick={() => onReject && onReject(id)}
        >
          Reject
        </Button>
        <Button 
          size="sm" 
          variant="secondary"
          onClick={() => onMessage && onMessage(id)}
        >
          Message
        </Button>
      </div>
    </div>
  );
};

export default ApplicationCard;
