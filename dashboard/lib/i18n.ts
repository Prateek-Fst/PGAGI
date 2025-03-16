import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const enTranslations = {
  header: {
    dashboard: 'Dashboard',
    search_placeholder: 'Search dashboard...',
  },
  profile: {
    settings: 'Profile Settings',
    notifications: 'Notifications',
    logout: 'Logout',
    no_notifications: 'No new notifications',
    name: 'Name',
    email: 'Email',
    edit: 'Edit Profile',
    save: 'Save',
    cancel: 'Cancel',
  },
  sidebar: {
    menu: 'Menu',
    dashboard: 'Dashboard',
    weather: 'Weather',
    news: 'News',
    finance: 'Finance',
    github: 'GitHub',
  },
  home: {
    sign_in_prompt: 'Please sign in to access the dashboard',
    sign_in_github: 'Sign in with GitHub',
    sign_in_google: 'Sign in with Google',
    welcome: 'Your Dashboard, {{name}}',
    no_widgets: 'No widgets match your search',
  },
};

// Spanish translations
const esTranslations = {
  header: {
    dashboard: 'Tablero',
    search_placeholder: 'Buscar en el tablero...',
  },
  profile: {
    settings: 'Configuración del perfil',
    notifications: 'Notificaciones',
    logout: 'Cerrar sesión',
    no_notifications: 'No hay nuevas notificaciones',
    name: 'Nombre',
    email: 'Correo electrónico',
    edit: 'Editar perfil',
    save: 'Guardar',
    cancel: 'Cancelar',
  },
  sidebar: {
    menu: 'Menú',
    dashboard: 'Tablero',
    weather: 'Clima',
    news: 'Noticias',
    finance: 'Finanzas',
    github: 'GitHub',
  },
  home: {
    sign_in_prompt: 'Por favor, inicia sesión para acceder al tablero',
    sign_in_github: 'Iniciar sesión con GitHub',
    sign_in_google: 'Iniciar sesión con Google',
    welcome: 'Tu Tablero, {{name}}',
    no_widgets: 'No hay widgets que coincidan con tu búsqueda',
  },
};

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations },
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;