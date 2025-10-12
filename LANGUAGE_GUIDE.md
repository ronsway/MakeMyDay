# 🌐 Language Support Guide

## Overview

MakeMyDay supports both English and Hebrew with full RTL (Right-to-Left) functionality for Hebrew users.

## How to Change Languages

### Method 1: Using the Language Switcher (Recommended)

1. **Look for the language switcher** in the top-right corner of the app
2. **Click on your preferred language**:
   - 🇺🇸 **English** - for left-to-right layout
   - 🇮🇱 **עברית** - for right-to-left layout
3. **The app will instantly switch** languages and layouts

### Method 2: Keyboard Navigation

1. **Tab to the language switcher** (it's in the top-right corner)
2. **Use arrow keys** to navigate between language options
3. **Press Enter or Space** to select your preferred language

### Method 3: Browser Language Detection

- The app automatically detects your browser's language preference
- If your browser is set to Hebrew, the app will start in Hebrew
- If your browser is set to English (or any other language), the app will start in English

## Language Features

### English Mode

- **Left-to-right (LTR) layout**
- **English fonts** optimized for readability
- **Standard navigation** (left to right)
- **English date/time formats**

### Hebrew Mode (עברית)

- **Right-to-left (RTL) layout** - everything mirrors appropriately
- **Hebrew fonts** (Segoe UI, Tahoma) for better Hebrew text rendering
- **Mirrored navigation** - buttons, inputs, and layouts flip horizontally
- **Hebrew text alignment** - all text aligns to the right
- **Hebrew translations** for all interface elements

## What Gets Translated

### Complete Interface Translation

- ✅ **App title and subtitle**
- ✅ **Task management** (add, edit, delete)
- ✅ **Placeholder text** in input fields
- ✅ **Button labels** and actions
- ✅ **Status messages** (empty states, confirmations)
- ✅ **Accessibility labels** for screen readers

### Hebrew Translations Include

- **App name**: "הפוך את היום שלי" (Make My Day)
- **Task management**: "המשימות של היום" (Today's Tasks)
- **Add task**: "הוסף משימה חדשה" (Add a new task)
- **All UI elements** are fully translated

## Technical Implementation

### Automatic Features

- **Language persistence** - your choice is remembered across sessions
- **Direction switching** - `dir="rtl"` applied automatically for Hebrew
- **Font optimization** - different fonts for different languages
- **Layout mirroring** - CSS automatically adjusts for RTL

### Developer Information

- **i18next framework** for internationalization
- **React-i18next hooks** for component translations
- **Browser language detection** for initial setup
- **localStorage** for language preference persistence

## Troubleshooting

### Language Not Switching?

1. **Clear browser cache** and reload the page
2. **Check browser console** for any JavaScript errors
3. **Try incognito/private mode** to test without extensions

### Layout Issues in Hebrew?

1. **Refresh the page** after switching to Hebrew
2. **Check if CSS is loading** properly
3. **Ensure you're using a modern browser** with RTL support

### Missing Translations?

1. **Report missing translations** by creating an issue
2. **Check the language files** in `src/i18n/locales/`
3. **Fallback to English** - incomplete translations show English text

## Accessibility

### Screen Reader Support

- **ARIA labels** in both languages
- **Language announcements** when switching
- **Proper semantic markup** for RTL content

### Keyboard Navigation

- **Tab order** respects RTL layout in Hebrew mode
- **Arrow key navigation** works in both directions
- **Focus indicators** visible in both language modes

## File Structure

```text
src/
  i18n/
    ├── index.js                    # i18n configuration
    └── locales/
        ├── en.json                 # English translations
        └── he.json                 # Hebrew translations
  components/
    └── LanguageSwitcher.jsx        # Language switching component
```

## Adding New Languages

To add support for additional languages:

1. **Create translation file** in `src/i18n/locales/[language-code].json`
2. **Add language to configuration** in `src/i18n/index.js`
3. **Update LanguageSwitcher component** to include new language option
4. **Test RTL support** if the language requires it

---

**Current Languages**: English (en) 🇺🇸 | Hebrew (he) 🇮🇱

*Need help with languages? The language switcher is always available in the top-right corner!* 🌐
