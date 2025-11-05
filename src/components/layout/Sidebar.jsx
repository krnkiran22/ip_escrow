import { Home, Briefcase, Search, FileText, Shield, BarChart3, Settings, ChevronLeft, ChevronRight, User2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Sidebar = ({ collapsed = false, onToggle }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  
  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    if (onToggle) onToggle(!isCollapsed);
  };
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Briefcase, label: 'My Projects', path: '/projects/my' },
    { icon: Search, label: 'Browse Projects', path: '/marketplace' },
    { icon: FileText, label: 'Applications', path: '/applications' },
    { icon: Shield, label: 'IP Assets', path: '/portfolio' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];
  
  const isActive = (path) => location.pathname === path;
  
  // Mock user data - replace with actual user data from context/auth
  const user = {
    name: 'Alex Rivera',
    avatar: 'AR',
    reputation: 4.8,
    walletAddress: '0x1234...5678'
  };
  
  return (
    <aside 
      className={`fixed left-0 top-20 h-[calc(100vh-80px)] bg-white border-r border-gray-200 transition-all duration-300 z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* User Info */}
        {!isCollapsed && (
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-900 truncate">{user.name}</div>
                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <span className="text-amber-500">★</span>
                  <span>{user.reputation}</span>
                  <span className="text-slate-400">·</span>
                  <span className="truncate">{user.walletAddress}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isCollapsed && (
          <div className="p-4 border-b border-gray-200 flex justify-center">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
              {user.avatar}
            </div>
          </div>
        )}
        
        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition group ${
                    active 
                      ? 'bg-cyan-50 text-cyan-600' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-cyan-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {!isCollapsed && (
                    <span className={`text-sm font-medium ${active ? 'font-semibold' : ''}`}>
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
        
        {/* Toggle Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleToggle}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
