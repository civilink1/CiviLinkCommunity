import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { User, MapPin, Calendar, Award, TrendingUp, Mail, MapPinned } from 'lucide-react';
import { mockUsers, mockPosts } from '../../lib/mockData';
import { POST_STATUSES } from '../../config/constants';
import { useState } from 'react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onPostClick?: (postId: string) => void;
}

export function UserProfileModal({ isOpen, onClose, userId, onPostClick }: UserProfileModalProps) {
  const user = mockUsers.find(u => u.id === userId);
  const userPosts = mockPosts.filter(p => p.authorId === userId);

  if (!user) return null;

  // Calculate user statistics
  const totalEndorsements = userPosts.reduce((sum, post) => sum + (post.endorsements || 0), 0);
  const totalComments = userPosts.reduce((sum, post) => sum + (post.comments || 0), 0);
  const resolvedIssues = userPosts.filter(p => p.status === 'completed').length;

  const getStatusInfo = (statusValue: string) => {
    const status = POST_STATUSES.find(s => s.value === statusValue);
    return status || POST_STATUSES[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden">
        <div className="overflow-y-auto max-h-[90vh] px-6 py-6 custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-2xl">Citizen Profile</DialogTitle>
            <DialogDescription className="sr-only">
              View citizen profile and civic engagement history
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* User Header */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#004080] to-[#003366] flex items-center justify-center flex-shrink-0">
                    <User className="h-12 w-12 text-white" />
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="secondary" 
                            className={`${user.role === 'admin' ? 'bg-[#E31E24]/20 text-[#E31E24]' : 'bg-[#004080]/20 text-[#004080]'}`}
                          >
                            {user.role === 'admin' ? 'Administrator' : 'Citizen'}
                          </Badge>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Member since {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-gradient-to-br from-amber-50 to-amber-100 px-4 py-2 rounded-lg border-2 border-amber-200">
                        <Award className="h-5 w-5 text-amber-600" />
                        <div>
                          <p className="text-xs text-amber-800 font-medium">Contribution Score</p>
                          <p className="text-lg font-bold text-amber-900">{user.contributionScore}</p>
                        </div>
                      </div>
                    </div>

                    {/* Contact & Location Info */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center flex-shrink-0 cursor-help border-2 border-[#004080]/20">
                                <Mail className="h-5 w-5 text-[#004080]" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p className="font-medium">Email</p>
                              <p className="text-xs">{user.email}</p>
                            </TooltipContent>
                          </Tooltip>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-muted-foreground font-medium mb-0.5">Email</p>
                            <p className="text-sm font-medium truncate">{user.email.split('@')[0]}...</p>
                          </div>
                        </div>
                        
                        <div className="h-8 w-px bg-border" />
                        
                        <div className="flex items-center gap-3">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center flex-shrink-0 cursor-help border-2 border-[#004080]/20">
                                <MapPinned className="h-5 w-5 text-[#004080]" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p className="font-medium">Location</p>
                              <p className="text-xs">{user.city}, {user.state} {user.zipCode}</p>
                            </TooltipContent>
                          </Tooltip>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-muted-foreground font-medium mb-0.5">Location</p>
                            <p className="text-sm font-medium truncate">{user.city.substring(0, 1)}...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="border-2">
                <CardContent className="pt-6 pb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#004080] mb-1">{userPosts.length}</div>
                    <p className="text-sm text-muted-foreground whitespace-nowrap">Issues Reported</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-6 pb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-1">{resolvedIssues}</div>
                    <p className="text-sm text-muted-foreground whitespace-nowrap">Issues Resolved</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-6 pb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">{totalEndorsements}</div>
                    <p className="text-sm text-muted-foreground">Total<br />Endorsements</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-6 pb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{totalComments}</div>
                    <p className="text-sm text-muted-foreground whitespace-nowrap">Total Comments</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User's Posts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Reported Issues</h3>
                <Badge variant="secondary" className="bg-muted">
                  {userPosts.length} {userPosts.length === 1 ? 'issue' : 'issues'}
                </Badge>
              </div>

              {userPosts.length === 0 ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="py-12">
                    <div className="text-center text-muted-foreground">
                      <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>This user hasn't reported any issues yet</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {userPosts.map((post) => {
                    const statusInfo = getStatusInfo(post.status);
                    return (
                      <Card 
                        key={post.id} 
                        className="border-2 hover:border-[#004080]/50 transition-all cursor-pointer"
                        onClick={() => {
                          if (onPostClick) {
                            onClose();
                            onPostClick(post.id);
                          }
                        }}
                      >
                        <CardContent className="py-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="bg-[#004080]/20 text-[#004080] border-[#004080]/30">
                                  {post.category}
                                </Badge>
                                <Badge className={`${statusInfo.color} border-0`}>
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <h4 className="font-semibold mb-1 line-clamp-1">{post.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{post.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{post.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(post.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  <span>{post.endorsements} endorsements</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="hover:bg-muted"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}