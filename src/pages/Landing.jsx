import { Link } from "wasp/client/router";
import React, { useState } from "react";

export default function Landing() {
  const [activeTab, setActiveTab] = useState('aws');
  const [promptInput, setPromptInput] = useState('Create a scalable web application with load balancing');

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-700">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 py-20 flex flex-col items-center">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="font-extrabold">Instanti8</span>
              <span className="text-blue-200">.</span>
              <span className="text-blue-300 font-light">&lt;dev&gt;</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Dynamic database on the fly. Build and deploy multi-cloud infrastructure with AI-powered assistance.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link to="/signup">
              <button className="px-8 py-3 bg-white text-indigo-700 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                Get Started
              </button>
            </Link>
            <Link to="/login">
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-all duration-200">
                Log In
              </button>
            </Link>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 right-[5%] w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl opacity-60 blur-sm animate-float"></div>
        <div className="absolute bottom-1/3 left-[10%] w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-60 blur-sm animate-float-delay"></div>
        <div className="absolute top-2/3 right-[15%] w-20 h-20 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-lg opacity-60 blur-sm animate-float-long"></div>
      </div>
      
      {/* Product Overview Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
            Multi-Cloud Infrastructure Provisioning
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-4.5-8.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">AWS Integration</h3>
              <p className="text-gray-600">
                Seamlessly provision and manage AWS resources with AI-powered infrastructure generation.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Azure Services</h3>
              <p className="text-gray-600">
                Deploy and manage Azure resources with intelligent infrastructure code generation.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Google Cloud</h3>
              <p className="text-gray-600">
                Provision GCP resources with secure, validated infrastructure as code generation.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Interactive Demo Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
            Try It Now
          </h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
            Experience the power of AI-driven infrastructure generation without signing up.
          </p>
          
          <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden max-w-5xl mx-auto">
            <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
              <h3 className="text-xl font-semibold">Infrastructure Generator</h3>
              <p className="text-blue-100">Describe your infrastructure needs in plain English</p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Describe your infrastructure:
                </label>
                <textarea 
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline h-24"
                  placeholder="e.g., Create a scalable web application with load balancing"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                ></textarea>
              </div>
              
              <div className="flex justify-center mb-6">
                <button 
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  onClick={() => {
                    alert("Infrastructure code generated! Sign up to deploy it.");
                  }}
                >
                  Generate Infrastructure Code
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex border-b">
                  <button 
                    className={`px-4 py-2 font-medium ${activeTab === 'aws' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('aws')}
                  >
                    AWS
                  </button>
                  <button 
                    className={`px-4 py-2 font-medium ${activeTab === 'azure' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('azure')}
                  >
                    Azure
                  </button>
                  <button 
                    className={`px-4 py-2 font-medium ${activeTab === 'gcp' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('gcp')}
                  >
                    Google Cloud
                  </button>
                </div>
                
                <div className="bg-gray-900 rounded-lg mt-4 p-4 overflow-auto max-h-80">
                  <pre className="text-green-400 text-sm font-mono">
                    {activeTab === 'aws' && (
                      "import * as pulumi from \"@pulumi/pulumi\";\n" +
                      "import * as aws from \"@pulumi/aws\";\n" +
                      "\n" +
                      "const vpc = new aws.ec2.Vpc(\"app-vpc\", {\n" +
                      "  cidrBlock: \"10.0.0.0/16\",\n" +
                      "  enableDnsHostnames: true,\n" +
                      "  tags: {\n" +
                      "    Name: \"app-vpc\",\n" +
                      "    Environment: \"production\",\n" +
                      "  },\n" +
                      "});\n" +
                      "\n" +
                      "const publicSubnet1 = new aws.ec2.Subnet(\"public-subnet-1\", {\n" +
                      "  vpcId: vpc.id,\n" +
                      "  cidrBlock: \"10.0.1.0/24\",\n" +
                      "  availabilityZone: \"us-west-2a\",\n" +
                      "  mapPublicIpOnLaunch: true,\n" +
                      "  tags: {\n" +
                      "    Name: \"public-subnet-1\",\n" +
                      "  },\n" +
                      "});\n" +
                      "\n" +
                      "const lb = new aws.lb.LoadBalancer(\"app-lb\", {\n" +
                      "  internal: false,\n" +
                      "  loadBalancerType: \"application\",\n" +
                      "  securityGroups: [securityGroup.id],\n" +
                      "  subnets: [publicSubnet1.id, publicSubnet2.id],\n" +
                      "  tags: {\n" +
                      "    Environment: \"production\",\n" +
                      "  },\n" +
                      "});\n" +
                      "\n" +
                      "export const lbDnsName = lb.dnsName;"
                    )}
                    
                    {activeTab === 'azure' && (
                      "import * as pulumi from \"@pulumi/pulumi\";\n" +
                      "import * as azure from \"@pulumi/azure-native\";\n" +
                      "\n" +
                      "const resourceGroup = new azure.resources.ResourceGroup(\"app-rg\", {\n" +
                      "  location: \"westus2\",\n" +
                      "});\n" +
                      "\n" +
                      "const vnet = new azure.network.VirtualNetwork(\"app-vnet\", {\n" +
                      "  resourceGroupName: resourceGroup.name,\n" +
                      "  addressSpace: {\n" +
                      "    addressPrefixes: [\"10.0.0.0/16\"],\n" +
                      "  },\n" +
                      "  location: resourceGroup.location,\n" +
                      "});\n" +
                      "\n" +
                      "const subnet = new azure.network.Subnet(\"app-subnet\", {\n" +
                      "  resourceGroupName: resourceGroup.name,\n" +
                      "  virtualNetworkName: vnet.name,\n" +
                      "  addressPrefix: \"10.0.1.0/24\",\n" +
                      "});\n" +
                      "\n" +
                      "const lb = new azure.network.LoadBalancer(\"app-lb\", {\n" +
                      "  resourceGroupName: resourceGroup.name,\n" +
                      "  location: resourceGroup.location,\n" +
                      "  frontendIPConfigurations: [{\n" +
                      "    name: \"PublicIPAddress\",\n" +
                      "    publicIPAddress: {\n" +
                      "      id: publicIp.id,\n" +
                      "    },\n" +
                      "  }],\n" +
                      "});\n" +
                      "\n" +
                      "export const lbIpAddress = publicIp.ipAddress;"
                    )}
                    
                    {activeTab === 'gcp' && (
                      "import * as pulumi from \"@pulumi/pulumi\";\n" +
                      "import * as gcp from \"@pulumi/gcp\";\n" +
                      "\n" +
                      "const network = new gcp.compute.Network(\"app-network\", {\n" +
                      "  autoCreateSubnetworks: false,\n" +
                      "});\n" +
                      "\n" +
                      "const subnet = new gcp.compute.Subnetwork(\"app-subnet\", {\n" +
                      "  ipCidrRange: \"10.0.1.0/24\",\n" +
                      "  region: \"us-central1\",\n" +
                      "  network: network.id,\n" +
                      "});\n" +
                      "\n" +
                      "const healthCheck = new gcp.compute.HealthCheck(\"app-health-check\", {\n" +
                      "  httpHealthCheck: {\n" +
                      "    port: 80,\n" +
                      "  },\n" +
                      "});\n" +
                      "\n" +
                      "const backendService = new gcp.compute.BackendService(\"app-backend-service\", {\n" +
                      "  healthChecks: [healthCheck.id],\n" +
                      "  protocol: \"HTTP\",\n" +
                      "  portName: \"http\",\n" +
                      "  timeoutSec: 10,\n" +
                      "  backends: [{\n" +
                      "    group: instanceGroup.id,\n" +
                      "  }],\n" +
                      "});\n" +
                      "\n" +
                      "export const lbIpAddress = forwardingRule.ipAddress;"
                    )}
                  </pre>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-gray-600 mb-4">Want to deploy this infrastructure?</p>
                <Link to="/signup">
                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    Sign Up to Deploy
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
            Key Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Natural Language to IaC</h3>
                <p className="text-gray-600">
                  Describe your infrastructure needs in plain English, and our AI will generate the appropriate Infrastructure as Code for AWS, Azure, or Google Cloud.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Validation &amp; Security</h3>
                <p className="text-gray-600">
                  All generated infrastructure code is automatically validated for correctness and security best practices before deployment.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Dynamic Database Generation</h3>
                <p className="text-gray-600">
                  Create and deploy database schemas on the fly with natural language descriptions. Supports relational and NoSQL databases across all major cloud providers.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">One-Click Deployment</h3>
                <p className="text-gray-600">
                  Deploy your infrastructure to any cloud provider with a single click. Monitor deployment progress and status in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
            What Our Users Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-indigo-600 font-bold">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">John Doe</h4>
                  <p className="text-gray-500 text-sm">DevOps Engineer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Instanti8.&lt;dev&gt; has revolutionized our infrastructure deployment process. What used to take days now takes minutes."
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-indigo-600 font-bold">JS</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Jane Smith</h4>
                  <p className="text-gray-500 text-sm">CTO, TechStart</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The ability to generate infrastructure code from natural language has been a game-changer for our team's productivity."
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-indigo-600 font-bold">RJ</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Robert Johnson</h4>
                  <p className="text-gray-500 text-sm">Cloud Architect</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Dynamic database generation has simplified our development workflow. We can iterate on database designs much faster now."
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-indigo-600 via-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Infrastructure Workflow?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Join thousands of developers who are building and deploying infrastructure with AI assistance.
          </p>
          <Link to="/signup">
            <button className="px-8 py-3 bg-white text-indigo-700 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
              Get Started for Free
            </button>
          </Link>
        </div>
      </div>
      
      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="font-extrabold">Instanti8</span>
                <span className="text-blue-300">.</span>
                <span className="text-blue-400 font-light">&lt;dev&gt;</span>
              </h3>
              <p className="text-gray-400 mb-4">
                Dynamic database on the fly. Build and deploy multi-cloud infrastructure with AI-powered assistance.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">API Reference</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} Instanti8.&lt;dev&gt;. All rights reserved.
              </p>
              
              <div className="flex items-center space-x-6">
                <p className="text-gray-400 text-sm mr-4">Powered by:</p>
                <a href="https://aws.amazon.com/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                  <img src="/cloud-logos/aws-logo.png" alt="AWS" className="h-8" />
                </a>
                <a href="https://azure.microsoft.com/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                  <img src="/cloud-logos/azure-logo.png" alt="Microsoft Azure" className="h-8" />
                </a>
                <a href="https://cloud.google.com/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                  <img src="/cloud-logos/gcp-logo.png" alt="Google Cloud" className="h-8" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
