'use client';
import { signIn } from 'next-auth/react';

export default function SignIn() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Welcome to Your Dashboard
        </h1>
        <div className="space-y-4">
          <button
            onClick={() => signIn('github', { callbackUrl: '/' })}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign in with GitHub
          </button>
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}