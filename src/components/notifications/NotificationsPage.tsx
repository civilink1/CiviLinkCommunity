import { useState } from 'react';
import { Bell, ThumbsUp, MessageSquare, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { AppLayout } from '../layout/AppLayout';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { mockNotifications } from '../../lib/mockData';
import { toast } from 'sonner';

interface NotificationsPageProps {
  currentUser: any;
  onLogout: () => void;
}

export function NotificationsPage({ currentUser, onLogout }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'endorsement':
        return <ThumbsUp className="h-5 w-5 text-blue-600" />;
      case 'status_update':
        return <AlertCircle className="h-5 w-5 text-green-600" />;
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-purple-600" />;
      case 'system':
        return <Bell className="h-5 w-5 text-gray-600" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
    toast.success('Marked as read');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout}>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#004080] via-[#003366] to-[#002952] border-b border-white/10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-40"></div>
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 relative">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-12 bg-[#E31E24] rounded-full"></div>
                <span className="text-white/80 text-sm tracking-wider uppercase">Stay Updated</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4 text-white">
                Notifications
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl">
                Stay updated on your posts and community activity
              </p>
              {unreadCount > 0 && (
                <div className="mt-6">
                  <Button 
                    onClick={handleMarkAllAsRead}
                    className="bg-[#E31E24] hover:bg-[#C01A1F] text-white border-0 transition-all duration-200 hover:shadow-lg hover:shadow-[#E31E24]/30"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark All as Read
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-6">
          {/* Unread Count */}
          {unreadCount > 0 && (
            <Card className="border-2 border-[#004080]/30 bg-[#004080]/5">
              <CardContent className="py-4">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-[#004080]" />
                  <span>You have <strong>{unreadCount}</strong> unread notification{unreadCount !== 1 ? 's' : ''}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications List */}
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <Card className="border-2">
                <CardContent className="py-16 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Bell className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg mb-2">No notifications yet</h3>
                  <p className="text-muted-foreground">You're all caught up!</p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all border-2 ${notification.read ? 'bg-muted/30 border-transparent' : 'bg-card border-[#004080]/30 hover:border-[#004080]/50'}`}
                >
                  <CardContent className="py-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <p className={notification.read ? 'text-muted-foreground' : ''}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(notification.createdAt)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <>
                            <Badge variant="default" className="bg-[#E31E24]/20 text-[#E31E24] border-[#E31E24]/30 hover:bg-[#E31E24]/30">
                              New
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="hover:bg-[#004080]/10"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
