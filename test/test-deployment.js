const fs = require('fs');
const path = require('path');
const { validateAndDeployInfrastructure } = require('../src/actions');
const { saveCredentials } = require('../src/cloudCredentialService');

const mockContext = {
  user: { id: 1 },
  entities: {
    Infrastructure: {
      create: async (data) => {
        console.log('Creating infrastructure record:', data.data);
        return { id: 1, ...data.data };
      },
      findUnique: async (where) => {
        console.log('Finding infrastructure record:', where);
        return mockInfrastructure;
      },
      update: async (data) => {
        console.log('Updating infrastructure record:', data);
        return { id: 1, ...data.data };
      }
    }
  }
};

async function testDeployment(provider) {
  try {
    console.log(`\n=== Testing ${provider} deployment ===\n`);
    
    const filePath = path.join(__dirname, 'infrastructure', `${provider}-test.js`);
    const code = fs.readFileSync(filePath, 'utf8');
    
    const mockInfrastructure = {
      id: 1,
      userId: 1,
      description: `Test ${provider} infrastructure`,
      code: code,
      status: 'generated'
    };
    
    global.mockInfrastructure = mockInfrastructure;
    
    console.log(`Deploying ${provider} infrastructure...`);
    const result = await validateAndDeployInfrastructure({ infrastructureId: 1 }, mockContext);
    
    console.log(`\n${provider} deployment result:`, result);
    console.log(`\n=== ${provider} deployment test completed ===\n`);
    
    return result;
  } catch (error) {
    console.error(`Error testing ${provider} deployment:`, error);
    return { success: false, error: error.message };
  }
}

async function setupCredentials() {
  try {
    console.log('Setting up test credentials...');
    
    await saveCredentials(1, 'aws', {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test-access-key',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test-secret-key',
      region: process.env.AWS_REGION || 'us-west-2'
    });
    
    await saveCredentials(1, 'azure', {
      tenantId: process.env.AZURE_TENANT_ID || 'test-tenant-id',
      clientId: process.env.AZURE_CLIENT_ID || 'test-client-id',
      clientSecret: process.env.AZURE_CLIENT_SECRET || 'test-client-secret',
      subscriptionId: process.env.AZURE_SUBSCRIPTION_ID || 'test-subscription-id'
    });
    
    await saveCredentials(1, 'gcp', {
      projectId: process.env.GOOGLE_CLOUD_PROJECT || 'test-project-id',
      credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS || JSON.stringify({
        type: 'service_account',
        project_id: 'test-project-id',
        private_key_id: 'test-private-key-id',
        private_key: 'test-private-key',
        client_email: 'test-client-email',
        client_id: 'test-client-id'
      })
    });
    
    console.log('Test credentials set up successfully');
  } catch (error) {
    console.error('Error setting up test credentials:', error);
  }
}

async function runTests() {
  await setupCredentials();
  
  await testDeployment('aws-s3');
  
  await testDeployment('azure-resource-group');
  
  await testDeployment('gcp-storage');
}

runTests().catch(console.error);
