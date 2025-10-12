/**
 * Version Check Script for ParentFlow
 * Validates version compatibility and displays system info
 */

import { VERSION_CONFIG, getVersionInfo, compareVersions } from '../server/version.js';

async function checkServerVersion() {
  try {
    console.log('🔍 Checking ParentFlow version compatibility...\n');

    // Check if server is running
    const healthResponse = await fetch('http://localhost:3001/health');
    if (!healthResponse.ok) {
      throw new Error(`Server health check failed: ${healthResponse.status}`);
    }

    const healthData = await healthResponse.json();
    console.log('✅ Server Status:', healthData.status);
    console.log('🌍 Timezone:', healthData.timezone);
    console.log('💾 Database:', healthData.database);
    console.log('🏷️ Server Version:', healthData.version);
    console.log('📡 API Version:', healthData.apiVersion);
    console.log('');

    // Get detailed version info
    const versionResponse = await fetch('http://localhost:3001/api/version', {
      headers: {
        'X-Client-Version': VERSION_CONFIG.app.version,
        'X-API-Version': VERSION_CONFIG.api.current,
      },
    });

    if (!versionResponse.ok) {
      throw new Error(`Version endpoint failed: ${versionResponse.status}`);
    }

    const versionData = await versionResponse.json();

    console.log('📋 Application Version Info:');
    console.log('  App Version:', versionData.app.version);
    console.log('  Build Number:', versionData.app.buildNumber);
    console.log('  Environment:', versionData.app.environment);
    console.log('  Build Date:', versionData.app.buildDate);
    console.log('');

    console.log('🔌 API Version Info:');
    console.log('  Current:', versionData.api.current);
    console.log('  Supported:', versionData.api.supported.join(', '));
    console.log('  Minimum:', versionData.api.minimum);
    console.log('');

    console.log('💻 Client Compatibility:');
    console.log('  Minimum Version:', versionData.client.minimumVersion);
    console.log('  Current Version:', VERSION_CONFIG.app.version);
    console.log('  Supported:', versionData.clientSupported ? '✅ Yes' : '❌ No');
    console.log('  Update Required:', versionData.client.updateRequired ? '⚠️ Yes' : '✅ No');
    console.log('  Update Recommended:', versionData.client.updateRecommended ? '💡 Yes' : '✅ No');
    console.log('');

    console.log('🎯 Feature Flags:');
    Object.entries(versionData.features).forEach(([feature, config]: [string, any]) => {
      const status = config.available ? '✅' : '❌';
      console.log(`  ${feature}: ${status} (min: ${config.minVersion}, enabled: ${config.enabled})`);
    });
    console.log('');

    // Version comparison demo
    console.log('🔄 Version Comparison Examples:');
    const testVersions = ['0.0.9', '0.1.0', '0.1.1', '0.2.0'];
    testVersions.forEach(version => {
      const comparison = compareVersions(version, VERSION_CONFIG.app.version);
      const symbol = comparison > 0 ? '⬆️' : comparison < 0 ? '⬇️' : '✅';
      console.log(`  ${version} vs ${VERSION_CONFIG.app.version}: ${symbol}`);
    });
    console.log('');

    // Deprecation warnings
    if (versionData.deprecations.endpoints.length > 0 || versionData.deprecations.features.length > 0) {
      console.log('⚠️ Deprecation Warnings:');
      versionData.deprecations.endpoints.forEach((endpoint: string) => {
        console.log(`  Endpoint: ${endpoint}`);
      });
      versionData.deprecations.features.forEach((feature: string) => {
        console.log(`  Feature: ${feature}`);
      });
      console.log('');
    }

    console.log('✅ Version check completed successfully!');

  } catch (error) {
    console.error('❌ Version check failed:', error instanceof Error ? error.message : String(error));
    console.log('\n💡 Make sure the API server is running:');
    console.log('   npm run dev:api');
    process.exit(1);
  }
}

async function checkClientPackages() {
  console.log('📦 Checking package versions...\n');

  try {
    const packageJson = await import('../package.json', { assert: { type: 'json' } });
    const pkg = packageJson.default;

    console.log('📋 Package Information:');
    console.log('  Name:', pkg.name);
    console.log('  Version:', pkg.version);
    console.log('  Type:', pkg.type);
    console.log('');

    console.log('🔧 Key Dependencies:');
    const keyDeps = ['react', 'fastify', 'prisma', 'typescript'];
    keyDeps.forEach(dep => {
      const dependencies = pkg.dependencies as Record<string, string> || {};
      const devDependencies = pkg.devDependencies as Record<string, string> || {};
      const version = dependencies[dep] || devDependencies[dep];
      if (version) {
        console.log(`  ${dep}: ${version}`);
      }
    });
    console.log('');

  } catch (error) {
    console.error('❌ Package check failed:', error instanceof Error ? error.message : String(error));
  }
}

// Main execution
async function main() {
  console.log('🚀 ParentFlow Version Check Tool');
  console.log('================================\n');

  await checkClientPackages();
  await checkServerVersion();

  console.log('🎉 All checks completed!');
  console.log('');
  console.log('📖 Version Management Features:');
  console.log('  • Automatic client-server compatibility checking');
  console.log('  • Feature flags based on version requirements');
  console.log('  • Update notifications and recommendations');
  console.log('  • API versioning with backward compatibility');
  console.log('  • Graceful degradation for older clients');
  console.log('');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}