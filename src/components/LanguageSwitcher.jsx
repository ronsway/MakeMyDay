import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'he', name: 'עברית', flag: '🇮🇱' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    
    // Only update body direction, not document root
    document.body.dir = lng === 'he' ? 'rtl' : 'ltr';
    // Update body language
    document.body.lang = lng;
    
    // Store language preference
    localStorage.setItem('preferred-language', lng);
    
    setIsOpen(false);
    
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    } else if (event.key === 'ArrowDown' || event.key === 'Enter') {
      event.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="flex items-center gap-3 px-4 py-2.5 bg-white border border-silver-300 rounded-lg hover:border-teal-500 transition-all shadow-sm min-w-[160px] focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        aria-label={t('accessibility.language_switcher')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="flex-1 text-left font-medium text-navy-700">
          {currentLanguage.name}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-silver-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-silver-300 rounded-lg shadow-lg z-50">
          <div role="listbox" aria-label={t('language.switch')}>
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-teal-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  i18n.language === language.code 
                    ? 'bg-teal-50 text-teal-700' 
                    : 'text-navy-600'
                }`}
                role="option"
                aria-selected={i18n.language === language.code}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
                {i18n.language === language.code && (
                  <span className="ml-auto text-teal-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;