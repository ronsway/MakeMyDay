/**
 * Version Display Component for ParentFlow
 * Shows version information and update notifications
 */

import React from 'react';
import { useVersionCheck } from './versionManager';

interface VersionDisplayProps {
  showInFooter?: boolean;
  showUpdateBanner?: boolean;
  compact?: boolean;
}

export function VersionDisplay({ 
  showInFooter = false, 
  showUpdateBanner = true, 
  compact = false 
}: VersionDisplayProps) {
  const { 
    supported, 
    updateRequired, 
    updateRecommended, 
    serverVersion, 
    clientVersion, 
    isLoading, 
    error 
  } = useVersionCheck();

  // Update banner for critical updates
  if (showUpdateBanner && updateRequired) {
    return (
      <div className="version-update-banner critical">
        <div className="update-content">
          <h3>עדכון נדרש</h3>
          <p>גרסה זו לא נתמכת יותר. אנא עדכן את האפליקציה לגרסה {serverVersion}</p>
          <div className="version-info">
            <span>גרסה נוכחית: {clientVersion}</span>
            <span>גרסה נדרשת: {serverVersion}</span>
          </div>
          <button 
            className="update-button critical"
            onClick={() => window.location.reload()}
          >
            רענן עמוד
          </button>
        </div>
      </div>
    );
  }

  // Update recommendation banner
  if (showUpdateBanner && updateRecommended) {
    return (
      <div className="version-update-banner recommended">
        <div className="update-content">
          <h4>עדכון מומלץ</h4>
          <p>גרסה חדשה זמינה: {serverVersion}</p>
          <button 
            className="update-button recommended"
            onClick={() => window.location.reload()}
          >
            עדכן עכשיו
          </button>
          <button 
            className="update-button dismiss"
            onClick={() => {/* Hide banner logic */}}
          >
            התעלם
          </button>
        </div>
      </div>
    );
  }

  // Footer version display
  if (showInFooter) {
    if (isLoading) {
      return (
        <div className="version-footer loading">
          <span>טוען מידע גרסה...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="version-footer error">
          <span>גרסה: {clientVersion} (לא ניתן לבדוק שרת)</span>
        </div>
      );
    }

    return (
      <div className="version-footer">
        <div className="version-info">
          {compact ? (
            <span>ParentFlow v{clientVersion}</span>
          ) : (
            <>
              <span>ParentFlow גרסה {clientVersion}</span>
              <span>שרת: {serverVersion}</span>
              <span className={`status ${supported ? 'supported' : 'unsupported'}`}>
                {supported ? '✓ נתמך' : '⚠️ לא נתמך'}
              </span>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}

// Version status indicator for debugging/admin
export function VersionStatusIndicator() {
  const { 
    supported, 
    features, 
    serverVersion, 
    clientVersion, 
    isLoading, 
    error 
  } = useVersionCheck();

  if (isLoading) {
    return <div className="version-status loading">🔄</div>;
  }

  if (error) {
    return <div className="version-status error" title={error}>⚠️</div>;
  }

  if (!supported) {
    return <div className="version-status unsupported" title="גרסה לא נתמכת">❌</div>;
  }

  return (
    <div className="version-status supported" title={`Client: ${clientVersion} | Server: ${serverVersion}`}>
      ✅
    </div>
  );
}

// Feature flag wrapper component
export function FeatureFlag({ 
  feature, 
  children, 
  fallback = null 
}: { 
  feature: string; 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  const { features } = useVersionCheck();
  
  if (features[feature]) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}

// CSS styles (to be included in your main CSS file)
export const versionStyles = `
.version-update-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 15px;
  text-align: center;
  direction: rtl;
}

.version-update-banner.critical {
  background: #dc3545;
  color: white;
}

.version-update-banner.recommended {
  background: #ffc107;
  color: #212529;
}

.update-content h3, .update-content h4 {
  margin: 0 0 10px 0;
  font-weight: bold;
}

.update-content p {
  margin: 0 0 15px 0;
}

.version-info {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 10px 0;
  font-size: 0.9em;
  opacity: 0.9;
}

.update-button {
  margin: 0 5px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.update-button.critical {
  background: white;
  color: #dc3545;
}

.update-button.recommended {
  background: #007bff;
  color: white;
}

.update-button.dismiss {
  background: transparent;
  color: inherit;
  border: 1px solid currentColor;
}

.version-footer {
  padding: 10px;
  text-align: center;
  font-size: 0.8em;
  color: #6c757d;
  border-top: 1px solid #e9ecef;
}

.version-footer.loading, .version-footer.error {
  font-style: italic;
}

.version-info {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.status.supported {
  color: #28a745;
}

.status.unsupported {
  color: #dc3545;
}

.version-status {
  position: fixed;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: help;
  z-index: 999;
}

@media (max-width: 768px) {
  .version-info {
    flex-direction: column;
    gap: 5px;
  }
  
  .version-update-banner {
    padding: 10px;
  }
  
  .update-content h3, .update-content h4 {
    font-size: 1.1em;
  }
}
`;

export default VersionDisplay;