#!/usr/bin/env node

import http from 'http';

const PORT = process.env.PORT || 8080;
const HOST = 'localhost';

const ENDPOINTS = [
  { path: '/', description: 'Home page' },
  { path: '/blog', description: 'Blog listing' },
  { path: '/about', description: 'About page' },
  { path: '/contact', description: 'Contact page' },
  { path: '/resume', description: 'Resume page' },
  { path: '/api/posts-index.json', description: 'Posts API index', json: true },
  { path: '/blog/two-minds-one-war', description: 'Sample blog post' },
  { path: '/nonexistent-route', description: 'SPA fallback test', expectFallback: true }
];

function checkEndpoint(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: HOST,
      port: PORT,
      path: endpoint.path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const result = {
          endpoint: endpoint.path,
          description: endpoint.description,
          statusCode: res.statusCode,
          success: res.statusCode === 200
        };

        // For JSON endpoints, validate JSON
        if (endpoint.json && res.statusCode === 200) {
          try {
            const parsed = JSON.parse(data);
            result.jsonValid = true;
            result.jsonLength = Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length;
          } catch (e) {
            result.jsonValid = false;
            result.error = 'Invalid JSON response';
            result.success = false;
          }
        }

        // For SPA fallback test, check if we get index.html
        if (endpoint.expectFallback && res.statusCode === 200) {
          result.isFallback = data.includes('<!DOCTYPE html>') && data.includes('root');
          result.success = result.isFallback;
        }

        resolve(result);
      });
    });

    req.on('error', (err) => {
      reject({
        endpoint: endpoint.path,
        description: endpoint.description,
        success: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({
        endpoint: endpoint.path,
        description: endpoint.description,
        success: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

async function runHealthChecks() {
  console.log(`\n🏥 Running health checks on http://${HOST}:${PORT}\n`);

  const results = [];
  let allPassed = true;

  for (const endpoint of ENDPOINTS) {
    try {
      const result = await checkEndpoint(endpoint);
      results.push(result);

      const emoji = result.success ? '✅' : '❌';
      let details = `[${result.statusCode}]`;

      if (result.jsonValid !== undefined) {
        details += result.jsonValid ? ` Valid JSON (${result.jsonLength} items)` : ' Invalid JSON';
      }

      if (result.isFallback !== undefined) {
        details += result.isFallback ? ' SPA fallback works' : ' SPA fallback failed';
      }

      console.log(`${emoji} ${result.description.padEnd(25)}: ${details}`);

      if (!result.success) {
        allPassed = false;
        if (result.error) {
          console.log(`   Error: ${result.error}`);
        }
      }
    } catch (err) {
      results.push(err);
      console.log(`❌ ${err.description.padEnd(25)}: ${err.error}`);
      allPassed = false;
    }
  }

  // Summary
  const passed = results.filter(r => r.success).length;
  const total = results.length;

  console.log(`\n📊 Summary: ${passed}/${total} checks passed`);

  if (allPassed) {
    console.log('✅ All health checks passed!\n');
    process.exit(0);
  } else {
    console.log('❌ Some health checks failed\n');
    process.exit(1);
  }
}

// Check if server is running first
function checkServerRunning() {
  return new Promise((resolve) => {
    const options = {
      hostname: HOST,
      port: PORT,
      path: '/',
      method: 'HEAD',
      timeout: 2000
    };

    const req = http.request(options, () => {
      resolve(true);
    });

    req.on('error', () => {
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Main execution
(async function main() {
  const isRunning = await checkServerRunning();

  if (!isRunning) {
    console.error(`\n❌ Server not running on http://${HOST}:${PORT}`);
    console.error('Start the server first: npm start\n');
    process.exit(1);
  }

  await runHealthChecks();
})();
