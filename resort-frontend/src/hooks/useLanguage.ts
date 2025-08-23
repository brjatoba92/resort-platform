import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

type Language = 'pt-BR' | 'en-US' | 'es-ES';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const defaultTranslations: Translations = {
  'pt-BR': {
    welcome: 'Bem-vindo ao Resort',
    login: 'Entrar',
    logout: 'Sair',
    settings: 'Configurações',
    profile: 'Perfil',
    reservations: 'Reservas',
    rooms: 'Quartos',
    services: 'Serviços',
    contact: 'Contato',
  },
  'en-US': {
    welcome: 'Welcome to Resort',
    login: 'Login',
    logout: 'Logout',
    settings: 'Settings',
    profile: 'Profile',
    reservations: 'Reservations',
    rooms: 'Rooms',
    services: 'Services',
    contact: 'Contact',
  },
  'es-ES': {
    welcome: 'Bienvenido al Resort',
    login: 'Iniciar Sesión',
    logout: 'Cerrar Sesión',
    settings: 'Configuración',
    profile: 'Perfil',
    reservations: 'Reservas',
    rooms: 'Habitaciones',
    services: 'Servicios',
    contact: 'Contacto',
  },
};

export function useLanguage() {
  const getBrowserLanguage = useCallback((): Language => {
    if (typeof window === 'undefined') return 'en-US';
    
    const browserLang = navigator.language;
    const supportedLanguages: Language[] = ['pt-BR', 'en-US', 'es-ES'];
    
    const matchedLang = supportedLanguages.find(lang => 
      browserLang.startsWith(lang.split('-')[0])
    );
    
    return matchedLang || 'en-US';
  }, []);

  const [language, setLanguage] = useLocalStorage<Language>(
    'language',
    getBrowserLanguage()
  );

  const [translations, setTranslations] = useLocalStorage<Translations>(
    'translations',
    defaultTranslations
  );

  const translate = useCallback((key: string, params: Record<string, string> = {}) => {
    const translation = translations[language]?.[key] || translations['en-US']?.[key] || key;
    
    return translation.replace(/\{(\w+)\}/g, (_, param) => params[param] || '');
  }, [language, translations]);

  const addTranslations = useCallback((newTranslations: Partial<Translations>) => {
    setTranslations(prevTranslations => ({
      ...prevTranslations,
      ...Object.entries(newTranslations).reduce((acc, [lang, translations]) => ({
        ...acc,
        [lang]: {
          ...prevTranslations[lang],
          ...translations,
        },
      }), {}),
    }));
  }, [setTranslations]);

  const formatDate = useCallback((date: Date | string | number) => {
    return new Date(date).toLocaleDateString(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [language]);

  const formatNumber = useCallback((number: number) => {
    return new Intl.NumberFormat(language).format(number);
  }, [language]);

  const formatCurrency = useCallback((amount: number) => {
    const currencyMap: Record<Language, string> = {
      'pt-BR': 'BRL',
      'en-US': 'USD',
      'es-ES': 'EUR',
    };

    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency: currencyMap[language],
    }).format(amount);
  }, [language]);

  return {
    language,
    setLanguage,
    translate,
    addTranslations,
    formatDate,
    formatNumber,
    formatCurrency,
    supportedLanguages: Object.keys(translations) as Language[],
  };
}