import { useState } from 'react';
import { AppLayout } from '../layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Mail, Phone, Search, Building2 } from 'lucide-react';
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
      <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl mb-2">Local Leaders</h1>
          <p className="text-muted-foreground">
            Connect with city officials and department leaders
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Find Leaders</CardTitle>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLeaders.map((leader) => (
            <Card key={leader.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl mb-3">
                    {leader.icon}
                  </div>
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardTitle className="line-clamp-1">{leader.name}</CardTitle>
                <CardDescription className="line-clamp-1">
                  {leader.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-3 mb-4">
                  <div className="p-2 bg-muted rounded-lg">
                    <p className="text-sm">{leader.department}</p>
                  </div>
                  <div className="p-2 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">📍 {leader.city}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <a href={`mailto:${leader.email}`}>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      {leader.email}
                    </Button>
                  </a>
                  <a href={`tel:${leader.phone}`}>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      {leader.phone}
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLeaders.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No leaders found matching your search</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
