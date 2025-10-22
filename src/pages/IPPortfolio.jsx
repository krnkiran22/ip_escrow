import { useState } from 'react';
import { Plus, Search, SlidersHorizontal, ArrowUpDown, LayoutGrid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import StatsCard from '../components/dashboard/StatsCard';
import IPAssetCard from '../components/shared/IPAssetCard';
import Modal from '../components/ui/Modal';
import { Briefcase, DollarSign, FileText, Users } from 'lucide-react';

const IPPortfolio = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  
  const stats = [
    { icon: FileText, value: '28', label: 'Total IP Assets', iconBgColor: 'bg-cyan-100', iconColor: 'text-cyan-600' },
    { icon: DollarSign, value: '$12,450', label: 'Total Value Generated', iconBgColor: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    { icon: Briefcase, value: '24', label: 'Active Licenses', iconBgColor: 'bg-amber-100', iconColor: 'text-amber-600' },
    { icon: Users, value: '16', label: 'Derivatives Created', iconBgColor: 'bg-slate-100', iconColor: 'text-slate-600' },
  ];
  
  const assets = [
    { type: 'Document', title: 'Project Proposal Template', registrationDate: 'Jan 15, 2025', ipAssetId: '0xabcd...1234', derivatives: 3, revenue: 1240, licenses: 5, coOwners: 2 },
    { type: 'Image', title: 'Abstract Art Collection', registrationDate: 'Feb 5, 2025', ipAssetId: '0xef12...5678', derivatives: 5, revenue: 2100, licenses: 8, coOwners: 1 },
    { type: 'Code', title: 'React Component Library', registrationDate: 'Feb 20, 2025', ipAssetId: '0x9876...abcd', derivatives: 8, revenue: 3200, licenses: 12, coOwners: 1 },
    { type: 'Music', title: 'Ambient Soundtrack Pack', registrationDate: 'Mar 10, 2025', ipAssetId: '0x4567...ef01', derivatives: 5, revenue: 890, licenses: 7, coOwners: 3 },
    { type: 'Video', title: 'Tutorial Series: Web3 Basics', registrationDate: 'Mar 18, 2025', ipAssetId: '0x2345...9abc', derivatives: 2, revenue: 1500, licenses: 4, coOwners: 2 },
    { type: 'Document', title: 'Smart Contract Audit Report', registrationDate: 'Apr 2, 2025', ipAssetId: '0x6789...def0', derivatives: 1, revenue: 3520, licenses: 3, coOwners: 1 }
  ];
  
  const handleViewDetails = (asset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isConnected={true} />
      
      <div className="pt-20">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">My IP Portfolio</h1>
                <p className="text-sm text-slate-600 mt-1">All your registered intellectual property</p>
              </div>
              <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 flex items-center gap-2 transition">
                <Plus className="w-5 h-5" />
                Register New IP
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Banner */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>
        </div>
        
        {/* Filter & Search Bar */}
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search your IP assets..."
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
              />
            </div>
            <button className="px-4 py-3 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50">
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
            </button>
            <button className="px-4 py-3 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50">
              <ArrowUpDown className="w-5 h-5" />
              <span>Sort by</span>
            </button>
            <div className="flex gap-2">
              <button className="p-3 bg-cyan-600 text-white rounded-lg">
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button className="p-3 bg-gray-100 text-slate-600 rounded-lg">
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* IP Assets Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid md:grid-cols-3 gap-6">
            {assets.map((asset, idx) => (
              <div key={idx} onClick={() => handleViewDetails(asset)}>
                <IPAssetCard asset={asset} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* IP Genealogy Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="IP Asset Details"
        size="lg"
      >
        {selectedAsset && (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="aspect-video bg-linear-to-br from-cyan-400 to-emerald-400 rounded-lg flex items-center justify-center mb-4">
                <span className="text-6xl">📄</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedAsset.title}</h2>
              <p className="text-sm text-slate-600 mb-4">Registered on {selectedAsset.registrationDate}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Type</span>
                  <span className="font-medium text-slate-900">{selectedAsset.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">IP Asset ID</span>
                  <span className="font-mono text-xs text-slate-900">{selectedAsset.ipAssetId}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Derivatives</span>
                  <span className="font-medium text-slate-900">{selectedAsset.derivatives}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Total Revenue</span>
                  <span className="font-medium text-emerald-600">${selectedAsset.revenue}</span>
                </div>
              </div>
              
              <button className="w-full bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-700 transition">
                Download License Agreement
              </button>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">IP Lineage</h3>
              <div className="space-y-3">
                <div className="border-2 border-cyan-600 rounded-lg p-4 bg-cyan-50">
                  <div className="font-medium text-slate-900">{selectedAsset.title}</div>
                  <div className="text-xs text-slate-600 mt-1">Current IP (You)</div>
                </div>
                {selectedAsset.derivatives > 0 && (
                  <div className="pl-8 space-y-2">
                    <div className="border-l-2 border-gray-300 pl-4">
                      <div className="border border-gray-300 rounded-lg p-3 bg-white">
                        <div className="text-sm font-medium text-slate-900">Derivative Work 1</div>
                        <div className="text-xs text-slate-600 mt-1">Created by collaborator</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <h4 className="text-base font-semibold text-slate-900 mb-3">Revenue Breakdown</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600">License Sales</span>
                    <span className="font-medium text-slate-900">${selectedAsset.revenue * 0.6}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Derivative Revenue</span>
                    <span className="font-medium text-slate-900">${selectedAsset.revenue * 0.4}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <button className="w-full border border-slate-900 text-slate-900 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition">
                  Create Derivative
                </button>
                <button className="w-full border border-gray-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
                  Transfer Ownership
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
      
      <Footer />
    </div>
  );
};

export default IPPortfolio;
