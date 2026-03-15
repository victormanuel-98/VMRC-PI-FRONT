import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const UiPreferencesContext = createContext();

const translations = {
  en: {
    'header.searchPlaceholder': 'Search recipes...',
    'header.profile': 'My profile',
    'header.logout': 'Sign out',
    'header.settings': 'Quick settings',
    'header.darkMode': 'Dark mode',
    'header.english': 'English',
    'header.settingsPage': 'Open settings',
    'nav.home': 'Home',
    'nav.myRecipes': 'My recipes',
    'nav.recipesPersonal': 'Personal recipes',
    'nav.createRecipe': 'Create recipe',
    'nav.collections': 'Collections',
    'nav.weekPlan': 'Weekly plan',
    'nav.plates': 'Plates',
    'nav.explore': 'Explore plates',
    'nav.breakfast': 'Breakfast',
    'nav.lunch': 'Lunch',
    'nav.dinner': 'Dinner',
    'nav.other': 'Other',
    'nav.contact': 'Contact',
    'nav.settings': 'Settings',
    'nav.profile': 'My profile',
    'settings.title': 'General settings',
    'settings.subtitle': 'Control language, appearance, and interaction preferences.',
    'settings.language': 'Language',
    'settings.spanish': 'Spanish',
    'settings.english': 'English',
    'settings.appearance': 'Appearance',
    'settings.light': 'Light mode',
    'settings.dark': 'Dark mode',
    'settings.comments': 'Comments visibility',
    'settings.public': 'Public',
    'settings.private': 'Private',
    'settings.devices': 'Devices',
    'settings.connectMobile': 'Connect with your mobile account?',
    'settings.yes': 'Yes',
    'settings.no': 'No',
    'settings.save': 'Save changes',
    'settings.saved': 'Changes saved successfully',
    'home.hero.title': 'Welcome to FitFood',
    'home.hero.subtitle': 'Your daily ally for healthier eating.',
    'home.hero.body1': 'FitFood helps you keep track of your meals in a simple and clear way.',
    'home.hero.body2': 'Track dishes, estimate calories automatically, and follow your progress in real time.',
    'home.hero.body3': 'Create personalized plans and share healthy recipes with the community.'
  }
};

const defaultSettings = {
  language: 'es',
  theme: 'light'
};

export const UiPreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem('uiPreferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreferences((prev) => ({ ...prev, ...parsed }));
      } catch {
        setPreferences(defaultSettings);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('uiPreferences', JSON.stringify(preferences));

    if (preferences.theme === 'dark') {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
    }

    document.documentElement.setAttribute('lang', preferences.language === 'en' ? 'en' : 'es');
  }, [preferences]);

  const setTheme = (theme) => {
    setPreferences((prev) => ({ ...prev, theme }));
  };

  const toggleTheme = () => {
    setPreferences((prev) => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  };

  const setLanguage = (language) => {
    setPreferences((prev) => ({ ...prev, language }));
  };

  const toggleLanguage = () => {
    setPreferences((prev) => ({ ...prev, language: prev.language === 'es' ? 'en' : 'es' }));
  };

  const t = (key, fallback = '') => {
    if (preferences.language !== 'en') {
      return fallback || key;
    }
    return translations.en[key] || fallback || key;
  };

  const value = useMemo(
    () => ({
      preferences,
      setTheme,
      toggleTheme,
      setLanguage,
      toggleLanguage,
      t
    }),
    [preferences]
  );

  return <UiPreferencesContext.Provider value={value}>{children}</UiPreferencesContext.Provider>;
};

export const useUiPreferences = () => {
  const context = useContext(UiPreferencesContext);
  if (!context) {
    throw new Error('useUiPreferences debe usarse dentro de UiPreferencesProvider');
  }
  return context;
};
