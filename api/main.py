import os
import json
from typing import Optional
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import httpx
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Instanti8.dev API", description="API for Instanti8.dev infrastructure generation")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "https://multi-cloud-iac-agent-i3d4dp7s.devinapps.com,http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InfrastructureRequest(BaseModel):
    prompt: str

class InfrastructureResponse(BaseModel):
    code: str
    cloudProvider: Optional[str] = None
    infraType: Optional[str] = None

def detect_cloud_provider(prompt: str) -> str:
    """Detect the cloud provider from the prompt"""
    prompt_lower = prompt.lower()
    if "aws" in prompt_lower or "amazon" in prompt_lower:
        return "AWS"
    elif "azure" in prompt_lower or "microsoft" in prompt_lower:
        return "Azure"
    elif "gcp" in prompt_lower or "google" in prompt_lower:
        return "Google Cloud Platform"
    else:
        return "multi-cloud"  # Default to multi-cloud if no provider specified

def detect_infrastructure_type(prompt: str) -> str:
    """Detect the infrastructure type from the prompt"""
    prompt_lower = prompt.lower()
    if "kubernetes" in prompt_lower or "k8s" in prompt_lower:
        return "Kubernetes"
    elif "serverless" in prompt_lower or "lambda" in prompt_lower or "function" in prompt_lower:
        return "Serverless"
    elif "vpc" in prompt_lower or "network" in prompt_lower:
        return "Network"
    else:
        return "general"  # Default to general if no type specified

async def generate_with_groq(prompt: str, cloud_provider: str, infra_type: str) -> str:
    """Generate infrastructure code using Groq AI"""
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY environment variable not set")
    
    groq_api_url = "https://api.groq.com/openai/v1/chat/completions"
    
    system_prompt = f"""You are an expert in cloud infrastructure and Pulumi. 
Generate valid Pulumi TypeScript code for {cloud_provider} deployments.
Focus specifically on {infra_type} infrastructure.
Include proper error handling, security best practices, and resource tagging."""
    
    user_prompt = f"""Convert the following infrastructure description to Pulumi TypeScript code for {cloud_provider}:

{prompt}

Format the response as valid TypeScript code only, with no explanations or markdown.
The code should be ready to use with Pulumi CLI.
"""
    
    headers = {
        "Authorization": f"Bearer {groq_api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "llama3-70b-8192",  # Using Llama 3 70B model
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.2,
        "max_tokens": 4000
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(groq_api_url, headers=headers, json=payload)
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=f"Groq API error: {response.text}")
        
        response_data = response.json()
        return response_data["choices"][0]["message"]["content"]

