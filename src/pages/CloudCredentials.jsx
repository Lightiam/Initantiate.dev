import React, { useState, useEffect } from 'react';
import { useQuery, useAction } from 'wasp/client/operations';
import { getUserCloudCredentials, saveCloudCredentials, deleteCloudCredentials } from 'wasp/client/operations';

const CloudCredentialsPage = () => {
  const [activeProvider, setActiveProvider] = useState('aws');
  const [credentials, setCredentials] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  
  const { data: userCredentials, isLoading, error, refetch } = useQuery(getUserCloudCredentials);
  const save = useAction(saveCloudCredentials);
  const remove = useAction(deleteCloudCredentials);
  
  const providers = [
    { id: 'aws', name: 'Amazon Web Services', icon: 'aws.svg', fields: [
      { name: 'accessKeyId', label: 'Access Key ID', type: 'text' },
      { name: 'secretAccessKey', label: 'Secret Access Key', type: 'password' },
      { name: 'region', label: 'Region', type: 'text', defaultValue: 'us-west-2' }
    ]},
    { id: 'azure', name: 'Microsoft Azure', icon: 'azure.svg', fields: [
      { name: 'tenantId', label: 'Tenant ID', type: 'text' },
      { name: 'clientId', label: 'Client ID', type: 'text' },
      { name: 'clientSecret', label: 'Client Secret', type: 'password' },
      { name: 'subscriptionId', label: 'Subscription ID', type: 'text' }
    ]},
    { id: 'gcp', name: 'Google Cloud Platform', icon: 'gcp.svg', fields: [
      { name: 'projectId', label: 'Project ID', type: 'text' },
      { name: 'privateKey', label: 'Private Key', type: 'textarea' },
      { name: 'clientEmail', label: 'Client Email', type: 'text' }
    ]}
  ];
  
  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    
    try {
      await save({ provider: activeProvider, credentials: credentials[activeProvider] });
      setMessage({ type: 'success', text: `${activeProvider.toUpperCase()} credentials saved successfully` });
      refetch();
    } catch (error) {
      setMessage({ type: 'error', text: `Error saving credentials: ${error.message}` });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete your ${activeProvider.toUpperCase()} credentials?`)) {
      return;
    }
    
    try {
      await remove({ provider: activeProvider });
      setMessage({ type: 'success', text: `${activeProvider.toUpperCase()} credentials deleted successfully` });
      setCredentials({ ...credentials, [activeProvider]: {} });
      refetch();
    } catch (error) {
      setMessage({ type: 'error', text: `Error deleting credentials: ${error.message}` });
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [activeProvider]: {
        ...credentials[activeProvider],
        [name]: value
      }
    });
  };
  
  const activeFields = providers.find(p => p.id === activeProvider)?.fields || [];
  
  if (isLoading) return <div className="flex justify-center p-8">Loading credentials...</div>;
  if (error) return <div className="bg-red-100 text-red-700 p-4 rounded">Error: {error.message}</div>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cloud Provider Credentials</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Providers</h2>
            <div className="space-y-2">
              {providers.map(provider => (
                <div 
                  key={provider.id} 
                  className={`flex items-center p-3 rounded-md cursor-pointer ${activeProvider === provider.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveProvider(provider.id)}
                >
                  <div className="w-8 h-8 mr-3 flex items-center justify-center">
                    <img src={`/icons/${provider.icon}`} alt={provider.name} className="max-w-full max-h-full" />
                  </div>
                  <div>
                    <div className="font-medium">{provider.name}</div>
                    <div className="text-sm text-gray-500">
                      {userCredentials && userCredentials[provider.id] ? 'Configured' : 'Not configured'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-3/4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {providers.find(p => p.id === activeProvider)?.name} Credentials
            </h2>
            
            {message && (
              <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message.text}
              </div>
            )}
            
            <div className="space-y-4">
              {activeFields.map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      value={credentials[activeProvider]?.[field.name] || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={5}
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={credentials[activeProvider]?.[field.name] || field.defaultValue || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  )}
                </div>
              ))}
              
              <div className="flex justify-between pt-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  {isSaving ? 'Saving...' : 'Save Credentials'}
                </button>
                
                {userCredentials && userCredentials[activeProvider] && (
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                  >
                    Delete Credentials
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudCredentialsPage;
