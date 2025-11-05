import { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';
import { 
  User, 
  Mail, 
  Bell, 
  Shield, 
  Wallet,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Camera
} from 'lucide-react';

const Settings = () => {
  const [formData, setFormData] = useState({
    name: 'Alex Rivera',
    email: 'alex@example.com',
    bio: 'Experienced blockchain developer and IP creator',
    avatar: null,
    notifications: {
      email: true,
      projectUpdates: true,
      newApplications: true,
      milestoneAlerts: true,
      marketingEmails: false
    },
    socialLinks: {
      website: 'https://alexrivera.com',
      linkedin: 'https://linkedin.com/in/alexrivera',
      github: 'https://github.com/alexrivera',
      twitter: 'https://twitter.com/alexrivera'
    }
  });
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleNotificationChange = (field) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field]
      }
    }));
  };
  
  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }));
  };
  
  const handleSave = () => {
    // TODO: Save settings to backend
    console.log('Saving settings:', formData);
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-600">Manage your account settings and preferences</p>
        </div>
        
        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-5 h-5 text-slate-400" />
                <h2 className="text-xl font-bold text-slate-900">Profile Information</h2>
              </div>
              
              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <Avatar 
                    src={formData.avatar}
                    name={formData.name}
                    size="3xl"
                  />
                  <div>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Change Photo
                    </Button>
                    <p className="text-xs text-slate-500 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>
                
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Full Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                
                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    maxLength={500}
                  />
                  <p className="text-xs text-slate-500 mt-1">{formData.bio.length}/500 characters</p>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Social Links */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-5 h-5 text-slate-400" />
                <h2 className="text-xl font-bold text-slate-900">Social Links</h2>
              </div>
              
              <div className="space-y-4">
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
          </Card>
          
          {/* Notification Preferences */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-5 h-5 text-slate-400" />
                <h2 className="text-xl font-bold text-slate-900">Notification Preferences</h2>
              </div>
              
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
                  { key: 'projectUpdates', label: 'Project Updates', description: 'Get notified about project milestones and changes' },
                  { key: 'newApplications', label: 'New Applications', description: 'Notification when someone applies to your project' },
                  { key: 'milestoneAlerts', label: 'Milestone Alerts', description: 'Reminders for upcoming milestones' },
                  { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive product updates and news' }
                ].map((item) => (
                  <div key={item.key} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{item.label}</div>
                      <div className="text-sm text-slate-600">{item.description}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications[item.key]}
                        onChange={() => handleNotificationChange(item.key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          
          {/* Security */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-slate-400" />
                <h2 className="text-xl font-bold text-slate-900">Security</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-slate-600" />
                    <div>
                      <div className="font-medium text-slate-900">Connected Wallet</div>
                      <div className="text-sm text-slate-600">0x1234...5678</div>
                    </div>
                  </div>
                  <Button variant="outline" size="small">Change</Button>
                </div>
                
                <Button variant="outline" className="w-full">
                  Two-Factor Authentication
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Save Button */}
          <div className="flex gap-3">
            <Button className="flex-1" onClick={handleSave}>
              Save Changes
            </Button>
            <Button variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
