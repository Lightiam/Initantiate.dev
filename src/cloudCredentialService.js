import { HttpError } from 'wasp/server';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const CREDENTIALS_DIR = process.env.CREDENTIALS_DIR || path.join(os.homedir(), '.instantiate', 'credentials');

if (!fs.existsSync(CREDENTIALS_DIR)) {
  fs.mkdirSync(CREDENTIALS_DIR, { recursive: true });
  fs.chmodSync(CREDENTIALS_DIR, 0o700); // Secure permissions
}

/**
 * Save cloud provider credentials for a user
 * @param {number} userId - User ID
 * @param {string} provider - Cloud provider (aws, azure, gcp)
 * @param {object} credentials - Provider-specific credentials
 * @returns {Promise<boolean>} - Success status
 */
export const saveCredentials = async (userId, provider, credentials) => {
  try {
    const userDir = path.join(CREDENTIALS_DIR, userId.toString());
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
      fs.chmodSync(userDir, 0o700);
    }
    
    const credentialsFile = path.join(userDir, `${provider}.json`);
    fs.writeFileSync(credentialsFile, JSON.stringify(credentials, null, 2));
    fs.chmodSync(credentialsFile, 0o600);
    
    return true;
  } catch (error) {
    console.error(`Failed to save ${provider} credentials:`, error);
    return false;
  }
};

/**
 * Get cloud provider credentials for a user
 * @param {number} userId - User ID
 * @param {string} provider - Cloud provider (aws, azure, gcp)
 * @returns {Promise<object|null>} - Provider credentials or null if not found
 */
export const getCredentials = async (userId, provider) => {
  try {
    const credentialsFile = path.join(CREDENTIALS_DIR, userId.toString(), `${provider}.json`);
    if (!fs.existsSync(credentialsFile)) {
      return null;
    }
    
    const credentials = JSON.parse(fs.readFileSync(credentialsFile, 'utf8'));
    return credentials;
  } catch (error) {
    console.error(`Failed to get ${provider} credentials:`, error);
    return null;
  }
};

/**
 * Delete cloud provider credentials for a user
 * @param {number} userId - User ID
 * @param {string} provider - Cloud provider (aws, azure, gcp)
 * @returns {Promise<boolean>} - Success status
 */
export const deleteCredentials = async (userId, provider) => {
  try {
    const credentialsFile = path.join(CREDENTIALS_DIR, userId.toString(), `${provider}.json`);
    if (fs.existsSync(credentialsFile)) {
      fs.unlinkSync(credentialsFile);
    }
    return true;
  } catch (error) {
    console.error(`Failed to delete ${provider} credentials:`, error);
    return false;
  }
};

/**
 * Check if user has credentials for a provider
 * @param {number} userId - User ID
 * @param {string} provider - Cloud provider (aws, azure, gcp)
 * @returns {Promise<boolean>} - Whether credentials exist
 */
export const hasCredentials = async (userId, provider) => {
  const credentialsFile = path.join(CREDENTIALS_DIR, userId.toString(), `${provider}.json`);
  return fs.existsSync(credentialsFile);
};

/**
 * Configure cloud provider environment for deployment
 * @param {number} userId - User ID
 * @param {string} provider - Cloud provider (aws, azure, gcp)
 * @returns {Promise<object>} - Environment variables for deployment
 */
export const configureProviderEnvironment = async (userId, provider) => {
  const credentials = await getCredentials(userId, provider);
  if (!credentials) {
    throw new HttpError(400, `No ${provider} credentials found for user`);
  }
  
  const env = { ...process.env };
  
  switch (provider.toLowerCase()) {
    case 'aws':
      env.AWS_ACCESS_KEY_ID = credentials.accessKeyId;
      env.AWS_SECRET_ACCESS_KEY = credentials.secretAccessKey;
      env.AWS_REGION = credentials.region || 'us-west-2';
      break;
    case 'azure':
      env.AZURE_TENANT_ID = credentials.tenantId;
      env.AZURE_CLIENT_ID = credentials.clientId;
      env.AZURE_CLIENT_SECRET = credentials.clientSecret;
      env.AZURE_SUBSCRIPTION_ID = credentials.subscriptionId;
      break;
    case 'gcp':
      const gcpCredentialsFile = path.join(os.tmpdir(), `gcp-${userId}-${Date.now()}.json`);
      fs.writeFileSync(gcpCredentialsFile, JSON.stringify(credentials), { mode: 0o600 });
      env.GOOGLE_APPLICATION_CREDENTIALS = gcpCredentialsFile;
      break;
    default:
      throw new HttpError(400, `Unsupported cloud provider: ${provider}`);
  }
  
  return env;
};
