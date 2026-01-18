import { useState } from 'react';
import { FileText, ThumbsUp, MessageSquare, MapPin, Calendar, Trash2, PlusCircle, Sparkles, TrendingUp } from 'lucide-react';
import { mockPosts, getStatusColor, getStatusLabel } from '../../lib/mockData';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { AppLayout } from '../layout/AppLayout';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

interface PostsPageProps {
  currentUser: any;
  onLogout: () => void;
}

export function PostsPage({ currentUser, onLogout }: PostsPageProps) {
  const [posts, setPosts] = useState(mockPosts);
  
  // Get only user's posts
  const userPosts = posts.filter(p => p.authorId === currentUser?.id);

  // Calculate stats
  const totalPosts = userPosts.length;
  const approvedPosts = userPosts.filter(p => p.status === 'approved').length;
  const rejectedPosts = userPosts.filter(p => p.status === 'rejected').length;
  const totalEndorsements = userPosts.reduce((sum, post) => sum + post.endorsements, 0);

  const handleDelete = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
    toast.success('Post deleted successfully');
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
                <span className="text-white/80 text-sm tracking-wider uppercase">Your Contributions</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4 text-white">
                My Posts
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl">
                Manage and track your civic issue reports
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-8">
          {/* Stats Overview */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {/* Total Posts Card */}
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
                <p className="text-sm text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            {/* Approved Posts Card */}
            <Card className="relative overflow-hidden border-2 hover:border-[#004080]/50 transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <CardHeader className="relative pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-4xl mb-1">{approvedPosts}</div>
                <p className="text-sm text-muted-foreground">Published</p>
              </CardContent>
            </Card>

            {/* Rejected Posts Card */}
            <Card className="relative overflow-hidden border-2 hover:border-[#E31E24]/50 transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <CardHeader className="relative pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
                  <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-4xl mb-1">{rejectedPosts}</div>
                <p className="text-sm text-muted-foreground">Not published</p>
              </CardContent>
            </Card>
          </div>

          {/* Posts List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl mb-1">Your Posts</h2>
                <p className="text-sm text-muted-foreground">All your civic issue reports</p>
              </div>
            </div>

            {userPosts.length === 0 ? (
              <Card className="border-2">
                <CardContent className="py-16 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg mb-2">No posts yet</h3>
                  <p className="text-muted-foreground mb-6">You haven't created any posts yet</p>
                  <Link to="/posts/create">
                    <Button className="bg-[#004080] hover:bg-[#003366] text-white">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Your First Post
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {userPosts.map((post) => (
                  <Card 
                    key={post.id} 
                    className="group flex flex-col border-2 bg-white hover:border-[#004080]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#004080]/10 hover:-translate-y-1"
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
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Post?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your post
                                and remove it from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(post.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}