/**
 * ParentFlow Version Configuration
 * Centralized version management for API and application
 */

export const VERSION_CONFIG = {
  // Application version (from package.json)
  app: {
    version: '1.0.0',
    buildNumber: process.env.BUILD_NUMBER || 'prod',
    environment: process.env.NODE_ENV || 'production',
    buildDate: new Date().toISOString(),
  },

  // API versioning
  api: {
    current: 'v1',
    supported: ['v1'],
    deprecated: [],
    minimum: 'v1',
  },

  // Client compatibility
  client: {
    minimumVersion: '1.0.0',
    currentVersion: '1.0.0',
    updateRequired: false,
    updateRecommended: false,
  },

  // Feature flags based on version
  features: {
    hebrewNLP: {
      enabled: true,
      minVersion: '0.1.0',
    },
    realTimeUpdates: {
      enabled: false,
      minVersion: '0.2.0',
    },
    advancedAnalytics: {
      enabled: true,
      minVersion: '1.0.0',
    },
    multiLanguage: {
      enabled: false,
      minVersion: '0.4.0',
    },
  },

  // Deprecation warnings
  deprecations: {
    endpoints: [],
    features: [],
  },
} as const;

export type ApiVersion = typeof VERSION_CONFIG.api.supported[number];
export type FeatureName = keyof typeof VERSION_CONFIG.features;

// Version comparison utilities
export function compareVersions(version1: string, version2: string): number {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;
    
    if (v1Part > v2Part) return 1;
    if (v1Part < v2Part) return -1;
  }
  
  return 0;
}

export function isVersionSupported(version: string): boolean {
  return compareVersions(version, VERSION_CONFIG.client.minimumVersion) >= 0;
}

export function isFeatureEnabled(feature: FeatureName, clientVersion?: string): boolean {
  const featureConfig = VERSION_CONFIG.features[feature];
  if (!featureConfig.enabled) return false;
  
  if (clientVersion) {
    return compareVersions(clientVersion, featureConfig.minVersion) >= 0;
  }
  
  return true;
}

export function getVersionInfo() {
  return {
    app: VERSION_CONFIG.app,
    api: VERSION_CONFIG.api,
    client: VERSION_CONFIG.client,
    timestamp: new Date().toISOString(),
  };
}