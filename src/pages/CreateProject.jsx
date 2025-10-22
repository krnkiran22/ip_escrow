import { useState } from 'react';
import { Check, ArrowRight, Save, CloudUpload, X, FileText, PenTool, Palette, Music, Video, Code, MoreHorizontal, GripVertical, Trash2, Plus, Edit3, Rocket, AlertCircle, Info } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const CreateProject = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    skills: [],
    milestones: [{ id: 1, name: '', description: '', amount: '', timeline: '' }],
    totalBudget: 2000,
    revenueMyShare: 50,
    revenueCollabShare: 50,
    licenseType: 'joint',
    agreedToTerms: false
  });
  
  const steps = [
    { id: 1, name: 'Basic Info' },
    { id: 2, name: 'Milestones' },
    { id: 3, name: 'Budget & Terms' },
    { id: 4, name: 'Review' }
  ];
  
  const categories = [
    { value: 'writing', label: 'Writing', icon: PenTool },
    { value: 'design', label: 'Design', icon: Palette },
    { value: 'music', label: 'Music', icon: Music },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'development', label: 'Development', icon: Code },
    { value: 'other', label: 'Other', icon: MoreHorizontal }
  ];
  
  const addMilestone = () => {
    setFormData({
      ...formData,
      milestones: [...formData.milestones, { id: Date.now(), name: '', description: '', amount: '', timeline: '' }]
    });
  };
  
  const removeMilestone = (id) => {
    setFormData({
      ...formData,
      milestones: formData.milestones.filter(m => m.id !== id)
    });
  };
  
  const renderStep1 = () => (
    <div className="space-y-6">
      <Input 
        label="Project Title"
        required
        placeholder="e.g., Children's book illustration needed"
        helper="Be clear and specific"
      />
      
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900 flex items-center gap-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 bg-white text-slate-900">
          <option value="">Select a category</option>
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <p className="text-xs text-slate-500">Select the primary type of work needed</p>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900 flex items-center gap-1">
          Project Description <span className="text-red-500">*</span>
        </label>
        <textarea 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 resize-y min-h-[180px] text-slate-900 placeholder:text-slate-400"
          placeholder="Describe your project, requirements, timeline, and what you're looking for in a collaborator..."
        />
        <div className="flex justify-between items-center">
          <p className="text-xs text-slate-500">Minimum 200 characters. Be detailed to attract the right collaborators.</p>
          <span className="text-xs text-slate-400">0/2000</span>
        </div>
        <div className="text-xs text-cyan-600 flex items-center gap-1">
          <Info className="w-3 h-3" />
          <span>Markdown supported</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900">Attach Files (optional)</label>
        <div className="border-2 border-dashed border-cyan-300 rounded-lg p-8 text-center hover:border-cyan-500 transition cursor-pointer bg-cyan-50/30">
          <CloudUpload className="w-12 h-12 text-cyan-500 mx-auto mb-3" />
          <p className="text-sm text-slate-900">Drag & drop files here or click to browse</p>
          <p className="text-xs text-slate-600 mt-1">Supported: PDF, DOC, TXT, Images (Max 10MB)</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900 flex items-center gap-1">
          Required Skills <span className="text-red-500">*</span>
        </label>
        <input 
          type="text"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 text-slate-900 placeholder:text-slate-400"
          placeholder="Type a skill and press Enter"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {['Illustration', 'Character Design'].map((skill, idx) => (
            <span key={idx} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium">
              {skill}
              <X className="w-3 h-3 cursor-pointer hover:text-cyan-900" />
            </span>
          ))}
        </div>
        <p className="text-xs text-slate-500">Add 3-7 skills. Press Enter after each skill.</p>
        <div className="mt-3">
          <p className="text-xs font-medium text-slate-600 mb-2">Common skills:</p>
          <div className="flex flex-wrap gap-2">
            {['Illustration', 'Character Design', 'Digital Art', 'Watercolor', '3D Modeling'].map((skill, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full bg-gray-100 text-slate-700 text-xs font-medium cursor-pointer hover:bg-cyan-100 hover:text-cyan-700 transition">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderStep2 = () => (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Break Down Your Project</h2>
        <p className="text-sm text-slate-600 mt-2">Define clear milestones with deliverables and payment amounts</p>
      </div>
      
      <div className="space-y-4">
        {formData.milestones.map((milestone, index) => (
          <div key={milestone.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
                <h3 className="text-lg font-semibold text-slate-900">Milestone {index + 1}</h3>
              </div>
              {formData.milestones.length > 1 && (
                <button onClick={() => removeMilestone(milestone.id)}>
                  <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer" />
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <Input 
                label="Milestone Name"
                required
                placeholder="e.g., Initial character sketches"
              />
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Description</label>
                <textarea 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 resize-y min-h-[100px] text-slate-900"
                  placeholder="Describe what needs to be delivered for this milestone..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Expected Deliverables</label>
                <div className="space-y-2">
                  {['Files', 'Documentation', 'Source Files', 'Revisions Included'].map((item, idx) => (
                    <label key={idx} className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-cyan-600" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <label className="text-sm font-semibold text-slate-900 block mb-2">Payment Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input 
                    type="number"
                    className="w-full pl-7 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 text-slate-900"
                    placeholder="500"
                  />
                </div>
              </div>
              
              <Input 
                label="Estimated Timeline"
                placeholder="e.g., 2 weeks"
                helper="How long will this milestone take?"
              />
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={addMilestone}
        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-slate-600 hover:border-cyan-500 hover:text-cyan-600 flex items-center justify-center gap-2 transition cursor-pointer mt-4"
      >
        <Plus className="w-5 h-5" />
        Add Another Milestone
      </button>
    </div>
  );
  
  const renderStep3 = () => (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Budget & Collaboration Terms</h2>
        <p className="text-sm text-slate-600 mt-2">Set your total budget and define collaboration terms</p>
      </div>
      
      <div className="bg-linear-to-br from-cyan-50 to-emerald-50 border border-cyan-200 rounded-xl p-6 mb-8">
        <div className="text-sm font-medium text-slate-700 mb-2">Total Budget</div>
        <div className="text-4xl font-bold text-slate-900">$2,000</div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <div className="text-2xl font-semibold text-slate-900">4</div>
            <div className="text-xs text-slate-600">Milestones</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-slate-900">$500</div>
            <div className="text-xs text-slate-600">Avg per milestone</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-slate-900">12 weeks</div>
            <div className="text-xs text-slate-600">Total timeline</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold text-slate-900">Revenue Split Configuration</h3>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-700">Your Share</span>
          <input type="range" min="0" max="100" value={formData.revenueMyShare} className="flex-1" />
          <span className="text-sm font-medium text-slate-700">Collaborator's Share</span>
        </div>
        <div className="flex justify-between">
          <span className="text-3xl font-bold text-cyan-600">50%</span>
          <span className="text-3xl font-bold text-emerald-600">50%</span>
        </div>
        <p className="text-xs text-slate-500">Define how future revenue will be split automatically</p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Intellectual Property Terms</h3>
        {['Joint Ownership', 'License with Attribution', 'Work for Hire', 'Custom Terms'].map((option, idx) => (
          <div key={idx} className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-cyan-500 transition">
            <div className="flex items-start gap-3">
              <input type="radio" name="license" className="mt-1 w-4 h-4 text-cyan-600" />
              <div>
                <div className="text-base font-semibold text-slate-900">{option}</div>
                <div className="text-sm text-slate-600 mt-1">
                  {idx === 0 && 'Both parties are co-owners with equal rights'}
                  {idx === 1 && 'Collaborator retains rights, you get usage license'}
                  {idx === 2 && 'You own all rights, collaborator is paid for service'}
                  {idx === 3 && 'Define your own agreement'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-8">
        <h4 className="text-base font-semibold text-slate-900 mb-3">Collaboration Agreement Preview</h4>
        <div className="max-h-64 overflow-y-auto text-sm text-slate-700 leading-relaxed space-y-2">
          <p>This agreement outlines the terms of collaboration for the project "Children's Book Illustration"...</p>
          <p>Milestones: The project consists of 4 milestones with defined deliverables...</p>
          <p>Payment: Total budget of $2,000 will be held in escrow and released upon milestone approval...</p>
          <p>Revenue Split: Future revenue will be split 50/50 between both parties...</p>
          <p>IP Ownership: Joint ownership with equal rights to both parties...</p>
        </div>
        <label className="flex items-start gap-3 mt-4 cursor-pointer">
          <input type="checkbox" className="mt-1 w-5 h-5 text-cyan-600" />
          <span className="text-sm text-slate-700">I agree to these terms and authorize the smart contract to hold funds in escrow</span>
        </label>
      </div>
    </div>
  );
  
  const renderStep4 = () => (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Review Your Project</h2>
        <p className="text-sm text-slate-600 mt-2">Double-check all details before submitting</p>
      </div>
      
      {/* Review Sections */}
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Basic Information</h3>
            <button 
              onClick={() => setCurrentStep(1)}
              className="text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium text-slate-600">Project Title</div>
              <div className="text-base text-slate-900 mt-1">Children's Book Illustration Series</div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600">Category</div>
              <div className="text-base text-slate-900 mt-1">Design</div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600">Skills</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {['Illustration', 'Character Design', 'Digital Art'].map((skill, idx) => (
                  <span key={idx} className="px-2 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-linear-to-br from-slate-900 to-slate-800 text-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Transaction Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-300">Total Budget</span>
              <span className="text-base font-semibold">$2,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-300">Platform Fee (2%)</span>
              <span className="text-base font-semibold">$40</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-300">Gas Fee (estimated)</span>
              <span className="text-base font-semibold">$5</span>
            </div>
            <div className="border-t border-slate-700 pt-3 flex justify-between">
              <span className="text-base font-semibold">Total to Lock</span>
              <span className="text-xl font-bold">$2,045</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 mt-10">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
        <p className="text-sm text-amber-800">Once submitted, funds will be locked in escrow. Make sure all details are correct.</p>
      </div>
      
      <button className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-lg transition mt-4">
        <Rocket className="w-6 h-6" />
        Submit Project & Lock Funds
      </button>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isConnected={true} />
      
      <div className="pt-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            {/* Progress Stepper */}
            <div className="flex justify-center items-center mb-12">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep > step.id ? 'bg-emerald-600 text-white' :
                      currentStep === step.id ? 'bg-cyan-600 text-white' :
                      'bg-gray-200 text-slate-600'
                    }`}>
                      {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                    </div>
                    <span className={`text-xs font-medium mt-2 ${
                      currentStep === step.id ? 'text-slate-900' : 'text-slate-500'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 ${
                      currentStep > step.id ? 'bg-emerald-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            {/* Step Content */}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            
            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
                <button className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-2">
                  {currentStep > 1 ? (
                    <span onClick={() => setCurrentStep(currentStep - 1)}>← Back</span>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save as Draft
                    </>
                  )}
                </button>
                <Button 
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Next: {steps[currentStep]?.name}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CreateProject;
