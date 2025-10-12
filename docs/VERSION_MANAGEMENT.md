# ParentFlow Version Support Documentation

## Overview

ParentFlow now includes comprehensive version management to ensure compatibility between client and server components, enable feature flags, and provide smooth update experiences.

## Features

### ✅ **API Versioning**

- **Current API Version**: v1
- **Version Headers**: Automatic inclusion in all API requests
- **Backward Compatibility**: Support for multiple API versions
- **Deprecation Management**: Graceful handling of deprecated endpoints

### ✅ **Client-Server Compatibility**

- **Automatic Version Checking**: Client compatibility validation on every request
- **Update Notifications**: In-app banners for required/recommended updates
- **Graceful Degradation**: Fallback behavior for unsupported clients

### ✅ **Feature Flags**

- **Version-Based Features**: Enable/disable features based on client version
- **Runtime Feature Detection**: Dynamic feature availability checking
- **Progressive Enhancement**: New features available to newer clients

### ✅ **Version Display**

- **Footer Information**: Version details in app footer
- **Status Indicator**: Real-time compatibility status
- **Debug Support**: Developer-friendly version information

## API Endpoints

### Version Information

```http
GET /version
```

Returns basic version information.

```http
GET /api/version
```

Returns detailed version information with feature flags.

### Health Check (Enhanced)

```http
GET /health
```

Includes version information in health status.

## Client Integration

### Version Headers

All API requests automatically include:

```http
X-Client-Version: 0.1.0
X-API-Version: v1
```

### React Hooks

#### `useVersionCheck()`

```tsx
import { useVersionCheck } from './versionManager';

function MyComponent() {
  const { 
    supported, 
    updateRequired, 
    updateRecommended, 
    features, 
    serverVersion, 
    clientVersion 
  } = useVersionCheck();
  
  if (updateRequired) {
    return <UpdateRequiredMessage />;
  }
  
  return <NormalApp />;
}
```

#### `useFeature()`

```tsx
import { useFeature } from './versionManager';

function AdvancedAnalytics() {
  const hasAdvancedAnalytics = useFeature('advancedAnalytics');
  
  if (!hasAdvancedAnalytics) {
    return <BasicAnalytics />;
  }
  
  return <AdvancedAnalyticsView />;
}
```

### Components

#### `VersionDisplay`

```tsx
import VersionDisplay from './VersionDisplay';

// Show update banners
<VersionDisplay showUpdateBanner={true} />

// Show in footer
<VersionDisplay showInFooter={true} compact={false} />
```

#### `FeatureFlag`

```tsx
import { FeatureFlag } from './VersionDisplay';

<FeatureFlag 
  feature="advancedAnalytics" 
  fallback={<BasicView />}
>
  <AdvancedView />
</FeatureFlag>
```

#### `VersionStatusIndicator`

```tsx
import { VersionStatusIndicator } from './VersionDisplay';

// Shows a small status indicator (for debugging)
<VersionStatusIndicator />
```

## Feature Flags Configuration

Current feature flags in `server/version.ts`:

### Hebrew NLP (`hebrewNLP`)

- **Status**: ✅ Enabled
- **Minimum Version**: 0.1.0
- **Description**: Hebrew text processing capabilities

### Real-time Updates (`realTimeUpdates`)

- **Status**: ❌ Disabled
- **Minimum Version**: 0.2.0
- **Description**: WebSocket-based live updates

### Advanced Analytics (`advancedAnalytics`)

- **Status**: ❌ Disabled
- **Minimum Version**: 0.3.0
- **Description**: Enhanced analytics and time-saving metrics

### Multi-language Support (`multiLanguage`)

- **Status**: ❌ Disabled
- **Minimum Version**: 0.4.0
- **Description**: Support for multiple languages

## Version Management Scripts

### Version Check Tool

```bash
npm run version:check
```

Provides comprehensive version information:

- Server health and version
- Client-server compatibility
- Feature flag status
- Package versions
- Deprecation warnings

