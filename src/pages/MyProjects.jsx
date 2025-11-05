import { useState } from 'react';
import { Link } from 'react-router-dom';
import Tabs from '../components/ui/Tabs';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { 
  Plus, 
  Briefcase, 
  Users, 
  Send, 
  CheckCircle2, 
  Clock, 
  DollarSign,
  Calendar,
  Eye
} from 'lucide-react';

const MyProjects = () => {
  const [loading, setLoading] = useState(false);
  
  // Mock data - replace with actual API calls
  const createdProjects = [
    {
      id: 1,
      title: 'AI-Powered Content Generation Platform',
      description: 'Revolutionary AI system for automated content creation',
      status: 'active',
      budget: 50000,
      applications: 12,
      collaborators: 3,
      progress: 65,
      createdAt: '2024-01-15',
      category: 'Artificial Intelligence'
    },
    {
      id: 2,
      title: 'Blockchain-Based Supply Chain Solution',
      description: 'Transparent supply chain tracking using blockchain',
      status: 'in_escrow',
      budget: 75000,
      applications: 8,
      collaborators: 2,
      progress: 30,
      createdAt: '2024-02-01',
      category: 'Blockchain'
    }
  ];
  
  const collaboratingProjects = [
    {
      id: 3,
      title: 'Mobile Health Monitoring App',
      description: 'Real-time health tracking and analysis',
      role: 'Senior Developer',
      owner: 'Sarah Chen',
      status: 'active',
      myContribution: 45,
      earnings: 15000,
      deadline: '2024-06-30'
    }
  ];
  
  const applications = [
    {
      id: 1,
      projectTitle: 'DeFi Lending Protocol',
      projectOwner: 'Mike Johnson',
      appliedDate: '2024-02-20',
      status: 'pending',
      proposedRate: 5000,
      message: 'I have 5 years of experience in DeFi development...'
    },
    {
      id: 2,
      projectTitle: 'NFT Marketplace Platform',
      projectOwner: 'Emma Wilson',
      appliedDate: '2024-02-18',
      status: 'accepted',
      proposedRate: 8000,
      message: 'Expert in NFT smart contracts and marketplace development...'
    }
  ];
  
  const completedProjects = [
    {
      id: 4,
      title: 'E-commerce Analytics Dashboard',
      completedDate: '2024-01-10',
      totalEarned: 25000,
      rating: 4.9,
      review: 'Excellent work! Delivered on time and exceeded expectations.'
    }
  ];
  
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { variant: 'success', text: 'Active' },
      in_escrow: { variant: 'warning', text: 'In Escrow' },
      pending: { variant: 'warning', text: 'Pending' },
      accepted: { variant: 'success', text: 'Accepted' },
      rejected: { variant: 'danger', text: 'Rejected' },
      completed: { variant: 'default', text: 'Completed' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };
  
  // Tab 1: Created by Me
  const CreatedProjectsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Created Projects</h2>
          <p className="text-slate-600 mt-1">Projects you've created and are managing</p>
        </div>
        <Link to="/create-project">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Project
          </Button>
        </Link>
      </div>
      
      {loading ? (
        <div className="py-12">
          <Spinner size="large" text="Loading projects..." />
        </div>
      ) : createdProjects.length > 0 ? (
        <div className="grid gap-6">
          {createdProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{project.title}</h3>
                      {getStatusBadge(project.status)}
                    </div>
                    <p className="text-slate-600 mb-3">{project.description}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Badge variant="outline">{project.category}</Badge>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Created {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600">Project Progress</span>
                    <span className="font-semibold text-cyan-600">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-linear-to-r from-cyan-500 to-cyan-600 transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Budget</div>
                      <div className="font-semibold text-slate-900">${project.budget.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Send className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Applications</div>
                      <div className="font-semibold text-slate-900">{project.applications}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Collaborators</div>
                      <div className="font-semibold text-slate-900">{project.collaborators}</div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Link to={`/project/${project.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  <Button variant="outline" className="flex-1">
                    Manage
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Projects Yet</h3>
          <p className="text-slate-600 mb-6">Create your first project to get started</p>
          <Link to="/create-project">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
  
  // Tab 2: Collaborating On
  const CollaboratingTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Active Collaborations</h2>
        <p className="text-slate-600 mt-1">Projects where you're a collaborator</p>
      </div>
      
      {collaboratingProjects.length > 0 ? (
        <div className="grid gap-6">
          {collaboratingProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{project.title}</h3>
                      {getStatusBadge(project.status)}
                    </div>
                    <p className="text-slate-600 mb-3">{project.description}</p>
                    <div className="flex items-center gap-3 text-sm">
                      <Badge variant="outline">{project.role}</Badge>
                      <span className="text-slate-500">Owner: {project.owner}</span>
                    </div>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">My Contribution</div>
                    <div className="font-semibold text-slate-900">{project.myContribution}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Earnings</div>
                    <div className="font-semibold text-emerald-600">${project.earnings.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Deadline</div>
                    <div className="font-semibold text-slate-900">{new Date(project.deadline).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Link to={`/project/${project.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">View Project</Button>
                  </Link>
                  <Button className="flex-1">Submit Work</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Collaborations</h3>
          <p className="text-slate-600 mb-6">Browse projects and apply to start collaborating</p>
          <Link to="/marketplace">
            <Button>Browse Projects</Button>
          </Link>
        </Card>
      )}
    </div>
  );
  
  // Tab 3: Applications Sent
  const ApplicationsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">My Applications</h2>
        <p className="text-slate-600 mt-1">Track your project applications</p>
      </div>
      
      {applications.length > 0 ? (
        <div className="grid gap-6">
          {applications.map((app) => (
            <Card key={app.id} className="hover:shadow-lg transition">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">{app.projectTitle}</h3>
                      {getStatusBadge(app.status)}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">Project Owner: {app.projectOwner}</p>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg italic">
                      "{app.message}"
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm mb-4">
                  <div>
                    <span className="text-slate-500">Applied: </span>
                    <span className="font-medium text-slate-900">{new Date(app.appliedDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Proposed Rate: </span>
                    <span className="font-semibold text-cyan-600">${app.proposedRate.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button variant="outline" className="flex-1">View Application</Button>
                  {app.status === 'pending' && (
                    <Button variant="outline" className="text-red-600 hover:bg-red-50">
                      Withdraw
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Send className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Applications</h3>
          <p className="text-slate-600 mb-6">You haven't applied to any projects yet</p>
          <Link to="/marketplace">
            <Button>Browse Projects</Button>
          </Link>
        </Card>
      )}
    </div>
  );
  
  // Tab 4: Completed
  const CompletedTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Completed Projects</h2>
        <p className="text-slate-600 mt-1">Your project history and achievements</p>
      </div>
      
      {completedProjects.length > 0 ? (
        <div className="grid gap-6">
          {completedProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                      <span>Completed {new Date(project.completedDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="text-amber-500">★</span>
                        <span className="font-semibold">{project.rating}/5.0</span>
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg italic">
                      "{project.review}"
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500 mb-1">Total Earned</div>
                    <div className="text-2xl font-bold text-emerald-600">
                      ${project.totalEarned.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CheckCircle2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Completed Projects</h3>
          <p className="text-slate-600">Your completed projects will appear here</p>
        </Card>
      )}
    </div>
  );
  
  const tabs = [
    {
      label: 'Created by Me',
      icon: Briefcase,
      badge: createdProjects.length,
      content: <CreatedProjectsTab />
    },
    {
      label: 'Collaborating On',
      icon: Users,
      badge: collaboratingProjects.length,
      content: <CollaboratingTab />
    },
    {
      label: 'Applications Sent',
      icon: Send,
      badge: applications.length,
      content: <ApplicationsTab />
    },
    {
      label: 'Completed',
      icon: CheckCircle2,
      badge: completedProjects.length,
      content: <CompletedTab />
    }
  ];
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Projects</h1>
          <p className="text-slate-600">Manage all your projects and collaborations in one place</p>
        </div>
        
        <Tabs tabs={tabs} defaultTab={0} />
      </div>
    </div>
  );
};

export default MyProjects;
