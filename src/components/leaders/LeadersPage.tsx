import { useState } from 'react';
import { AppLayout } from '../layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Mail, Phone, Search, Building2, Users } from 'lucide-react';
import { mockLeaders } from '../../lib/mockData';

interface LeadersPageProps {
  currentUser: any;
  onLogout: () => void;
}

export function LeadersPage({ currentUser, onLogout }: LeadersPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = ['all', ...Array.from(new Set(mockLeaders.map(l => l.department)))];

  const filteredLeaders = mockLeaders.filter(leader => {
    const matchesSearch = leader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         leader.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || leader.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

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
                <span className="text-white/80 text-sm tracking-wider uppercase">Board Directory</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4 text-white">
                Board & Management
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl">
                Connect with HOA board members and property managers
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-6">
          {/* Filters */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#004080]/10 flex items-center justify-center">
                  <Search className="h-5 w-5 text-[#004080]" />
                </div>
                <div>
                  <CardTitle>Find Board Members</CardTitle>
                  <CardDescription>Search by name, title, or role</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept === 'all' ? 'All Departments' : dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Leaders List */}
          {filteredLeaders.length === 0 ? (
            <Card className="border-2">
              <CardContent className="py-16 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg mb-2">No leaders found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredLeaders.map((leader) => (
                <Card key={leader.id} className="group flex flex-col border-2 bg-white hover:border-[#004080]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#004080]/10 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-[#004080]/10 rounded-xl flex items-center justify-center text-2xl mb-3">
                        {leader.icon}
                      </div>
                      <Building2 className="h-5 w-5 text-[#004080]" />
                    </div>
                    <CardTitle className="line-clamp-1 group-hover:text-[#004080] transition-colors">{leader.name}</CardTitle>
                    <CardDescription className="line-clamp-1">
                      {leader.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="space-y-3 mb-4">
                      <div className="p-3 bg-[#004080]/5 rounded-lg border border-[#004080]/10">
                        <p className="text-sm font-medium">{leader.department}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">📍 {leader.city}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <a href={`mailto:${leader.email}`}>
                        <Button variant="outline" className="w-full justify-start border-2 hover:border-[#004080] hover:bg-[#004080]/5" size="sm">
                          <Mail className="h-4 w-4 mr-2" />
                          <span className="truncate">{leader.email}</span>
                        </Button>
                      </a>
                      <a href={`tel:${leader.phone}`}>
                        <Button variant="outline" className="w-full justify-start border-2 hover:border-[#004080] hover:bg-[#004080]/5" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          {leader.phone}
                        </Button>
                      </a>
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
