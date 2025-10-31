#!/usr/bin/env node

// Shadcn UI MCP Server Wrapper
// This script provides a local wrapper for the shadcn-ui MCP server

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting Shadcn UI MCP Server...');

// Get GitHub API key from environment if available
const githubApiKey = process.env.GITHUB_API_KEY || process.env.GITHUB_TOKEN;

// Build command arguments
const args = ['@jpisnice/shadcn-ui-mcp-server'];
if (githubApiKey) {
  args.push('--github-api-key', githubApiKey);
  console.log('Using GitHub API key for higher rate limits (5000 requests/hour)');
} else {
  console.log('No GitHub API key found, using default rate limits (60 requests/hour)');
  console.log('Set GITHUB_API_KEY environment variable for better rate limits');
}

// Spawn the MCP server process
const server = spawn('npx', args, {
  stdio: 'inherit',
  cwd: __dirname,
  env: {
    ...process.env,
    MCP_SERVER_NAME: 'shadcn-ui',
    MCP_SERVER_VERSION: '1.0.0'
  }
});

server.on('error', (error) => {
  console.error('Failed to start Shadcn UI MCP server:', error);
  process.exit(1);
});

server.on('exit', (code, signal) => {
  if (signal) {
    console.log(`Shadcn UI MCP server terminated by signal ${signal}`);
  } else {
    console.log(`Shadcn UI MCP server exited with code ${code}`);
  }
  process.exit(code);
});

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\nShutting down Shadcn UI MCP server...');
  server.kill('SIGTERM');
});

process.on('SIGTERM', () => {
  console.log('Terminating Shadcn UI MCP server...');
  server.kill('SIGTERM');
});