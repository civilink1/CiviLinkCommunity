import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ThumbsUp, MessageSquare, MapPin, Calendar, User, ArrowLeft, Send } from 'lucide-react';
import { mockPosts, mockUsers } from '../../lib/mockData';
import { toast } from 'sonner';
import { AppLayout } from '../layout/AppLayout';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Avatar } from '../ui/avatar';

interface PostDetailPageProps {
  currentUser: any;
  onLogout: () => void;
}

/**
 * PostDetailPage Component
 * Displays full post details with comments and interactions
 * 
 * GitHub Copilot Integration Notes:
 * - TODO: Replace mockPosts.find() with API call: GET /api/posts/:postId
 * - TODO: Replace mockUsers.find() with API call: GET /api/users/:userId
 * - TODO: Implement real comment submission: POST /api/posts/:postId/comments
 * - TODO: Implement real endorsement: POST /api/posts/:postId/endorse
 * - TODO: Add real-time comment updates with WebSocket
 */
export function PostDetailPage({ currentUser, onLogout }: PostDetailPageProps) {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');
  const [isEndorsed, setIsEndorsed] = useState(false);

  // TODO: Replace with API call - GET /api/posts/:postId
  const post = mockPosts.find(p => p.id === postId);
  
  // TODO: Replace with API call - GET /api/users/:userId
  const author = mockUsers.find(u => u.id === post?.authorId);

  // Mock comments
  const [comments] = useState([
    {
      id: '1',
      postId: postId,
      authorId: '2',
      authorName: 'Jane Smith',
      text: 'Thanks for reporting this! I noticed the same issue near my unit last week.',
      createdAt: '2024-01-05T14:30:00',
    },
    {
      id: '2',
      postId: postId,
      authorId: '3',
      authorName: 'Mike Johnson',
      text: 'The board mentioned this at the last meeting. It should be addressed soon.',
      createdAt: '2024-01-05T16:45:00',
    }
  ]);

  if (!post) {
    return (
      <AppLayout currentUser={currentUser} onLogout={onLogout}>
        <div className="container mx-auto px-4 py-8">
          <Card className="border-2">
            <CardContent className="py-16 text-center">
              <h2 className="text-2xl mb-4">Report not found</h2>
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

  // TODO: Replace with API call - POST /api/posts/:postId/endorse
  const handleEndorse = () => {
    setIsEndorsed(!isEndorsed);
    toast.success(isEndorsed ? 'Endorsement removed' : 'Post endorsed!');
  };

  // TODO: Replace with API call - POST /api/posts/:postId/comments
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    
    // Mock comment submission
    toast.success('Comment posted!');
    setCommentText('');
  };

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout}>
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <div className="bg-background border-b">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Badge variant="secondary" className="bg-[#004080]/20 text-[#004080] border-[#004080]/30 mb-3">
                  {post.category}
                </Badge>
                <h1 className="text-3xl md:text-4xl mb-4">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#E31E24]" />
                    {post.location}, {post.city}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Post Content */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Issue Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{post.description}</p>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="border-2">
                <CardContent className="py-6">
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={handleEndorse}
                      variant={isEndorsed ? "default" : "outline"}
                      className={isEndorsed ? "bg-[#004080] hover:bg-[#003366]" : "border-2"}
                    >
                      <ThumbsUp className={`h-4 w-4 mr-2 ${isEndorsed ? 'fill-current' : ''}`} />
                      {isEndorsed ? 'Endorsed' : 'Endorse'} ({post.endorsements + (isEndorsed ? 1 : 0)})
                    </Button>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>{comments.length} Comments</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                  <CardDescription>Join the discussion about this issue</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add Comment Form */}
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <Textarea
                      placeholder="Share your thoughts or provide additional information..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                    <Button 
                      type="submit" 
                      className="bg-[#004080] hover:bg-[#003366]"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Post Comment
                    </Button>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-4 pt-4 border-t">
                    {comments.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No comments yet. Be the first to comment!
                      </p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 p-4 rounded-lg bg-muted/50">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-[#004080]/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-[#004080]" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Link 
                                to={`/users/${comment.authorId}`}
                                className="font-medium hover:text-[#004080] transition-colors"
                              >
                                {comment.authorName}
                              </Link>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed">{comment.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author Info */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-base">Posted By</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link to={`/users/${post.authorId}`}>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-[#004080]/10 flex items-center justify-center flex-shrink-0">
                        <User className="h-6 w-6 text-[#004080]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium hover:text-[#004080] transition-colors">
                          {post.authorName}
                        </p>
                        {author && (
                          <>
                            <p className="text-sm text-muted-foreground truncate">{author.city}, {author.state}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                Score: {author.contributionScore}
                              </Badge>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              {/* Post Stats */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-base">Engagement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4 text-[#004080]" />
                      <span className="text-sm">Endorsements</span>
                    </div>
                    <span className="font-semibold">{post.endorsements}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm">Comments</span>
                    </div>
                    <span className="font-semibold">{comments.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
