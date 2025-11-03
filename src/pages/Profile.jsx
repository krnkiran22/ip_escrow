import { useState } from 'react';
import { Camera, BadgeCheck, Copy, Github, Twitter, Globe, Star } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import IPAssetCard from '../components/shared/IPAssetCard';
import ProjectCard from '../components/dashboard/ProjectCard';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Portfolio');
  
  const tabs = ['Portfolio', 'Projects', 'Reviews', 'Activity'];
  
  const portfolioItems = [
    { type: 'Image', title: 'Abstract Art Collection', registrationDate: 'Jan 15, 2025', ipAssetId: '0xabcd...1234', derivatives: 3, revenue: 1240, licenses: 5, coOwners: 2 },
    { type: 'Code', title: 'React Component Library', registrationDate: 'Feb 20, 2025', ipAssetId: '0xef12...5678', derivatives: 8, revenue: 3200, licenses: 12, coOwners: 1 },
    { type: 'Music', title: 'Ambient Soundtrack Pack', registrationDate: 'Mar 10, 2025', ipAssetId: '0x9876...abcd', derivatives: 5, revenue: 890, licenses: 7, coOwners: 3 }
  ];
  
  const projects = [
    { id: 1, title: 'Children\'s Book', role: 'Project Creator', status: 'Active', description: 'Illustration project', category: 'Design', budget: 2000, milestonesTotal: 4, milestonesCompleted: 2, progress: 50, collaborator: { name: 'Sarah Chen', avatar: 'SC', rating: 4.9 } }
  ];
  
  const reviews = [
    { id: 1, reviewer: { name: 'John Doe', avatar: 'JD' }, project: 'Children\'s Book Illustration', rating: 5, comment: 'Excellent work! Very professional and delivered ahead of schedule.', date: '2 weeks ago', helpful: 12, notHelpful: 1 },
    { id: 2, reviewer: { name: 'Jane Smith', avatar: 'JS' }, project: 'Logo Design', rating: 4, comment: 'Great collaboration, good communication throughout the project.', date: '1 month ago', helpful: 8, notHelpful: 0 }
  ];
  
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
    ));
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20">
        {/* Hero Section */}
        <div className="relative h-48 bg-linear-to-r from-slate-900 to-slate-700">
          <div className="max-w-7xl mx-auto px-4 relative h-full">
            <div className="absolute bottom-0 transform translate-y-1/2">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center text-3xl font-bold text-slate-600">
                  AK
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                  <Camera className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 pt-20 pb-8">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-slate-900">Alex Rivera</h1>
                  <BadgeCheck className="w-6 h-6 text-cyan-600" />
                </div>
                <p className="text-base text-slate-600 mt-1">@alexrivera</p>
                <div className="flex items-center gap-2 text-sm mt-2">
                  <span className="text-slate-600 font-mono">0x1234...5678</span>
                  <Copy className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
                </div>
                
                <p className="text-base text-slate-700 max-w-2xl leading-relaxed mt-4">
                  Creative professional specializing in digital art and illustration. Passionate about blockchain technology and decentralized collaboration.
                </p>
                
                <div className="flex items-center gap-8 mt-6">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">47</div>
                    <div className="text-sm text-slate-600">Projects</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-slate-900">4.9</div>
                      <div className="flex gap-0.5">
                        {renderStars(4.9)}
                      </div>
                    </div>
                    <div className="text-sm text-slate-600">Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">42</div>
                    <div className="text-sm text-slate-600">Completed</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-4">
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Github className="w-5 h-5 text-slate-600 hover:text-slate-900 cursor-pointer transition" />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-5 h-5 text-slate-600 hover:text-slate-900 cursor-pointer transition" />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Globe className="w-5 h-5 text-slate-600 hover:text-slate-900 cursor-pointer transition" />
                  </a>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button className="bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-base font-medium cursor-pointer transition ${
                    activeTab === tab
                      ? 'text-slate-900 border-b-2 border-cyan-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {activeTab === 'Portfolio' && (
            <div className="grid md:grid-cols-3 gap-6">
              {portfolioItems.map((item, idx) => (
                <IPAssetCard key={idx} asset={item} />
              ))}
            </div>
          )}
          
          {activeTab === 'Projects' && (
            <div className="space-y-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
          
          {activeTab === 'Reviews' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center mb-8">
                <div className="text-6xl font-bold text-slate-900">4.9</div>
                <div className="flex justify-center gap-1 mt-2">
                  {renderStars(4.9)}
                </div>
                <div className="text-sm text-slate-600 mt-2">Based on {reviews.length} reviews</div>
              </div>
              
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                          {review.reviewer.avatar}
                        </div>
                        <div>
                          <div className="text-base font-semibold text-slate-900">{review.reviewer.name}</div>
                          <div className="text-sm text-slate-600">for {review.project}</div>
                          <div className="flex gap-0.5 mt-1">{renderStars(review.rating)}</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">{review.date}</div>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed mt-4">{review.comment}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-4">
                      <span>Was this helpful?</span>
                      <button className="hover:text-slate-700">Yes ({review.helpful})</button>
                      <button className="hover:text-slate-700">No ({review.notHelpful})</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'Activity' && (
            <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl p-8">
              <div className="relative">
                <div className="absolute left-1 top-2 bottom-2 w-px bg-slate-200" />
                <div className="space-y-6">
                  {['Project created', 'Milestone completed', 'Payment received', 'IP registered'].map((activity, idx) => (
                    <div key={idx} className="flex gap-3 relative">
                      <div className={`w-2 h-2 rounded-full mt-2 z-10 ${idx === 0 ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                      <div>
                        <div className="text-sm text-slate-900">{activity}</div>
                        <div className="text-xs text-slate-500 mt-1">{idx + 1} days ago</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
