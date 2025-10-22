import { CheckCircle, Clock, Circle, DollarSign } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const MilestoneCard = ({ milestone, isCreator = false }) => {
  const {
    number = 1,
    title = 'Untitled Milestone',
    description = 'No description provided',
    amount = 500,
    timeline = '2 weeks',
    status = 'pending', // 'completed', 'in-progress', 'pending', 'in-review'
    deliverables = ['Files', 'Documentation']
  } = milestone || {};
  
  const statusConfig = {
    completed: {
      icon: CheckCircle,
      color: 'text-emerald-600',
      borderColor: 'border-l-emerald-600',
    },
    'in-progress': {
      icon: Clock,
      color: 'text-cyan-600',
      borderColor: 'border-l-cyan-600',
    },
    'in-review': {
      icon: Clock,
      color: 'text-amber-600',
      borderColor: 'border-l-amber-600',
    },
    pending: {
      icon: Circle,
      color: 'text-slate-300',
      borderColor: 'border-l-gray-300',
    }
  };
  
  const config = statusConfig[status] || statusConfig.pending;
  const StatusIcon = config.icon;
  
  return (
    <div className={`border border-gray-200 rounded-lg p-5 hover:shadow-md transition border-l-4 ${config.borderColor}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-slate-900">
            Milestone {number}: {title}
          </h4>
        </div>
        <StatusIcon className={`w-6 h-6 ${config.color}`} />
      </div>
      
      <p className="text-sm text-slate-600 mt-2">{description}</p>
      
      <div className="mt-3 flex items-center gap-4">
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-900">${amount}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600">{timeline}</span>
        </div>
      </div>
      
      {deliverables && deliverables.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-medium text-slate-600 mb-1">Deliverables:</div>
          <div className="flex flex-wrap gap-2">
            {deliverables.map((item, index) => (
              <span key={index} className="text-xs text-slate-600 bg-gray-50 px-2 py-1 rounded">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {status === 'in-review' && isCreator && (
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="primary">
            Approve
          </Button>
          <Button size="sm" variant="secondary" className="border-amber-600 text-amber-600">
            Request Changes
          </Button>
        </div>
      )}
      
      {status === 'pending' && !isCreator && (
        <div className="mt-4">
          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
            Start Working
          </Button>
        </div>
      )}
      
      {status === 'completed' && (
        <div className="mt-4">
          <button className="text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
            View Submission
          </button>
        </div>
      )}
    </div>
  );
};

export default MilestoneCard;
