// Mock data for the CiviLink application

export const mockUsers = [
  {
    id: '1',
    email: 'civilink1357@gmail.com',
    password: 'AryanVrinda1',
    name: 'Admin User',
    role: 'admin',
    city: 'San Francisco',
    state: 'CA',
    address: '123 Main St',
    zipCode: '94102',
    joinDate: '2024-01-01',
    contributionScore: 850
  }
];

export const mockPosts: any[] = [];

export const mockNotifications: any[] = [];

export const mockLeaders = [
  {
    id: '1',
    name: 'Mayor London Breed',
    title: 'Mayor',
    department: 'Mayor & Mayor Pro Tem',
    city: 'San Francisco',
    email: 'mayor@sfgov.org',
    phone: '(415) 554-6141',
    icon: '🏛️'
  },
  {
    id: '2',
    name: 'Carla Short',
    title: 'Public Works Director',
    department: 'Infrastructure Department',
    city: 'San Francisco',
    email: 'publicworks@sfgov.org',
    phone: '(415) 554-6920',
    icon: '🏗️'
  },
  {
    id: '3',
    name: 'Jeffrey Tumlin',
    title: 'Transportation Director',
    department: 'Transportation Department',
    city: 'San Francisco',
    email: 'transportation@sfgov.org',
    phone: '(415) 701-4500',
    icon: '🚗'
  },
  {
    id: '4',
    name: 'Phil Ginsburg',
    title: 'Recreation and Parks Director',
    department: 'Parks & Recreation',
    city: 'San Francisco',
    email: 'parks@sfgov.org',
    phone: '(415) 831-2700',
    icon: '🌳'
  },
  {
    id: '5',
    name: 'William Scott',
    title: 'Chief of Police',
    department: 'Public Safety',
    city: 'San Francisco',
    email: 'publicsafety@sfgov.org',
    phone: '(415) 553-0123',
    icon: '🛡️'
  },
  {
    id: '6',
    name: 'Joaquin Torres',
    title: 'Director of Economic Development',
    department: 'Commerce Department',
    city: 'San Francisco',
    email: 'commerce@sfgov.org',
    phone: '(415) 554-6969',
    icon: '💼'
  }
];

export const categories = [
  'Infrastructure',
  'Transportation',
  'Parks',
  'Public Safety',
  'Education',
  'Health'
];

export const statuses = [
  { value: 'under-review', label: 'Under Review', color: 'text-blue-600 bg-blue-50' },
  { value: 'approved', label: 'Approved', color: 'text-green-600 bg-green-50' },
  { value: 'rejected', label: 'Rejected', color: 'text-red-600 bg-red-50' }
];

// Helper functions
export const getStatusColor = (status: string) => {
  const statusObj = statuses.find(s => s.value === status);
  return statusObj ? statusObj.color : 'text-gray-600 bg-gray-50';
};

export const getStatusLabel = (status: string) => {
  const statusObj = statuses.find(s => s.value === status);
  return statusObj ? statusObj.label : status;
};