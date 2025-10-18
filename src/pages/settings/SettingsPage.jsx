import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Globe,
  Bell,
  Moon,
  Sun,
  User,
  Users,
  Shield,
  Database,
  ChevronRight,
  ArrowLeft,
  Save,
  Check,
  HelpCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import FamilyManagement from '../../components/FamilyManagement';
import EnvironmentSwitcher from '../../components/EnvironmentSwitcher';
import UserProfileEditor from '../../components/UserProfileEditor';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: {
      push: true,
      email: true,
      taskReminders: true,
      eventReminders: true,
    },
    privacy: {
      shareData: false,
      analytics: true,
    },
    general: {
      language: i18n.language,
      timezone: 'Asia/Jerusalem',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
    },
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('parentflow_settings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(prev => ({
            ...prev,
            ...parsedSettings,
            general: {
              ...prev.general,
              ...parsedSettings.general,
              language: i18n.language, // Keep current language from i18n
            }
          }));
        }
      } catch (error) {
        console.error('Failed to load settings from localStorage:', error);
      }
    };

    loadSettings();
  }, [i18n.language]);

  // Sync language setting when i18n language changes
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        language: i18n.language
      }
    }));
  }, [i18n.language]);

  const settingSections = [
    {
      id: 'general',
      title: t('settings.general', 'הגדרות כלליות'),
      icon: Settings,
      description: t('settings.generalDesc', 'שפה, אזור זמן ופורמט תצוגה'),
    },
    {
      id: 'profile',
      title: t('settings.profile', 'פרופיל אישי'),
      icon: User,
      description: t('settings.profileDesc', 'עדכן פרטים אישיים ותמונת פרופיל'),
    },
    {
      id: 'family',
      title: t('settings.family', 'ניהול משפחה'),
      icon: Users,
      description: t('settings.familyDesc', 'נהל פרופילי בני המשפחה ותמונות'),
    },
    {
      id: 'appearance',
      title: t('settings.appearance', 'מראה'),
      icon: Moon,
      description: t('settings.appearanceDesc', 'ערכת נושא וצבעים'),
    },
    {
      id: 'notifications',
      title: t('settings.notifications', 'התראות'),
      icon: Bell,
      description: t('settings.notificationsDesc', 'נהל התראות ותזכורות'),
    },
    {
      id: 'environment',
      title: t('settings.environment', 'מצב פעולה'),
      icon: Globe,
      description: t('settings.environmentDesc', 'החלף בין מצבי פיתוח, בדיקות וייצור'),
    },
    {
      id: 'privacy',
      title: t('settings.privacy', 'פרטיות'),
      icon: Shield,
      description: t('settings.privacyDesc', 'שליטה בנתונים ופרטיות'),
    },
    {
      id: 'data',
      title: t('settings.data', 'נתונים'),
      icon: Database,
      description: t('settings.dataDesc', 'גיבוי, ייבוא וייצוא נתונים'),
    },
    {
      id: 'help',
      title: t('settings.help', 'עזרה ותמיכה'),
      icon: HelpCircle,
      description: t('settings.helpDesc', 'מדריכים, שאלות נפוצות ויצירת קשר'),
    },
  ];

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (saving) return; // Prevent double-clicking
    
    setSaving(true);
    try {
      // Save settings to localStorage
      localStorage.setItem('parentflow_settings', JSON.stringify(settings));
      
      // Apply language change if it was modified
      if (settings.general.language !== i18n.language) {
        await i18n.changeLanguage(settings.general.language);
      }
      
      // Update user profile if there are changes
      if (user && updateProfile) {
        await updateProfile({
          ...user,
          settings: settings
        });
      }
      
      // Simulate save delay for user feedback
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSaved(true);
      
      // Show saved state briefly, then navigate back
      setTimeout(() => {
        setSaved(false);
        navigate(-1); // Go back to previous page
      }, 1200);
    } catch (error) {
      console.error('Failed to save settings:', error);
      // You could add error state here to show user an error message
    } finally {
      setSaving(false);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-navy-700 mb-3">
          {t('settings.language', 'שפה')}
        </label>
        <LanguageSwitcher />
      </div>

      <div>
        <label className="block text-sm font-medium text-navy-700 mb-3">
          {t('settings.timezone', 'אזור זמן')}
        </label>
        <select
          value={settings.general.timezone}
          onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
          className="w-full p-3 border border-silver-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="Asia/Jerusalem">{t('settings.timezones.jerusalem')}</option>
          <option value="Europe/London">{t('settings.timezones.london')}</option>
          <option value="America/New_York">{t('settings.timezones.newYork')}</option>
          <option value="Europe/Paris">{t('settings.timezones.paris')}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-navy-700 mb-3">
          {t('settings.dateFormat', 'פורמט תאריך')}
        </label>
        <select
          value={settings.general.dateFormat}
          onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
          className="w-full p-3 border border-silver-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="DD/MM/YYYY">{t('settings.dateFormats.dmySlash')}</option>
          <option value="MM/DD/YYYY">{t('settings.dateFormats.mdySlash')}</option>
          <option value="YYYY-MM-DD">{t('settings.dateFormats.ymdHyphen')}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-navy-700 mb-3">
          {t('settings.timeFormat', 'פורמט שעה')}
        </label>
        <select
          value={settings.general.timeFormat}
          onChange={(e) => handleSettingChange('general', 'timeFormat', e.target.value)}
          className="w-full p-3 border border-silver-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="24h">{t('settings.timeFormats.24h')}</option>
          <option value="12h">{t('settings.timeFormats.12h')}</option>
        </select>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      {Object.entries(settings.notifications).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between p-4 bg-cream-50 rounded-lg">
          <div>
            <h4 className="font-medium text-navy-700">
              {t(`settings.notifications.${key}`, key)}
            </h4>
            <p className="text-sm text-silver-600">
              {t(`settings.notifications.${key}Desc`, '')}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-silver-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-navy-700 mb-4">
          {t('settings.theme', 'ערכת נושא')}
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {['light', 'dark'].map((theme) => (
            <button
              key={theme}
              onClick={() => handleSettingChange('general', 'theme', theme)}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.theme === theme
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-silver-300 hover:border-silver-400'
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                {theme === 'light' ? (
                  <Sun className="w-8 h-8 text-orange-500" />
                ) : (
                  <Moon className="w-8 h-8 text-navy-500" />
                )}
              </div>
              <p className="text-sm font-medium">
                {t(`settings.theme.${theme}`, theme === 'light' ? 'בהיר' : 'כהה')}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      {Object.entries(settings.privacy).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between p-4 bg-cream-50 rounded-lg">
          <div>
            <h4 className="font-medium text-navy-700">
              {t(`settings.privacy.${key}`, key)}
            </h4>
            <p className="text-sm text-silver-600">
              {t(`settings.privacy.${key}Desc`, '')}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleSettingChange('privacy', key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-silver-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <button className="w-full p-4 text-left bg-cream-50 hover:bg-cream-100 rounded-lg transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-navy-700">
                {t('settings.data.backup', 'גיבוי נתונים')}
              </h4>
              <p className="text-sm text-silver-600">
                {t('settings.data.backupDesc', 'צור גיבוי של כל הנתונים שלך')}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-silver-500" />
          </div>
        </button>

        <button className="w-full p-4 text-left bg-cream-50 hover:bg-cream-100 rounded-lg transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-navy-700">
                {t('settings.data.export', 'ייצוא נתונים')}
              </h4>
              <p className="text-sm text-silver-600">
                {t('settings.data.exportDesc', 'ייצא את הנתונים שלך לקובץ')}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-silver-500" />
          </div>
        </button>

        <button className="w-full p-4 text-left bg-cream-50 hover:bg-cream-100 rounded-lg transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-navy-700">
                {t('settings.data.import', 'ייבוא נתונים')}
              </h4>
              <p className="text-sm text-silver-600">
                {t('settings.data.importDesc', 'ייבא נתונים מקובץ גיבוי')}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-silver-500" />
          </div>
        </button>
      </div>
    </div>
  );

  const renderHelpSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <button className="w-full p-4 text-left bg-cream-50 hover:bg-cream-100 rounded-lg transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-navy-700">
                {t('settings.help.guide', 'מדריך למשתמש')}
              </h4>
              <p className="text-sm text-silver-600">
                {t('settings.help.guideDesc', 'למד איך להשתמש בכל התכונות')}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-silver-500" />
          </div>
        </button>

        <button className="w-full p-4 text-left bg-cream-50 hover:bg-cream-100 rounded-lg transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-navy-700">
                {t('settings.help.faq', 'שאלות נפוצות')}
              </h4>
              <p className="text-sm text-silver-600">
                {t('settings.help.faqDesc', 'מענה לשאלות שכיחות')}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-silver-500" />
          </div>
        </button>

        <button className="w-full p-4 text-left bg-cream-50 hover:bg-cream-100 rounded-lg transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-navy-700">
                {t('settings.help.contact', 'יצירת קשר')}
              </h4>
              <p className="text-sm text-silver-600">
                {t('settings.help.contactDesc', 'קבל תמיכה טכנית')}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-silver-500" />
          </div>
        </button>

        <button className="w-full p-4 text-left bg-cream-50 hover:bg-cream-100 rounded-lg transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-navy-700">
                {t('settings.help.feedback', 'משוב ובקשות')}
              </h4>
              <p className="text-sm text-silver-600">
                {t('settings.help.feedbackDesc', 'שתף את החוויה שלך והצע שיפורים')}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-silver-500" />
          </div>
        </button>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">
            {t('settings.help.version', 'גרסת האפליקציה')}
          </h4>
          <p className="text-sm text-blue-700">
            ParentFlow v1.0.0 (Build 2025.10.17)
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {t('settings.help.lastUpdate', 'עודכן לאחרונה: 17 באוקטובר 2025')}
          </p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <UserProfileEditor />;
      case 'family':
        return <FamilyManagement />;
      case 'general':
        return renderGeneralSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'environment':
        return <EnvironmentSwitcher />;
      case 'privacy':
        return renderPrivacySettings();
      case 'data':
        return renderDataSettings();
      case 'help':
        return renderHelpSettings();
      default:
        return <UserProfileEditor />;
    }
  };

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-silver-200" dir="ltr">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-navy-600 hover:bg-silver-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-teal-500" />
                <h1 className="text-xl font-bold text-navy-600">
                  {t('settings.title', 'הגדרות')}
                </h1>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving || saved}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                saved 
                  ? 'bg-green-500 text-white' 
                  : saving 
                    ? 'bg-teal-400 text-white cursor-not-allowed' 
                    : 'bg-teal-500 text-white hover:bg-teal-600'
              }`}
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  {t('settings.saved', 'נשמר')}
                </>
              ) : saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('settings.saving', 'שומר...')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {t('settings.save', 'שמור')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-silver-200 overflow-hidden">
              <div className="p-6 border-b border-silver-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center overflow-hidden">
                    {user?.photoUrl ? (
                      <img 
                        src={user.photoUrl} 
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">{user?.avatar || <User className="w-6 h-6 text-white" />}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-navy-700">{user?.name}</h3>
                    <p className="text-sm text-silver-600">{user?.email}</p>
                  </div>
                </div>
              </div>

              <nav className="p-2">
                {settingSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-right p-4 rounded-lg transition-colors mb-1 ${
                      activeSection === section.id
                        ? 'bg-teal-50 text-teal-700 border-r-4 border-teal-500'
                        : 'text-navy-600 hover:bg-silver-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <section.icon className="w-5 h-5" />
                      <div className="flex-1 text-right">
                        <div className="font-medium">{section.title}</div>
                        <div className="text-xs text-silver-500 mt-1">
                          {section.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-silver-200 p-8"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-navy-700 mb-2">
                  {settingSections.find(s => s.id === activeSection)?.title}
                </h2>
                <p className="text-silver-600">
                  {settingSections.find(s => s.id === activeSection)?.description}
                </p>
              </div>

              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}