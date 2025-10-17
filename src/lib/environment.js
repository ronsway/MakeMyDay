/**
 * Environment Configuration Helper
 * Manages app environment modes and settings
 */

export const APP_MODES = {
  DEVELOPMENT: 'development',
  TEST: 'test',
  PRODUCTION: 'production'
};

export class EnvironmentConfig {
  static getCurrentMode() {
    // Check localStorage first, then fallback to environment or default
    const savedMode = localStorage.getItem('app_mode');
    if (savedMode && Object.values(APP_MODES).includes(savedMode)) {
      return savedMode;
    }
    
    // Check environment variables
    if (typeof window !== 'undefined') {
      return import.meta.env.MODE || APP_MODES.DEVELOPMENT;
    }
    
    return APP_MODES.DEVELOPMENT;
  }

  static setMode(mode) {
    if (!Object.values(APP_MODES).includes(mode)) {
      throw new Error(`Invalid app mode: ${mode}`);
    }
    
    localStorage.setItem('app_mode', mode);
    
    // Also set in environment for current session
    if (typeof window !== 'undefined' && window.__APP_MODE__) {
      window.__APP_MODE__ = mode;
    }
  }

  static getConfig() {
    const mode = this.getCurrentMode();
    
    const baseConfig = {
      mode,
      isDevelopment: mode === APP_MODES.DEVELOPMENT,
      isTest: mode === APP_MODES.TEST,
      isProduction: mode === APP_MODES.PRODUCTION
    };

    // Mode-specific configurations
    switch (mode) {
      case APP_MODES.DEVELOPMENT:
        return {
          ...baseConfig,
          apiUrl: 'http://localhost:3001',
          databaseUrl: 'file:./dev.db',
          enableLogging: true,
          enableDebug: true,
          mockEmail: true,
          enableHotReload: true,
          logLevel: 'debug'
        };

      case APP_MODES.TEST:
        return {
          ...baseConfig,
          apiUrl: 'http://localhost:3001',
          databaseUrl: 'file:./test.db',
          enableLogging: true,
          enableDebug: false,
          mockEmail: true,
          enableHotReload: false,
          logLevel: 'info',
          useMockData: true,
          resetDataOnStart: true
        };

      case APP_MODES.PRODUCTION:
        return {
          ...baseConfig,
          apiUrl: process.env.REACT_APP_API_URL || 'https://api.parentflow.app',
          databaseUrl: 'file:./production.db',
          enableLogging: false,
          enableDebug: false,
          mockEmail: false,
          enableHotReload: false,
          logLevel: 'error',
          useMockData: false,
          resetDataOnStart: false,
          enableAnalytics: true,
          enableCrashReporting: true
        };

      default:
        return baseConfig;
    }
  }

  static getDatabaseUrl() {
    const config = this.getConfig();
    return config.databaseUrl;
  }

  static shouldMockEmail() {
    const config = this.getConfig();
    return config.mockEmail;
  }

  static shouldEnableLogging() {
    const config = this.getConfig();
    return config.enableLogging;
  }

  static shouldEnableDebug() {
    const config = this.getConfig();
    return config.enableDebug;
  }

  static getLogLevel() {
    const config = this.getConfig();
    return config.logLevel || 'info';
  }

  static shouldUseMockData() {
    const config = this.getConfig();
    return config.useMockData || false;
  }

  static shouldResetDataOnStart() {
    const config = this.getConfig();
    return config.resetDataOnStart || false;
  }

  // Utility methods for conditional behavior
  static ifDevelopment(callback) {
    if (this.getCurrentMode() === APP_MODES.DEVELOPMENT) {
      return callback();
    }
  }

  static ifTest(callback) {
    if (this.getCurrentMode() === APP_MODES.TEST) {
      return callback();
    }
  }

  static ifProduction(callback) {
    if (this.getCurrentMode() === APP_MODES.PRODUCTION) {
      return callback();
    }
  }

  static log(message, level = 'info') {
    if (!this.shouldEnableLogging()) return;
    
    const config = this.getConfig();
    const logLevels = { debug: 0, info: 1, warn: 2, error: 3 };
    const currentLevel = logLevels[config.logLevel] || 1;
    const messageLevel = logLevels[level] || 1;
    
    if (messageLevel >= currentLevel) {
      console[level](`[${config.mode.toUpperCase()}] ${message}`);
    }
  }

  static debug(message) {
    this.log(message, 'debug');
  }

  static info(message) {
    this.log(message, 'info');
  }

  static warn(message) {
    this.log(message, 'warn');
  }

  static error(message) {
    this.log(message, 'error');
  }
}

// Initialize mode on load
if (typeof window !== 'undefined') {
  window.__APP_MODE__ = EnvironmentConfig.getCurrentMode();
  
  // Log current configuration in development
  EnvironmentConfig.ifDevelopment(() => {
    console.log('🚀 ParentFlow Environment Configuration:', EnvironmentConfig.getConfig());
  });
}

export default EnvironmentConfig;