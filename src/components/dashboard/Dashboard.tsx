import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FileText, ThumbsUp, MessageSquare, MapPin, Calendar, Eye, Search, TrendingUp, Users, Sparkles } from 'lucide-react';
import { mockPosts, categories, getStatusColor, getStatusLabel } from '../../lib/mockData';
import { PostDetailModal } from '../posts/PostDetailModal';
import { toast } from 'sonner';

interface DashboardProps {
  currentUser: any;
  onLogout: () => void;
}

export function Dashboard({ currentUser, onLogout }: DashboardProps) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(mockPosts);
  const [filteredPosts, setFilteredPosts] = useState(mockPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [endorsedPosts, setEndorsedPosts] = useState<Set<string>>(new Set());

  // Get only approved posts for dashboard
  const approvedPosts = posts.filter(p => p.status === 'approved');

  // Calculate stats
  const totalPosts = approvedPosts.length;
  const totalEndorsements = approvedPosts.reduce((sum, post) => sum + post.endorsements, 0);
  const avgEndorsements = totalPosts > 0 ? Math.round(totalEndorsements / totalPosts) : 0;

  // Get unique cities
  const cities = ['all', ...Array.from(new Set(posts.map(p => p.city)))];

  useEffect(() => {
    let filtered = approvedPosts;

    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (selectedCity !== 'all') {
      filtered = filtered.filter(post => post.city === selectedCity);
    }

    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory, selectedCity, posts]);

  const handleEndorse = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, endorsements: post.endorsements + 1 }
        : post
    ));
    setEndorsedPosts(prev => new Set([...prev, postId]));
    toast.success('Post endorsed!');
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
                <span className="text-white/80 text-sm tracking-wider uppercase">Community Hub</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4 text-white">
                Welcome back, <span className="text-[#E31E24]">{currentUser?.name?.split(' ')[0]}</span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl">
                Track civic issues, connect with your community, and make a real impact in {currentUser?.city || 'your city'}
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-8">
          {/* Statistics - Enhanced Design */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Posts Card */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#004080] to-[#003366] text-white hover:shadow-xl hover:shadow-[#004080]/20 transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <CardHeader className="relative pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-white/80">Active Issues</CardTitle>
                  <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-4xl mb-1">{totalPosts}</div>
                <p className="text-sm text-white/60">Community posts</p>
              </CardContent>
            </Card>

            {/* Total Endorsements Card */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#E31E24] to-[#C01A1F] text-white hover:shadow-xl hover:shadow-[#E31E24]/20 transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <CardHeader className="relative pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-white/80">Total Support</CardTitle>
                  <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <ThumbsUp className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-4xl mb-1">{totalEndorsements}</div>
                <p className="text-sm text-white/60">Endorsements</p>
              </CardContent>
            </Card>

            {/* Average Engagement Card */}
            <Card className="relative overflow-hidden border-2 hover:border-[#004080]/50 transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#004080]/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <CardHeader className="relative pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Engagement</CardTitle>
                  <div className="h-10 w-10 rounded-lg bg-[#004080]/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-[#004080]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-4xl mb-1">{avgEndorsements}</div>
                <p className="text-sm text-muted-foreground">Per post</p>
              </CardContent>
            </Card>

            {/* Contribution Score Card */}
            <Card className="relative overflow-hidden border-2 hover:border-[#E31E24]/50 transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E31E24]/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <CardHeader className="relative pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Your Impact</CardTitle>
                  <div className="h-10 w-10 rounded-lg bg-[#E31E24]/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-[#E31E24]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-4xl mb-1">{currentUser?.contributionScore || 0}</div>
                <p className="text-sm text-muted-foreground">Contribution score</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters Section - Enhanced */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#004080]/10 flex items-center justify-center">
                  <Search className="h-5 w-5 text-[#004080]" />
                </div>
                <div>
                  <CardTitle>Discover Issues</CardTitle>
                  <CardDescription>Filter and search community posts</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city === 'all' ? 'All Cities' : city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(searchQuery || selectedCategory !== 'all' || selectedCity !== 'all') && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Showing {filteredPosts.length} of {approvedPosts.length} posts
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedCity('all');
                    }}
                    className="text-[#E31E24] hover:text-[#E31E24] hover:bg-[#E31E24]/10"
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Posts Grid - Enhanced */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl mb-1">Community Issues</h2>
                <p className="text-sm text-muted-foreground">Browse and support local initiatives</p>
              </div>
            </div>

            {filteredPosts.length === 0 ? (
              <Card className="border-2">
                <CardContent className="py-16 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg mb-2">No posts found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters to see more results</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
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
                        <Badge variant="secondary" className="bg-[#004080]/20 text-[#004080] border-[#004080]/30 hover:bg-[#004080]/30">
                          {post.category}
                        </Badge>
                      </div>
                      <CardTitle className="line-clamp-2 text-xl group-hover:text-[#004080] transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3 text-base leading-relaxed">
                        {post.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2 text-[#E31E24]" />
                          <span>{post.location}, {post.city}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="text-muted-foreground">
                            by <span className="text-foreground">{post.author}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <ThumbsUp className="h-4 w-4 mr-1.5 text-[#004080]" />
                            <span className="font-medium text-foreground">{post.endorsements}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <MessageSquare className="h-4 w-4 mr-1.5" />
                            <span className="font-medium text-foreground">{post.comments}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!endorsedPosts.has(post.id)) {
                              handleEndorse(post.id);
                            }
                          }}
                          disabled={endorsedPosts.has(post.id)}
                          className={
                            endorsedPosts.has(post.id)
                              ? 'bg-[#004080] text-white cursor-not-allowed opacity-90'
                              : 'bg-[#004080] hover:bg-[#003366] text-white border-0 transition-all duration-200 hover:shadow-lg hover:shadow-[#004080]/30'
                          }
                        >
                          <ThumbsUp className={`h-3.5 w-3.5 mr-1.5 ${endorsedPosts.has(post.id) ? 'fill-current' : ''}`} />
                          {endorsedPosts.has(post.id) ? 'Endorsed' : 'Endorse'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Post Detail Modal */}
        {selectedPost && (
          <PostDetailModal
            post={selectedPost}
            isOpen={isPostModalOpen}
            onClose={() => {
              setIsPostModalOpen(false);
              setSelectedPost(null);
            }}
            currentUser={currentUser}
            onEndorse={handleEndorse}
            isEndorsed={endorsedPosts.has(selectedPost.id)}
            onUserClick={(userId) => navigate(`/users/${userId}`)}
          />
        )}
      </div>
    </AppLayout>
  );
}