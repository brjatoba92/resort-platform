import React, { createContext, useContext } from 'react';
import { useLanguage as useLanguageHook } from '../hooks';

interface LanguageContextData {
  language: 'pt-BR' | 'en-US' | 'es-ES';
  setLanguage: (language: 'pt-BR' | 'en-US' | 'es-ES') => void;
  translate: (key: string, params?: Record<string, string>) => string;
  addTranslations: (translations: Record<string, Record<string, string>>) => void;
  formatDate: (date: Date | string | number) => string;
  formatNumber: (number: number) => string;
  formatCurrency: (amount: number) => string;
  supportedLanguages: ('pt-BR' | 'en-US' | 'es-ES')[];
}

interface LanguageProviderProps {
  children: React.ReactNode;
}

const LanguageContext = createContext<LanguageContextData>({} as LanguageContextData);

export function LanguageProvider({ children }: LanguageProviderProps) {
  const {
    language,
    setLanguage,
    translate,
    addTranslations,
    formatDate,
    formatNumber,
    formatCurrency,
    supportedLanguages,
  } = useLanguageHook();

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translate,
        addTranslations,
        formatDate,
        formatNumber,
        formatCurrency,
        supportedLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextData {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
}