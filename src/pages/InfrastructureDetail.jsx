import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useAction, getUserCloudCredentials } from 'wasp/client/operations';
import { getInfrastructureDetails, validateAndDeployInfrastructure } from 'wasp/client/operations';

const InfrastructureDetailPage = () => {
  const { infraId } = useParams();
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState(null);
  const [deploymentDetails, setDeploymentDetails] = useState(null);
  
  const { data: infrastructure, isLoading, error: loadError, refetch } = 
    useQuery(getInfrastructureDetails, { id: parseInt(infraId) });
  
  const { data: credentials } = useQuery(getUserCloudCredentials);
  
  const validateAndDeploy = useAction(validateAndDeployInfrastructure);
  
  useEffect(() => {
    if (infrastructure?.deploymentDetails) {
      try {
        setDeploymentDetails(JSON.parse(infrastructure.deploymentDetails));
      } catch (e) {
        console.error("Error parsing deployment details:", e);
      }
    }
  }, [infrastructure]);
  
  const handleDeploy = async () => {
    setIsDeploying(true);
    setError(null);
    
    try {
      const provider = detectProvider(infrastructure.description);
      
      if (credentials && !credentials[provider]) {
        throw new Error(`You need to configure ${getProviderName(provider)} credentials before deploying`);
      }
      
      await validateAndDeploy({ infrastructureId: infrastructure.id });
      refetch();
    } catch (error) {
      setError(`Deployment failed: ${error.message}`);
    } finally {
      setIsDeploying(false);
    }
  };
  
  const detectProvider = (description) => {
    const text = description.toLowerCase();
    if (text.includes('aws') || text.includes('amazon')) {
      return 'aws';
    } else if (text.includes('azure') || text.includes('microsoft')) {
      return 'azure';
    } else if (text.includes('gcp') || text.includes('google')) {
      return 'gcp';
    }
    return 'aws'; // Default to AWS
  };
  
  const getProviderName = (provider) => {
    switch (provider) {
      case 'aws': return 'AWS';
      case 'azure': return 'Azure';
      case 'gcp': return 'Google Cloud';
      default: return 'Cloud Provider';
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
  
  if (isLoading) return <div className="flex justify-center p-8">Loading infrastructure details...</div>;
  if (loadError) return <div className="bg-red-100 text-red-700 p-4 rounded">Error: {loadError.message}</div>;
  if (!infrastructure) return <div className="bg-red-100 text-red-700 p-4 rounded">Infrastructure not found</div>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Infrastructure Details</h1>
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
          Back to Dashboard
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="mt-2 text-gray-700">{infrastructure.description}</p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(infrastructure.status)}`}>
            {infrastructure.status}
          </span>
        </div>
        
        {infrastructure.status === 'generated' && (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Ready to Deploy</h3>
                <p className="text-gray-600">
                  This infrastructure has been generated and is ready to deploy to your cloud provider.
                </p>
              </div>
              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                {isDeploying ? 'Deploying...' : 'Deploy Infrastructure'}
              </button>
            </div>
            
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mt-4">
                {error}
              </div>
            )}
            
            {!credentials || !credentials[detectProvider(infrastructure.description)] && (
              <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md mt-4">
                <p>
                  You need to configure {getProviderName(detectProvider(infrastructure.description))} credentials before deploying.{' '}
                  <Link to="/credentials" className="font-medium underline">
                    Configure credentials
                  </Link>
                </p>
              </div>
            )}
          </div>
        )}
        
        {infrastructure.status === 'deploying' && (
          <div className="mt-6">
            <h3 className="text-lg font-medium">Deployment in Progress</h3>
            <div className="mt-2 bg-blue-50 p-4 rounded-md">
              <div className="flex items-center">
                <svg className="animate-spin h-5 w-5 text-blue-600 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p>Deploying your infrastructure. This may take several minutes.</p>
              </div>
              
              {deploymentDetails && deploymentDetails.logs && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Deployment Logs</h4>
                  <pre className="bg-gray-800 text-gray-100 p-3 rounded-md text-sm overflow-x-auto">
                    {deploymentDetails.logs}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
        
        {infrastructure.status === 'deployed' && deploymentDetails && (
          <div className="mt-6">
            <h3 className="text-lg font-medium">Deployment Successful</h3>
            <div className="mt-2 bg-green-50 p-4 rounded-md">
              <p className="text-green-800">
                Your infrastructure was successfully deployed to {getProviderName(deploymentDetails.provider || detectProvider(infrastructure.description))}.
              </p>
              
              {deploymentDetails.outputs && Object.keys(deploymentDetails.outputs).length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Deployment Outputs</h4>
                  <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Output</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {Object.entries(deploymentDetails.outputs).map(([key, value]) => (
                          <tr key={key}>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900">{key}</td>
                            <td className="px-4 py-2 text-sm text-gray-500 break-all">{JSON.stringify(value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {deploymentDetails.startTime && deploymentDetails.endTime && (
                <p className="mt-4 text-sm text-gray-600">
                  Deployment time: {Math.round((deploymentDetails.endTime - deploymentDetails.startTime) / 1000)} seconds
                </p>
              )}
            </div>
          </div>
        )}
        
        {infrastructure.status === 'failed' && deploymentDetails && (
          <div className="mt-6">
            <h3 className="text-lg font-medium">Deployment Failed</h3>
            <div className="mt-2 bg-red-50 p-4 rounded-md">
              <p className="text-red-800">
                Your infrastructure deployment failed with the following error:
              </p>
              <pre className="mt-2 bg-gray-800 text-gray-100 p-3 rounded-md text-sm overflow-x-auto">
                {deploymentDetails.error}
              </pre>
              
              <div className="mt-4">
                <button
                  onClick={handleDeploy}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Retry Deployment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Infrastructure Code</h2>
        <pre className="bg-gray-800 text-gray-100 p-4 rounded-md text-sm overflow-x-auto">
          {infrastructure.code}
        </pre>
      </div>
    </div>
  );
};

export default InfrastructureDetailPage;
