import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hook to access and use user settings throughout the app
 */
export function useSettings() {
  const { i18n } = useTranslation();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('parentflow_settings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(parsedSettings);
        } else {
          // Default settings
          setSettings({
            general: {
              language: i18n.language,
              timezone: 'Asia/Jerusalem',
              dateFormat: 'DD/MM/YYYY',
              timeFormat: '24h',
            }
          });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
        // Fallback to defaults
        setSettings({
          general: {
            language: i18n.language,
            timezone: 'Asia/Jerusalem',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h',
          }
        });
      }
    };

    loadSettings();
  }, [i18n.language]);

  /**
   * Format a date according to user's preferred format
   */
  const formatDate = (date, options = {}) => {
    if (!date) return '';
    
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';

    const dateFormat = settings?.general?.dateFormat || 'DD/MM/YYYY';
    const locale = settings?.general?.language === 'he' ? 'he-IL' : 'en-US';

    // If custom options are provided, use them
    if (options.weekday || options.month || options.year) {
      return d.toLocaleDateString(locale, options);
    }

    // Otherwise, format according to user preference
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    switch (dateFormat) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'DD/MM/YYYY':
      default:
        return `${day}/${month}/${year}`;
    }
  };

  /**
   * Format a time according to user's preferred format
   */
  const formatTime = (date, options = {}) => {
    if (!date) return '';
    
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';

    const timeFormat = settings?.general?.timeFormat || '24h';
    const locale = settings?.general?.language === 'he' ? 'he-IL' : 'en-US';

    const hour24 = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');

    if (timeFormat === '12h') {
      const period = hour24 >= 12 ? 'PM' : 'AM';
      const hour12 = hour24 % 12 || 12;
      return `${hour12}:${minutes} ${period}`;
    } else {
      // 24h format
      const hours = String(hour24).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  };

  /**
   * Format date and time together
   */
  const formatDateTime = (date) => {
    if (!date) return '';
    return `${formatDate(date)} ${formatTime(date)}`;
  };

  /**
   * Get the user's timezone
   */
  const getTimezone = () => {
    return settings?.general?.timezone || 'Asia/Jerusalem';
  };

  /**
   * Get the user's locale
   */
  const getLocale = () => {
    return settings?.general?.language === 'he' ? 'he-IL' : 'en-US';
  };

  return {
    settings,
    formatDate,
    formatTime,
    formatDateTime,
    getTimezone,
    getLocale,
  };
}
