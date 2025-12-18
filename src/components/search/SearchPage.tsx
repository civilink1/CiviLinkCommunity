import { useState, useEffect } from 'react';
import { AppLayout } from '../layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, FileText, ThumbsUp, MessageSquare, MapPin, Calendar, User } from 'lucide-react';
import { mockPosts, mockUsers, categories, getStatusColor, getStatusLabel } from '../../lib/mockData';
import { toast } from 'sonner';

interface SearchPageProps {
  currentUser: any;
  onLogout: () => void;
}

export function SearchPage({ currentUser, onLogout }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'posts' | 'users'>('posts');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!searchQuery) {
      setResults([]);
      return;
    }

    if (searchType === 'posts') {
      let filtered = mockPosts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.city.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (selectedCategory !== 'all') {
        filtered = filtered.filter(post => post.category === selectedCategory);
      }

      if (selectedStatus !== 'all') {
        filtered = filtered.filter(post => post.status === selectedStatus);
      }

      setResults(filtered);
    } else {
      const filtered = mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
    }
  }, [searchQuery, searchType, selectedCategory, selectedStatus]);

  const handleEndorse = (postId: string) => {
    toast.success('Post endorsed!');
  };

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout}>
      <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl mb-2">Search</h1>
          <p className="text-muted-foreground">
            Find posts and users across the platform
          </p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardHeader>
            <CardTitle>Search CiviLink</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for posts, users, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-lg h-12"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex gap-2">
                <Button
                  variant={searchType === 'posts' ? 'default' : 'outline'}
                  onClick={() => setSearchType('posts')}
                  size="sm"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Posts
                </Button>
                <Button
                  variant={searchType === 'users' ? 'default' : 'outline'}
                  onClick={() => setSearchType('users')}
                  size="sm"
                >
                  <User className="h-4 w-4 mr-2" />
                  Users
                </Button>
              </div>

              {searchType === 'posts' && (
                <>
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

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="under-review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div>
          {searchQuery === '' ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Start typing to search</p>
              </CardContent>
            </Card>
          ) : results.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
              </CardContent>
            </Card>
          ) : (
            <div>
              <h2 className="text-xl mb-4">
                {results.length} {searchType === 'posts' ? 'Post' : 'User'}{results.length !== 1 ? 's' : ''} Found
              </h2>

              {searchType === 'posts' ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {results.map((post: any) => (
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
                          <div className="text-sm text-muted-foreground">
                            By {post.authorName}
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
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEndorse(post.id)}
                          >
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Endorse
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {results.map((user: any) => (
                    <Card key={user.id}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle>{user.name}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1" />
                            {user.city}, {user.state}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Contribution Score</span>
                            <Badge>{user.contributionScore}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Member Since</span>
                            <span>{new Date(user.joinDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}