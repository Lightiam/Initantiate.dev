# Instanti8.dev

Multi-cloud infrastructure provisioning platform with AI-powered code generation.

## Features

- Generate infrastructure code using AI
- Deploy to AWS, Azure, and Google Cloud Platform
- Manage cloud provider credentials
- Track deployment status and outputs
- Real-time deployment logs and outputs
- Support for multiple infrastructure types (VPC, Kubernetes, VMs, etc.)

## Setup

### Prerequisites

- Node.js 16+
- PostgreSQL
- Pulumi CLI

### Environment Variables

Create a `.env.server` file with the following variables:

```
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/instantiate

# Pulumi Configuration
PULUMI_ACCESS_TOKEN=your_pulumi_access_token

# AI Services (at least one is required)
GROQ_API_KEY=your_groq_api_key
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
AZURE_OPENAI_KEY=your_azure_openai_key
AZURE_OPENAI_DEPLOYMENT_ID=your_azure_openai_deployment_id
```

### Installation

1. Clone the repository
   ```
   git clone https://github.com/Lightiam/Initantiate.dev.git
   cd Initantiate.dev
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   wasp start
   ```

## Usage

1. Create an account and log in
2. Configure your cloud provider credentials in the Credentials page
3. Generate infrastructure code using natural language on the Dashboard
4. Deploy the infrastructure to your cloud provider
5. View deployment status and outputs in the Infrastructure Details page

## Cloud Provider Setup

### AWS

1. Create an IAM user with programmatic access
2. Attach the necessary policies (e.g., AdministratorAccess for testing)
3. Save the Access Key ID and Secret Access Key
4. Enter these credentials in the AWS section of the Credentials page

### Azure

1. Create a service principal with the Azure CLI:
   ```
   az ad sp create-for-rbac --name "Instanti8Dev" --role contributor --scopes /subscriptions/{subscription-id}
   ```
2. Save the tenant ID, client ID, client secret, and subscription ID
3. Enter these credentials in the Azure section of the Credentials page

### Google Cloud Platform

1. Create a service account with the necessary permissions
2. Generate and download a JSON key file
3. Enter the key file contents in the GCP section of the Credentials page

## Development

### Backend API

The backend API is built with FastAPI and provides endpoints for:
- Generating infrastructure code using AI
- Validating infrastructure code
- Deploying infrastructure to cloud providers

### Frontend

The frontend is built with React and provides:
- User authentication
- Infrastructure management dashboard
- Cloud provider credential management
- Deployment status tracking
