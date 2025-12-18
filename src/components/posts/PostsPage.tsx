import { FileText, ThumbsUp, MessageSquare, MapPin, Calendar, Trash2, PlusCircle } from 'lucide-react';
import { mockPosts, getStatusColor, getStatusLabel } from '../../lib/mockData';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

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
  const underReviewPosts = userPosts.filter(p => p.status === 'under-review').length;
  const approvedPosts = userPosts.filter(p => p.status === 'approved').length;
  const rejectedPosts = userPosts.filter(p => p.status === 'rejected').length;
  const totalEndorsements = userPosts.reduce((sum, post) => sum + post.endorsements, 0);

  const handleDelete = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
    toast.success('Post deleted successfully');
  };

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout}>
      <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">My Posts</h1>
            <p className="text-muted-foreground">
              Manage and track your civic issue reports
            </p>
          </div>
          <Link to="/posts/create">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{totalPosts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Endorsements</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{totalEndorsements}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Approved</CardTitle>
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{approvedPosts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Under Review</CardTitle>
              <div className="h-3 w-3 rounded-full bg-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{underReviewPosts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Posts by Status */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-blue-50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="text-sm text-blue-700 dark:text-blue-400">
                🔵 Under Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{underReviewPosts}</div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950/20">
            <CardHeader>
              <CardTitle className="text-sm text-green-700 dark:text-green-400">
                🟢 Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{approvedPosts}</div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 dark:bg-red-950/20">
            <CardHeader>
              <CardTitle className="text-sm text-red-700 dark:text-red-400">
                🔴 Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{rejectedPosts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        <div>
          <h2 className="text-xl mb-4">Your Posts</h2>
          {userPosts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">You haven't created any posts yet</p>
                <Link to="/posts/create">
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Your First Post
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userPosts.map((post) => (
                <Card key={post.id} className="flex flex-col">
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
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {post.location}, {post.city}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {post.endorsements}
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {post.commentsCount}
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="text-destructive">
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
    </AppLayout>
  );
}