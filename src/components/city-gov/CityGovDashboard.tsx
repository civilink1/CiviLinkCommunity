import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Building2, TrendingUp, MapPin, ThumbsUp, MessageSquare, Calendar, Filter, Eye, LogOut } from 'lucide-react';
import { mockPosts, categories, getStatusColor, getStatusLabel } from '../../lib/mockData';
import { toast } from 'sonner';
import logo from 'figma:asset/e0850b95def2b76d7623aebb6fd341e7597812e1.png';

interface CityGovDashboardProps {
  cityName: string;
  onLogout: () => void;
}

export function CityGovDashboard({ cityName, onLogout }: CityGovDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Filter posts for this city (approved only)
  const cityPosts = mockPosts.filter(p => p.city === cityName && p.status === 'approved');

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

  const getHeatIntensityColor = (intensity: number, maxIntensity: number) => {
    const percentage = intensity / maxIntensity;
    if (percentage > 0.7) return 'bg-red-500';
    if (percentage > 0.4) return 'bg-orange-500';
    if (percentage > 0.2) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const maxIntensity = Math.max(...heatMapData.map(d => d.intensity), 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b sticky top-0 z-50 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={logo} alt="CiviLink" className="h-8" />
              <div className="h-8 w-px bg-border" />
              <div>
                <h1 className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  {cityName} Government Portal
                </h1>
                <p className="text-sm text-muted-foreground">Civic Issues Dashboard</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Statistics Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-blue-100">Total Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl">{stats.totalIssues}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-orange-100">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl">{stats.topIssues}</div>
              <p className="text-sm text-orange-100 mt-1">50+ endorsements</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-purple-100">Total Endorsements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl">{stats.totalEndorsements}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-green-100">Avg. Endorsements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl">{stats.avgEndorsements}</div>
              <p className="text-sm text-green-100 mt-1">per issue</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="heatmap" className="space-y-4">
          <TabsList>
            <TabsTrigger value="heatmap">🗺️ Heat Map</TabsTrigger>
            <TabsTrigger value="posts">📋 All Issues</TabsTrigger>
            <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
          </TabsList>

          {/* Heat Map Tab */}
          <TabsContent value="heatmap" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Issue Heat Map by Location</CardTitle>
                <CardDescription>
                  Locations with the most reported issues and community engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {heatMapData.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No issues reported yet</p>
                  ) : (
                    <>
                      {heatMapData.map((item, index) => (
                        <div
                          key={index}
                          className="group cursor-pointer"
                          onClick={() => setSelectedLocation(
                            selectedLocation === item.location ? null : item.location
                          )}
                        >
                          <div className="flex items-center gap-3 p-4 rounded-lg hover:bg-muted transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>{item.location}</span>
                                <Badge variant="secondary">{item.count} issues</Badge>
                              </div>
                              
                              {/* Heat bar */}
                              <div className="w-full h-8 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
                                <div
                                  className={`h-full ${getHeatIntensityColor(item.intensity, maxIntensity)} transition-all duration-500 flex items-center justify-between px-4`}
                                  style={{ width: `${(item.intensity / maxIntensity) * 100}%` }}
                                >
                                  <span className="text-white text-sm flex items-center gap-2">
                                    <ThumbsUp className="h-3 w-3" />
                                    {item.endorsements}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Expanded location posts */}
                          {selectedLocation === item.location && (
                            <div className="ml-8 mt-2 space-y-2 animate-in slide-in-from-top-2">
                              {item.posts.slice(0, 3).map(post => (
                                <Card key={post.id} className="bg-muted/50">
                                  <CardContent className="py-3">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <Badge variant="secondary">{post.category}</Badge>
                                          <span className="text-sm text-muted-foreground">
                                            {post.createdAt}
                                          </span>
                                        </div>
                                        <p className="line-clamp-1">{post.title}</p>
                                        <div className="flex gap-3 mt-2 text-sm text-muted-foreground">
                                          <span className="flex items-center gap-1">
                                            <ThumbsUp className="h-3 w-3" />
                                            {post.endorsements}
                                          </span>
                                          <span className="flex items-center gap-1">
                                            <MessageSquare className="h-3 w-3" />
                                            {post.commentsCount}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                              {item.posts.length > 3 && (
                                <p className="text-sm text-muted-foreground text-center py-2">
                                  + {item.posts.length - 3} more issues
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="py-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-48">
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

                  <Button
                    variant={showAllPosts ? "default" : "outline"}
                    onClick={() => setShowAllPosts(!showAllPosts)}
                  >
                    {showAllPosts ? 'Show Top Issues Only' : 'Show All Issues'}
                  </Button>
                </div>

                {!showAllPosts && (
                  <p className="text-sm text-muted-foreground mt-3">
                    Showing issues with 50+ endorsements. Click "Show All Issues" to see everything.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Posts Grid */}
            {filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No issues found matching your filters</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="flex flex-col hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary">{post.category}</Badge>
                        <Badge className={getStatusColor(post.status)}>
                          {getStatusLabel(post.status)}
                        </Badge>
                      </div>
                      <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {post.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-end">
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {post.location}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {post.createdAt}
                        </div>
                        <div className="flex gap-4 pt-2">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4 text-primary" />
                            <span>{post.endorsements}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{post.commentsCount}</span>
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
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Issues by Category</CardTitle>
                  <CardDescription>Distribution of reported issues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.categoryBreakdown.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">{item.category}</span>
                          <Badge variant="secondary">{item.count}</Badge>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{
                              width: `${(item.count / stats.totalIssues) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trending Issues */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    Top Trending Issues
                  </CardTitle>
                  <CardDescription>Most endorsed issues this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sortedPosts.slice(0, 5).map((post, index) => (
                      <div key={post.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm">#{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm line-clamp-1">{post.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {post.endorsements}
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
        </Tabs>
      </div>
    </div>
  );
}