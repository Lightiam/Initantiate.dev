import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useAction, getInfrastructureDetails, validateAndDeployInfrastructure } from 'wasp/client/operations';

const InfrastructureDetailPage = () => {
  const { infraId } = useParams();
  const { data: infrastructure, isLoading, error } = useQuery(getInfrastructureDetails, { id: infraId });
  const validateAndDeploy = useAction(validateAndDeployInfrastructure);

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error;

  const handleDeploy = async () => {
    try {
      await validateAndDeploy({ infrastructureId: infraId });
      alert('Infrastructure deployed successfully!');
    } catch (err) {
      alert('Deployment failed: ' + err.message);
    }
  };

  return (
    <div className='p-6 bg-white rounded-lg shadow-md'>
      <h1 className='text-2xl font-bold mb-4'>Infrastructure Details</h1>
      <p><strong>Description:</strong> {infrastructure.description}</p>
      <p><strong>Status:</strong> {infrastructure.status}</p>
      <div className='my-4'>
        <h2 className='text-xl font-semibold'>Generated IaC Code:</h2>
        <pre className='bg-gray-100 p-4 rounded overflow-x-auto'>{infrastructure.code}</pre>
      </div>
      <button
        onClick={handleDeploy}
        className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      >
        Validate and Deploy
      </button>
    </div>
  );
};

export default InfrastructureDetailPage;
