import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { CityGovAuth } from './components/city-gov/CityGovAuth';
import { CityGovDashboard } from './components/city-gov/CityGovDashboard';
import { Dashboard } from './components/dashboard/Dashboard';
import { PostsPage } from './components/posts/PostsPage';
import { CreatePostPage } from './components/posts/CreatePostPage';
import { PostDetailPage } from './components/posts/PostDetailPage';
import { NotificationsPage } from './components/notifications/NotificationsPage';
import { LeadersPage } from './components/leaders/LeadersPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { UserProfilePage } from './components/profile/UserProfilePage';
import { SearchPage } from './components/search/SearchPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Toaster } from './components/ui/sonner';
import type { User } from './types';

/**
 * CiviLink Main Application Component
 * 
 * This is the root component that handles:
 * - User authentication state
 * - City government authentication
 * - Routing between different pages
 * - Session persistence
 * 
 * GitHub Copilot: When adding backend integration:
 * 1. Replace localStorage auth with JWT tokens from /services/auth.service.ts
 * 2. Add token refresh logic
 * 3. Implement proper session management
 */
export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCityGov, setIsCityGov] = useState(false);
  const [cityName, setCityName] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [showCityGovAuth, setShowCityGovAuth] = useState(false);

  /**
   * Initialize app - Check for existing session
   * TODO: Replace localStorage checks with proper JWT validation
   */
  useEffect(() => {
    // Check localStorage for auth
    const user = localStorage.getItem('currentUser');
    const cityGov = localStorage.getItem('cityGov');
    const savedCityName = localStorage.getItem('cityName');
    
    if (user) {
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
      setShowLanding(false);
    } else if (cityGov && savedCityName) {
      setIsCityGov(true);
      setCityName(savedCityName);
      setShowLanding(false);
    }
    setIsLoading(false);
  }, []);

  /**
   * Handle user login
   * TODO: Update to use authService.login() from /services/auth.service.ts
   */
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setShowLanding(false);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  /**
   * Handle city government login
   * TODO: Update to use proper city gov authentication
   */
  const handleCityGovLogin = (city: string) => {
    setIsCityGov(true);
    setCityName(city);
    setShowLanding(false);
    setShowCityGovAuth(false);
    localStorage.setItem('cityGov', 'true');
    localStorage.setItem('cityName', city);
  };

  /**
   * Handle logout
   * TODO: Update to use authService.logout() to properly clear JWT tokens
   */
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsCityGov(false);
    setCityName('');
    setShowLanding(true);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cityGov');
    localStorage.removeItem('cityName');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page
  if (showLanding && !isAuthenticated && !isCityGov) {
    return (
      <>
        <LandingPage
          onCitizenAuth={() => setShowLanding(false)}
          onCityGovAuth={() => {
            setShowLanding(false);
            setShowCityGovAuth(true);
          }}
        />
        <Toaster />
      </>
    );
  }

  // Show city gov auth
  if (showCityGovAuth) {
    return (
      <>
        <CityGovAuth
          onBack={() => {
            setShowCityGovAuth(false);
            setShowLanding(true);
          }}
          onSuccess={handleCityGovLogin}
        />
        <Toaster />
      </>
    );
  }

  // Show city government dashboard
  if (isCityGov && cityName) {
    return (
      <>
        <CityGovDashboard cityName={cityName} onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <Navigate to={currentUser?.role === 'admin' ? '/admin' : '/dashboard'} replace />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            } 
          />
          <Route 
            path="/auth/login" 
            element={
              isAuthenticated ? (
                <Navigate to={currentUser?.role === 'admin' ? '/admin' : '/dashboard'} replace />
              ) : (
                <AuthPage 
                  onLogin={handleLogin}
                  onBack={() => setShowLanding(true)}
                />
              )
            } 
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Dashboard currentUser={currentUser} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />
          <Route
            path="/posts"
            element={
              isAuthenticated ? (
                <PostsPage currentUser={currentUser} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />
          <Route
            path="/posts/create"
            element={
              isAuthenticated ? (
                <CreatePostPage currentUser={currentUser} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />
          <Route
            path="/posts/:postId"
            element={
              isAuthenticated ? (
                <PostDetailPage currentUser={currentUser} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />
          <Route
            path="/notifications"
            element={
              isAuthenticated ? (
                <NotificationsPage currentUser={currentUser} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />
          <Route
            path="/leaders"
            element={
              isAuthenticated ? (
                <LeadersPage currentUser={currentUser} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <ProfilePage currentUser={currentUser} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />
          <Route
            path="/users/:userId"
            element={
              isAuthenticated ? (
                <UserProfilePage currentUser={currentUser} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />
          <Route
            path="/search"
            element={
              isAuthenticated ? (
                <SearchPage currentUser={currentUser} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />
          <Route
            path="/admin"
            element={
              isAuthenticated && currentUser?.role === 'admin' ? (
                <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}