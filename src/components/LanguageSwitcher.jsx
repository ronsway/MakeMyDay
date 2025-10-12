import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Update document direction for RTL support
    document.documentElement.dir = lng === 'he' ? 'rtl' : 'ltr';
    // Update document language
    document.documentElement.lang = lng;
    
    // Store language preference
    localStorage.setItem('preferred-language', lng);
    
    // Announce language change for screen readers
    const announcement = lng === 'he' ? 'שפה השתנתה לעברית' : 'Language changed to English';
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.position = 'absolute';
    announcer.style.left = '-10000px';
    announcer.textContent = announcement;
    document.body.appendChild(announcer);
    setTimeout(() => document.body.removeChild(announcer), 1000);
  };

  const handleKeyDown = (event, lng) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      changeLanguage(lng);
    }
  };

  return (
    <div className="language-switcher" role="group" aria-label={t('language.switch')}>
      <button
        className={`language-button ${i18n.language === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
        onKeyDown={(e) => handleKeyDown(e, 'en')}
        aria-label={`${t('accessibility.language_switcher')} - ${t('language.english')}`}
        aria-pressed={i18n.language === 'en'}
        title={t('language.english')}
      >
        <span className="language-flag">🇺🇸</span>
        <span className="language-text">{t('language.english')}</span>
      </button>
      <button
        className={`language-button ${i18n.language === 'he' ? 'active' : ''}`}
        onClick={() => changeLanguage('he')}
        onKeyDown={(e) => handleKeyDown(e, 'he')}
        aria-label={`${t('accessibility.language_switcher')} - ${t('language.hebrew')}`}
        aria-pressed={i18n.language === 'he'}
        title={t('language.hebrew')}
      >
        <span className="language-flag">🇮🇱</span>
        <span className="language-text">{t('language.hebrew')}</span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;