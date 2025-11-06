import { useState } from 'react';
import { X, FileText, Link as LinkIcon, DollarSign, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function ApplicationForm({ project, isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    proposal: '',
    estimatedDuration: '',
    portfolioLinks: [''],
    hourlyRate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.proposal.length < 50) {
      toast.error('Proposal must be at least 50 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        proposal: formData.proposal,
        estimatedDuration: formData.estimatedDuration ? parseInt(formData.estimatedDuration) : undefined,
        portfolio: formData.portfolioLinks
          .filter(link => link.trim() !== '')
          .map(url => ({ url })),
        hourlyRate: formData.hourlyRate ? formData.hourlyRate : undefined
      };

      const response = await axios.post(`${API_URL}/applications/${project._id}`, payload);

      toast.success('Application submitted successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Application error:', error);
      toast.error(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addPortfolioLink = () => {
    setFormData(prev => ({
      ...prev,
      portfolioLinks: [...prev.portfolioLinks, '']
    }));
  };

  const updatePortfolioLink = (index, value) => {
    const newLinks = [...formData.portfolioLinks];
    newLinks[index] = value;
    setFormData(prev => ({ ...prev, portfolioLinks: newLinks }));
  };

  const removePortfolioLink = (index) => {
    setFormData(prev => ({
      ...prev,
      portfolioLinks: prev.portfolioLinks.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Apply to Project</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Proposal */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <FileText className="w-4 h-4" />
              Cover Letter / Proposal *
            </label>
            <textarea
              value={formData.proposal}
              onChange={(e) => setFormData({ ...formData, proposal: e.target.value })}
              placeholder="Explain why you're the best fit for this project..."
              rows={6}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
            <p className="text-sm text-slate-500 mt-1">
              {formData.proposal.length}/2000 characters (minimum 50)
            </p>
          </div>

          {/* Estimated Duration */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Clock className="w-4 h-4" />
              Estimated Duration (days) *
            </label>
            <select
              value={formData.estimatedDuration}
              onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              <option value="">Select duration...</option>
              <option value="7">1 week</option>
              <option value="14">2 weeks</option>
              <option value="30">1 month</option>
              <option value="60">2 months</option>
              <option value="90">3 months</option>
              <option value="180">6 months</option>
            </select>
          </div>

          {/* Hourly Rate */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <DollarSign className="w-4 h-4" />
              Hourly Rate (ETH) - Optional
            </label>
            <input
              type="number"
              step="0.001"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
              placeholder="0.01"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Portfolio Links */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <LinkIcon className="w-4 h-4" />
              Portfolio Links
            </label>
            {formData.portfolioLinks.map((link, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => updatePortfolioLink(index, e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {formData.portfolioLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePortfolioLink(index)}
                    className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPortfolioLink}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              + Add Another Link
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