def generate_sample_code(cloud_provider: str, infra_type: str) -> str:
    """Generate sample Pulumi TypeScript code based on cloud provider and infrastructure type"""
    
    if cloud_provider == "Google Cloud Platform" and infra_type == "Kubernetes":
        return """
import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as k8s from "@pulumi/kubernetes";

// Configuration
const config = new pulumi.Config();
const namePrefix = config.get("namePrefix") || "app";
const nodeCount = config.getNumber("nodeCount") || 3;
const tags = {
    "Environment": "Development",
    "Project": "KubernetesDemo",
    "ManagedBy": "Pulumi"
};

// Create a GCP Resource Group
const gcpProject = gcp.config.project || "my-gcp-project";
const gcpRegion = gcp.config.region || "us-central1";
const gcpZone = gcp.config.zone || "us-central1-a";

// Create a GKE cluster
const cluster = new gcp.container.Cluster(`${namePrefix}-gke-cluster`, {
    initialNodeCount: nodeCount,
    minMasterVersion: "latest",
    nodeVersion: "latest",
    location: gcpZone,
    nodeConfig: {
        machineType: "n1-standard-1",
        oauthScopes: [
            "https://www.googleapis.com/auth/compute",
            "https://www.googleapis.com/auth/devstorage.read_only",
            "https://www.googleapis.com/auth/logging.write",
            "https://www.googleapis.com/auth/monitoring",
        ],
        labels: tags,
    },
});

// Export the Cluster name and kubeconfig
export const clusterName = cluster.name;
export const kubeconfig = pulumi.secret(
    pulumi.interpolate`apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ${cluster.masterAuth.clusterCaCertificate}
    server: https://${cluster.endpoint}
  name: ${cluster.name}
contexts:
- context:
    cluster: ${cluster.name}
    user: ${cluster.name}
  name: ${cluster.name}
current-context: ${cluster.name}
kind: Config
preferences: {}
users:
- name: ${cluster.name}
  user:
    auth-provider:
      config:
        cmd-args: config config-helper --format=json
        cmd-path: gcloud
        expiry-key: '{.credential.token_expiry}'
        token-key: '{.credential.access_token}'
      name: gcp
`);

// Create a Kubernetes provider instance that uses our cluster from above
const provider = new k8s.Provider(`${namePrefix}-k8s-provider`, {
    kubeconfig: kubeconfig,
});

// Create a Kubernetes Namespace
const namespace = new k8s.core.v1.Namespace(`${namePrefix}-namespace`, {
    metadata: {
        name: namePrefix,
    },
}, { provider: provider });

// Deploy a simple application
const appLabels = { app: "simple-app" };
const deployment = new k8s.apps.v1.Deployment(`${namePrefix}-deployment`, {
    metadata: {
        namespace: namespace.metadata.name,
        labels: appLabels,
    },
    spec: {
        replicas: 2,
        selector: { matchLabels: appLabels },
        template: {
            metadata: { labels: appLabels },
            spec: {
                containers: [{
                    name: "simple-app",
                    image: "nginx:latest",
                    ports: [{ name: "http", containerPort: 80 }],
                }],
            },
        },
    },
}, { provider: provider });

// Export the Deployment name
export const deploymentName = deployment.metadata.name;
"""
    elif cloud_provider == "Azure" and infra_type == "Network":
        return """
// Azure Virtual Network Configuration
import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure-native";
import * as network from "@pulumi/azure-native/network";

// Create a resource group
const resourceGroup = new azure.resources.ResourceGroup("azure-vpc-rg");

// Create a virtual network (VPC equivalent in Azure)
const virtualNetwork = new network.VirtualNetwork("azure-vnet", {
    resourceGroupName: resourceGroup.name,
    addressSpace: {
        addressPrefixes: ["10.0.0.0/16"],
    },
    subnets: [
        {
            name: "frontend-subnet",
            addressPrefix: "10.0.1.0/24",
        },
        {
            name: "backend-subnet",
            addressPrefix: "10.0.2.0/24",
        },
        {
            name: "database-subnet",
            addressPrefix: "10.0.3.0/24",
        },
    ],
});

// Create a network security group
const nsg = new network.NetworkSecurityGroup("azure-nsg", {
    resourceGroupName: resourceGroup.name,
    securityRules: [
        {
            name: "allow-http",
            priority: 100,
            direction: "Inbound",
            access: "Allow",
            protocol: "Tcp",
            sourceAddressPrefix: "*",
            sourcePortRange: "*",
            destinationAddressPrefix: "*",
            destinationPortRange: "80",
        },
        {
            name: "allow-https",
            priority: 110,
            direction: "Inbound",
            access: "Allow",
            protocol: "Tcp",
            sourceAddressPrefix: "*",
            sourcePortRange: "*",
            destinationAddressPrefix: "*",
            destinationPortRange: "443",
        },
    ],
});

export const vnetName = virtualNetwork.name;
export const vnetId = virtualNetwork.id;
export const resourceGroupName = resourceGroup.name;
"""
    elif cloud_provider == "AWS" and (infra_type == "Network" or infra_type == "VPC"):
        return """
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Configuration
const config = new pulumi.Config();
const namePrefix = config.get("namePrefix") || "app";
const tags = {
    "Environment": "Development",
    "Project": "VpcDemo",
    "ManagedBy": "Pulumi"
};

// Create a VPC
const vpc = new aws.ec2.Vpc(`${namePrefix}-vpc`, {
    cidrBlock: "10.0.0.0/16",
    enableDnsHostnames: true,
    enableDnsSupport: true,
    tags: {
        ...tags,
        Name: `${namePrefix}-vpc`,
    },
});

// Create an internet gateway
const internetGateway = new aws.ec2.InternetGateway(`${namePrefix}-igw`, {
    vpcId: vpc.id,
    tags: {
        ...tags,
        Name: `${namePrefix}-igw`,
    },
});

// Create public subnets
const publicSubnet1 = new aws.ec2.Subnet(`${namePrefix}-public-subnet-1`, {
    vpcId: vpc.id,
    cidrBlock: "10.0.1.0/24",
    availabilityZone: "us-east-1a",
    mapPublicIpOnLaunch: true,
    tags: {
        ...tags,
        Name: `${namePrefix}-public-subnet-1`,
    },
});

const publicSubnet2 = new aws.ec2.Subnet(`${namePrefix}-public-subnet-2`, {
    vpcId: vpc.id,
    cidrBlock: "10.0.2.0/24",
    availabilityZone: "us-east-1b",
    mapPublicIpOnLaunch: true,
    tags: {
        ...tags,
        Name: `${namePrefix}-public-subnet-2`,
    },
});

// Create private subnets
const privateSubnet1 = new aws.ec2.Subnet(`${namePrefix}-private-subnet-1`, {
    vpcId: vpc.id,
    cidrBlock: "10.0.3.0/24",
    availabilityZone: "us-east-1a",
    tags: {
        ...tags,
        Name: `${namePrefix}-private-subnet-1`,
    },
});

const privateSubnet2 = new aws.ec2.Subnet(`${namePrefix}-private-subnet-2`, {
    vpcId: vpc.id,
    cidrBlock: "10.0.4.0/24",
    availabilityZone: "us-east-1b",
    tags: {
        ...tags,
        Name: `${namePrefix}-private-subnet-2`,
    },
});

// Create a route table for public subnets
const publicRouteTable = new aws.ec2.RouteTable(`${namePrefix}-public-rt`, {
    vpcId: vpc.id,
    routes: [
        {
            cidrBlock: "0.0.0.0/0",
            gatewayId: internetGateway.id,
        },
    ],
    tags: {
        ...tags,
        Name: `${namePrefix}-public-rt`,
    },
});

// Associate public subnets with the public route table
const publicRtAssociation1 = new aws.ec2.RouteTableAssociation(`${namePrefix}-public-rt-assoc-1`, {
    subnetId: publicSubnet1.id,
    routeTableId: publicRouteTable.id,
});

const publicRtAssociation2 = new aws.ec2.RouteTableAssociation(`${namePrefix}-public-rt-assoc-2`, {
    subnetId: publicSubnet2.id,
    routeTableId: publicRouteTable.id,
});

// Create a security group
const securityGroup = new aws.ec2.SecurityGroup(`${namePrefix}-sg`, {
    vpcId: vpc.id,
    description: "Allow HTTP and HTTPS traffic",
    ingress: [
        {
            protocol: "tcp",
            fromPort: 80,
            toPort: 80,
            cidrBlocks: ["0.0.0.0/0"],
        },
        {
            protocol: "tcp",
            fromPort: 443,
            toPort: 443,
            cidrBlocks: ["0.0.0.0/0"],
        },
    ],
    egress: [
        {
            protocol: "-1",
            fromPort: 0,
            toPort: 0,
            cidrBlocks: ["0.0.0.0/0"],
        },
    ],
    tags: {
        ...tags,
        Name: `${namePrefix}-sg`,
    },
});

// Export the VPC and subnet IDs
export const vpcId = vpc.id;
export const publicSubnetIds = [publicSubnet1.id, publicSubnet2.id];
export const privateSubnetIds = [privateSubnet1.id, privateSubnet2.id];
export const securityGroupId = securityGroup.id;
"""
    else:
        return """
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as azure from "@pulumi/azure-native";
import * as gcp from "@pulumi/gcp";

// Configuration
const config = new pulumi.Config();
const namePrefix = config.get("namePrefix") || "demo";
const tags = {
    "Environment": "Development",
    "Project": "MultiCloudDemo",
    "ManagedBy": "Pulumi"
};

// AWS Resources
const awsBucket = new aws.s3.Bucket(`${namePrefix}-bucket`, {
    acl: "private",
    tags: tags,
});

// Azure Resources
const resourceGroup = new azure.resources.ResourceGroup(`${namePrefix}-rg`, {
    location: "eastus",
    tags: tags,
});

const storageAccount = new azure.storage.StorageAccount(`${namePrefix}storage`, {
    resourceGroupName: resourceGroup.name,
    sku: {
        name: "Standard_LRS",
    },
    kind: "StorageV2",
    tags: tags,
});

// GCP Resources
const gcpBucket = new gcp.storage.Bucket(`${namePrefix}-bucket`, {
    location: "US",
    labels: {
        environment: "development",
        project: "multicloud-demo",
        managed_by: "pulumi",
    },
});

// Export the resource names
export const awsBucketName = awsBucket.id;
export const azureStorageAccountName = storageAccount.name;
export const gcpBucketName = gcpBucket.name;
"""

@app.get("/")
async def root():
    return {"message": "Welcome to Instanti8.dev API"}

@app.post("/api/generate-infrastructure", response_model=InfrastructureResponse)
async def generate_infrastructure(request: InfrastructureRequest):
    try:
        cloud_provider = detect_cloud_provider(request.prompt)
        infra_type = detect_infrastructure_type(request.prompt)
        
        try:
            code = await generate_with_groq(request.prompt, cloud_provider, infra_type)
        except Exception as e:
            print(f"Error generating code with Groq AI: {str(e)}")
            code = generate_sample_code(cloud_provider, infra_type)
        
        return InfrastructureResponse(
            code=code,
            cloudProvider=cloud_provider,
            infraType=infra_type
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
