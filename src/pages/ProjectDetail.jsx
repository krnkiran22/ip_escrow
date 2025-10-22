import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Tag, DollarSign, Flag, User, Star, FileText, Download, CheckCircle, Clock, Circle, Calendar, ShieldCheck, Share2, ExternalLink, Info } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import MilestoneCard from '../components/projects/MilestoneCard';
import ApplicationCard from '../components/projects/ApplicationCard';

const ProjectDetail = () => {
  const { id } = useParams();
  
  const project = {
    id: id,
    title: "Children's Book Illustration Series",
    category: 'Design',
    description: 'Need talented illustrator for a 24-page children\'s book about space exploration. Looking for colorful, engaging artwork that appeals to ages 4-8. The project involves character design, background illustrations, and cover art.',
    status: 'Active',
    budget: 2000,
    milestonesTotal: 4,
    milestonesCompleted: 2,
    progress: 50,
    creator: { name: 'Sarah Johnson', avatar: 'SJ', rating: 4.9, verified: true },
    skills: ['Illustration', 'Character Design', 'Digital Art', 'Watercolor'],
    attachments: [
      { name: 'project-brief.pdf', size: '2.4 MB' },
      { name: 'reference-images.zip', size: '8.1 MB' }
    ],
    ipAssetId: '0xabcd...1234',
    contractAddress: '0x1234...5678',
    postedDate: '2 days ago',
    applications: 7
  };
  
  const milestones = [
    { number: 1, title: 'Initial Character Sketches', description: 'Create rough sketches of main characters', amount: 500, timeline: '2 weeks', status: 'completed', deliverables: ['Files', 'Documentation'] },
    { number: 2, title: 'Final Character Designs', description: 'Finalize character designs with color', amount: 500, timeline: '2 weeks', status: 'in-progress', deliverables: ['Files', 'Source Files'] },
    { number: 3, title: 'Background Illustrations', description: 'Create all background scenes', amount: 600, timeline: '3 weeks', status: 'pending', deliverables: ['Files', 'Documentation'] },
    { number: 4, title: 'Cover Art & Final Delivery', description: 'Create cover art and compile final files', amount: 400, timeline: '1 week', status: 'pending', deliverables: ['Files', 'Documentation', 'Source Files'] }
  ];
  
  const applications = [
    { id: 1, applicant: { name: 'Mike Chen', avatar: 'MC', projectsCompleted: 45, rating: 4.9, portfolioUrl: '#' }, proposal: 'I have 10+ years of experience in children\'s book illustration. I\'ve worked on over 50 published books and specialize in colorful, engaging artwork that captures children\'s imagination.', appliedDate: '1 day ago' },
    { id: 2, applicant: { name: 'Emma Davis', avatar: 'ED', projectsCompleted: 32, rating: 4.8, portfolioUrl: '#' }, proposal: 'As a professional illustrator specializing in children\'s content, I bring a unique style that combines traditional watercolor techniques with digital art.', appliedDate: '2 days ago' }
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
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link to="/marketplace" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6 cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
          
          {/* Hero Section */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium mb-3">
                <Tag className="w-3 h-3" />
                {project.category}
              </div>
              
              <h1 className="text-4xl font-bold text-slate-900 mb-3">{project.title}</h1>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                  {project.creator.avatar}
                </div>
                <div>
                  <div className="text-base font-semibold text-slate-900">{project.creator.name}</div>
                  <div className="flex gap-0.5 mt-1">
                    {renderStars(project.creator.rating)}
                  </div>
                </div>
                {project.creator.verified && (
                  <Badge variant="info" icon={ShieldCheck}>Verified</Badge>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Badge variant="success" className="px-4 py-2 text-base">
                {project.status}
              </Badge>
              <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition">
                Apply to This Project
              </button>
            </div>
          </div>
          
          {/* Two Column Layout */}
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-6">
              {/* Project Overview */}
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Project Overview</h2>
                <p className="text-base text-slate-700 leading-relaxed mb-6">{project.description}</p>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-900 mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                {project.attachments.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-slate-900 mb-3">Attached Files</h3>
                    <div className="space-y-2">
                      {project.attachments.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-slate-600" />
                            <div>
                              <div className="text-sm font-medium text-slate-900">{file.name}</div>
                              <div className="text-xs text-slate-500">{file.size}</div>
                            </div>
                          </div>
                          <Download className="w-5 h-5 text-cyan-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Milestones */}
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Project Milestones</h2>
                <div className="mb-6">
                  <ProgressBar percentage={project.progress} showLabel />
                  <p className="text-sm text-slate-600 mt-2">{project.milestonesCompleted} of {project.milestonesTotal} completed ({project.progress}%)</p>
                </div>
                
                <div className="space-y-4">
                  {milestones.map((milestone) => (
                    <MilestoneCard key={milestone.number} milestone={milestone} isCreator={true} />
                  ))}
                </div>
              </div>
              
              {/* Applications */}
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Applications ({project.applications})</h2>
                <div className="space-y-4">
                  {applications.map((app) => (
                    <ApplicationCard key={app.id} application={app} />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Details</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold text-slate-900">${project.budget}</div>
                      <div className="text-sm text-slate-600">Total Budget</div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Flag className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900">{project.milestonesTotal} milestones</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900">3 months timeline</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900">{project.applications} applied</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900">Posted {project.postedDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-slate-900 mb-2">Blockchain Info</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-slate-900">IP Registered</span>
                      <a href="#" className="text-cyan-600 ml-auto">View on Story</a>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <FileText className="w-4 h-4 text-cyan-600" />
                      <span className="text-slate-900">Escrow Active</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6 space-y-3">
                  <button className="w-full bg-emerald-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition">
                    Apply to Project
                  </button>
                  <button className="w-full border border-gray-300 text-slate-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
                    <Share2 className="w-4 h-4" />
                    Share Project
                  </button>
                  <button className="w-full border border-gray-300 text-slate-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
                    <Flag className="w-4 h-4" />
                    Report Issue
                  </button>
                </div>
              </div>
              
              {/* Revenue Split */}
              <div className="bg-linear-to-br from-cyan-50 to-emerald-50 border border-cyan-200 rounded-xl p-6 mt-6">
                <h4 className="text-base font-semibold text-slate-900 mb-4">Revenue Split</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-3xl font-bold text-cyan-600">50%</div>
                    <div className="text-sm text-slate-600">Creator</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-emerald-600">50%</div>
                    <div className="text-sm text-slate-600">Collaborator</div>
                  </div>
                </div>
                <div className="border-t border-cyan-200 mt-4 pt-4">
                  <div className="text-xs text-slate-600 flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>All future revenue from this IP will be split automatically according to these terms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProjectDetail;
