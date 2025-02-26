import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { ThemeProvider } from './theme-provider';

/**
 * MainLayout component
 * Provides consistent layout structure for all pages with responsive design
 */
interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="nba-ui-theme">
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-background">
          <div className="container py-6 md:py-8">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default MainLayout;
