'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react'; 
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || '');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();

 
  useEffect(() => {
    setName(session?.user?.name || '');
    setEmail(session?.user?.email || '');
  }, [session]);

  const handleSave = () => {
    console.log('Saving profile:', { name, email });
    if (session) {
      session.user.name = name; 
      session.user.email = email;
    }
    setIsEditing(false);
  };

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center">{t('home.sign_in_prompt')}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          {t('profile.settings')}
        </h1>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-6">
            {session.user?.image ? (
              <img src={session.user.image} alt="User Avatar" className="w-16 h-16 rounded-full mr-4" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-2xl mr-4">
                {session.user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{name}</h2> {/* Use name state */}
              <p className="text-gray-600 dark:text-gray-400">{email}</p> {/* Use email state */}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-1">{t('profile.name')}</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-1">{t('profile.email')}</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            <div className="flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                  >
                    {t('profile.cancel')}
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {t('profile.save')}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {t('profile.edit')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}