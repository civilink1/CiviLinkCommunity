import { useParams, useNavigate } from 'react-router-dom';
import { User, MapPin, Calendar, Award, FileText, ThumbsUp, ArrowLeft, MessageSquare } from 'lucide-react';
import { mockPosts, mockUsers } from '../../lib/mockData';
import { AppLayout } from '../layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { PostDetailModal } from '../posts/PostDetailModal';
import { useState } from 'react';
import { toast } from 'sonner';

interface UserProfilePageProps {
  currentUser: any;
  onLogout: () => void;
}

/**
 * UserProfilePage Component
 * Displays public profile information for any user
 * 
 * GitHub Copilot Integration Notes:
 * - TODO: Replace mockUsers.find() with API call: GET /api/users/:userId
 * - TODO: Replace mockPosts.filter() with API call: GET /api/users/:userId/posts
 * - TODO: Add user activity feed: GET /api/users/:userId/activity
 * - TODO: Add follow/unfollow functionality: POST /api/users/:userId/follow
 * - TODO: Add direct messaging option: POST /api/messages/new
 */
export function UserProfilePage({ currentUser, onLogout }: UserProfilePageProps) {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [endorsedPosts, setEndorsedPosts] = useState<Set<string>>(new Set());

  // TODO: Replace with API call - GET /api/users/:userId
  const user = mockUsers.find(u => u.id === userId);
  
  // TODO: Replace with API call - GET /api/users/:userId/posts
  const userPosts = mockPosts.filter(p => p.authorId === userId);
  const totalPosts = userPosts.length;
  const totalEndorsements = userPosts.reduce((sum, post) => sum + post.endorsements, 0);
  const approvedPosts = userPosts.filter(p => p.status === 'approved').length;

  if (!user) {
    return (
      <AppLayout currentUser={currentUser} onLogout={onLogout}>
        <div className="container mx-auto px-4 py-8">
          <Card className="border-2">
            <CardContent className="py-16 text-center">
              <h2 className="text-2xl mb-4">User not found</h2>
              <Button onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleEndorse = (postId: string) => {
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
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6 text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <User className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl mb-2 text-white">
                  {user.name}
                </h1>
                <p className="text-lg text-white/70 mb-4">{user.email}</p>
                <div className="flex flex-wrap items-center gap-4 text-white/80">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#E31E24]" />
                    {user.city}, {user.state}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-8">
          {/* Statistics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Contribution Score */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#004080] to-[#003366] text-white hover:shadow-xl hover:shadow-[#004080]/20 transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <CardHeader className="relative pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-white/80">Impact Score</CardTitle>
                  <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-4xl mb-1">{user.contributionScore}</div>
                <p className="text-sm text-white/60">Community impact</p>
              </CardContent>
            </Card>

            {/* Total Posts */}
            <Card className="relative overflow-hidden border-2 hover:border-[#004080]/50 transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#004080]/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <CardHeader className="relative pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
                  <div className="h-10 w-10 rounded-lg bg-[#004080]/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-[#004080]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-4xl mb-1">{totalPosts}</div>
                <p className="text-sm text-muted-foreground">Issues reported</p>
              </CardContent>
            </Card>

            {/* Endorsements */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#E31E24] to-[#C01A1F] text-white hover:shadow-xl hover:shadow-[#E31E24]/20 transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <CardHeader className="relative pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-white/80">Endorsements</CardTitle>
                  <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <ThumbsUp className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-4xl mb-1">{totalEndorsements}</div>
                <p className="text-sm text-white/60">Community support</p>
              </CardContent>
            </Card>

            {/* Approved Posts */}
            <Card className="relative overflow-hidden border-2 hover:border-[#E31E24]/50 transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <CardHeader className="relative pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-4xl mb-1">{approvedPosts}</div>
                <p className="text-sm text-muted-foreground">Active issues</p>
              </CardContent>
            </Card>
          </div>

          {/* User's Posts */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>Issues reported by {user.name}</CardDescription>
            </CardHeader>
            <CardContent>
              {userPosts.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No posts yet
                </div>
              ) : (
                <div className="space-y-3">
                  {userPosts.slice(0, 10).map((post) => (
                    <div key={post.id} onClick={() => handlePostClick(post)} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="bg-[#004080]/20 text-[#004080] border-[#004080]/30">
                            {post.category}
                          </Badge>
                        </div>
                        <p className="font-medium truncate">{post.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {post.location}, {post.city}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground ml-4 flex-shrink-0">
                        <div className="flex items-center">
                          <ThumbsUp className="h-3 w-3 mr-1 text-[#004080]" />
                          {post.endorsements}
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {post.commentsCount}
                        </div>
                        <div className="hidden sm:block">
                          {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <PostDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        post={selectedPost}
        currentUser={currentUser}
        onEndorse={handleEndorse}
        isEndorsed={selectedPost ? endorsedPosts.has(selectedPost.id) : false}
        onUserClick={(userId) => navigate(`/users/${userId}`)}
      />
    </AppLayout>
  );
}