### Development Commands

```bash
# Start with version info
npm run dev

# Check version compatibility
npm run version:check

# Build with version
npm run build
```

## Update Workflows

### Critical Updates (Required)

1. **Server Detection**: API middleware checks client version
2. **Client Response**: Returns 426 Upgrade Required
3. **User Notification**: Red banner with mandatory update message
4. **Action Required**: User must refresh/update to continue

### Recommended Updates

1. **Periodic Checking**: Client checks for updates every 5 minutes
2. **User Notification**: Yellow banner with update recommendation
3. **User Choice**: Can update now or dismiss notification

### Feature Rollouts

1. **Server Configuration**: Enable feature in `VERSION_CONFIG`
2. **Client Detection**: `useFeature()` hook checks availability
3. **Conditional Rendering**: Show new features only to supported clients
4. **Graceful Fallback**: Older clients see basic functionality

## Configuration

### Environment Variables

```env
VITE_APP_VERSION=0.1.0          # Client version
NODE_ENV=development            # Environment
BUILD_NUMBER=dev                # Build identifier
```

### Version Config (`server/version.ts`)

```typescript
export const VERSION_CONFIG = {
  app: {
    version: '0.1.0',
    buildNumber: process.env.BUILD_NUMBER || 'dev',
    environment: process.env.NODE_ENV || 'development',
  },
  api: {
    current: 'v1',
    supported: ['v1'],
    minimum: 'v1',
  },
  client: {
    minimumVersion: '0.1.0',
    updateRequired: false,
    updateRecommended: false,
  },
  features: {
    // Feature definitions...
  }
};
```

## Best Practices

### For Developers

1. **Always Test Compatibility**: Use version check script before releases
2. **Feature Flag New Features**: Wrap new functionality in feature flags
3. **Graceful Degradation**: Provide fallbacks for older clients
4. **Clear Version Communication**: Update version numbers consistently

### For Deployment

1. **Coordinated Updates**: Deploy server before client updates
2. **Rollback Readiness**: Keep previous versions available
3. **Monitor Compatibility**: Watch for version-related errors
4. **User Communication**: Provide clear update instructions

### For Users

1. **Regular Updates**: Keep app updated for best experience
2. **Critical Updates**: Install required updates immediately
3. **Feature Access**: Newer versions have more features
4. **Compatibility**: Older versions may have limited functionality

## Troubleshooting

### Common Issues

#### Version Check Fails

```bash
❌ Version check failed: Server not running
💡 Make sure the API server is running: npm run dev:api
```

#### Client Not Supported

```text
❌ Client version not supported
Minimum Version: 0.1.0
Current Version: 0.0.9
Update Required: true
```

#### Feature Not Available

```tsx
// Feature will be false if version requirement not met
const hasFeature = useFeature('advancedAnalytics'); // false for v0.1.0
```

### Debug Information

The app includes several debugging tools:

1. **Version Status Indicator**: Small icon in top-right corner
2. **Console Logging**: Version info in browser console
3. **Footer Display**: Detailed version information
4. **Version Check Script**: Comprehensive system analysis

## Version History

### v0.1.0 (Current)

- Initial POC implementation
- Basic Hebrew NLP processing
- SQLite database integration
- React RTL interface
- Version management system

### Future Versions

#### v0.2.0 (Planned)

- Real-time updates via WebSocket
- Enhanced error handling
- Performance optimizations

#### v0.3.0 (Planned)

- Advanced analytics dashboard
- Time-saving metrics
- Export capabilities

#### v0.4.0 (Planned)

- Multi-language support
- English interface option
- Localization framework

## Support

For version-related issues:

1. **Run Version Check**: `npm run version:check`
2. **Check Console**: Look for version warnings in browser console
3. **Update Client**: Refresh browser or update app
4. **Check Server**: Ensure API server is running latest version
5. **Clear Cache**: Clear browser cache if needed

The version management system ensures ParentFlow can evolve while maintaining compatibility and providing the best user experience.
