import React, { useState } from 'react';
import { useQuery, useAction } from 'wasp/client/operations';
import { getUserInfrastructures, generateInfrastructure } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';

const DashboardPage = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  const { data: infrastructures, isLoading, refetch } = useQuery(getUserInfrastructures);
  const generate = useAction(generateInfrastructure);
  
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for your infrastructure');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      await generate({ prompt });
      setPrompt('');
      refetch();
    } catch (error) {
      setError(`Generation failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'generated': return 'bg-yellow-100 text-yellow-800';
      case 'deploying': return 'bg-blue-100 text-blue-800';
      case 'deployed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'generated': return '📝';
      case 'deploying': return '🔄';
      case 'deployed': return '✅';
      case 'failed': return '❌';
      default: return '❓';
    }
  };
  
  const getProviderIcon = (description) => {
    const text = description.toLowerCase();
    if (text.includes('aws') || text.includes('amazon')) {
      return '/icons/aws.svg';
    } else if (text.includes('azure') || text.includes('microsoft')) {
      return '/icons/azure.svg';
    } else if (text.includes('gcp') || text.includes('google')) {
      return '/icons/gcp.svg';
    }
    return '/icons/cloud.svg';
  };
  
  const getProviderName = (description) => {
    const text = description.toLowerCase();
    if (text.includes('aws') || text.includes('amazon')) {
      return 'AWS';
    } else if (text.includes('azure') || text.includes('microsoft')) {
      return 'Azure';
    } else if (text.includes('gcp') || text.includes('google')) {
      return 'Google Cloud';
    }
    return 'Multi-Cloud';
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Infrastructure Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Generate New Infrastructure</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Describe your infrastructure needs
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            rows={4}
            placeholder="Example: Create a VPC in AWS with public and private subnets, or a Kubernetes cluster in GCP with 3 nodes"
          />
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            {isGenerating ? 'Generating...' : 'Generate Infrastructure'}
          </button>
          
          <Link to="/credentials" className="text-blue-600 hover:text-blue-800">
            Manage Cloud Credentials
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Infrastructures</h2>
        
        {isLoading ? (
          <div className="text-center p-4">Loading...</div>
        ) : !infrastructures || infrastructures.length === 0 ? (
          <div className="text-center p-4 text-gray-500">
            No infrastructures found. Generate your first one above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {infrastructures.map((infra) => (
                  <tr key={infra.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={getProviderIcon(infra.description)} 
                          alt={getProviderName(infra.description)} 
                          className="w-6 h-6 mr-2" 
                        />
                        {getProviderName(infra.description)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {infra.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(infra.status)}`}>
                        {getStatusIcon(infra.status)} {infra.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(infra.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link 
                        to={`/infrastructure/${infra.id}`} 
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </Link>
                      {infra.status === 'generated' && (
                        <Link 
                          to={`/infrastructure/${infra.id}`} 
                          className="text-green-600 hover:text-green-900"
                        >
                          Deploy
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
