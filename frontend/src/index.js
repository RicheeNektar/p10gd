import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from './translations/de.json';
import en from './translations/en.json';
import { I18nextProvider } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ICU from 'i18next-icu';

i18n
  .use(ICU)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      order: ['querystring', 'path'],
      lookupQuerystring: 'lang',
    },
    resources: {
      de,
      en,
    },
    whitelist: ['en', 'de'],
    fallbackLng: 'en',
    // lng: 'en',
  });

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </Provider>
  </React.StrictMode>
);
