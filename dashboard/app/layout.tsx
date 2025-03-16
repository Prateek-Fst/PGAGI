'use client';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { SessionProvider, useSession } from 'next-auth/react';
import { I18nextProvider } from 'react-i18next';
import { store } from '@/store';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { SearchProvider } from '@/lib/SearchContext';
import i18n from '@/lib/i18n';
import '../styles/global.css';
import { useEffect } from 'react';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

  useEffect(() => {

    document.documentElement.lang = i18n.language;
  }, []);

  return (
    <html lang="en"><body><SessionProvider><Provider store={store}><DndProvider backend={HTML5Backend}><SearchProvider><I18nextProvider i18n={i18n}><LayoutContent>{children}</LayoutContent></I18nextProvider></SearchProvider></DndProvider></Provider></SessionProvider></body></html>
  );
}