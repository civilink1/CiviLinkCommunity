import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import { toast } from 'sonner';
import { registerAdmin } from './services/auth.service';
import { createCommunity } from './services/community.service';
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
  const navigate = useNavigate();

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHoaAdmin, setIsHoaAdmin] = useState(false);
  const [communityName, setCommunityName] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('standard');

  // Pending HOA admin data collected during onboarding (used after billing)
  const [pendingAdminData, setPendingAdminData] = useState<{
    communityName: string; plan: string; homeCount: string;
    adminName: string; adminEmail: string; adminPassword: string;
  } | null>(null);
  const [inviteCode, setInviteCode] = useState('');

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
        navigate('/hoa-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else if (hoaFlag && savedCommunity) {
      setIsHoaAdmin(true);
      setCommunityName(savedCommunity);
      navigate('/hoa-dashboard', { replace: true });
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      navigate('/hoa-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleHoaOnboardingComplete = (data: {
    communityName: string; plan: string; homeCount: string;
    adminName: string; adminEmail: string; adminPassword: string;
  }) => {
    setCommunityName(data.communityName);
    setSelectedPlan(data.plan);
    setPendingAdminData(data);
    navigate('/billing');
  };

  const handleBillingComplete = async () => {
    if (!pendingAdminData) {
      navigate('/invite');
      return;
    }

    const authResult = await registerAdmin({
      name: pendingAdminData.adminName,
      email: pendingAdminData.adminEmail,
      password: pendingAdminData.adminPassword,
    });

    if (!authResult.success || !authResult.data) {
      throw new Error(authResult.error || 'Account creation failed. This email may already be registered.');
    }

    const communityResult = await createCommunity({
      name: pendingAdminData.communityName,
      planTier: pendingAdminData.plan,
      homeCount: parseInt(pendingAdminData.homeCount, 10) || 0,
      adminUserId: authResult.data.user.id,
    });

    if (!communityResult.success || !communityResult.data) {
      throw new Error(communityResult.error || 'Failed to create your community. Please try again.');
    }

    setInviteCode(communityResult.data.invite_code);
    setCurrentUser(authResult.data.user);
    setIsAuthenticated(true);
    setIsHoaAdmin(true);
    localStorage.setItem('communityName', pendingAdminData.communityName);
    navigate('/invite');
  };

  const handleInviteContinue = () => {
    setIsHoaAdmin(true);
    localStorage.setItem('hoaAdmin', 'true');
    localStorage.setItem('communityName', communityName);
    navigate('/hoa-dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsHoaAdmin(false);
    setCommunityName('');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('hoaAdmin');
    localStorage.removeItem('communityName');
    navigate('/');
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

  // ── Unified routes ────────────────────────────────────────────────────────

  return (
    <>
      <Routes>
        {/* ── Public ── */}
        <Route
          path="/"
          element={
            <LandingPage
              onCitizenAuth={() => navigate('/auth')}
              onCityGovAuth={() => navigate('/onboarding')}
            />
          }
        />

        <Route
          path="/auth"
          element={
            isAuthenticated
              ? <Navigate to={isHoaAdmin ? '/hoa-dashboard' : '/dashboard'} replace />
              : <AuthPage onLogin={handleLogin} onBack={() => navigate('/')} />
          }
        />

        <Route
          path="/join"
          element={
            <JoinPage
              onJoined={handleLogin}
              onBack={() => navigate('/')}
              onPendingApproval={() => navigate('/pending')}
            />
          }
        />

        <Route
          path="/pending"
          element={<PendingApprovalPage onBack={() => navigate('/')} />}
        />

        {/* ── HOA onboarding flow ── */}
        <Route
          path="/onboarding"
          element={
            <OnboardingPage
              onComplete={handleHoaOnboardingComplete}
              onBack={() => navigate('/')}
            />
          }
        />

        <Route
          path="/billing"
          element={
            <BillingPage
              planName={selectedPlan}
              onComplete={handleBillingComplete}
              onBack={() => navigate('/onboarding')}
            />
          }
        />

        <Route
          path="/invite"
          element={
            <InvitePage
              communityName={communityName}
              inviteCode={inviteCode}
              onContinue={handleInviteContinue}
            />
          }
        />

        <Route
          path="/hoa-dashboard"
          element={
            isHoaAdmin
              ? <CityGovDashboard cityName={communityName} onLogout={handleLogout} />
              : <Navigate to="/" replace />
          }
        />

        {/* ── Resident app ── */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated
              ? <Dashboard currentUser={currentUser} onLogout={handleLogout} />
              : <Navigate to="/auth" replace />
          }
        />

        <Route
          path="/posts"
          element={
            isAuthenticated
              ? <PostsPage currentUser={currentUser} onLogout={handleLogout} />
              : <Navigate to="/auth" replace />
          }
        />

        <Route
          path="/posts/create"
          element={
            isAuthenticated
              ? <CreatePostPage currentUser={currentUser} onLogout={handleLogout} />
              : <Navigate to="/auth" replace />
          }
        />

        <Route
          path="/posts/:postId"
          element={
            isAuthenticated
              ? <PostDetailPage currentUser={currentUser} onLogout={handleLogout} />
              : <Navigate to="/auth" replace />
          }
        />

        <Route
          path="/notifications"
          element={
            isAuthenticated
              ? <NotificationsPage currentUser={currentUser} onLogout={handleLogout} />
              : <Navigate to="/auth" replace />
          }
        />

        <Route
          path="/leaders"
          element={
            isAuthenticated
              ? <LeadersPage currentUser={currentUser} onLogout={handleLogout} />
              : <Navigate to="/auth" replace />
          }
        />

        <Route
          path="/profile"
          element={
            isAuthenticated
              ? <ProfilePage currentUser={currentUser} onLogout={handleLogout} />
              : <Navigate to="/auth" replace />
          }
        />

        <Route
          path="/users/:userId"
          element={
            isAuthenticated
              ? <UserProfilePage currentUser={currentUser} onLogout={handleLogout} />
              : <Navigate to="/auth" replace />
          }
        />

        <Route
          path="/search"
          element={
            isAuthenticated
              ? <SearchPage currentUser={currentUser} onLogout={handleLogout} />
              : <Navigate to="/auth" replace />
          }
        />

        <Route
          path="/admin"
          element={
            isAuthenticated && currentUser?.role === 'HOA_ADMIN'
              ? <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />
              : <Navigate to="/dashboard" replace />
          }
        />
      </Routes>
      <Toaster />
    </>
  );
}