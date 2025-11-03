import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, CloudUpload, X, FileText, PenTool, Palette, Music, Video, Code, MoreHorizontal, Trash2, Plus, Rocket, AlertCircle, Info } from 'lucide-react';
import { useAccount } from 'wagmi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const CreateProject = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [currentStep, setCurrentStep] = useState(1);
  const [skillInput, setSkillInput] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    skills: [],
    files: [],
    milestones: [{ id: 1, name: '', description: '', amount: '', timeline: '', deliverables: '' }],
    totalBudget: 0,
    revenueMyShare: 50,
    revenueCollabShare: 50,
    licenseType: 'joint',
    agreedToTerms: false
  });

  const categories = [
    { value: 'writing', label: 'Writing & Content', icon: FileText },
    { value: 'design', label: 'Design & Art', icon: PenTool },
    { value: 'illustration', label: 'Illustration', icon: Palette },
    { value: 'music', label: 'Music & Audio', icon: Music },
    { value: 'video', label: 'Video & Animation', icon: Video },
    { value: 'software', label: 'Software & Code', icon: Code },
    { value: 'other', label: 'Other', icon: MoreHorizontal }
  ];

  const skillSuggestions = [
    'JavaScript', 'Python', 'React', 'Design', 'Writing', 'Video Editing',
    'Illustration', 'Music Production', '3D Modeling', 'Photography',
    'Content Writing', 'UI/UX Design', 'Animation', 'Marketing', 'SEO'
  ];

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Project details' },
    { number: 2, title: 'Milestones', description: 'Define deliverables' },
    { number: 3, title: 'Revenue', description: 'Set IP terms' },
    { number: 4, title: 'Review', description: 'Confirm & submit' }
  ];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 10MB.`);
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newFile = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          preview: reader.result,
          file: file
        };
        
        setUploadedFiles(prev => [...prev, newFile]);
        setFormData(prev => ({
          ...prev,
          files: [...prev.files, newFile]
        }));
        toast.success(`${file.name} uploaded successfully!`);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== fileId)
    }));
    toast.success('File removed');
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, skillInput.trim()]
        }));
        setSkillInput('');
        toast.success('Skill added!');
      } else {
        toast.error('Skill already added');
      }
    }
  };

  const addSkill = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      toast.success('Skill added!');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const addMilestone = () => {
    const newMilestone = {
      id: Date.now(),
      name: '',
      description: '',
      amount: '',
      timeline: '',
      deliverables: ''
    };
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone]
    }));
  };

  const removeMilestone = (id) => {
    if (formData.milestones.length > 1) {
      setFormData(prev => ({
        ...prev,
        milestones: prev.milestones.filter(m => m.id !== id)
      }));
      toast.success('Milestone removed');
    } else {
      toast.error('At least one milestone is required');
    }
  };

  const updateMilestone = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map(m =>
        m.id === id ? { ...m, [field]: value } : m
      )
    }));
  };

  const calculateTotalBudget = () => {
    const total = formData.milestones.reduce((sum, m) => {
      return sum + (parseFloat(m.amount) || 0);
    }, 0);
    setFormData(prev => ({ ...prev, totalBudget: total }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (formData.skills.length === 0) newErrors.skills = 'Add at least one skill';
    }

    if (step === 2) {
      formData.milestones.forEach((m, idx) => {
        if (!m.name.trim()) newErrors[`milestone_${idx}_name`] = 'Milestone name required';
        if (!m.amount || parseFloat(m.amount) <= 0) newErrors[`milestone_${idx}_amount`] = 'Valid amount required';
        if (!m.timeline.trim()) newErrors[`milestone_${idx}_timeline`] = 'Timeline required';
      });
    }

    if (step === 3) {
      if (formData.revenueMyShare + formData.revenueCollabShare !== 100) {
        newErrors.revenue = 'Revenue shares must total 100%';
      }
    }

    if (step === 4) {
      if (!formData.agreedToTerms) {
        newErrors.terms = 'You must agree to the terms';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 2) calculateTotalBudget();
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast.error('Please fix the errors before continuing');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!validateStep(4)) {
      toast.error('Please agree to the terms');
      return;
    }

    try {
      toast.loading('Creating project...', { id: 'create' });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Project Data:', {
        ...formData,
        creator: address,
        createdAt: new Date().toISOString()
      });

      toast.success('Project created successfully!', { id: 'create' });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project', { id: 'create' });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Project Title *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., AI-Powered NFT Art Collection"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Category *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.value })}
                      className={`p-4 border-2 rounded-xl text-center transition-all hover:border-indigo-500 hover:bg-indigo-50 ${
                        formData.category === cat.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200'
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                      <span className="text-sm font-medium">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="6"
                placeholder="Describe your project, what you're building, and what makes it unique..."
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Required Skills *
              </label>
              <div className="space-y-3">
                <Input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type a skill and press Enter"
                  className={errors.skills ? 'border-red-500' : ''}
                />
                {errors.skills && <p className="text-red-500 text-sm">{errors.skills}</p>}
                
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                      >
                        {skill}
                        <X
                          className="w-4 h-4 cursor-pointer hover:text-indigo-900"
                          onClick={() => removeSkill(skill)}
                        />
                      </span>
                    ))}
                  </div>
                )}

                <div>
                  <p className="text-xs text-slate-500 mb-2">Quick add:</p>
                  <div className="flex flex-wrap gap-2">
                    {skillSuggestions
                      .filter(s => !formData.skills.includes(s))
                      .slice(0, 8)
                      .map((skill, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => addSkill(skill)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm transition-colors"
                        >
                          + {skill}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Project Files (Optional)
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
              >
                <CloudUpload className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                <p className="text-sm font-medium text-slate-700">
                  Click to upload files
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Images, PDFs (Max 10MB each)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />

              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map(file => (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                    >
                      {file.type.startsWith('image/') ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <FileText className="w-12 h-12 text-slate-400" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 hover:bg-slate-200 rounded"
                      >
                        <X className="w-5 h-5 text-slate-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Define your project milestones</p>
                <p className="text-blue-700">
                  Break down your project into clear deliverables. Each milestone should have a specific outcome, budget, and timeline.
                </p>
              </div>
            </div>

            {formData.milestones.map((milestone, idx) => (
              <div
                key={milestone.id}
                className="p-6 border-2 border-slate-200 rounded-xl space-y-4 relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Milestone {idx + 1}
                  </h3>
                  {formData.milestones.length > 1 && (
                    <button
                      onClick={() => removeMilestone(milestone.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Milestone Name *
                    </label>
                    <Input
                      type="text"
                      value={milestone.name}
                      onChange={(e) => updateMilestone(milestone.id, 'name', e.target.value)}
                      placeholder="e.g., Initial Design & Concept"
                      className={errors[`milestone_${idx}_name`] ? 'border-red-500' : ''}
                    />
                    {errors[`milestone_${idx}_name`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`milestone_${idx}_name`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Budget (IP) *
                    </label>
                    <Input
                      type="number"
                      value={milestone.amount}
                      onChange={(e) => updateMilestone(milestone.id, 'amount', e.target.value)}
                      placeholder="1000"
                      min="0"
                      step="0.01"
                      className={errors[`milestone_${idx}_amount`] ? 'border-red-500' : ''}
                    />
                    {errors[`milestone_${idx}_amount`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`milestone_${idx}_amount`]}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Timeline *
                  </label>
                  <Input
                    type="text"
                    value={milestone.timeline}
                    onChange={(e) => updateMilestone(milestone.id, 'timeline', e.target.value)}
                    placeholder="e.g., 2 weeks"
                    className={errors[`milestone_${idx}_timeline`] ? 'border-red-500' : ''}
                  />
                  {errors[`milestone_${idx}_timeline`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`milestone_${idx}_timeline`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Deliverables
                  </label>
                  <textarea
                    value={milestone.deliverables}
                    onChange={(e) => updateMilestone(milestone.id, 'deliverables', e.target.value)}
                    rows="3"
                    placeholder="What will be delivered at this milestone?"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))}

            <Button
              variant="secondary"
              onClick={addMilestone}
              className="w-full"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Another Milestone
            </Button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div className="text-sm text-purple-800">
                <p className="font-medium mb-1">IP Revenue Sharing</p>
                <p className="text-purple-700">
                  Define how future revenue from this IP will be split between you and collaborators. This is enforced by smart contracts.
                </p>
              </div>
            </div>

            <div className="p-6 border-2 border-slate-200 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Revenue Distribution
              </h3>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Your Share
                    </label>
                    <span className="text-lg font-bold text-indigo-600">
                      {formData.revenueMyShare}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.revenueMyShare}
                    onChange={(e) => {
                      const myShare = parseInt(e.target.value);
                      setFormData({
                        ...formData,
                        revenueMyShare: myShare,
                        revenueCollabShare: 100 - myShare
                      });
                    }}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Collaborator Share
                    </label>
                    <span className="text-lg font-bold text-purple-600">
                      {formData.revenueCollabShare}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.revenueCollabShare}
                    onChange={(e) => {
                      const collabShare = parseInt(e.target.value);
                      setFormData({
                        ...formData,
                        revenueCollabShare: collabShare,
                        revenueMyShare: 100 - collabShare
                      });
                    }}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
              </div>

              {errors.revenue && (
                <p className="text-red-500 text-sm mt-4">{errors.revenue}</p>
              )}
            </div>

            <div className="p-6 border-2 border-slate-200 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                IP License Type
              </h3>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                  <input
                    type="radio"
                    name="licenseType"
                    value="joint"
                    checked={formData.licenseType === 'joint'}
                    onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-slate-800">Joint Ownership</p>
                    <p className="text-sm text-slate-600">
                      Both parties share equal rights to the IP and can make decisions together
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                  <input
                    type="radio"
                    name="licenseType"
                    value="exclusive"
                    checked={formData.licenseType === 'exclusive'}
                    onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-slate-800">Exclusive License</p>
                    <p className="text-sm text-slate-600">
                      You retain ownership but grant exclusive rights to the collaborator
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                  <input
                    type="radio"
                    name="licenseType"
                    value="non-exclusive"
                    checked={formData.licenseType === 'non-exclusive'}
                    onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-slate-800">Non-Exclusive License</p>
                    <p className="text-sm text-slate-600">
                      You retain full ownership and can license to multiple parties
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Project Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Title:</span>
                  <span className="font-semibold text-slate-800">{formData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Category:</span>
                  <span className="font-semibold text-slate-800 capitalize">{formData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Milestones:</span>
                  <span className="font-semibold text-slate-800">{formData.milestones.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Budget:</span>
                  <span className="font-semibold text-slate-800">{formData.totalBudget} IP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Your Revenue Share:</span>
                  <span className="font-semibold text-indigo-600">{formData.revenueMyShare}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Collaborator Share:</span>
                  <span className="font-semibold text-purple-600">{formData.revenueCollabShare}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">License Type:</span>
                  <span className="font-semibold text-slate-800 capitalize">{formData.licenseType.replace('-', ' ')}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-2 border-slate-200 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Milestones</h3>
              <div className="space-y-3">
                {formData.milestones.map((m, idx) => (
                  <div key={m.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700">{idx + 1}. {m.name}</span>
                    <span className="font-semibold text-indigo-600">{m.amount} IP</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-2 border-slate-200 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="p-6 border-2 border-slate-200 rounded-xl">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Uploaded Files</h3>
                <div className="space-y-2">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <span className="text-sm text-slate-700">{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 border-2 border-slate-200 rounded-xl">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                  className="mt-1"
                />
                <div className="text-sm text-slate-700">
                  <p className="font-medium mb-1">I agree to the terms and conditions *</p>
                  <p className="text-slate-600">
                    I understand that this project will be registered on Story Protocol and all IP rights will be managed through smart contracts. I agree to the revenue sharing terms outlined above.
                  </p>
                </div>
              </label>
              {errors.terms && <p className="text-red-500 text-sm mt-2">{errors.terms}</p>}
            </div>

            {!isConnected && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Wallet not connected</p>
                  <p className="text-amber-700">Please connect your wallet to submit the project</p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Create New Project
          </h1>
          <p className="text-lg text-slate-600">
            Launch your IP-protected collaboration project
          </p>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {steps.map((step, idx) => (
              <div key={step.number} className="flex flex-col items-center relative z-10 flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 transition-all ${
                    currentStep > step.number
                      ? 'bg-green-500 border-green-500 text-white'
                      : currentStep === step.number
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {currentStep > step.number ? <Check className="w-6 h-6" /> : step.number}
                </div>
                <div className="text-center mt-2">
                  <p className={`text-sm font-semibold ${currentStep >= step.number ? 'text-slate-800' : 'text-slate-400'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-slate-500">{step.description}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`absolute top-6 left-1/2 w-full h-0.5 -z-10 ${
                      currentStep > step.number ? 'bg-green-500' : 'bg-slate-300'
                    }`}
                    style={{ transform: 'translateY(-50%)' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {renderStepContent()}
        </div>

        <div className="flex justify-between gap-4">
          {currentStep > 1 && (
            <Button variant="secondary" onClick={prevStep} className="px-8">
              Back
            </Button>
          )}
          <div className="flex-1" />
          {currentStep < 4 ? (
            <Button onClick={nextStep} className="px-8">
              Next Step
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isConnected || !formData.agreedToTerms}
              className="px-8"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Launch Project
            </Button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateProject;
