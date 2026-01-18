import { useState, useMemo } from 'react';
import { PostDetailModal } from '../posts/PostDetailModal';
import { StatusUpdateModal } from './StatusUpdateModal';
import { UserProfileModal } from './UserProfileModal';
import { ReportModal } from './ReportModal';
import { toast } from 'sonner';
import logo from 'figma:asset/e0850b95def2b76d7623aebb6fd341e7597812e1.png';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
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
  RefreshCw
} from 'lucide-react';
import { mockPosts, categories, mockUsers } from '../../lib/mockData';
import { POST_STATUSES } from '../../config/constants';

interface CityGovDashboardProps {
  cityName: string;
  onLogout: () => void;
}

export function CityGovDashboard({ cityName, onLogout }: CityGovDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [analyticsCategory, setAnalyticsCategory] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [posts, setPosts] = useState(mockPosts);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Current user for gov dashboard (mock)
  const currentUser = {
    name: 'Government Admin',
    role: 'admin',
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
      description: 'The citizen and all endorsers will be notified of this change.',
    });
  };

  // Filter posts for this city (all statuses now)
  const cityPosts = posts.filter(p => p.city === cityName);

  // AI-Powered Mock Data
  /**
   * TODO - Backend Integration:
   * Replace these mock predictions with real AI API calls:
   * - GET /api/ai/trend-forecast - Returns predicted trends
   * - GET /api/ai/resource-optimization - Returns staffing recommendations
   * - GET /api/ai/budget-analysis - Returns cost estimates
   * - POST /api/ai/generate-report - Generates AI reports
   */
  const aiPredictions = {
    trendForecast: categories.map(category => {
      const currentWeek = cityPosts.filter(p => p.category === category).length;
      const randomChange = Math.floor(Math.random() * 60) - 20; // Random between -20 and +40
      const nextWeek = Math.max(1, currentWeek + Math.floor(currentWeek * (randomChange / 100)));
      
      const insights: Record<string, string> = {
        'Infrastructure': 'Upcoming winter weather predicted to increase pothole reports',
        'Transportation': 'Major event downtown next week will increase traffic concerns',
        'Parks & Recreation': 'Off-season decrease in park maintenance issues expected',
        'Safety': 'Enhanced community policing expected to reduce incident reports',
        'Environment': 'Spring cleaning initiatives driving increased litter and pollution reports',
        'Housing': 'New development projects causing temporary increase in construction complaints',
        'Commerce': 'Business district renovation leading to accessibility concerns',
        'Health': 'Flu season increasing health facility capacity concerns'
      };
      
      return {
        category,
        currentWeek,
        nextWeek,
        confidence: Math.floor(Math.random() * 20) + 75, // Random between 75-95%
        reason: insights[category] || `Seasonal trends affecting ${category.toLowerCase()} issue volume`,
        icon: AlertCircle
      };
    }),
    resourceOptimization: {
      recommendations: [
        {
          department: 'Public Works',
          currentStaff: 12,
          recommendedStaff: 16,
          reason: 'Increased infrastructure issues predicted',
          impact: 'High',
          color: 'text-red-600 bg-red-50'
        },
        {
          department: 'Parks Department',
          currentStaff: 8,
          recommendedStaff: 6,
          reason: 'Seasonal decrease in park-related issues',
          impact: 'Low',
          color: 'text-green-600 bg-green-50'
        }
      ],
      estimatedCostSavings: '$45,000/month',
      efficiencyGain: '23%'
    },
    budgetAnalysis: {
      highPriorityIssues: cityPosts.filter(p => p.endorsements > 100).length,
      estimatedTotalCost: '$284,500',
      averageCostPerIssue: '$3,200',
      estimatedTimeframe: '6-8 weeks',
      breakdown: categories
        .map(category => {
          const categoryIssues = cityPosts.filter(p => p.category === category);
          if (categoryIssues.length === 0) return null;
          
          // Calculate cost based on number of issues and average endorsements
          const baseCost = categoryIssues.length * 12000; // Base $12k per issue
          const endorsementBonus = categoryIssues.reduce((sum, p) => sum + p.endorsements, 0) * 50; // $50 per endorsement
          const totalCost = baseCost + endorsementBonus;
          
          return {
            category,
            cost: `$${totalCost.toLocaleString()}`,
            issues: categoryIssues.length
          };
        })
        .filter(Boolean) // Remove null entries
        .sort((a, b) => {
          // Sort by cost (highest first)
          const aCost = parseInt(a!.cost.replace(/[$,]/g, ''));
          const bCost = parseInt(b!.cost.replace(/[$,]/g, ''));
          return bCost - aCost;
        })
    }
  };

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

  // Mock Report Data
  const reportData = {
    totalIssues: stats.totalIssues,
    totalEndorsements: stats.totalEndorsements,
    avgEndorsements: stats.avgEndorsements,
    budgetImpact: aiPredictions.budgetAnalysis.estimatedTotalCost,
    avgResolution: '2 days',
    trendDirection: '18% increase',
    trends: categories.map(category => {
      // Generate trend data for each category
      const currentWeek = cityPosts.filter(p => p.category === category).length;
      const randomChange = Math.floor(Math.random() * 60) - 20; // Random between -20 and +40
      const nextWeek = Math.max(1, currentWeek + Math.floor(currentWeek * (randomChange / 100)));
      const percentChange = currentWeek > 0 ? ((nextWeek - currentWeek) / currentWeek * 100) : 0;
      const isIncrease = percentChange > 0;
      
      const insights: Record<string, string> = {
        'Infrastructure': 'Winter weather expected to significantly increase pothole and road damage reports',
        'Transportation': 'Major downtown event will drive increased traffic and parking concerns',
        'Parks & Recreation': 'Off-season decrease as fewer citizens use outdoor facilities',
        'Safety': 'Enhanced community policing expected to reduce incident reports',
        'Environment': 'Spring cleaning initiatives driving increased litter and pollution reports',
        'Housing': 'New development projects causing temporary increase in construction complaints',
        'Commerce': 'Business district renovation leading to accessibility concerns',
        'Health': 'Flu season increasing health facility capacity concerns'
      };
      
      return {
        category,
        change: `${isIncrease ? '+' : ''}${Math.abs(Math.round(percentChange))}%`,
        isIncrease,
        confidence: Math.floor(Math.random() * 20) + 75, // Random between 75-95%
        insight: insights[category] || `Seasonal trends affecting ${category.toLowerCase()} issue volume`
      };
    }),
    budgetBreakdown: aiPredictions.budgetAnalysis.breakdown.map(item => ({
      ...item,
      percentage: (parseInt(item.cost.replace(/[$,]/g, '')) / parseInt(aiPredictions.budgetAnalysis.estimatedTotalCost.replace(/[$,]/g, ''))) * 100
    })),
    recommendations: [
      'Prioritize infrastructure issues before winter weather intensifies - deploy additional crews to high-traffic areas',
      'Reduce Parks Department staffing by 2 personnel during off-season to optimize budget allocation',
      'Implement temporary traffic management plan for upcoming downtown event to reduce congestion complaints',
      'Increase community engagement by responding to high-priority issues (50+ endorsements) within 48 hours',
      'Consider bulk contracting for infrastructure repairs to reduce per-issue costs by estimated 15-20%'
    ]
  };

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
                    <h1 className="text-xl font-semibold">{cityName} Government</h1>
                  </div>
                  <p className="text-sm text-muted-foreground">Tracking Portal</p>
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
              <p className="text-sm text-blue-100">Reported by citizens</p>
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
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2">
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

            {/* AI-Powered Insights Header */}
            <Card className="border-2 bg-gradient-to-br from-purple-50 to-blue-50">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      Predictive Insights
                      <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">AI</Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground">Real-time predictions and optimization recommendations</p>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                    onClick={() => {
                      /** TODO - Backend Integration: POST /api/ai/generate-report 
                       * Generate comprehensive AI report with all insights, trends, and recommendations
                       * Parameters: { cityName, dateRange, categories, includeForecasts: true }
                       */
                      toast.success('Report Generated', {
                        description: 'Your comprehensive report is ready for download'
                      });
                      setIsReportModalOpen(true);
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Trend Forecasting */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Trend Forecasting</CardTitle>
                <CardDescription>Predicted issue volumes based on seasonal patterns, weather, and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiPredictions.trendForecast.map((trend, index) => {
                    const Icon = trend.icon;
                    const percentChange = ((trend.nextWeek - trend.currentWeek) / trend.currentWeek * 100);
                    const isIncrease = percentChange > 0;
                    
                    return (
                      <div key={index} className="p-4 rounded-xl border-2 hover:border-blue-500/50 transition-all">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <h4 className="font-semibold">{trend.category}</h4>
                            <p className="text-sm text-muted-foreground">{trend.reason}</p>
                          </div>
                          
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            {trend.confidence}% Confidence
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 rounded-lg bg-gray-50 border">
                            <p className="text-xs text-muted-foreground mb-1">Current Week</p>
                            <p className="text-xl font-bold">{trend.currentWeek}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                            <p className="text-xs text-blue-600 mb-1">Next Week</p>
                            <p className="text-xl font-bold text-blue-600">{trend.nextWeek}</p>
                          </div>
                          <div className={`p-3 rounded-lg ${isIncrease ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                            <p className={`text-xs mb-1 ${isIncrease ? 'text-red-600' : 'text-green-600'}`}>Change</p>
                            <p className={`text-xl font-bold ${isIncrease ? 'text-red-600' : 'text-green-600'}`}>
                              {isIncrease ? '+' : ''}{percentChange.toFixed(0)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* AI Budget Impact Analysis */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Budget Impact Analysis</CardTitle>
                <CardDescription>Cost estimates and timeline for addressing high-priority issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h4 className="font-semibold mb-4">Cost Breakdown by Category</h4>
                  <div className="space-y-3">
                    {aiPredictions.budgetAnalysis.breakdown.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 rounded-xl border-2 hover:border-amber-500/50 transition-all">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{item.category}</span>
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary">
                                {item.issues} issues
                              </Badge>
                              <span className="text-lg font-bold text-amber-600">{item.cost}</span>
                            </div>
                          </div>
                          <div className="w-full h-3 bg-muted rounded-full overflow-hidden border-2">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                              style={{ 
                                width: `${(parseInt(item.cost.replace(/[$,]/g, '')) / parseInt(aiPredictions.budgetAnalysis.estimatedTotalCost.replace(/[$,]/g, ''))) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <Card className="border-2">
                    <CardContent className="py-4 text-center">
                      <AlertCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground mb-1">High Priority Issues</p>
                      <p className="text-2xl font-bold text-blue-600">{aiPredictions.budgetAnalysis.highPriorityIssues}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-2">
                    <CardContent className="py-4 text-center">
                      <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground mb-1">Estimated Total Cost</p>
                      <p className="text-2xl font-bold text-green-600">{aiPredictions.budgetAnalysis.estimatedTotalCost}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-2">
                    <CardContent className="py-4 text-center">
                      <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground mb-1">Avg. Cost Per Issue</p>
                      <p className="text-2xl font-bold text-purple-600">{aiPredictions.budgetAnalysis.averageCostPerIssue}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-2">
                    <CardContent className="py-4 text-center">
                      <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground mb-1">Est. Timeframe</p>
                      <p className="text-2xl font-bold text-orange-600">{aiPredictions.budgetAnalysis.estimatedTimeframe}</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
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
        aiPredictions={aiPredictions}
        stats={stats}
        reportData={reportData}
      />
    </div>
  );
}