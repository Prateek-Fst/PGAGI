'use client';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { FaUser, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { RootState } from '@/store';
import { useTranslation } from 'react-i18next';

export default function ProfileSection({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notifications = useSelector((state: RootState) => state.notifications);
  const { t } = useTranslation();

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
    onClose();
  };

  return (
    <div className="absolute top-12 right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-50">
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => {
              router.push('/profile');
              onClose();
            }}
            className="w-full flex items-center gap-2 px-2 py-1 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <FaUser />
            {t('profile.settings')}
          </button>
        </li>
        <li className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="w-full flex items-center gap-2 px-2 py-1 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <FaBell />
            {t('profile.notifications')}
          </button>
          {isNotificationsOpen && (
            <div className="absolute top-10 left-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-50">
              {notifications.length > 0 ? (
                <ul className="space-y-2">
                  {notifications.map((notif) => (
                    <li
                      key={notif.id}
                      className="px-2 py-1 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <p>{notif.message}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{notif.time}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('profile.no_notifications')}
                </p>
              )}
            </div>
          )}
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2 py-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
          >
            <FaSignOutAlt />
            {t('profile.logout')}
          </button>
        </li>
      </ul>
    </div>
  );
}