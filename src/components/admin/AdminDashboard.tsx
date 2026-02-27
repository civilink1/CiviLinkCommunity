import { Shield, FileText, Users, ThumbsUp, CheckCircle, XCircle, Clock, Sparkles, MapPin, Calendar } from 'lucide-react';
import { mockPosts, mockUsers, getStatusColor, getStatusLabel } from '../../lib/mockData';
import { toast } from 'sonner';

interface AdminDashboardProps {
  currentUser: any;
  onLogout: () => void;
}

export function AdminDashboard({ currentUser, onLogout }: AdminDashboardProps) {
  const [posts, setPosts] = useState(mockPosts);
  const [users, setUsers] = useState(mockUsers);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Calculate stats
  const totalPosts = posts.length;
  const underReviewPosts = posts.filter(p => p.status === 'under-review');
  const approvedPosts = posts.filter(p => p.status === 'approved');
  const rejectedPosts = posts.filter(p => p.status === 'rejected');
  const totalUsers = users.filter(u => u.role !== 'admin').length;
  const totalEndorsements = posts.reduce((sum, post) => sum + post.endorsements, 0);

  // Simulate AI pre-screening
  const getAIScreening = (post: any) => {
    const spamKeywords = ['spam', 'advertisement', 'buy now', 'click here'];
    const isSpam = spamKeywords.some(keyword => 
      post.title.toLowerCase().includes(keyword) || 
      post.description.toLowerCase().includes(keyword)
    );

    if (isSpam) {
      return {
        recommendation: 'reject',
        confidence: 0.85,
        reasoning: 'Content appears to be spam or off-topic. Does not relate to neighborhood issues.'
      };
    }

    return {
      recommendation: 'approve',
      confidence: 0.92,
      reasoning: 'Content appears to be a legitimate neighborhood issue. Addresses community maintenance or shared-space concerns with specific details.'
    };
  };

  const handleApprove = (postId: string) => {
    setPosts(posts.map(p => 
      p.id === postId ? { ...p, status: 'approved' } : p
    ));
    toast.success('Report approved successfully');
  };

  const handleReject = (postId: string, reason: string) => {
    setPosts(posts.map(p => 
      p.id === postId ? { ...p, status: 'rejected' } : p
    ));
    toast.success('Report rejected');
    setRejectionReason('');
    setSelectedPost(null);
  };

  const handleStatusChange = (postId: string, newStatus: string) => {
    setPosts(posts.map(p => 
      p.id === postId ? { ...p, status: newStatus } : p
    ));
    toast.success('Report status updated');
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(u =>
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    ));
    toast.success('Resident status updated');
  };

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout}>
      <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage reports, residents, and community content
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{totalPosts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-yellow-600">{underReviewPosts.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Residents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{totalUsers}</div>
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
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              📋 Pending Reports ({underReviewPosts.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              📊 All Reports
            </TabsTrigger>
            <TabsTrigger value="users">
              👥 Residents
            </TabsTrigger>
          </TabsList>

          {/* Pending Posts Tab */}
          <TabsContent value="pending" className="space-y-4">
            {underReviewPosts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No pending reports to review</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {underReviewPosts.map((post) => {
                  const aiScreening = getAIScreening(post);
                  
                  return (
                    <Card key={post.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">{post.category}</Badge>
                              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                                Pending Review
                              </Badge>
                            </div>
                            <CardTitle>{post.title}</CardTitle>
                            <CardDescription className="mt-2">
                              {post.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Post Details */}
                        <div className="grid gap-2 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            {post.location}, {post.city}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            Submitted on {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-muted-foreground">
                            Author: {post.authorName}
                          </div>
                        </div>

                        {/* AI Pre-screening */}
                        <div className={`p-4 rounded-lg ${aiScreening.recommendation === 'approve' ? 'bg-green-50 dark:bg-green-950/20' : 'bg-red-50 dark:bg-red-950/20'}`}>
                          <div className="flex items-start gap-2">
                            <Sparkles className={`h-5 w-5 mt-0.5 ${aiScreening.recommendation === 'approve' ? 'text-green-600' : 'text-red-600'}`} />
                            <div className="flex-1">
                              <p className={`${aiScreening.recommendation === 'approve' ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'} mb-2`}>
                                <strong>AI Pre-screening Result:</strong> {aiScreening.recommendation === 'approve' ? 'Recommend Approval' : 'Recommend Rejection'}
                              </p>
                              <p className="text-sm mb-2">
                                <strong>Confidence:</strong> {(aiScreening.confidence * 100).toFixed(0)}%
                              </p>
                              <p className="text-sm">
                                <strong>Reasoning:</strong> {aiScreening.reasoning}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => handleApprove(post.id)}
                            className="flex-1"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                className="flex-1"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Reject Report</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Please provide a reason for rejecting this report.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="space-y-2">
                                <Label>Rejection Reason</Label>
                                <Textarea
                                  placeholder="Explain why this post is being rejected..."
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  rows={4}
                                />
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setRejectionReason('')}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleReject(post.id, rejectionReason)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={!rejectionReason}
                                >
                                  Reject Report
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* All Posts Tab */}
          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{post.category}</Badge>
                          <Badge className={getStatusColor(post.status)}>
                            {getStatusLabel(post.status)}
                          </Badge>
                        </div>
                        <CardTitle>{post.title}</CardTitle>
                        <CardDescription className="mt-2 line-clamp-2">
                          {post.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>{post.location}, {post.city}</p>
                        <p>By {post.authorName} • {new Date(post.createdAt).toLocaleDateString()}</p>
                        <div className="flex gap-4">
                          <span>👍 {post.endorsements} endorsements</span>
                          <span>💬 {post.commentsCount} comments</span>
                        </div>
                      </div>
                      <Select
                        value={post.status}
                        onValueChange={(value) => handleStatusChange(post.id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-review">Under Review</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {users.filter(u => u.role !== 'admin').map((user) => (
                <Card key={user.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                      </div>
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span>{user.city}, {user.state}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Joined</span>
                        <span>{new Date(user.joinDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contribution Score</span>
                        <Badge>{user.contributionScore}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Posts</span>
                        <span>{posts.filter(p => p.authorId === user.id).length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}