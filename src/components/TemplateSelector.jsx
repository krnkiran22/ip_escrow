import React, { useState } from 'react';
import { 
  BookOpen, Music, Video, Gamepad2, Palette, Mic, 
  Plus, Check, X 
} from 'lucide-react';
import { COLLABORATION_TEMPLATES } from '../data/collaborationTemplates';

const iconMap = {
  BookOpen,
  Music,
  Video,
  Gamepad2,
  Palette,
  Mic
};

export default function TemplateSelector({ onSelectTemplate, onSkip }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const getIcon = (iconName) => {
    const Icon = iconMap[iconName] || BookOpen;
    return Icon;
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Start with a Template</h2>
        <p className="text-slate-600">
          Choose a collaboration template or start from scratch
        </p>
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(COLLABORATION_TEMPLATES).map((template) => {
          const Icon = getIcon(template.icon);
          const isSelected = selectedTemplate?.id === template.id;
          
          return (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`
                cursor-pointer transition-all rounded-lg border-2 p-4
                ${isSelected 
                  ? 'ring-2 ring-emerald-500 shadow-lg border-emerald-500 bg-emerald-50' 
                  : 'border-slate-200 hover:shadow-md hover:border-slate-300 bg-white'
                }
              `}
            >
              {/* Icon */}
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center mb-3
                ${isSelected ? 'bg-emerald-200' : 'bg-emerald-100'}
              `}>
                <Icon className="w-6 h-6 text-emerald-700" />
              </div>

              {/* Name */}
              <h3 className="font-bold text-lg mb-2">{template.name}</h3>

              {/* Description */}
              <p className="text-sm text-slate-600 mb-3">
                {template.description}
              </p>

              {/* Quick Stats */}
              <div className="space-y-1 text-xs text-slate-500">
                <p>• {template.suggestedMilestones.length} milestones</p>
                <p>• {template.estimatedDuration}</p>
                <p>• {template.typicalBudget}</p>
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="mt-3 flex items-center gap-2 text-emerald-600">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">Selected</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Custom Template Option */}
        <div
          onClick={() => onSkip && onSkip()}
          className="cursor-pointer hover:shadow-md border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center h-full bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <Plus className="w-12 h-12 text-slate-400 mb-3" />
          <h3 className="font-bold text-lg text-center">Start from Scratch</h3>
          <p className="text-sm text-slate-600 text-center mt-2">
            Create a custom project
          </p>
        </div>
      </div>

      {/* Selected Template Preview */}
      {selectedTemplate && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">
            {selectedTemplate.name} Template
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Milestones Preview */}
            <div>
              <h4 className="font-semibold mb-3">Suggested Milestones:</h4>
              <div className="space-y-2">
                {selectedTemplate.suggestedMilestones.map((milestone, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 bg-slate-50 rounded"
                  >
                    <div className="font-bold text-slate-400 min-w-[20px]">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{milestone.title}</p>
                      <p className="text-xs text-slate-600">
                        {milestone.description}
                      </p>
                      <p className="text-xs text-emerald-600 mt-1">
                        {milestone.percentage}% of budget
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Details */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Revenue Split:</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-slate-600">Creator</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {selectedTemplate.revenueSplit.creator}%
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-600">Collaborator</p>
                    <p className="text-2xl font-bold text-cyan-600">
                      {selectedTemplate.revenueSplit.collaborator}%
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">License Terms:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    {selectedTemplate.licenseTerms.commercial ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                    Commercial Use
                  </li>
                  <li className="flex items-center gap-2">
                    {selectedTemplate.licenseTerms.attribution ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                    Attribution Required
                  </li>
                  <li className="flex items-center gap-2">
                    {selectedTemplate.licenseTerms.modifications ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                    Modifications Allowed
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Estimated Duration:</h4>
                <p className="text-slate-700">{selectedTemplate.estimatedDuration}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Typical Budget:</h4>
                <p className="text-slate-700">{selectedTemplate.typicalBudget}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setSelectedTemplate(null)}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition"
            >
              Choose Different Template
            </button>
            <button
              onClick={handleUseTemplate}
              className="flex-1 px-6 py-2.5 bg-linear-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-lg font-medium transition"
            >
              Use This Template
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
