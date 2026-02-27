import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Calendar, Award, Save, FileText, ThumbsUp, Sparkles } from 'lucide-react';
import { mockPosts } from '../../lib/mockData';
import { toast } from 'sonner';
import { AppLayout } from '../layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { PostDetailModal } from '../posts/PostDetailModal';

interface ProfilePageProps {
  currentUser: any;
  onLogout: () => void;
}

export function ProfilePage({ currentUser, onLogout }: ProfilePageProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [endorsedPosts, setEndorsedPosts] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    unit: currentUser?.unit || '',
    bio: ''
  });

  // Get user stats
  const userPosts = mockPosts.filter(p => p.authorId === currentUser?.id);
  const totalPosts = userPosts.length;
  const totalEndorsements = userPosts.reduce((sum, post) => sum + post.endorsements, 0);
  const approvedPosts = userPosts.filter(p => p.status === 'approved').length;

  const handleSave = () => {
    // Update user data (in a real app, this would make an API call)
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

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
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi0yLjY4NiLTYgNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-40"></div>
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 relative">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-12 bg-[#E31E24] rounded-full"></div>
                <span className="text-white/80 text-sm tracking-wider uppercase">Your Account</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4 text-white">
                My Profile
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl">
                Manage your account and view your contribution history
              </p>
              {!isEditing && (
                <div className="mt-6">
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="bg-[#E31E24] hover:bg-[#C01A1F] text-white border-0 transition-all duration-200 hover:shadow-lg hover:shadow-[#E31E24]/30"
                  >
                    Edit Profile
                  </Button>
                </div>
              )}
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
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-4xl mb-1">{currentUser?.contributionScore || 0}</div>
                <p className="text-sm text-white/60">Keep contributing!</p>
              </CardContent>
            </Card>

            {/* Total Posts */}
            <Card className="relative overflow-hidden border-2 hover:border-[#004080]/50 transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#004080]/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <CardHeader className="relative pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
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

          {/* Profile Card */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#004080]/10 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-[#004080]" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{currentUser?.name}</CardTitle>
                  <CardDescription className="text-base">{currentUser?.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Unit / Lot #</Label>
                    <Input
                      value={formData.unit}
                      placeholder="e.g., Unit 4B or Lot 12"
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea
                      placeholder="Tell us about yourself..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="bg-[#004080] hover:bg-[#003366] text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="border-2">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentUser?.unit && (
                    <div className="flex items-center gap-2 text-muted-foreground p-3 bg-muted rounded-lg">
                      <MapPin className="h-4 w-4 text-[#E31E24]" />
                      {currentUser.unit}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground p-3 bg-muted rounded-lg">
                    <Calendar className="h-4 w-4" />
                    Member since {new Date(currentUser?.joinDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent contributions to the community</CardDescription>
            </CardHeader>
            <CardContent>
              {userPosts.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No reports yet. Start contributing to your community!
                </div>
              ) : (
                <div className="space-y-3">
                  {userPosts.slice(0, 5).map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer" onClick={() => handlePostClick(post)}>
                      <div className="flex-1">
                        <p className="font-medium">{post.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {post.category} • {post.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <ThumbsUp className="h-3 w-3 mr-1 text-[#004080]" />
                          {post.endorsements}
                        </div>
                        <div>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <PostDetailModal post={selectedPost} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} currentUser={currentUser} onEndorse={handleEndorse} isEndorsed={selectedPost ? endorsedPosts.has(selectedPost.id) : false} onUserClick={(userId) => navigate(`/users/${userId}`)} />
    </AppLayout>
  );
}