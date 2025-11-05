import { useState } from 'react';
import Card from '../components/ui/Card';
import { 
  TrendingUp, 
  DollarSign, 
  Briefcase, 
  Users, 
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const Analytics = () => {
  // Mock analytics data
  const stats = [
    {
      title: 'Total Earnings',
      value: '$127,450',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Active Projects',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: Briefcase,
      bgColor: 'bg-cyan-100',
      iconColor: 'text-cyan-600'
    },
    {
      title: 'Collaborators',
      value: '24',
      change: '+6',
      trend: 'up',
      icon: Users,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Completion Rate',
      value: '94%',
      change: '-2%',
      trend: 'down',
      icon: TrendingUp,
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600'
    }
  ];
  
  const recentActivity = [
    { date: '2024-02-22', action: 'Project milestone completed', amount: '$5,000', type: 'earning' },
    { date: '2024-02-20', action: 'New collaborator joined', amount: null, type: 'activity' },
    { date: '2024-02-18', action: 'Payment received', amount: '$12,500', type: 'earning' },
    { date: '2024-02-15', action: 'New project created', amount: null, type: 'activity' },
    { date: '2024-02-12', action: 'Project milestone completed', amount: '$8,000', type: 'earning' }
  ];
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics</h1>
          <p className="text-slate-600">Track your performance and earnings</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${
                      stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.title}</div>
                </div>
              </Card>
            );
          })}
        </div>
        
        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Earnings Overview</h3>
              <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                <p className="text-slate-500">Chart visualization coming soon</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Project Distribution</h3>
              <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                <p className="text-slate-500">Chart visualization coming soon</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{activity.action}</div>
                      <div className="text-sm text-slate-500">{new Date(activity.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  {activity.amount && (
                    <div className="font-bold text-emerald-600">{activity.amount}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
