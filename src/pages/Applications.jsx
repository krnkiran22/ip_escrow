import { useState } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import Avatar from '../components/ui/Avatar';
import { Search, Filter, Send, Inbox, CheckCircle2, X, Eye, Clock, DollarSign } from 'lucide-react';

const Applications = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data - replace with actual API
  const receivedApplications = [
    {
      id: 1,
      applicantName: 'Alex Rivera',
      applicantAvatar: 'AR',
      projectTitle: 'AI-Powered Content Generation Platform',
      appliedDate: '2024-02-22',
      status: 'pending',
      proposedRate: 6000,
      experience: '5 years',
      rating: 4.8,
      completedProjects: 23,
      coverLetter: 'I have extensive experience in AI/ML development with a focus on NLP and content generation. I\'ve built similar systems for Fortune 500 companies...',
      skills: ['Python', 'TensorFlow', 'NLP', 'REST APIs']
    },
    {
      id: 2,
      applicantName: 'Sarah Chen',
      applicantAvatar: 'SC',
      projectTitle: 'Blockchain-Based Supply Chain Solution',
      appliedDate: '2024-02-20',
      status: 'pending',
      proposedRate: 8500,
      experience: '7 years',
      rating: 4.9,
      completedProjects: 45,
      coverLetter: 'Blockchain architect with proven track record in supply chain solutions. Led development of 3 major enterprise blockchain projects...',
      skills: ['Solidity', 'Ethereum', 'Hyperledger', 'Node.js']
    }
  ];
  
  const sentApplications = [
    {
      id: 3,
      projectTitle: 'DeFi Lending Protocol',
      projectOwner: 'Mike Johnson',
      appliedDate: '2024-02-20',
      status: 'pending',
      proposedRate: 5000,
      projectBudget: 50000,
      coverLetter: 'I have 5 years of experience in DeFi development...'
    },
    {
      id: 4,
      projectTitle: 'NFT Marketplace Platform',
      projectOwner: 'Emma Wilson',
      appliedDate: '2024-02-18',
      status: 'accepted',
      proposedRate: 8000,
      projectBudget: 75000,
      coverLetter: 'Expert in NFT smart contracts and marketplace development...'
    },
    {
      id: 5,
      projectTitle: 'Social Media Analytics Tool',
      projectOwner: 'David Park',
      appliedDate: '2024-02-15',
      status: 'rejected',
      proposedRate: 4500,
      projectBudget: 40000,
      coverLetter: 'Experienced data scientist with background in social media analytics...'
    }
  ];
  
  const getStatusBadge = (status) => {
    const config = {
      pending: { variant: 'warning', text: 'Pending', icon: Clock },
      accepted: { variant: 'success', text: 'Accepted', icon: CheckCircle2 },
      rejected: { variant: 'danger', text: 'Rejected', icon: X }
    };
    
    const { variant, text, icon: Icon } = config[status] || config.pending;
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {text}
      </Badge>
    );
  };
  
  // Received Applications Tab
  const ReceivedTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Applications Received</h2>
          <p className="text-slate-600 mt-1">Review and manage applications for your projects</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>
      
      {receivedApplications.length > 0 ? (
        <div className="space-y-4">
          {receivedApplications.map((app) => (
            <Card key={app.id} className="hover:shadow-lg transition">
              <div className="p-6">
                <div className="flex gap-6">
                  {/* Applicant Info */}
                  <div className="shrink-0">
                    <Avatar 
                      name={app.applicantName}
                      size="xlarge"
                    />
                    <div className="mt-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <span className="text-amber-500">★</span>
                        <span className="font-semibold">{app.rating}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {app.completedProjects} projects
                      </div>
                    </div>
                  </div>
                  
                  {/* Application Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{app.applicantName}</h3>
                        <p className="text-sm text-slate-600">Applied for: <span className="font-semibold">{app.projectTitle}</span></p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-6 mb-4 text-sm">
                      <div>
                        <span className="text-slate-500">Experience: </span>
                        <span className="font-medium text-slate-900">{app.experience}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Proposed Rate: </span>
                        <span className="font-semibold text-cyan-600">${app.proposedRate.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Applied: </span>
                        <span className="font-medium text-slate-900">{new Date(app.appliedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {app.skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                    
                    {/* Cover Letter */}
                    <div className="bg-slate-50 p-4 rounded-lg mb-4">
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">Cover Letter</h4>
                      <p className="text-sm text-slate-700 line-clamp-2">{app.coverLetter}</p>
                    </div>
                    
                    {/* Actions */}
                    {app.status === 'pending' && (
                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          View Full Profile
                        </Button>
                        <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                        <Button variant="outline" className="text-red-600 hover:bg-red-50">
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Inbox className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Applications Yet</h3>
          <p className="text-slate-600">Applications for your projects will appear here</p>
        </Card>
      )}
    </div>
  );
  
  // Sent Applications Tab
  const SentTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Applications Sent</h2>
        <p className="text-slate-600 mt-1">Track the status of your applications</p>
      </div>
      
      {sentApplications.length > 0 ? (
        <div className="space-y-4">
          {sentApplications.map((app) => (
            <Card key={app.id} className="hover:shadow-lg transition">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">{app.projectTitle}</h3>
                      {getStatusBadge(app.status)}
                    </div>
                    <p className="text-sm text-slate-600 mb-3">Project Owner: <span className="font-semibold">{app.projectOwner}</span></p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Your Proposal</div>
                      <div className="font-semibold text-slate-900">${app.proposedRate.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Project Budget</div>
                      <div className="font-semibold text-slate-900">${app.projectBudget.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Applied Date</div>
                      <div className="font-semibold text-slate-900">{new Date(app.appliedDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg mb-4">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Your Cover Letter</h4>
                  <p className="text-sm text-slate-700 line-clamp-2 italic">"{app.coverLetter}"</p>
                </div>
                
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    View Project
                  </Button>
                  {app.status === 'pending' && (
                    <Button variant="outline" className="text-red-600 hover:bg-red-50">
                      Withdraw Application
                    </Button>
                  )}
                  {app.status === 'accepted' && (
                    <Button className="flex-1">Start Working</Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Send className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Applications Sent</h3>
          <p className="text-slate-600">You haven't applied to any projects yet</p>
        </Card>
      )}
    </div>
  );
  
  const tabs = [
    {
      label: 'Received',
      icon: Inbox,
      badge: receivedApplications.filter(a => a.status === 'pending').length,
      content: <ReceivedTab />
    },
    {
      label: 'Sent',
      icon: Send,
      badge: sentApplications.filter(a => a.status === 'pending').length,
      content: <SentTab />
    }
  ];
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Applications</h1>
          <p className="text-slate-600">Manage applications for your projects and track your own applications</p>
        </div>
        
        <Tabs tabs={tabs} defaultTab={0} />
      </div>
    </div>
  );
};

export default Applications;
