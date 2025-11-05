import { useState } from 'react';

const Tabs = ({ tabs, defaultTab = 0, onChange, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const handleTabClick = (index) => {
    setActiveTab(index);
    if (onChange) onChange(index, tabs[index]);
  };
  
  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {tabs.map((tab, index) => {
          const isActive = index === activeTab;
          const Icon = tab.icon;
          
          return (
            <button
              key={index}
              onClick={() => handleTabClick(index)}
              disabled={tab.disabled}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium whitespace-nowrap transition border-b-2 -mb-px ${
                isActive
                  ? 'text-cyan-600 border-cyan-600'
                  : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
              } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${
                  isActive 
                    ? 'bg-cyan-100 text-cyan-700' 
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Tab Content */}
      <div className="mt-6">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

// Alternative: Pill-style tabs
export const PillTabs = ({ tabs, defaultTab = 0, onChange, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const handleTabClick = (index) => {
    setActiveTab(index);
    if (onChange) onChange(index, tabs[index]);
  };
  
  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-lg">
        {tabs.map((tab, index) => {
          const isActive = index === activeTab;
          const Icon = tab.icon;
          
          return (
            <button
              key={index}
              onClick={() => handleTabClick(index)}
              disabled={tab.disabled}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition ${
                isActive
                  ? 'bg-white text-cyan-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`ml-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
                  isActive 
                    ? 'bg-cyan-100 text-cyan-700' 
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Tab Content */}
      <div className="mt-6">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

export default Tabs;
