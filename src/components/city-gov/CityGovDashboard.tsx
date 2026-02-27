import { useState, useMemo } from 'react';
import { PostDetailModal } from '../posts/PostDetailModal';
import { StatusUpdateModal } from './StatusUpdateModal';
import { UserProfileModal } from './UserProfileModal';
import { ReportModal } from './ReportModal';
import { toast } from 'sonner';
import logo from '../../assets/logo.png';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  LayoutDashboard,
  Map,
  FileText,
  TrendingUp,
  AlertCircle,
  ThumbsUp,
  MessageSquare,
  Filter,
  Eye,
  MapPin,
  CheckCircle2,
  LogOut,
  Clock,
  BarChart3,
  Users,
  Building2,
  ClipboardList,
  Calendar,
  RefreshCw,
  Settings,
  Bell,
  Search,
  Check,
  X,
  Save,
} from 'lucide-react';
import { mockPosts, categories, mockUsers, mockCommunity, createAnnouncement, approveUser, denyUser, updateCommunitySettings } from '../../lib/mockData';
import { POST_STATUSES } from '../../config/constants';

interface CityGovDashboardProps {
  cityName: string;
  onLogout: () => void;
}

export function CityGovDashboard({ cityName, onLogout }: CityGovDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAllPosts, setShowAllPosts] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [analyticsCategory, setAnalyticsCategory] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [posts, setPosts] = useState(mockPosts);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Settings state
  const [settingsCommunityName, setSettingsCommunityName] = useState(mockCommunity.name);
  const [settingsHomeCount, setSettingsHomeCount] = useState(String(mockCommunity.homeCount));
  const [settingsRequireApproval, setSettingsRequireApproval] = useState(mockCommunity.requireApproval);
  const [settingsCommentsEnabled, setSettingsCommentsEnabled] = useState(mockCommunity.commentsEnabled);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementUrgent, setAnnouncementUrgent] = useState(false);

  // Users state
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'APPROVED' | 'PENDING' | 'DENIED'>('all');
  const [residentList, setResidentList] = useState(mockUsers);

  // Display name — avoid "Sunset Ridge HOA HOA"
  const displayName = cityName.includes('HOA') ? cityName : `${cityName} HOA`;

  // Current user for gov dashboard (mock)
  const currentUser = {
    name: 'HOA Admin',
    role: 'HOA_ADMIN',
    city: cityName,
  };

  // Handle status update
  const handleUpdateStatus = (postId: string, newStatus: string, note: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newHistoryEntry = {
          status: newStatus,
          date: new Date().toISOString(),
          note: note,
          updatedBy: currentUser.name,
        };

        return {
          ...post,
          status: newStatus,
          statusHistory: [...(post.statusHistory || []), newHistoryEntry],
        };
      }
      return post;
    }));

    toast.success(`Status updated to \"${getStatusLabel(newStatus)}\"`, {
      description: 'The resident and all endorsers will be notified of this change.',
    });
  };

  // Filter posts for this city — fall back to all posts if none match (mock data support)
  const cityMatchedPosts = posts.filter(p => p.city === cityName);
  const cityPosts = cityMatchedPosts.length > 0 ? cityMatchedPosts : posts;

  // Sort by endorsements
  const sortedPosts = useMemo(() => {
    return [...cityPosts].sort((a, b) => b.endorsements - a.endorsements);
  }, [cityPosts]);

  // Top posts (high endorsements)
  const topPosts = sortedPosts.filter(p => p.endorsements >= 50);
  const otherPosts = sortedPosts.filter(p => p.endorsements < 50);

  // Display posts based on toggle
  const displayPosts = showAllPosts ? sortedPosts : topPosts;

  // Filter by category
  const filteredPosts = selectedCategory === 'all'
    ? displayPosts
    : displayPosts.filter(p => p.category === selectedCategory);

  // Filter by status
  const statusFilteredPosts = selectedStatus === 'all'
    ? filteredPosts
    : filteredPosts.filter(p => p.status === selectedStatus);

  // Calculate heat map data (posts by location)
  const heatMapData = useMemo(() => {
    const locationCounts: Record<string, { count: number; endorsements: number; posts: any[] }> = {};

    cityPosts.forEach(post => {
      if (!locationCounts[post.location]) {
        locationCounts[post.location] = { count: 0, endorsements: 0, posts: [] };
      }
      locationCounts[post.location].count++;
      locationCounts[post.location].endorsements += post.endorsements;
      locationCounts[post.location].posts.push(post);
    });

    return Object.entries(locationCounts)
      .map(([location, data]) => ({
        location,
        ...data,
        intensity: data.count + (data.endorsements / 10) // Calculate intensity
      }))
      .sort((a, b) => b.intensity - a.intensity);
  }, [cityPosts]);

  // Stats
  const stats = {
    totalIssues: cityPosts.length,
    topIssues: topPosts.length,
    totalEndorsements: cityPosts.reduce((sum, p) => sum + p.endorsements, 0),
    avgEndorsements: cityPosts.length > 0
      ? Math.round(cityPosts.reduce((sum, p) => sum + p.endorsements, 0) / cityPosts.length)
      : 0,
    categoryBreakdown: categories.map(cat => ({
      category: cat,
      count: cityPosts.filter(p => p.category === cat).length
    })).filter(c => c.count > 0)
  };

  // Report data (depends on stats — must be declared after)
  const reportData = {
    totalIssues: stats.totalIssues,
    totalEndorsements: stats.totalEndorsements,
    avgEndorsements: stats.avgEndorsements,
    budgetImpact: 'N/A',
    avgResolution: '2 days',
    trendDirection: 'Stable',
    trends: categories.map(category => ({
      category,
      change: '—',
      isIncrease: false,
      confidence: 0,
      insight: `${category} issues are being monitored by the board.`
    })),
    budgetBreakdown: [] as any[],
    recommendations: [
      'Respond to high-priority issues (10+ endorsements) within 48 hours.',
      'Post announcements for scheduled maintenance to reduce duplicate reports.',
      'Review pending resident approvals regularly.',
      'Use bulk maintenance contracts to reduce per-issue costs.',
      'Keep community pool/gym hours updated in announcements.',
    ]
  };

  const getStatusInfo = (statusValue: string) => {
    const status = POST_STATUSES.find(s => s.value === statusValue);
    return status || POST_STATUSES[0];
  };

  const getStatusColor = (statusValue: string) => {
    return getStatusInfo(statusValue).color;
  };

  const getStatusLabel = (statusValue: string) => {
    return getStatusInfo(statusValue).label;
  };

  const getHeatIntensityColor = (intensity: number, maxIntensity: number) => {
    const percentage = intensity / maxIntensity;
    if (percentage > 0.7) return 'bg-gradient-to-r from-[#E31E24] to-red-600';
    if (percentage > 0.4) return 'bg-gradient-to-r from-orange-500 to-orange-600';
    if (percentage > 0.2) return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
  };

  const maxIntensity = Math.max(...heatMapData.map(d => d.intensity), 1);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Gradient */}
      <header className="sticky top-0 z-50 border-b backdrop-blur-xl bg-background/90">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#004080]/20 via-transparent to-[#E31E24]/20"></div>
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <img src={logo} alt="CiviLink" className="h-10 drop-shadow-lg" />
                <div className="hidden md:block w-px h-10 bg-gradient-to-b from-transparent via-zinc-700 to-transparent"></div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-xl font-semibold">{displayName}</h1>
                  </div>
                  <p className="text-sm text-muted-foreground">Community Dashboard</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="border-[#E31E24]/30 hover:border-[#E31E24] hover:bg-[#E31E24]/10 hover:text-[#E31E24]"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-8">
        {/* Statistics Overview - Enhanced */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Issues */}
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#004080] to-[#003366] text-white group hover:shadow-2xl hover:shadow-[#004080]/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
            <CardHeader className="relative pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-100">Total Issues</CardTitle>
                <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
                  <ClipboardList className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-5xl font-bold mb-2">{stats.totalIssues}</div>
              <p className="text-sm text-blue-100">Reported by residents</p>
            </CardContent>
          </Card>

          {/* High Priority */}
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#E31E24] to-[#B01820] text-white group hover:shadow-2xl hover:shadow-[#E31E24]/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
            <CardHeader className="relative pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-red-100">High Priority</CardTitle>
                <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-5xl font-bold mb-2">{stats.topIssues}</div>
              <p className="text-sm text-red-100">50+ endorsements</p>
            </CardContent>
          </Card>

          {/* Total Endorsements */}
          <Card className="relative overflow-hidden border-2 hover:border-[#004080]/50 transition-all duration-300 hover:shadow-xl group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#004080]/5 rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700"></div>
            <CardHeader className="relative pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Support</CardTitle>
                <div className="h-12 w-12 rounded-xl bg-[#004080]/10 flex items-center justify-center border border-[#004080]/30">
                  <ThumbsUp className="h-6 w-6 text-[#004080]" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-5xl font-bold mb-2">{stats.totalEndorsements}</div>
              <p className="text-sm text-muted-foreground">Community endorsements</p>
            </CardContent>
          </Card>

          {/* Average */}
          <Card className="relative overflow-hidden border-2 hover:border-[#E31E24]/50 transition-all duration-300 hover:shadow-xl group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#E31E24]/5 rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700"></div>
            <CardHeader className="relative pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Engagement</CardTitle>
                <div className="h-12 w-12 rounded-xl bg-[#E31E24]/10 flex items-center justify-center border border-[#E31E24]/30">
                  <TrendingUp className="h-6 w-6 text-[#E31E24]" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-5xl font-bold mb-2">{stats.avgEndorsements}</div>
              <p className="text-sm text-muted-foreground">Endorsements per issue</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs - Enhanced */}
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4">
            <TabsTrigger
              value="posts"
              className="flex items-center gap-2"
            >
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">All Issues</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Members</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-6">
            {/* Filters */}
            <Card className="border-2">
              <CardContent className="py-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-10 w-10 rounded-lg bg-[#004080]/20 border border-[#004080]/30 flex items-center justify-center">
                      <Filter className="h-5 w-5 text-[#004080]" />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full sm:w-64">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-10 w-10 rounded-lg bg-[#004080]/20 border border-[#004080]/30 flex items-center justify-center">
                      <RefreshCw className="h-5 w-5 text-[#004080]" />
                    </div>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-full sm:w-64">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {POST_STATUSES.map((status) => (
                          <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant={showAllPosts ? "default" : "outline"}
                    onClick={() => setShowAllPosts(!showAllPosts)}
                    className={showAllPosts
                      ? "bg-[#004080] hover:bg-[#003366]"
                      : "hover:bg-[#004080]/20 hover:border-[#004080]"
                    }
                  >
                    {showAllPosts ? 'Top Priority Only' : 'Show All Issues'}
                  </Button>
                </div>

                {!showAllPosts && (
                  <div className="mt-4 p-3 rounded-lg bg-[#004080]/10 border border-[#004080]/30">
                    <p className="text-sm text-[#004080]">
                      <span className="font-medium">Showing high-priority issues:</span> Posts with 50+ community endorsements
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Posts Grid */}
            {statusFilteredPosts.length === 0 ? (
              <Card className="border-2">
                <CardContent className="py-16 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg mb-2">No issues found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or toggle to show all issues</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {statusFilteredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="group flex flex-col border-2 bg-white hover:border-[#004080]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#004080]/10 hover:-translate-y-1 cursor-pointer"
                    onClick={() => {
                      setSelectedPost(post);
                      setIsPostModalOpen(true);
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="secondary" className="bg-[#004080]/20 text-[#004080]">
                          {post.category}
                        </Badge>
                        <Badge className={`${getStatusColor(post.status)} border-0`}>
                          {getStatusLabel(post.status)}
                        </Badge>
                      </div>
                      <CardTitle className="line-clamp-2 text-xl group-hover:text-[#004080] transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3 text-base leading-relaxed">
                        {post.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-end">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2 text-[#E31E24]" />
                          <span>{post.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-4 pt-3 border-t">
                          <div className="flex items-center gap-1.5 text-sm">
                            <ThumbsUp className="h-4 w-4 text-[#004080]" />
                            <span className="font-medium">{post.endorsements}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{post.comments}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Original Analytics Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Category Breakdown */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">Issues by Category</CardTitle>
                  <CardDescription>Distribution across all categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {stats.categoryBreakdown.map((item, index) => {
                      const percentage = (item.count / stats.totalIssues) * 100;
                      return (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{item.category}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">{Math.round(percentage)}%</span>
                              <Badge variant="secondary" className="bg-[#004080]/20 text-[#004080]">
                                {item.count}
                              </Badge>
                            </div>
                          </div>
                          <div className="w-full h-3 bg-muted rounded-full overflow-hidden border-2">
                            <div
                              className="h-full bg-gradient-to-r from-[#004080] to-[#0059b3] transition-all duration-700 relative"
                              style={{ width: `${percentage}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Trending Issues */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">Top Trending Issues</CardTitle>
                  <CardDescription>Most endorsed by the community</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sortedPosts.slice(0, 5).map((post, index) => (
                      <div
                        key={post.id}
                        className="flex items-start gap-3 p-4 rounded-xl border-2 hover:border-[#004080]/50 transition-all duration-300 cursor-pointer"
                        onClick={() => {
                          setSelectedPost(post);
                          setIsPostModalOpen(true);
                        }}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#004080] to-[#003366] flex items-center justify-center flex-shrink-0 font-bold text-white">
                          #{index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium line-clamp-2 mb-2">{post.title}</p>
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="text-xs bg-[#004080]/20 text-[#004080]">
                              {post.category}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                              <ThumbsUp className="h-3.5 w-3.5 text-[#004080]" />
                              <span className="font-medium">{post.endorsements}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#004080]" />
                  Member Management
                </CardTitle>
                <CardDescription>Review and approve residents who have requested to join</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="Search members..."
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {(['All', 'APPROVED', 'PENDING', 'DENIED'] as const).map(f => (
                      <Button
                        key={f}
                        size="sm"
                        variant={userFilter === f ? 'default' : 'outline'}
                        className={userFilter === f ? 'bg-[#004080] text-white' : ''}
                        onClick={() => setUserFilter(f as any)}
                      >
                        {f === 'All' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Name</th>
                        <th className="px-4 py-3 text-left font-semibold">Email</th>
                        <th className="px-4 py-3 text-left font-semibold">Phone</th>
                        <th className="px-4 py-3 text-left font-semibold">Unit</th>
                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                        <th className="px-4 py-3 text-left font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {residentList
                        .filter(u => {
                          const q = userSearch.toLowerCase();
                          const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
                          const matchFilter = userFilter === 'All' || u.approvalStatus === userFilter;
                          return matchSearch && matchFilter;
                        })
                        .map(u => (
                          <tr key={u.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{u.name}</td>
                            <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                            <td className="px-4 py-3 text-muted-foreground">{(u as any).phone ?? '—'}</td>
                            <td className="px-4 py-3 text-muted-foreground">{u.unit ?? '—'}</td>
                            <td className="px-4 py-3">
                              <Badge
                                className={
                                  u.approvalStatus === 'APPROVED'
                                    ? 'bg-green-100 text-green-700 border-green-200'
                                    : u.approvalStatus === 'PENDING'
                                    ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                    : 'bg-red-100 text-red-700 border-red-200'
                                }
                                variant="outline"
                              >
                                {u.approvalStatus}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                {u.approvalStatus !== 'APPROVED' && (
                                  <Button
                                    size="sm"
                                    className="h-7 bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => {
                                      approveUser(u.id);
                                      setResidentList(prev => prev.map(x => x.id === u.id ? { ...x, approvalStatus: 'APPROVED' as const } : x));
                                      toast.success(`${u.name} approved`);
                                    }}
                                  >
                                    <Check className="h-3 w-3 mr-1" /> Approve
                                  </Button>
                                )}
                                {u.approvalStatus !== 'DENIED' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 border-red-300 text-red-600 hover:bg-red-50"
                                    onClick={() => {
                                      denyUser(u.id);
                                      setResidentList(prev => prev.map(x => x.id === u.id ? { ...x, approvalStatus: 'DENIED' as const } : x));
                                      toast.error(`${u.name} denied`);
                                    }}
                                  >
                                    <X className="h-3 w-3 mr-1" /> Deny
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {residentList.filter(u => {
                    const q = userSearch.toLowerCase();
                    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
                    const matchFilter = userFilter === 'All' || u.approvalStatus === userFilter;
                    return matchSearch && matchFilter;
                  }).length === 0 && (
                    <div className="py-12 text-center text-muted-foreground">No members found</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#004080]" />
                  Community Settings
                </CardTitle>
                <CardDescription>Update your community details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1 block">Community Name</Label>
                    <Input
                      value={settingsCommunityName}
                      onChange={e => setSettingsCommunityName(e.target.value)}
                      placeholder="e.g. Sunset Ridge"
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block">Number of Homes</Label>
                    <Input
                      type="number"
                      value={settingsHomeCount}
                      onChange={e => setSettingsHomeCount(Number(e.target.value))}
                      placeholder="e.g. 120"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsRequireApproval}
                      onChange={e => setSettingsRequireApproval(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[#004080]"
                    />
                    <span className="text-sm font-medium">Require admin approval before residents can join</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsCommentsEnabled}
                      onChange={e => setSettingsCommentsEnabled(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[#004080]"
                    />
                    <span className="text-sm font-medium">Allow residents to leave comments on issues</span>
                  </label>
                </div>
                <Button
                  className="bg-[#004080] hover:bg-[#003060] text-white mt-2"
                  onClick={() => {
                    updateCommunitySettings({
                      name: settingsCommunityName,
                      homeCount: settingsHomeCount,
                      requireApproval: settingsRequireApproval,
                      commentsEnabled: settingsCommentsEnabled,
                    });
                    toast.success('Settings saved');
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-[#004080]" />
                  Post Announcement
                </CardTitle>
                <CardDescription>Notify all residents with a community-wide message</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-1 block">Title</Label>
                  <Input
                    value={announcementTitle}
                    onChange={e => setAnnouncementTitle(e.target.value)}
                    placeholder="e.g. Pool Maintenance This Weekend"
                  />
                </div>
                <div>
                  <Label className="mb-1 block">Message</Label>
                  <textarea
                    className="w-full min-h-[90px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={announcementMessage}
                    onChange={e => setAnnouncementMessage(e.target.value)}
                    placeholder="Write your announcement here..."
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={announcementUrgent}
                    onChange={e => setAnnouncementUrgent(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-red-600"
                  />
                  <span className="text-sm font-medium text-red-600">Mark as urgent</span>
                </label>
                <Button
                  className="bg-[#004080] hover:bg-[#003060] text-white"
                  disabled={!announcementTitle.trim() || !announcementMessage.trim()}
                  onClick={() => {
                    createAnnouncement({
                      communityId: mockCommunity.id,
                      title: announcementTitle.trim(),
                      message: announcementMessage.trim(),
                      urgent: announcementUrgent,
                      authorName: cityName,
                    });
                    setAnnouncementTitle('');
                    setAnnouncementMessage('');
                    setAnnouncementUrgent(false);
                    toast.success('Announcement posted to all residents');
                  }}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Post Announcement
                </Button>
              </CardContent>
            </Card>
            {mockCommunity.announcements.length > 0 && (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-base">Recent Announcements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[...mockCommunity.announcements].reverse().map(ann => (
                    <div key={ann.id} className={`p-4 rounded-xl border-2 ${ann.urgent ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm">{ann.title}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">{ann.message}</p>
                        </div>
                        {ann.urgent && <Badge className="bg-red-500 text-white border-0 shrink-0">Urgent</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{new Date(ann.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Post Detail Modal */}
      <PostDetailModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        post={selectedPost}
        currentUser={currentUser}
        isCityGov={true}
        onStatusUpdateClick={() => setIsStatusModalOpen(true)}
        onUserClick={(userId) => {
          setSelectedUserId(userId);
          setIsUserProfileModalOpen(true);
        }}
      />

      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        post={selectedPost}
        currentStatus={selectedPost?.status}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* User Profile Modal */}
      {selectedUserId && (
        <UserProfileModal
          isOpen={isUserProfileModalOpen}
          onClose={() => {
            setIsUserProfileModalOpen(false);
            setSelectedUserId(null);
          }}
          userId={selectedUserId}
          onPostClick={(postId) => {
            const post = posts.find(p => p.id === postId);
            if (post) {
              setSelectedPost(post);
              setIsPostModalOpen(true);
            }
          }}
        />
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        cityName={cityName}
        aiPredictions={{}}
        stats={stats}
        reportData={reportData}
      />
    </div>
  );
}
