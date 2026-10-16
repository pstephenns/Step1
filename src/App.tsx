import React, { useState, useEffect } from 'react';
import { initStorage } from './services/storageService';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SafeTradeModal } from './components/common/SafeTradeModal';
import { BarterCalculatorModal } from './components/common/BarterCalculatorModal';
import { AuthModal } from './components/modals/AuthModal';

import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { CreateListingPage } from './pages/CreateListingPage';
import { OffersPage } from './pages/OffersPage';
import { MessagesPage } from './pages/MessagesPage';
import { DashboardPage } from './pages/DashboardPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { FavouritesPage } from './pages/FavouritesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  // Initialize storage with seed data if first time
  useEffect(() => {
    initStorage();
  }, []);

  // Simple client-side router
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
    return new URLSearchParams(window.location.search);
  });

  // Global modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);

  const navigate = (pathWithSearch: string) => {
    const [path, search] = pathWithSearch.split('?');
    setCurrentPath(path || '/');
    const params = new URLSearchParams(search || '');
    setSearchParams(params);
    window.history.pushState({}, '', pathWithSearch);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setSearchParams(new URLSearchParams(window.location.search));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Route dispatcher
  const renderPage = () => {
    // /listing/:id
    if (currentPath.startsWith('/listing/')) {
      const listingId = currentPath.replace('/listing/', '');
      return (
        <ListingDetailPage
          listingId={listingId}
          navigate={navigate}
          openSafetyModal={() => setShowSafetyModal(true)}
          openAuthModal={() => setShowAuthModal(true)}
        />
      );
    }

    // /user/:id
    if (currentPath.startsWith('/user/')) {
      const userId = currentPath.replace('/user/', '');
      return <UserProfilePage userId={userId} navigate={navigate} />;
    }

    switch (currentPath) {
      case '/marketplace':
        return (
          <MarketplacePage
            navigate={navigate}
            initialQuery={searchParams.get('q') || ''}
            initialCategory={searchParams.get('cat') || 'all'}
            initialRegion={searchParams.get('region') || 'all'}
            initialType={searchParams.get('type') || 'all'}
          />
        );
      case '/create-listing':
        return (
          <CreateListingPage
            navigate={navigate}
            openAuthModal={() => setShowAuthModal(true)}
          />
        );
      case '/offers':
        return (
          <OffersPage
            navigate={navigate}
            openAuthModal={() => setShowAuthModal(true)}
          />
        );
      case '/messages':
        return (
          <MessagesPage
            navigate={navigate}
            openSafetyModal={() => setShowSafetyModal(true)}
            initialConversationId={searchParams.get('conv') || undefined}
          />
        );
      case '/dashboard':
        return (
          <DashboardPage
            navigate={navigate}
            openAuthModal={() => setShowAuthModal(true)}
          />
        );
      case '/favourites':
        return (
          <FavouritesPage
            navigate={navigate}
            openAuthModal={() => setShowAuthModal(true)}
          />
        );
      case '/notifications':
        return (
          <NotificationsPage
            navigate={navigate}
            openAuthModal={() => setShowAuthModal(true)}
          />
        );
      case '/admin':
        return (
          <AdminPage
            navigate={navigate}
            openAuthModal={() => setShowAuthModal(true)}
          />
        );
      case '/':
      default:
        return (
          <HomePage
            navigate={navigate}
            openSafetyModal={() => setShowSafetyModal(true)}
            openAuthModal={() => setShowAuthModal(true)}
            openCalculatorModal={() => setShowCalculatorModal(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        openAuthModal={() => setShowAuthModal(true)}
        openSafetyModal={() => setShowSafetyModal(true)}
        openCalculatorModal={() => setShowCalculatorModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Global Footer */}
      <Footer
        navigate={navigate}
        openSafetyModal={() => setShowSafetyModal(true)}
      />

      {/* Global Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {}}
      />

      <SafeTradeModal
        isOpen={showSafetyModal}
        onClose={() => setShowSafetyModal(false)}
      />

      <BarterCalculatorModal
        isOpen={showCalculatorModal}
        onClose={() => setShowCalculatorModal(false)}
      />
    </div>
  );
}
