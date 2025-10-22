import { Calendar, Activity } from 'lucide-react';

const ActivityFeed = () => {
  const upcomingMilestones = [
    { id: 1, project: 'Children\'s Book', milestone: 'Final Illustrations', daysLeft: 2, urgent: 'warning' },
    { id: 2, project: 'Logo Design', milestone: 'Brand Guidelines', daysLeft: 5, urgent: 'normal' },
    { id: 3, project: 'Web Development', milestone: 'Backend API', daysLeft: -1, urgent: 'overdue' },
  ];
  
  const recentActivity = [
    { id: 1, text: 'John approved Milestone 2', time: '2 hours ago', isRecent: true },
    { id: 2, text: 'New application received', time: '5 hours ago', isRecent: false },
    { id: 3, text: 'Payment released for Milestone 1', time: '1 day ago', isRecent: false },
    { id: 4, text: 'Project "Logo Design" created', time: '2 days ago', isRecent: false },
  ];
  
  const getUrgencyColor = (urgent) => {
    switch (urgent) {
      case 'overdue': return 'bg-red-500';
      case 'warning': return 'bg-amber-500';
      default: return 'bg-slate-300';
    }
  };
  
  const getUrgencyText = (daysLeft) => {
    if (daysLeft < 0) return 'Overdue';
    if (daysLeft === 0) return 'Due today';
    return `${daysLeft} days left`;
  };
  
  return (
    <div className="space-y-6">
      {/* Upcoming Milestones */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Upcoming Milestones</h3>
          <Calendar className="w-5 h-5 text-slate-400" />
        </div>
        
        <div className="space-y-4">
          {upcomingMilestones.map((item, index) => (
            <div 
              key={item.id} 
              className={`flex items-start gap-3 ${
                index !== upcomingMilestones.length - 1 ? 'border-b border-gray-100 pb-4' : ''
              }`}
            >
              <div className={`w-3 h-3 rounded-full mt-1 ${getUrgencyColor(item.urgent)}`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900">{item.project}</div>
                <div className="text-xs text-slate-600">{item.milestone}</div>
              </div>
              <div className={`text-xs ${
                item.urgent === 'overdue' ? 'text-red-600 font-medium' : 'text-slate-500'
              }`}>
                {getUrgencyText(item.daysLeft)}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
          <Activity className="w-5 h-5 text-slate-400" />
        </div>
        
        <div className="relative">
          <div className="absolute left-1 top-2 bottom-2 w-px bg-slate-200" />
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex gap-3 relative">
                <div className={`w-2 h-2 rounded-full mt-2 z-10 ${
                  item.isRecent ? 'bg-emerald-600' : 'bg-slate-300'
                }`} />
                <div>
                  <div className="text-sm text-slate-900">{item.text}</div>
                  <div className="text-xs text-slate-500 mt-1">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;
