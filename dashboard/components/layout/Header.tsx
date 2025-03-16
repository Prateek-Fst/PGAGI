'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaSearch, FaBell } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import ProfileSection from './ProfileSection';
import { useSearch } from '@/lib/SearchContext';

export default function Header() {
  const { data: session } = useSession();
  const { searchQuery, setSearchQuery } = useSearch();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t, i18n } = useTranslation(); 

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="bg-white dark:bg-gray-800 p-4 shadow flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        {t('header.dashboard')}
      </h1>

      <form onSubmit={handleSearch} className="flex items-center w-1/3">
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('header.search_placeholder')}
            className="w-full px-4 py-2 pl-10 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </form>

      <div className="flex items-center space-x-4">
        <FaBell className="text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-500" />
        <button
          aria-label="Toggle Dark Mode"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {isDarkMode ? (
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        <select
          value={i18n.language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
        {session && (
          <div className="relative">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt="User Avatar"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold cursor-pointer"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                {session.user?.name?.charAt(0) || 'U'}
              </div>
            )}
            {isProfileOpen && <ProfileSection onClose={() => setIsProfileOpen(false)} />}
          </div>
        )}
      </div>
    </header>
  );
}