'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useTranslation();

  return (
    <aside
      className={`bg-gray-100 dark:bg-gray-900 h-screen sticky top-0 p-6 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        {!isCollapsed && (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('sidebar.menu')}
          </h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
        >
          <svg
            className="w-6 h-6 text-gray-600 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isCollapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            )}
          </svg>
        </button>
      </div>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link
              href="/"
              className="flex items-center p-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <svg className="w-6 h-6 mr-3 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {!isCollapsed && <span className="text-gray-900 dark:text-white">{t('sidebar.dashboard')}</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/weather"
              className="flex items-center p-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <svg className="w-6 h-6 mr-3 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9m-9-4a9 9 0 019-9m-6 9h6" />
              </svg>
              {!isCollapsed && <span className="text-gray-900 dark:text-white">{t('sidebar.weather')}</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/news"
              className="flex items-center p-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <svg className="w-6 h-6 mr-3 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-1" />
              </svg>
              {!isCollapsed && <span className="text-gray-900 dark:text-white">{t('sidebar.news')}</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/finance"
              className="flex items-center p-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <svg className="w-6 h-6 mr-3 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {!isCollapsed && <span className="text-gray-900 dark:text-white">{t('sidebar.finance')}</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/github"
              className="flex items-center p-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <svg className="w-6 h-6 mr-3 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 18l6-6m0 0l-6-6m6 6H8m-2 6l-6-6m0 0l6-6m-6 6h8" />
              </svg>
              {!isCollapsed && <span className="text-gray-900 dark:text-white">{t('sidebar.github')}</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}