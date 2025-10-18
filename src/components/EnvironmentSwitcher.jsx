import { useState, useEffect } from 'react';
import { Settings, TestTube, Globe, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const EnvironmentSwitcher = () => {
  const { t } = useTranslation();
  const [currentMode, setCurrentMode] = useState('development');
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    // Get current mode from localStorage or default to development
    const savedMode = localStorage.getItem('app_mode') || 'development';
    setCurrentMode(savedMode);
  }, []);

  const modes = [
    {
      id: 'development',
      name: t('settings.modes.development', 'פיתוח'),
      description: t('settings.modes.developmentDesc', 'מצב פיתוח עם כלי ניפוי שגיאות'),
      icon: Settings,
      color: 'blue',
      features: [
        t('settings.modes.features.fullDebug', 'דיבוג מלא'),
        t('settings.modes.features.detailedLogs', 'לוגים מפורטים'),
        t('settings.modes.features.localDatabase', 'מסד נתונים מקומי'),
        t('settings.modes.features.autoTests', 'בדיקות אוטומטיות')
      ]
    },
    {
      id: 'test',
      name: t('settings.modes.test', 'בדיקות'),
      description: t('settings.modes.testDesc', 'מצב בדיקות עם נתונים מדומים'),
      icon: TestTube,
      color: 'orange',
      features: [
        t('settings.modes.features.mockData', 'נתונים מדומים'),
        t('settings.modes.features.separateDatabase', 'מסד נתונים נפרד'),
        t('settings.modes.features.externalServices', 'הדמיית שירותים חיצוניים'),
        t('settings.modes.features.autoTests', 'בדיקות אוטומטיות')
      ]
    },
    {
      id: 'production',
      name: t('settings.modes.production', 'ייצור'),
      description: t('settings.modes.productionDesc', 'מצב ייצור לשימוש אמיתי'),
      icon: Globe,
      color: 'green',
      features: [
        t('settings.modes.features.realData', 'נתונים אמיתיים'),
        t('settings.modes.features.enhancedSecurity', 'אבטחה מוגברת'),
        t('settings.modes.features.optimalPerformance', 'ביצועים מיטביים'),
        t('settings.modes.features.autoBackup', 'גיבוי אוטומטי')
      ]
    }
  ];

  const handleModeChange = async (newMode) => {
    if (newMode === currentMode || isChanging) return;

    setIsChanging(true);
    
    try {
      // Save mode to localStorage
      localStorage.setItem('app_mode', newMode);
      
      // Update current mode
      setCurrentMode(newMode);
      
      // Show success message
      toast.success(t('settings.modeChanged', `המצב הוחלף ל${modes.find(m => m.id === newMode)?.name}`));
      
      // Suggest page reload for full effect
      setTimeout(() => {
        if (window.confirm(t('settings.reloadRequired', 'האם ברצונך לרענן את הדף כדי להחיל את השינויים?'))) {
          window.location.reload();
        }
      }, 1000);
      
    } catch (error) {
      console.error('Failed to change mode:', error);
      toast.error(t('settings.modeChangeFailed', 'שגיאה בהחלפת מצב'));
    } finally {
      setIsChanging(false);
    }
  };

  const getCurrentModeConfig = () => {
    const mode = modes.find(m => m.id === currentMode);
    return mode || modes[0];
  };

  const config = getCurrentModeConfig();

  return (
    <div className="space-y-6">
      {/* Current Mode Display */}
      <div className={`p-4 rounded-lg border-2 ${
        config.color === 'blue' ? 'border-blue-200 bg-blue-50' :
        config.color === 'orange' ? 'border-orange-200 bg-orange-50' :
        'border-green-200 bg-green-50'
      }`}>
        <div className="flex items-center gap-3 mb-2">
          <config.icon className={`w-5 h-5 ${
            config.color === 'blue' ? 'text-blue-600' :
            config.color === 'orange' ? 'text-orange-600' :
            'text-green-600'
          }`} />
          <h3 className="font-semibold text-navy-700">
            {t('settings.currentMode', 'מצב נוכחי')}: {config.name}
          </h3>
        </div>
        <p className="text-sm text-navy-600 mb-3">{config.description}</p>
        <div className="flex flex-wrap gap-2">
          {config.features.map((feature, index) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs rounded-full ${
                config.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                config.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                'bg-green-100 text-green-700'
              }`}
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Warning for Production Mode */}
      {currentMode === 'production' && (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-800 mb-1">
                {t('settings.productionWarning', 'אזהרת מצב ייצור')}
              </h4>
              <p className="text-sm text-red-700">
                {t('settings.productionWarningText', 'אתה במצב ייצור. שינויים יושמרו לקבע ויכולים להשפיע על נתונים אמיתיים.')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode Selection */}
      <div>
        <h4 className="font-semibold text-navy-700 mb-4">
          {t('settings.selectMode', 'בחר מצב פעולה')}
        </h4>
        <div className="grid gap-4">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              disabled={isChanging || mode.id === currentMode}
              className={`p-4 text-right border-2 rounded-lg transition-all ${
                mode.id === currentMode
                  ? mode.color === 'blue' ? 'border-blue-500 bg-blue-50' :
                    mode.color === 'orange' ? 'border-orange-500 bg-orange-50' :
                    'border-green-500 bg-green-50'
                  : 'border-silver-300 hover:border-silver-400 bg-white'
              } ${isChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-4">
                <mode.icon className={`w-6 h-6 ${
                  mode.id === currentMode
                    ? mode.color === 'blue' ? 'text-blue-600' :
                      mode.color === 'orange' ? 'text-orange-600' :
                      'text-green-600'
                    : 'text-silver-500'
                }`} />
                <div className="flex-1">
                  <h5 className="font-medium text-navy-700 mb-1">{mode.name}</h5>
                  <p className="text-sm text-silver-600">{mode.description}</p>
                </div>
                {mode.id === currentMode && (
                  <div className={`w-3 h-3 rounded-full ${
                    mode.color === 'blue' ? 'bg-blue-600' :
                    mode.color === 'orange' ? 'bg-orange-600' :
                    'bg-green-600'
                  }`} />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {isChanging && (
        <div className="text-center py-4">
          <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-silver-600">{t('settings.changingMode', 'מחליף מצב...')}</p>
        </div>
      )}
    </div>
  );
};

export default EnvironmentSwitcher;