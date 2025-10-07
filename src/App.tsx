import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { CheckTextPage } from './components/CheckTextPage';
import { NewsFeedPage } from './components/NewsFeedPage';
import { DashboardPage } from './components/DashboardPage';
import { AdminPage } from './components/AdminPage';
import { AuthPage } from './components/AuthPage';
import { TranslationProvider } from './hooks/useTranslation';
import { ThemeProvider } from './hooks/useTheme';
import { AuthProvider } from './hooks/useAuth';
import { Toaster } from './components/ui/sonner';

type Page = 'home' | 'check' | 'feed' | 'dashboard' | 'admin' | 'login' | 'signup';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'check':
        return <CheckTextPage />;
      case 'feed':
        return <NewsFeedPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'admin':
        return <AdminPage />;
      case 'login':
        return <AuthPage mode="login" onNavigate={setCurrentPage} />;
      case 'signup':
        return <AuthPage mode="signup" onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider>
      <TranslationProvider>
        <AuthProvider>
          <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
            <Header currentPage={currentPage} onNavigate={setCurrentPage} />
            <main>{renderPage()}</main>
            <Toaster />
          </div>
        </AuthProvider>
      </TranslationProvider>
    </ThemeProvider>
  );
}