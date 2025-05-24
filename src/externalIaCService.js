import axios from 'axios';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { VertexAI } from '@google-cloud/vertexai';

const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-west-2" });

const azureClient = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT || "https://lightiam.openai.azure.com/",
  new AzureKeyCredential(process.env.AZURE_OPENAI_KEY || "")
);

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT || "spreadifyai",
  location: process.env.GOOGLE_CLOUD_LOCATION || "us-central1",
});

/**
 * Generate Infrastructure as Code using AWS Bedrock (Claude 3)
 * @param {string} prompt - Natural language description of infrastructure
 * @returns {Promise<string>} - Generated Pulumi code
 */
async function generateWithBedrock(prompt) {
  const input = {
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: `Convert the following infrastructure description to Pulumi TypeScript code that works across AWS, Azure, and GCP. Include proper error handling, security best practices, and resource tagging:
          
          ${prompt}
          
          Format the response as valid TypeScript code only, with no explanations or markdown.`
        }
      ],
      temperature: 0.2,
      max_tokens: 4000
    })
  };

  try {
    const command = new InvokeModelCommand(input);
    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.content[0].text;
  } catch (error) {
    console.error("Error generating code with AWS Bedrock:", error);
    throw new Error("Failed to generate infrastructure code with AWS Bedrock");
  }
}

/**
 * Generate Infrastructure as Code using Azure OpenAI
 * @param {string} prompt - Natural language description of infrastructure
 * @returns {Promise<string>} - Generated Pulumi code
 */
async function generateWithAzure(prompt) {
  try {
    const deploymentId = process.env.AZURE_OPENAI_DEPLOYMENT_ID || "gpt-35-turbo";
    
    const response = await azureClient.getChatCompletions(
      deploymentId,
      [
        { 
          role: "system", 
          content: "You are an expert in cloud infrastructure and Pulumi. Generate valid Pulumi TypeScript code for multi-cloud deployments. Include proper error handling, security best practices, and resource tagging." 
        },
        { 
          role: "user", 
          content: `Convert the following infrastructure description to Pulumi TypeScript code that works across AWS, Azure, and GCP:
          
          ${prompt}
          
          Format the response as valid TypeScript code only, with no explanations or markdown.` 
        }
      ],
      { 
        temperature: 0.2, 
        maxTokens: 4000 
      }
    );
    
    if (response.choices && response.choices.length > 0 && response.choices[0].message) {
      return response.choices[0].message.content;
    } else {
      throw new Error("Unexpected response format from Azure OpenAI");
    }
  } catch (error) {
    console.error("Error generating code with Azure OpenAI:", error);
    
    if (process.env.AZURE_OPENAI_KEY_BACKUP) {
      try {
        console.log("Attempting with backup Azure OpenAI key");
        const backupClient = new OpenAIClient(
          process.env.AZURE_OPENAI_ENDPOINT || "https://lightiam.openai.azure.com/",
          new AzureKeyCredential(process.env.AZURE_OPENAI_KEY_BACKUP || "")
        );
        
        const deploymentId = process.env.AZURE_OPENAI_DEPLOYMENT_ID || "gpt-35-turbo";
        const response = await backupClient.getChatCompletions(
          deploymentId,
          [
            { 
              role: "system", 
              content: "You are an expert in cloud infrastructure and Pulumi. Generate valid Pulumi TypeScript code for multi-cloud deployments." 
            },
            { 
              role: "user", 
              content: `Convert the following infrastructure description to Pulumi TypeScript code that works across AWS, Azure, and GCP: ${prompt}` 
            }
          ],
          { temperature: 0.2, maxTokens: 4000 }
        );
        
        if (response.choices && response.choices.length > 0 && response.choices[0].message) {
          return response.choices[0].message.content;
        }
      } catch (backupError) {
        console.error("Error with backup Azure OpenAI key:", backupError);
      }
    }
    
    throw new Error("Failed to generate infrastructure code with Azure OpenAI");
  }
}

/**
 * Generate Infrastructure as Code using Google Vertex AI (Gemini)
 * @param {string} prompt - Natural language description of infrastructure
 * @returns {Promise<string>} - Generated Pulumi code
 */
async function generateWithVertexAI(prompt) {
  try {
    const model = vertexAI.preview.getGenerativeModel({
      model: "gemini-pro",
      generation_config: {
        temperature: 0.2,
        max_output_tokens: 4000,
      },
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an expert in cloud infrastructure and Pulumi. Generate valid Pulumi TypeScript code for multi-cloud deployments.
              
              Convert the following infrastructure description to Pulumi TypeScript code that works across AWS, Azure, and GCP.
              Include proper error handling, security best practices, and resource tagging:
              
              ${prompt}
              
              Format the response as valid TypeScript code only, with no explanations or markdown.`
            }
          ]
        }
      ]
    });
    
    if (result && result.response && result.response.candidates && 
        result.response.candidates.length > 0 && 
        result.response.candidates[0].content) {
      return result.response.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Unexpected response format from Google Vertex AI");
    }
  } catch (error) {
    console.error("Error generating code with Google Vertex AI:", error);
    throw new Error("Failed to generate infrastructure code with Google Vertex AI: " + error.message);
  }
}

/**
 * Generate Infrastructure as Code using the best available provider
 * Falls back to alternative providers if primary fails
 * @param {string} prompt - Natural language description of infrastructure
 * @returns {Promise<string>} - Generated Pulumi code
 */
export async function generateIaC(prompt) {
  const hasAwsCredentials = process.env.AWS_ACCESS_KEY_ID && 
                           process.env.AWS_ACCESS_KEY_ID !== 'your_aws_access_key' && 
                           process.env.AWS_SECRET_ACCESS_KEY && 
                           process.env.AWS_SECRET_ACCESS_KEY !== 'your_aws_secret_key';
  
  try {
    console.log("Attempting to generate infrastructure code with Azure OpenAI");
    return await generateWithAzure(prompt);
  } catch (azureError) {
    console.log("Azure OpenAI generation failed:", azureError.message);
    
    try {
      console.log("Falling back to Google Vertex AI");
      return await generateWithVertexAI(prompt);
    } catch (vertexError) {
      console.log("Google Vertex AI generation failed:", vertexError.message);
      
      if (hasAwsCredentials) {
        try {
          console.log("Falling back to AWS Bedrock");
          return await generateWithBedrock(prompt);
        } catch (bedrockError) {
          console.log("AWS Bedrock generation failed:", bedrockError.message);
          throw new Error("All cloud providers failed to generate infrastructure code. Please try again later.");
        }
      } else {
        throw new Error("All available cloud providers failed to generate infrastructure code. AWS credentials not configured yet.");
      }
    }
  }
}
