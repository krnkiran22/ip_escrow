import { Plus, Briefcase, CheckCircle, DollarSign, FileText, Search, Send, Folder, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import StatsCard from '../components/dashboard/StatsCard';
import ProjectCard from '../components/dashboard/ProjectCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('All');
  
  const stats = [
    { icon: Briefcase, value: '24', label: 'Active Projects', subtext: '+3 this month', trend: '+12%', iconBgColor: 'bg-cyan-100', iconColor: 'text-cyan-600' },
    { icon: CheckCircle, value: '42', label: 'Completed', subtext: 'Across 12 projects', trend: '+8%', iconBgColor: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    { icon: DollarSign, value: '$4,200', label: 'Total Earned', subtext: 'This quarter', trend: '+15%', iconBgColor: 'bg-amber-100', iconColor: 'text-amber-600' },
    { icon: FileText, value: '156', label: 'IP Registered', subtext: 'On blockchain', iconBgColor: 'bg-slate-100', iconColor: 'text-slate-600' },
  ];
  
  const quickActions = [
    { title: 'Browse Projects', icon: Search, gradient: 'from-cyan-500 to-cyan-600', path: '/marketplace' },
    { title: 'Apply Now', icon: Send, gradient: 'from-emerald-500 to-emerald-600', path: '/marketplace' },
    { title: 'My Portfolio', icon: Folder, gradient: 'from-amber-500 to-amber-600', path: '/portfolio' },
  ];
  
  const projects = [
    {
      id: 1,
      title: "Children's Book Illustration Series",
      role: 'Project Creator',
      status: 'Active',
      description: 'Need talented illustrator for a 24-page children\'s book about space exploration. Looking for colorful, engaging artwork.',
      category: 'Design',
      budget: 2000,
      milestonesTotal: 4,
      milestonesCompleted: 2,
      progress: 50,
      collaborator: { name: 'Sarah Chen', avatar: 'SC', rating: 4.9 }
    },
    {
      id: 2,
      title: "Brand Identity Package",
      role: 'Collaborator',
      status: 'In Review',
      description: 'Complete brand identity including logo, color palette, typography, and brand guidelines.',
      category: 'Design',
      budget: 1500,
      milestonesTotal: 3,
      milestonesCompleted: 2,
      progress: 67,
      collaborator: { name: 'Mike Johnson', avatar: 'MJ', rating: 4.7 }
    },
    {
      id: 3,
      title: "Website Development",
      role: 'Project Creator',
      status: 'Active',
      description: 'Modern responsive website with React and Tailwind CSS. Need frontend development expertise.',
      category: 'Development',
      budget: 3500,
      milestonesTotal: 5,
      milestonesCompleted: 1,
      progress: 20,
      collaborator: { name: 'Alex Rivera', avatar: 'AR', rating: 5.0 }
    }
  ];
  
  const tabs = ['All', 'Active', 'In Review', 'Completed'];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isConnected={true} />
      
      <div className="pt-20">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Welcome back, Alex</h1>
                <p className="text-sm text-slate-600 mt-1">Here's what's happening with your projects</p>
              </div>
              <Link to="/create-project">
                <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 flex items-center gap-2 shadow-md transition">
                  <Plus className="w-5 h-5" />
                  Create New Project
                </button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="max-w-7xl mx-auto px-4 mt-6">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.path} className="min-w-[200px]">
                <div className={`h-32 rounded-xl p-5 cursor-pointer hover:scale-105 transition flex flex-col justify-between bg-linear-to-br ${action.gradient} text-white`}>
                  <action.icon className="w-8 h-8" />
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold">{action.title}</span>
                    <Search className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column - Projects List */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">My Projects</h2>
                  <div className="flex items-center gap-6 mt-3">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-sm font-medium pb-2 transition ${
                          activeTab === tab
                            ? 'text-slate-900 border-b-2 border-cyan-600'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <SlidersHorizontal className="w-5 h-5 text-slate-600" />
                  </button>
                  <button className="flex items-center gap-1 px-3 py-2 hover:bg-gray-100 rounded-lg transition">
                    <span className="text-sm text-slate-600">Sort</span>
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
            
            {/* Right Column - Activity Feed */}
            <div className="md:col-span-1">
              <ActivityFeed />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
