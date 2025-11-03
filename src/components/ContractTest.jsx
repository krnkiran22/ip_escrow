import { useState, useEffect } from 'react';
import { getProjectCount, getProjectDetails, testContractConnection } from '../services/contractService';
import { CheckCircle, XCircle, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';

export function ContractTest() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  
  const runTest = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🧪 Running contract connection test...');
      
      // Test 1: Check contract connection
      const connectionTest = await testContractConnection();
      
      if (!connectionTest) {
        throw new Error('Contract connection failed');
      }
      
      // Test 2: Get project count
      const count = await getProjectCount();
      console.log('📊 Project count:', count);
      
      setStatus({
        success: true,
        projectCount: count,
        message: count === 0 
          ? 'Contract connected! No projects created yet.'
          : `Contract connected! Found ${count} project${count > 1 ? 's' : ''}.`
      });
      
      // Test 3: Load projects if any exist
      if (count > 0) {
        console.log('📥 Loading projects...');
        const projectsList = [];
        
        for (let i = 1; i <= Math.min(count, 5); i++) {
          const project = await getProjectDetails(i);
          if (project && project.success) {
            projectsList.push({
              id: i,
              ...project
            });
          }
        }
        
        setProjects(projectsList);
        console.log('✅ Loaded', projectsList.length, 'projects');
      }
      
    } catch (err) {
      console.error('❌ Contract test failed:', err);
      setError(err.message);
      setStatus({
        success: false,
        message: 'Failed to connect to contract'
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    runTest();
  }, []);
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Smart Contract Status</h3>
          <p className="text-sm text-gray-500 mt-1">
            IPEscrow on Story Aeneid Testnet
          </p>
        </div>
        <button
          onClick={runTest}
          disabled={loading}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {/* Status */}
      {status && (
        <div className="space-y-4">
          {/* Connection Status */}
          <div className={`flex items-start gap-3 p-4 rounded-lg ${
            status.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {status.success ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                status.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {status.message}
              </p>
              {error && (
                <p className="text-xs text-red-700 mt-1">
                  Error: {error}
                </p>
              )}
            </div>
          </div>
          
          {/* Project Count */}
          {status.success && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 font-medium mb-1">
                  Total Projects
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {status.projectCount}
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-700 font-medium mb-1">
                  Contract Status
                </p>
                <p className="text-lg font-semibold text-purple-900">
                  ✅ Active
                </p>
              </div>
            </div>
          )}
          
          {/* Warning if no projects */}
          {status.success && status.projectCount === 0 && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900">
                  No Projects Yet
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Create your first project to test the complete flow!
                </p>
              </div>
            </div>
          )}
          
          {/* Projects List */}
          {projects.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700">
                Recent Projects:
              </p>
              {projects.map(project => (
                <div 
                  key={project.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">
                      #{project.id}: {project.title}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      project.status === 0 ? 'bg-green-100 text-green-800' :
                      project.status === 1 ? 'bg-blue-100 text-blue-800' :
                      project.status === 2 ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {project.statusText}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">Creator:</span>{' '}
                      <span className="font-mono">
                        {project.creator.slice(0, 6)}...{project.creator.slice(-4)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Budget:</span>{' '}
                      {(Number(project.totalBudget) / 1e18).toFixed(2)} IP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Contract Link */}
          <a
            href="https://aeneid.storyscan.xyz/address/0x701dca87b35B0e65Ba8bE229878FDdA3887952b8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            View Contract on StoryScan
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}

export default ContractTest;
