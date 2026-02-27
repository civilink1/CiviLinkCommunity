import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { OnboardingPage } from './components/community/OnboardingPage';
import { BillingPage } from './components/community/BillingPage';
import { InvitePage } from './components/community/InvitePage';
import { JoinPage } from './components/community/JoinPage';
import { PendingApprovalPage } from './components/community/PendingApprovalPage';
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
 * CiviLink Community – Main Application Component
 *
 * Handles:
 * - Resident authentication (invite code → register → login)
 * - HOA admin onboarding (plan → billing → invite code → dashboard)
 * - Routing between all pages
 * - Session persistence via localStorage
 */
export default function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHoaAdmin, setIsHoaAdmin] = useState(false);
  const [communityName, setCommunityName] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // View state (screens rendered outside Router)
  const [view, setView] = useState<
    'landing' | 'auth' | 'join' | 'pending'
    | 'onboarding' | 'billing' | 'invite'
    | 'hoa-dashboard' | 'app'
  >('landing');
  const [selectedPlan, setSelectedPlan] = useState('standard');

  // Restore session
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    const hoaFlag = localStorage.getItem('hoaAdmin');
    const savedCommunity = localStorage.getItem('communityName');

    if (user) {
      const parsed: User = JSON.parse(user);
      setCurrentUser(parsed);
      setIsAuthenticated(true);
      if (parsed.role === 'HOA_ADMIN' || parsed.role === 'HOA_MODERATOR') {
        setIsHoaAdmin(true);
        setCommunityName(savedCommunity || parsed.city || '');
        setView('hoa-dashboard');
      } else {
        setView('app');
      }
    } else if (hoaFlag && savedCommunity) {
      setIsHoaAdmin(true);
      setCommunityName(savedCommunity);
      setView('hoa-dashboard');
    } else {
      setView('landing');
    }
    setIsLoading(false);
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(user));

    if (user.role === 'HOA_ADMIN' || user.role === 'HOA_MODERATOR') {
      setIsHoaAdmin(true);
      setCommunityName(user.city || '');
      localStorage.setItem('hoaAdmin', 'true');
      localStorage.setItem('communityName', user.city || '');
      setView('hoa-dashboard');
    } else {
      setView('app');
    }
  };

  const handleHoaOnboardingComplete = (name: string, plan: string) => {
    setCommunityName(name);
    setSelectedPlan(plan);
    setView('billing');
  };

  const handleBillingComplete = () => {
    setView('invite');
  };

  const handleInviteContinue = () => {
    setIsHoaAdmin(true);
    localStorage.setItem('hoaAdmin', 'true');
    localStorage.setItem('communityName', communityName);
    setView('hoa-dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsHoaAdmin(false);
    setCommunityName('');
    setView('landing');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('hoaAdmin');
    localStorage.removeItem('communityName');
  };

  // ── Loading ───────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-4 text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  // ── Full-screen views (outside React Router) ──────────────────────────────

  if (view === 'landing') {
    return (
      <>
        <LandingPage
          onCitizenAuth={() => setView('auth')}
          onCityGovAuth={() => setView('onboarding')}
        />
        <Toaster />
      </>
    );
  }

  if (view === 'auth') {
    return (
      <>
        <AuthPage onLogin={handleLogin} onBack={() => setView('landing')} />
        <Toaster />
      </>
    );
  }

  if (view === 'join') {
    return (
      <>
        <JoinPage
          onJoined={handleLogin}
          onBack={() => setView('landing')}
          onPendingApproval={() => setView('pending')}
        />
        <Toaster />
      </>
    );
  }

  if (view === 'pending') {
    return (
      <>
        <PendingApprovalPage onBack={() => setView('landing')} />
        <Toaster />
      </>
    );
  }

  if (view === 'onboarding') {
    return (
      <>
        <OnboardingPage
          onComplete={handleHoaOnboardingComplete}
          onBack={() => setView('landing')}
        />
        <Toaster />
      </>
    );
  }

  if (view === 'billing') {
    return (
      <>
        <BillingPage
          planName={selectedPlan}
          onComplete={handleBillingComplete}
          onBack={() => setView('onboarding')}
        />
        <Toaster />
      </>
    );
  }

  if (view === 'invite') {
    return (
      <>
        <InvitePage communityName={communityName} onContinue={handleInviteContinue} />
        <Toaster />
      </>
    );
  }

  if (view === 'hoa-dashboard') {
    return (
      <>
        <CityGovDashboard cityName={communityName} onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  // ── Router-based views (resident app) ─────────────────────────────────────

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to={currentUser?.role === 'HOA_ADMIN' ? '/admin' : '/dashboard'} replace />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />
          <Route
            path="/auth/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AuthPage onLogin={handleLogin} onBack={() => setView('landing')} />
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
              isAuthenticated && (currentUser?.role === 'HOA_ADMIN') ? (
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