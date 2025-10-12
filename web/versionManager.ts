/**
 * Client-side Version Manager for ParentFlow
 * Handles version compatibility and feature flags
 */

import { useEffect, useState } from 'react';

interface VersionInfo {
  app: {
    version: string;
    buildNumber: string;
    environment: string;
    buildDate: string;
  };
  api: {
    current: string;
    supported: string[];
    deprecated: string[];
    minimum: string;
  };
  client: {
    minimumVersion: string;
    currentVersion: string;
    updateRequired: boolean;
    updateRecommended: boolean;
  };
  timestamp: string;
  clientSupported?: boolean;
  features?: Record<string, {
    enabled: boolean;
    minVersion: string;
    available: boolean;
  }>;
}

interface VersionCheckResult {
  supported: boolean;
  updateRequired: boolean;
  updateRecommended: boolean;
  features: Record<string, boolean>;
  serverVersion: string;
  clientVersion: string;
}

// Get current client version from package.json or environment
const CLIENT_VERSION = (import.meta as any).env?.VITE_APP_VERSION || '0.1.0';
const API_VERSION = 'v1';

class VersionManager {
  private static instance: VersionManager;
  private versionInfo: VersionInfo | null = null;
  private checkInterval: number | null = null;

  static getInstance(): VersionManager {
    if (!VersionManager.instance) {
      VersionManager.instance = new VersionManager();
    }
    return VersionManager.instance;
  }

  async checkVersion(): Promise<VersionCheckResult> {
    try {
      const response = await fetch('/api/version', {
        headers: {
          'X-Client-Version': CLIENT_VERSION,
          'X-API-Version': API_VERSION,
        },
      });

      if (!response.ok) {
        throw new Error(`Version check failed: ${response.status}`);
      }

      this.versionInfo = await response.json();

      if (!this.versionInfo) {
        throw new Error('Invalid version info received');
      }

      return {
        supported: this.versionInfo.clientSupported ?? true,
        updateRequired: this.versionInfo.client.updateRequired,
        updateRecommended: this.versionInfo.client.updateRecommended,
        features: Object.fromEntries(
          Object.entries(this.versionInfo.features || {}).map(([key, feature]) => [
            key,
            feature.available
          ])
        ),
        serverVersion: this.versionInfo.app.version,
        clientVersion: CLIENT_VERSION,
      };
    } catch (error) {
      console.warn('Version check failed:', error);
      return {
        supported: true,
        updateRequired: false,
        updateRecommended: false,
        features: {},
        serverVersion: 'unknown',
        clientVersion: CLIENT_VERSION,
      };
    }
  }

  startPeriodicCheck(intervalMs: number = 300000): void { // 5 minutes
    this.checkInterval = window.setInterval(() => {
      this.checkVersion();
    }, intervalMs);
  }

  stopPeriodicCheck(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  getVersionInfo(): VersionInfo | null {
    return this.versionInfo;
  }

  getClientVersion(): string {
    return CLIENT_VERSION;
  }

  getApiVersion(): string {
    return API_VERSION;
  }

  // Add version headers to API requests
  getVersionHeaders(): Record<string, string> {
    return {
      'X-Client-Version': CLIENT_VERSION,
      'X-API-Version': API_VERSION,
    };
  }
}

// React hook for version management
export function useVersionCheck(): VersionCheckResult & {
  isLoading: boolean;
  error: string | null;
  versionManager: VersionManager;
} {
  const [result, setResult] = useState<VersionCheckResult>({
    supported: true,
    updateRequired: false,
    updateRecommended: false,
    features: {},
    serverVersion: 'unknown',
    clientVersion: CLIENT_VERSION,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const versionManager = VersionManager.getInstance();

  useEffect(() => {
    async function checkVersion() {
      try {
        setIsLoading(true);
        setError(null);
        const versionResult = await versionManager.checkVersion();
        setResult(versionResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Version check failed');
      } finally {
        setIsLoading(false);
      }
    }

    checkVersion();
    versionManager.startPeriodicCheck();

    return () => {
      versionManager.stopPeriodicCheck();
    };
  }, [versionManager]);

  return {
    ...result,
    isLoading,
    error,
    versionManager,
  };
}

// Hook for feature flags
export function useFeature(featureName: string): boolean {
  const { features } = useVersionCheck();
  return features[featureName] ?? false;
}

// Version comparison utility
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

export default VersionManager;