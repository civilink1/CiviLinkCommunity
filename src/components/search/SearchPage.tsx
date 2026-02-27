import { useState, useEffect } from 'react';
import { AppLayout } from '../layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, FileText, ThumbsUp, MessageSquare, MapPin, Calendar, User } from 'lucide-react';
import { mockPosts, mockUsers, categories } from '../../lib/mockData';
import { toast } from 'sonner';

interface SearchPageProps {
  currentUser: any;
  onLogout: () => void;
}

export function SearchPage({ currentUser, onLogout }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'posts' | 'users'>('posts');
  const [selectedCategory, setSelectedCategory] = useState('all');
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

      setResults(filtered);
    } else {
      const filtered = mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
    }
  }, [searchQuery, searchType, selectedCategory]);

  const handleEndorse = (postId: string) => {
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
                <span className="text-white/80 text-sm tracking-wider uppercase">Explore</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4 text-white">
                Search
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl">
                Find reports and residents in your community
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-6">
          {/* Search Bar */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#004080]/10 flex items-center justify-center">
                  <Search className="h-5 w-5 text-[#004080]" />
                </div>
                <div>
                  <CardTitle>Search Community</CardTitle>
                  <CardDescription>Find reports, residents, and locations</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for reports, residents, locations..."
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
                    className={searchType === 'posts' ? 'bg-[#004080] hover:bg-[#003366]' : ''}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Reports
                  </Button>
                  <Button
                    variant={searchType === 'users' ? 'default' : 'outline'}
                    onClick={() => setSearchType('users')}
                    size="sm"
                    className={searchType === 'users' ? 'bg-[#004080] hover:bg-[#003366]' : ''}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Residents
                  </Button>
                </div>

                {searchType === 'posts' && (
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
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div>
            {searchQuery === '' ? (
              <Card className="border-2">
                <CardContent className="py-16 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg mb-2">Start typing to search</h3>
                  <p className="text-muted-foreground">Search for reports, residents, or locations</p>
                </CardContent>
              </Card>
            ) : results.length === 0 ? (
              <Card className="border-2">
                <CardContent className="py-16 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg mb-2">No results found</h3>
                  <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                </CardContent>
              </Card>
            ) : (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl mb-1">
                    {results.length} {searchType === 'posts' ? 'Report' : 'Resident'}{results.length !== 1 ? 's' : ''} Found
                  </h2>
                  <p className="text-sm text-muted-foreground">Showing search results for "{searchQuery}"</p>
                </div>

                {searchType === 'posts' ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {results.map((post: any) => (
                      <Card key={post.id} className="group flex flex-col border-2 bg-white hover:border-[#004080]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#004080]/10 hover:-translate-y-1">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-3">
                            <Badge variant="secondary" className="bg-[#004080]/20 text-[#004080] border-[#004080]/30 hover:bg-[#004080]/30">
                              {post.category}
                            </Badge>
                          </div>
                          <CardTitle className="line-clamp-2 group-hover:text-[#004080] transition-colors">{post.title}</CardTitle>
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
                            <div className="text-sm text-muted-foreground">
                              by <span className="text-foreground">{post.author}</span>
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
                              onClick={() => handleEndorse(post.id)}
                              className="bg-[#004080] hover:bg-[#003366] text-white"
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
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {results.map((user: any) => (
                      <Card key={user.id} className="group border-2 bg-white hover:border-[#004080]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#004080]/10 hover:-translate-y-1">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#004080]/10 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-[#004080]" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="group-hover:text-[#004080] transition-colors">{user.name}</CardTitle>
                              <CardDescription className="truncate">{user.email}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3 text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2 text-[#E31E24]" />
                              {user.city}, {user.state}
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <span className="text-muted-foreground">Contribution Score</span>
                              <Badge className="bg-[#004080] hover:bg-[#003366]">{user.contributionScore}</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <span className="text-muted-foreground">Member Since</span>
                              <span>{new Date(user.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
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
      </div>
    </AppLayout>
  );
}
