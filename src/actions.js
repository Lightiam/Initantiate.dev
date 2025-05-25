import { HttpError } from 'wasp/server';
import { generateIaC } from './externalIaCService';
import { validateIaC } from './iacValidationService';
import * as pulumi from '@pulumi/pulumi';
import { configureProviderEnvironment } from './cloudCredentialService';

/**
 * Detect the cloud provider from infrastructure description
 * @param {string} description - Infrastructure description
 * @returns {string} - Detected cloud provider (aws, azure, gcp)
 */
function detectCloudProvider(description) {
  const text = description.toLowerCase();
  
  if (text.includes('aws') || text.includes('amazon')) {
    return 'aws';
  } else if (text.includes('azure') || text.includes('microsoft')) {
    return 'azure';
  } else if (text.includes('gcp') || text.includes('google')) {
    return 'gcp';
  }
  
  return 'aws';
}

export const generateInfrastructure = async (args, context) => {
  if (!context.user) { throw new HttpError(401); };

  try {
    const { prompt } = args;
    console.log("Generating infrastructure code for prompt:", prompt);
    
    const generatedCode = await generateIaC(prompt);
    console.log("Infrastructure code generated successfully");
    
    // Validate the generated code
    const validated = await validateIaC(generatedCode);
    
    if (!validated) {
      throw new Error("Infrastructure as Code validation failed");
    }
    
    console.log("Infrastructure code validated successfully");
    
    const infrastructure = await context.entities.Infrastructure.create({
      data: {
        userId: context.user.id,
        description: prompt,
        code: generatedCode,
        status: 'generated'
      }
    });
    
    console.log("Infrastructure record created with ID:", infrastructure.id);
    return infrastructure;
  } catch (error) {
    console.error("Error generating infrastructure:", error);
    throw new Error(`Failed to generate infrastructure: ${error.message}`);
  }
}

export const validateAndDeployInfrastructure = async ({ infrastructureId }, context) => {
  if (!context.user) { throw new HttpError(401); };

  try {
    console.log(`Validating and deploying infrastructure with ID: ${infrastructureId}`);
    
    // Retrieve the infrastructure details from the database
    const infrastructure = await context.entities.Infrastructure.findUnique({
      where: { id: infrastructureId }
    });
    
    if (!infrastructure) {
      throw new HttpError(404, "Infrastructure not found");
    }
    
    if (infrastructure.userId !== context.user.id) {
      throw new HttpError(403, "You don't have permission to deploy this infrastructure");
    }
    
    console.log("Infrastructure found, validating code...");
    
    // Validate the generated IaC code
    const isValid = await validateIaC(infrastructure.code);
    if (!isValid) {
      throw new Error("Infrastructure as Code validation failed");
    }
    
    console.log("Infrastructure code validated successfully, preparing to deploy...");
    
    const cloudProvider = detectCloudProvider(infrastructure.description);
    
    // Update infrastructure status to deploying
    await context.entities.Infrastructure.update({
      where: { id: infrastructureId },
      data: { 
        status: "deploying",
        deploymentDetails: JSON.stringify({ status: "in_progress", provider: cloudProvider })
      }
    });
    
    const env = await configureProviderEnvironment(context.user.id, cloudProvider);
    
    if (!process.env.PULUMI_ACCESS_TOKEN) {
      throw new Error("PULUMI_ACCESS_TOKEN environment variable is not set");
    }
    
    // Deploy the infrastructure using Pulumi with proper configuration
    const stack = new pulumi.Stack("auto-generated", {
      projectName: `user-${context.user.id}-infra-${infrastructureId}`,
      program: () => {
        const pulumiCode = new Function('pulumi', infrastructure.code);
        pulumiCode(pulumi);
      },
      environmentVariables: env
    });
    
    // Deploy the stack with progress tracking
    const deploymentStart = Date.now();
    console.log("Starting infrastructure deployment...");
    
    const result = await stack.up({
      onOutput: (output) => {
        console.log(output);
        // Update deployment details with progress information
        try {
          context.entities.Infrastructure.update({
            where: { id: infrastructureId },
            data: { 
              deploymentDetails: JSON.stringify({ 
                status: "in_progress", 
                provider: cloudProvider,
                logs: output,
                startTime: deploymentStart,
                lastUpdate: Date.now()
              })
            }
          });
        } catch (error) {
          console.error("Error updating deployment progress:", error);
        }
      }
    });
    
    console.log("Infrastructure deployed successfully");
    
    // Update the status of the Infrastructure entity
    await context.entities.Infrastructure.update({
      where: { id: infrastructureId },
      data: { 
        status: "deployed",
        deploymentDetails: JSON.stringify({
          status: "success",
          provider: cloudProvider,
          result: result,
          startTime: deploymentStart,
          endTime: Date.now(),
          outputs: result.outputs
        })
      }
    });
    
    console.log("Infrastructure status updated to 'deployed'");
    return { 
      success: true, 
      message: "Infrastructure deployed successfully", 
      outputs: result.outputs 
    };
  } catch (error) {
    console.error("Error deploying infrastructure:", error);
    
    // Update the status to failed if there was an error
    if (infrastructureId) {
      try {
        await context.entities.Infrastructure.update({
          where: { id: infrastructureId },
          data: { 
            status: "failed",
            deploymentDetails: JSON.stringify({ 
              status: "error", 
              error: error.message,
              timestamp: Date.now() 
            })
          }
        });
        console.log("Infrastructure status updated to 'failed'");
      } catch (updateError) {
        console.error("Failed to update infrastructure status:", updateError);
      }
    }
    
    throw new Error(`Deployment failed: ${error.message}`);
  }
};
