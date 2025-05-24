import * as pulumi from '@pulumi/pulumi';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Validates Infrastructure as Code using Pulumi preview
 * @param {string} code - Pulumi TypeScript code to validate
 * @returns {Promise<boolean>} - Whether the code is valid
 */
export async function validateIaC(code) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pulumi-validation-'));
  
  try {
    fs.writeFileSync(path.join(tempDir, 'index.ts'), code);
    fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify({
      name: "infrastructure-validation",
      main: "index.ts",
      dependencies: {
        "@pulumi/pulumi": "^3.0.0",
        "@pulumi/aws": "^5.0.0",
        "@pulumi/azure-native": "^2.0.0",
        "@pulumi/gcp": "^6.0.0"
      }
    }));
    
    fs.writeFileSync(path.join(tempDir, 'Pulumi.yaml'), `
name: infrastructure-validation
runtime: nodejs
description: Temporary project for validating infrastructure code
    `);
    
    await execAsync('npm install', { cwd: tempDir });
    
    await execAsync('pulumi preview --non-interactive', { 
      cwd: tempDir,
      env: {
        ...process.env,
        PULUMI_SKIP_UPDATE_CHECK: "true",
        PULUMI_ACCESS_TOKEN: process.env.PULUMI_ACCESS_TOKEN || "pul-12c056b7af91a9892ba74be9cc3c0418b09f3929"
      }
    });
    
    return true;
  } catch (error) {
    console.error('IaC validation error:', error);
    return false;
  } finally {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error('Error cleaning up temporary directory:', cleanupError);
    }
  }
}

/**
 * Performs static analysis on the generated code
 * @param {string} code - Pulumi TypeScript code to analyze
 * @returns {Promise<{valid: boolean, issues: Array<string>}>} - Validation results
 */
export async function staticAnalyzeIaC(code) {
  const issues = [];
  
  if (!code.includes('@pulumi/aws') && !code.includes('@pulumi/azure') && !code.includes('@pulumi/gcp')) {
    issues.push('Missing cloud provider imports');
  }
  
  if (!code.includes('new pulumi.Stack')) {
    issues.push('Missing Pulumi stack definition');
  }
  
  if (code.includes('PublicAccess: "enabled"') || code.includes('publicAccess: true')) {
    issues.push('Warning: Public access enabled on resources');
  }
  
  if (code.includes('password:') && !code.includes('secretsManager') && !code.includes('keyVault')) {
    issues.push('Warning: Passwords should be stored in secrets management');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}
