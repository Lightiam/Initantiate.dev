import { HttpError } from 'wasp/server';
import { saveCredentials, getCredentials, deleteCredentials, hasCredentials } from './cloudCredentialService';

export const saveCloudCredentials = async (args, context) => {
  if (!context.user) { throw new HttpError(401); }

  try {
    const { provider, credentials } = args;
    const supported = ['aws', 'azure', 'gcp'];
    
    if (!supported.includes(provider.toLowerCase())) {
      throw new HttpError(400, `Unsupported cloud provider: ${provider}`);
    }
    
    const success = await saveCredentials(context.user.id, provider.toLowerCase(), credentials);
    
    if (!success) {
      throw new Error(`Failed to save ${provider} credentials`);
    }
    
    return { success: true, provider };
  } catch (error) {
    console.error("Error saving cloud credentials:", error);
    throw new Error(`Failed to save cloud credentials: ${error.message}`);
  }
};

export const deleteCloudCredentials = async (args, context) => {
  if (!context.user) { throw new HttpError(401); }

  try {
    const { provider } = args;
    const success = await deleteCredentials(context.user.id, provider.toLowerCase());
    
    if (!success) {
      throw new Error(`Failed to delete ${provider} credentials`);
    }
    
    return { success: true, provider };
  } catch (error) {
    console.error("Error deleting cloud credentials:", error);
    throw new Error(`Failed to delete cloud credentials: ${error.message}`);
  }
};

export const getUserCloudCredentials = async (args, context) => {
  if (!context.user) { throw new HttpError(401); }

  try {
    const providers = ['aws', 'azure', 'gcp'];
    const result = {};
    
    for (const provider of providers) {
      result[provider] = await hasCredentials(context.user.id, provider);
    }
    
    return result;
  } catch (error) {
    console.error("Error getting user cloud credentials:", error);
    throw new Error(`Failed to get user cloud credentials: ${error.message}`);
  }
};
