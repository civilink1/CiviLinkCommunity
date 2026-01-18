import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Card, CardContent } from '../ui/card';
import { MapPin, Calendar, ThumbsUp, MessageSquare, User, X, Send, Clock, CheckCircle2, Edit } from 'lucide-react';
import { getStatusColor, getStatusLabel, mockUsers } from '../../lib/mockData';
import { POST_STATUSES } from '../../config/constants';
import { toast } from 'sonner';

interface Comment {
  id: string;
  authorId: string;
  author: string;
  text: string;
  date: string;
}

interface PostDetailModalProps {
  post: any;
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onEndorse?: (postId: string) => void; // Optional - not needed for city gov dashboard
  isEndorsed?: boolean; // Optional - not needed for city gov dashboard
  onUserClick?: (userId: string) => void; // Optional callback for user profile navigation
  onStatusUpdateClick?: () => void; // Optional - for city gov to update status
  isCityGov?: boolean; // Flag to show city gov specific features
}

export function PostDetailModal({ post, isOpen, onClose, currentUser, onEndorse, isEndorsed = false, onUserClick, onStatusUpdateClick, isCityGov = false }: PostDetailModalProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      authorId: '103',
      author: 'Emily Chen',
      text: 'This is a serious issue that needs immediate attention. Thanks for reporting!',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      authorId: '104',
      author: 'Michael Torres',
      text: 'I noticed this too! It\'s been getting worse over the past few weeks.',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      authorId: currentUser?.id || 'Anonymous',
      author: currentUser?.name || 'Anonymous',
      text: newComment,
      date: new Date().toISOString(),
    };

    setComments([...comments, comment]);
    setNewComment('');
    toast.success('Comment added!');
  };

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <div className="overflow-y-auto max-h-[90vh] px-6 py-6 custom-scrollbar">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-[#004080]/20 text-[#004080] border-[#004080]/30">
                  {post.category}
                </Badge>
                <Badge className={`${getStatusColor(post.status)} border-0`}>
                  {getStatusLabel(post.status)}
                </Badge>
              </div>
              <DialogTitle className="text-2xl leading-tight">{post.title}</DialogTitle>
              <DialogDescription className="sr-only">
                View full details, comments, and endorse this civic issue
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Post Image */}
          <div className="w-full h-80 bg-gradient-to-br from-zinc-100 to-zinc-200 rounded-xl overflow-hidden border-2">
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto mb-3 text-zinc-400" />
                <p className="text-sm">Photo would appear here</p>
                <p className="text-xs text-muted-foreground mt-1">{post.location}</p>
              </div>
            </div>
          </div>

          {/* Post Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{post.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg border-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#E31E24]" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium">{post.location}, {post.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Reported</p>
                  <p className="font-medium">
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Reported by</p>
                  <button 
                    onClick={() => {
                      onClose();
                      if (onUserClick) {
                        onUserClick(post.authorId);
                      }
                    }}
                    className="font-medium hover:text-[#004080] transition-colors cursor-pointer text-left"
                  >
                    {post.author}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-[#004080]" />
                <div>
                  <p className="text-xs text-muted-foreground">Community Support</p>
                  <p className="font-medium">{post.endorsements} endorsements</p>
                </div>
              </div>
            </div>

            {/* Endorse Button - Only show for citizens */}
            <div className="flex items-center gap-3">
              {onEndorse && (
                <Button
                  onClick={() => onEndorse(post.id)}
                  className={
                    isEndorsed
                      ? 'bg-[#004080] hover:bg-[#003366] flex-1'
                      : 'bg-transparent border-2 border-[#004080] text-[#004080] hover:bg-[#004080] hover:text-white flex-1'
                  }
                >
                  <ThumbsUp className={`h-4 w-4 mr-2 ${isEndorsed ? 'fill-current' : ''}`} />
                  {isEndorsed ? 'Endorsed' : 'Endorse This Issue'}
                </Button>
              )}
            </div>

            {/* City Gov Status Update Button - Only show for city gov */}
            {isCityGov && onStatusUpdateClick && (
              <Card className="border-2 border-[#004080]/50 bg-gradient-to-br from-[#004080]/5 to-[#004080]/10">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Edit className="h-5 w-5 text-[#004080]" />
                        <h4 className="font-semibold text-[#004080]">City Government Actions</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Update the status of this issue and notify the citizen
                      </p>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusUpdateClick();
                      }}
                      className="bg-gradient-to-r from-[#004080] to-[#003366] hover:from-[#003366] hover:to-[#002855] text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-6"
                      size="lg"
                    >
                      <Edit className="h-5 w-5 mr-2" />
                      Update Status
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Status History Timeline - Only show if statusHistory exists */}
          {post.statusHistory && post.statusHistory.length > 0 && (
            <div className="space-y-4 border-t-2 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-[#004080]" />
                <h3 className="font-semibold text-lg">Status History</h3>
              </div>
              <div className="relative space-y-6">
                {/* Timeline line */}
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#004080] via-blue-300 to-gray-300" />
                
                {post.statusHistory.map((historyItem: any, index: number) => {
                  const statusObj = POST_STATUSES.find(s => s.value === historyItem.status);
                  const isLatest = index === post.statusHistory.length - 1;
                  
                  return (
                    <div key={index} className="relative pl-12">
                      {/* Timeline dot */}
                      <div className={`absolute left-0 top-1 h-10 w-10 rounded-full border-4 border-background flex items-center justify-center ${
                        isLatest 
                          ? 'bg-gradient-to-br from-[#004080] to-[#003366]' 
                          : statusObj?.color.includes('red')
                            ? 'bg-gradient-to-br from-red-500 to-red-600'
                            : statusObj?.color.includes('green') || statusObj?.color.includes('emerald')
                              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                              : statusObj?.color.includes('yellow')
                                ? 'bg-gradient-to-br from-yellow-500 to-yellow-600'
                                : statusObj?.color.includes('purple')
                                  ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                                  : 'bg-gradient-to-br from-blue-500 to-blue-600'
                      }`}>
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </div>
                      
                      <Card className={`border-2 ${isLatest ? 'border-[#004080] bg-blue-50/50' : ''}`}>
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className={`${statusObj?.color} border-0`}>
                                {statusObj?.label}
                              </Badge>
                              {isLatest && (
                                <Badge className="bg-[#004080] text-white border-0">
                                  Current Status
                                </Badge>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              {new Date(historyItem.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed mb-2">{historyItem.note}</p>
                          <p className="text-xs text-muted-foreground">
                            Updated by: <span className="font-medium">{historyItem.updatedBy}</span>
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="space-y-4 border-t-2 pt-6">
            <h3 className="font-semibold text-lg">Comments ({comments.length})</h3>
            
            {/* Add Comment */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add your comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-24 resize-none"
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleAddComment}
                      className="bg-[#004080] hover:bg-[#003366]"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Post Comment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <Card key={comment.id} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#004080] to-[#003366] flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {comment.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <button 
                            onClick={() => {
                              onClose();
                              if (onUserClick) {
                                onUserClick(comment.authorId);
                              }
                            }}
                            className="font-semibold hover:text-[#004080] transition-colors cursor-pointer"
                          >
                            {comment.author}
                          </button>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}