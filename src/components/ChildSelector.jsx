import { Users, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

export default function ChildSelector({ children, selectedId, onChange }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [familyPhoto, setFamilyPhoto] = useState(null);
  const dropdownRef = useRef(null);

  // Load family profile photo
  useEffect(() => {
    const loadFamilyProfile = () => {
      const savedProfile = localStorage.getItem('family_profile');
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          if (profile.photoUrl) {
            setFamilyPhoto(profile.photoUrl);
          }
        } catch (error) {
          console.error('Failed to load family profile:', error);
        }
      }
    };
    loadFamilyProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = selectedId === 'all' 
    ? { id: 'all', name: t('tasks.allChildren'), avatar: '👨‍👩‍👧‍👦', photoUrl: familyPhoto }
    : children.find((c) => c.id === selectedId);

  const options = [
    { id: 'all', name: t('tasks.allChildren'), avatar: '👨‍👩‍👧‍👦', photoUrl: familyPhoto },
    ...children,
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-white border-2 border-silver-300 rounded-lg hover:border-teal-500 transition-all shadow-sm min-w-[200px]"
      >
        {/* Avatar/Icon */}
        <div className="flex-shrink-0 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-lg overflow-hidden">
          {selected?.photoUrl ? (
            <img 
              src={selected.photoUrl} 
              alt={selected.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{selected?.avatar || '👤'}</span>
          )}
        </div>

        {/* Name */}
        <span className="flex-1 text-right font-medium text-navy-700">
          {selected?.name || t('tasks.selectChild')}
        </span>

        {/* Arrow */}
        <ChevronDown
          className={cn(
            'w-5 h-5 text-silver-500 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-silver-200 rounded-lg shadow-xl z-50 overflow-hidden"
          >
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-right transition-colors',
                  option.id === selectedId
                    ? 'bg-teal-50 text-teal-700'
                    : 'hover:bg-cream-100 text-navy-700'
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg overflow-hidden',
                    option.id === selectedId
                      ? 'bg-teal-500'
                      : 'bg-silver-200'
                  )}
                >
                  {option.photoUrl ? (
                    <img 
                      src={option.photoUrl} 
                      alt={option.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{option.avatar || '👤'}</span>
                  )}
                </div>

                {/* Name */}
                <span className="flex-1 font-medium">{option.name}</span>

                {/* Checkmark for selected */}
                {option.id === selectedId && (
                  <span className="text-teal-500">✓</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Child count badge */}
      {children.length > 0 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-coral-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
          {children.length}
        </div>
      )}
    </div>
  );
}
