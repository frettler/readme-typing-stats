/**
 * Basic test script to verify the GitHub README Dynamic Typing service
 * Run with: node test/basic-test.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.abort();
      reject(new Error('Request timeout'));
    });
  });
}

async function runTests() {
  console.log('🧪 Running basic tests for GitHub README Dynamic Typing service...\n');
  
  const tests = [
    {
      name: 'Health Check',
      path: '/',
      expectedStatus: 200,
      expectedContentType: 'application/json'
    },
    {
      name: 'API Info',
      path: '/typing/info',
      expectedStatus: 200,
      expectedContentType: 'application/json'
    },
    {
      name: 'Preview Endpoint',
      path: '/typing/preview?text=Hello%20World',
      expectedStatus: 200,
      expectedContentType: 'image/svg+xml'
    },
    {
      name: 'Missing User Parameter',
      path: '/typing',
      expectedStatus: 400,
      expectedContentType: 'application/json'
    },
    {
      name: 'Invalid Type Parameter',
      path: '/typing?user=octocat&type=invalid',
      expectedStatus: 400,
      expectedContentType: 'application/json'
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      const response = await makeRequest(test.path);
      
      // Check status code
      if (response.statusCode !== test.expectedStatus) {
        console.log(`❌ FAIL: Expected status ${test.expectedStatus}, got ${response.statusCode}`);
        failed++;
        continue;
      }
      
      // Check content type
      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.includes(test.expectedContentType)) {
        console.log(`❌ FAIL: Expected content-type to include ${test.expectedContentType}, got ${contentType}`);
        failed++;
        continue;
      }
      
      console.log(`✅ PASS: ${test.name}`);
      passed++;
      
    } catch (error) {
      console.log(`❌ FAIL: ${test.name} - ${error.message}`);
      failed++;
    }
    
    console.log('');
  }
  
  console.log(`\n📊 Test Results:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your service is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check your server configuration.');
    process.exit(1);
  }
}

// Check if server is running
console.log('🔍 Checking if server is running on http://localhost:3000...\n');

makeRequest('/')
  .then(() => {
    console.log('✅ Server is running! Starting tests...\n');
    runTests();
  })
  .catch(() => {
    console.log('❌ Server is not running on http://localhost:3000');
    console.log('Please start the server with: npm start or npm run dev');
    process.exit(1);
  });

