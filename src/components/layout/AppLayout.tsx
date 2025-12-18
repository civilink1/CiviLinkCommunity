import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { Button } from '../ui/button';
import { Home, FileText, PlusCircle, Bell, Users, User, Search, LogOut, Shield } from 'lucide-react';
import { Badge } from '../ui/badge';
import logo from 'figma:asset/e0850b95def2b76d7623aebb6fd341e7597812e1.png';

interface AppLayoutProps {
  children: ReactNode;
  currentUser: any;
  onLogout: () => void;
}

export function AppLayout({ children, currentUser, onLogout }: AppLayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/posts', icon: FileText, label: 'My Posts' },
    { path: '/posts/create', icon: PlusCircle, label: 'Create Post' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/leaders', icon: Users, label: 'Leaders' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  if (currentUser?.role === 'admin') {
    navItems.push({ path: '/admin', icon: Shield, label: 'Admin' });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src={logo} alt="CiviLink Logo" className="w-full h-full" />
            </div>
            <span className="text-xl font-normal">CiviLink</span>
          </Link>
          
          <div className="flex items-center space-x-4 mr-4">
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">Welcome,</span>
              <span>{currentUser?.name}</span>
              {currentUser?.role === 'admin' && (
                <Badge variant="secondary">Admin</Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 border-r min-h-[calc(100vh-4rem)] flex-col">
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
          <div className="flex items-center justify-around p-2">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className="flex-col h-auto py-2 px-3"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs mt-1">{item.label.split(' ')[0]}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}