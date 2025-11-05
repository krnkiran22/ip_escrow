import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Avatar from '../ui/Avatar';
import { useState } from 'react';
import { Camera, Mail, Globe, Linkedin, Github, Twitter } from 'lucide-react';
import { useAccount } from 'wagmi';

const ProfileSetup = ({ isOpen, onClose, onComplete }) => {
  const { address } = useAccount();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: null,
    skills: [],
    socialLinks: {
      website: '',
      linkedin: '',
      github: '',
      twitter: ''
    },
    userType: 'creator' // creator or buyer
  });
  
  const [errors, setErrors] = useState({});
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }));
  };
  
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.userType) newErrors.userType = 'Please select your role';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };
  
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  
  const handleSubmit = async () => {
    try {
      // TODO: Send profile data to backend API
      console.log('Profile data:', formData);
      
      if (onComplete) {
        onComplete(formData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Complete Your Profile" 
      size="large"
      closeOnOverlay={false}
    >
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                s === step 
                  ? 'bg-cyan-600 text-white' 
                  : s < step 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-200 text-slate-600'
              }`}>
                {s < step ? '✓' : s}
              </div>
              {s < 2 && <div className={`w-12 h-0.5 ${s < step ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>
        
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Basic Information</h3>
              <p className="text-sm text-slate-600">Let's set up your profile</p>
            </div>
            
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-3">
              <Avatar 
                src={formData.avatar} 
                name={formData.name || 'User'} 
                size="3xl"
              />
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-cyan-600 hover:bg-cyan-50 rounded-lg transition">
                <Camera className="w-4 h-4" />
                Upload Photo
              </button>
            </div>
            
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-3">
                I am a... <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleInputChange('userType', 'creator')}
                  className={`p-4 border-2 rounded-lg text-left transition ${
                    formData.userType === 'creator'
                      ? 'border-cyan-600 bg-cyan-50'
                      : 'border-gray-200 hover:border-cyan-300'
                  }`}
                >
                  <div className="font-semibold text-slate-900">Creator</div>
                  <div className="text-sm text-slate-600 mt-1">I create and sell IP assets</div>
                </button>
                <button
                  onClick={() => handleInputChange('userType', 'buyer')}
                  className={`p-4 border-2 rounded-lg text-left transition ${
                    formData.userType === 'buyer'
                      ? 'border-cyan-600 bg-cyan-50'
                      : 'border-gray-200 hover:border-cyan-300'
                  }`}
                >
                  <div className="font-semibold text-slate-900">Buyer</div>
                  <div className="text-sm text-slate-600 mt-1">I buy and invest in IP assets</div>
                </button>
              </div>
              {errors.userType && <p className="text-sm text-red-600 mt-1">{errors.userType}</p>}
            </div>
            
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                error={errors.name}
              />
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                error={errors.email}
              />
            </div>
            
            {/* Wallet Address (read-only) */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Wallet Address
              </label>
              <Input
                value={address || ''}
                disabled
                className="bg-slate-50"
              />
            </div>
          </div>
        )}
        
        {/* Step 2: Additional Info */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Additional Information</h3>
              <p className="text-sm text-slate-600">Help others know more about you (optional)</p>
            </div>
            
            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself, your expertise, and what you're looking for..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                maxLength={500}
              />
              <p className="text-xs text-slate-500 mt-1">{formData.bio.length}/500 characters</p>
            </div>
            
            {/* Social Links */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-3">
                Social Links
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-slate-600" />
                  </div>
                  <Input
                    value={formData.socialLinks.website}
                    onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Linkedin className="w-5 h-5 text-blue-600" />
                  </div>
                  <Input
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shrink-0">
                    <Github className="w-5 h-5 text-white" />
                  </div>
                  <Input
                    value={formData.socialLinks.github}
                    onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center shrink-0">
                    <Twitter className="w-5 h-5 text-sky-600" />
                  </div>
                  <Input
                    value={formData.socialLinks.twitter}
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
          )}
          {step < 2 ? (
            <Button onClick={handleNext} className="flex-1">
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="flex-1">
              Complete Setup
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ProfileSetup;
