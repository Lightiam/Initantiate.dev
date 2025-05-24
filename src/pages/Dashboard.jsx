import React, { useState } from 'react';
import { useQuery, useAction, getUserInfrastructures, generateInfrastructure } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';

const DashboardPage = () => {
  const { data: infrastructures, isLoading, error } = useQuery(getUserInfrastructures);
  const generateInfrastructureFn = useAction(generateInfrastructure);
  const [prompt, setPrompt] = useState('');

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error;

  const handleGenerateInfrastructure = () => {
    generateInfrastructureFn({ prompt });
    setPrompt('');
  };

  return (
    <div className='p-4'>
      <div className='flex gap-x-4 py-5'>
        <input
          type='text'
          placeholder='Describe infrastructure'
          className='px-1 py-2 border rounded text-lg'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={handleGenerateInfrastructure}
          className='bg-blue-500 hover:bg-blue-700 px-2 py-2 text-white font-bold rounded'
        >
          Generate
        </button>
      </div>
      <div>
        {infrastructures.map((infra) => (
          <div
            key={infra.id}
            className='py-2 px-2 flex items-center justify-between hover:bg-slate-100 gap-x-2 rounded'
          >
            <div>
              <p className='font-bold'>{infra.description}</p>
              <p>Status: {infra.status}</p>
            </div>
            <Link
              to={`/infrastructure/${infra.id}`}
              className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
            >
              Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
