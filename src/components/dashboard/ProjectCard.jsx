import { Link } from 'react-router-dom';
import { User, DollarSign, Flag, Tag, ArrowRight, Star } from 'lucide-react';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';

const ProjectCard = ({ project }) => {
  const {
    id = 1,
    title = 'Untitled Project',
    role = 'Project Creator',
    status = 'Active',
    description = 'No description provided.',
    category = 'Design',
    budget = 2000,
    milestonesTotal = 4,
    milestonesCompleted = 2,
    progress = 50,
    collaborator = {
      name: 'John Doe',
      avatar: 'JD',
      rating: 4.5
    }
  } = project || {};
  
  const statusVariants = {
    'Active': 'success',
    'In Review': 'warning',
    'Completed': 'neutral',
    'Disputed': 'danger',
  };
  
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
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-cyan-600 transition cursor-pointer">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
            <User className="w-4 h-4" />
            <span>You're the {role}</span>
          </div>
        </div>
        
        <Badge variant={statusVariants[status] || 'neutral'}>
          {status}
        </Badge>
      </div>
      
      <p className="text-sm text-slate-600 line-clamp-2 mt-4">
        {description}
      </p>
      
      <div className="flex flex-wrap gap-2 mt-4">
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-md text-xs text-slate-600">
          <Tag className="w-3 h-3" />
          <span>{category}</span>
        </div>
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-md text-xs text-slate-600">
          <DollarSign className="w-3 h-3" />
          <span>${budget}</span>
        </div>
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-md text-xs text-slate-600">
          <Flag className="w-3 h-3" />
          <span>{milestonesTotal} milestones</span>
        </div>
      </div>
      
      <div className="mt-4">
        <ProgressBar percentage={progress} showLabel />
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
            {collaborator.avatar}
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900">{collaborator.name}</div>
            <div className="flex gap-0.5 mt-1">
              {renderStars(collaborator.rating)}
            </div>
          </div>
        </div>
        
        <Link 
          to={`/project/${id}`}
          className="text-sm font-medium text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
