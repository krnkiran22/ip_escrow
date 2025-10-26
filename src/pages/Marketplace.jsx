import { useState } from 'react';
import { Search, SlidersHorizontal, LayoutGrid, List, ChevronDown, ChevronLeft, ChevronRight, Heart, BadgeCheck, DollarSign, Flag, Clock, Users, ArrowRight, Star, PenTool, Palette, Music, Video, Code, MoreHorizontal, X } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';

const Marketplace = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    categories: [],
    minBudget: '',
    maxBudget: '',
    status: 'All',
    posted: 'All time'
  });
  

  
  const categories = [
    { icon: PenTool, name: 'Writing' },
    { icon: Palette, name: 'Design' },
    { icon: Music, name: 'Music' },
    { icon: Video, name: 'Video' },
    { icon: Code, name: 'Development' },
    { icon: MoreHorizontal, name: 'Other' }
  ];
  
  const projects = [
    {
      id: 1,
      title: 'Looking for talented illustrator for children\'s book series',
      category: 'Design',
      creator: { name: 'Sarah Johnson', avatar: 'SJ', rating: 4.9, verified: true },
      description: 'Need a creative illustrator for a 5-book children\'s series about space exploration. Looking for colorful, engaging artwork that appeals to ages 4-8.',
      budget: 2000,
      milestones: 4,
      timeline: '3 months',
      applications: 7,
      skills: ['Illustration', 'Character Design', 'Digital Art'],
      postedDate: '2 days ago'
    },
    {
      id: 2,
      title: 'Full-stack developer needed for DeFi dashboard',
      category: 'Development',
      creator: { name: 'Mike Chen', avatar: 'MC', rating: 4.7, verified: true },
      description: 'Building a comprehensive DeFi analytics dashboard. Need experienced developer with React, Node.js, and blockchain integration experience.',
      budget: 5000,
      milestones: 6,
      timeline: '4 months',
      applications: 12,
      skills: ['React', 'Node.js', 'Web3', 'Solidity'],
      postedDate: '5 days ago'
    },
    {
      id: 3,
      title: 'Music composer for indie game soundtrack',
      category: 'Music',
      creator: { name: 'Alex Rivera', avatar: 'AR', rating: 5.0, verified: false },
      description: 'Creating an atmospheric sci-fi adventure game. Need original soundtrack with 15-20 tracks, including ambient and action pieces.',
      budget: 3000,
      milestones: 5,
      timeline: '2 months',
      applications: 9,
      skills: ['Music Composition', 'Sound Design', 'Game Audio'],
      postedDate: '1 week ago'
    },
    {
      id: 4,
      title: 'Content writer for tech blog series',
      category: 'Writing',
      creator: { name: 'Emma Davis', avatar: 'ED', rating: 4.8, verified: true },
      description: 'Need technical writer for 10-part series on blockchain technology. Must have deep understanding of Web3 and ability to explain complex concepts.',
      budget: 1500,
      milestones: 3,
      timeline: '6 weeks',
      applications: 15,
      skills: ['Technical Writing', 'Blockchain', 'SEO'],
      postedDate: '3 days ago'
    }
  ];
  
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
    ));
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isConnected={true} />
      
      <div className="pt-20">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Find Projects</h1>
                <p className="text-sm text-slate-600 mt-1">Browse available collaboration opportunities</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-slate-600'}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-slate-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Layout */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Left Sidebar - Filters */}
            <div className="hidden md:block w-64 shrink-0">
              <div className="bg-gray-50 rounded-xl p-6 h-fit sticky top-24 space-y-6">
                {/* Category Section */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Category</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat.name} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-cyan-600" />
                        <cat.icon className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-700">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Budget Range */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Budget Range</h3>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                    <span className="text-slate-400 self-center">to</span>
                    <input type="number" placeholder="Max" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                  </div>
                </div>
                
                {/* Project Status */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Project Status</h3>
                  <div className="space-y-2">
                    {['Open', 'In Progress', 'All'].map((status) => (
                      <label key={status} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="status" className="w-4 h-4 text-cyan-600" />
                        <span className="text-sm text-slate-700">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Posted Date */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Posted Date</h3>
                  <div className="space-y-2">
                    {['Last 24 hours', 'Last 7 days', 'Last 30 days', 'All time'].map((date) => (
                      <label key={date} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="posted" className="w-4 h-4 text-cyan-600" />
                        <span className="text-sm text-slate-700">{date}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <button className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer mt-6">
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              </div>
            </div>
            
            {/* Right Content - Projects Grid */}
            <div className="flex-1">
              {/* Top Bar */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-slate-600">Showing {projects.length} projects</span>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:border-gray-400 transition">
                  <span>Sort by: Newest</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              
              {/* Projects Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-cyan-600 transition cursor-pointer group">
                    <div className="flex justify-between items-start">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                        {categories.find(c => c.name === project.category)?.icon && 
                          <div className="w-3 h-3">{/* Icon */}</div>
                        }
                        <span>{project.category}</span>
                      </div>
                      <Heart className="w-5 h-5 text-slate-300 hover:text-red-500 hover:fill-red-500 transition" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-slate-900 line-clamp-2 group-hover:text-cyan-600 transition mt-4">
                      {project.title}
                    </h3>
                    
                    <div className="flex items-center gap-3 mt-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600">
                        {project.creator.avatar}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900">{project.creator.name}</span>
                        <div className="flex gap-0.5">
                          {renderStars(project.creator.rating)}
                        </div>
                        {project.creator.verified && (
                          <BadgeCheck className="w-4 h-4 text-cyan-600" />
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 line-clamp-3 mt-4">
                      {project.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        <span>${project.budget}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Flag className="w-4 h-4 text-slate-400" />
                        <span>{project.milestones} milestones</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{project.timeline}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span>{project.applications} applied</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                      {project.skills.length > 3 && (
                        <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                          +{project.skills.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs text-slate-500">Posted {project.postedDate}</span>
                      <Link to={`/project/${project.id}`}>
                        <button className="px-4 py-2 border border-cyan-600 text-cyan-600 rounded-lg text-sm font-medium hover:bg-cyan-50 flex items-center gap-1 transition">
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              <div className="flex justify-center items-center gap-2 mt-8">
                <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <button 
                    key={page}
                    className={`px-3 py-2 rounded-md text-sm ${
                      page === 1 ? 'bg-cyan-600 text-white font-medium' : 'text-slate-600 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Marketplace;
