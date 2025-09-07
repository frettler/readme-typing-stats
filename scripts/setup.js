#!/usr/bin/env node

/**
 * Setup script for GitHub README Dynamic Typing
 * Helps users get started quickly with the project
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 GitHub README Dynamic Typing - Setup Script\n');

function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 16) {
    console.log('❌ Node.js version 16 or higher is required.');
    console.log(`Current version: ${nodeVersion}`);
    console.log('Please update Node.js: https://nodejs.org/');
    process.exit(1);
  }
  
  console.log(`✅ Node.js version: ${nodeVersion}`);
}

function checkPackageJson() {
  if (!fs.existsSync('package.json')) {
    console.log('❌ package.json not found. Are you in the project directory?');
    process.exit(1);
  }
  console.log('✅ package.json found');
}

function installDependencies() {
  console.log('\n📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.log('❌ Failed to install dependencies');
    console.log('Please run: npm install');
    process.exit(1);
  }
}

function setupEnvironment() {
  console.log('\n⚙️  Setting up environment...');
  
  const envExamplePath = 'env.example';
  const envPath = '.env';
  
  if (fs.existsSync(envExamplePath) && !fs.existsSync(envPath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from env.example');
    console.log('💡 Edit .env to add your GitHub token (optional but recommended)');
  } else if (fs.existsSync(envPath)) {
    console.log('✅ .env file already exists');
  }
}

function createCacheDirectory() {
  const cacheDir = 'cache';
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
    console.log('✅ Created cache directory');
  } else {
    console.log('✅ Cache directory exists');
  }
}

function displayNextSteps() {
  console.log('\n🎉 Setup completed successfully!\n');
  console.log('📋 Next steps:');
  console.log('   1. (Optional) Edit .env file to add your GitHub token');
  console.log('   2. Start the development server: npm run dev');
  console.log('   3. Test the service: http://localhost:3000');
  console.log('   4. Run tests: node test/basic-test.js\n');
  
  console.log('🔗 Example usage:');
  console.log('   http://localhost:3000/typing?user=octocat&type=commit');
  console.log('   http://localhost:3000/typing/preview?text=Hello%20World\n');
  
  console.log('📚 For more information, check the README.md file.');
}

function main() {
  try {
    checkNodeVersion();
    checkPackageJson();
    installDependencies();
    setupEnvironment();
    createCacheDirectory();
    displayNextSteps();
  } catch (error) {
    console.log(`\n❌ Setup failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };

