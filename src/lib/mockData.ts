/**
 * CiviLink Community – Mock data (HOA edition)
 *
 * One community, one admin, several residents, HOA-themed reports.
 */

import { POST_CATEGORIES, POST_STATUSES } from '../config/constants';
import type { Community, User, Report, Leader, Notification, Announcement } from '../types';

// ─── Invite-code helper ────────────────────────────────────────────────────
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous 0/O/1/I
  let code = '';
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  for (const byte of array) code += chars[byte % chars.length];
  return code;
}

// ─── Mock Community ────────────────────────────────────────────────────────
export const mockCommunity: Community = {
  id: 'comm-1',
  name: 'Sunset Ridge HOA',
  planTier: 'standard',
  homeCount: 96,
  inviteCode: generateInviteCode(),
  requireApproval: false,
  commentsEnabled: true,
  leadership: [
    { name: 'Patricia Moore', role: 'Board President', email: 'pmoore@sunsetridge.org', phone: '(555) 100-2000' },
    { name: 'James Carter', role: 'Property Manager', email: 'jcarter@sunsetridge.org', phone: '(555) 100-3000' },
    { name: 'Linda Nguyen', role: 'Treasurer', email: 'lnguyen@sunsetridge.org' },
  ],
  announcements: [
    {
      id: 'ann-1',
      communityId: 'comm-1',
      title: 'Pool Reopens June 1st',
      message: 'The community pool will reopen for the season on June 1st. Please review the updated pool rules posted at the clubhouse.',
      urgent: false,
      createdAt: '2024-05-20T10:00:00Z',
      authorName: 'Patricia Moore',
    },
    {
      id: 'ann-2',
      communityId: 'comm-1',
      title: 'Parking Lot Resurfacing – May 28-29',
      message: 'The parking lot will be closed for resurfacing on May 28th and 29th. Please use street parking during this time. We apologize for the inconvenience.',
      urgent: true,
      createdAt: '2024-05-22T09:00:00Z',
      authorName: 'James Carter',
    },
  ],
  createdAt: '2024-01-01T00:00:00Z',
};

// ─── Mock Users ────────────────────────────────────────────────────────────
export const mockUsers: (User & { password: string })[] = [
  // HOA Admin
  {
    id: 'admin-1',
    name: 'Patricia Moore',
    email: 'admin@sunsetridge.org',
    password: 'admin',
    role: 'HOA_ADMIN',
    communityId: 'comm-1',
    approvalStatus: 'APPROVED',
    unit: 'Clubhouse',
    phone: '(555) 100-2000',
    address: '1 Sunset Ridge Blvd',
    joinDate: '2024-01-01',
    contributionScore: 0,
    avatarUrl: 'https://i.pravatar.cc/150?u=patricia',
    bio: 'Board President of Sunset Ridge HOA.',
    city: 'Sunset Ridge',
    state: 'CA',
    zipCode: '90210',
  },
  {
    id: 'admin-main',
    name: 'Main Administrator',
    email: 'civilink1357@gmail.com',
    password: 'AryanVrinda1',
    role: 'HOA_ADMIN',
    communityId: 'comm-1',
    approvalStatus: 'APPROVED',
    unit: 'Admin',
    phone: '',
    address: '',
    joinDate: '2024-01-01',
    contributionScore: 0,
    city: 'Sunset Ridge',
    state: 'CA',
    zipCode: '90210',
  },
  // Residents
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    password: 'password123',
    role: 'RESIDENT',
    communityId: 'comm-1',
    approvalStatus: 'APPROVED',
    unit: 'Unit 14B',
    phone: '(555) 201-1001',
    address: '14B Sunset Ridge Blvd',
    joinDate: '2024-02-15',
    contributionScore: 1250,
    avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
    bio: 'Love keeping our neighborhood beautiful!',
    city: 'Sunset Ridge',
    state: 'CA',
    zipCode: '90210',
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    email: 'marcus.j@example.com',
    password: 'password123',
    role: 'RESIDENT',
    communityId: 'comm-1',
    approvalStatus: 'APPROVED',
    unit: 'Unit 7A',
    phone: '(555) 201-1002',
    address: '7A Sunset Ridge Blvd',
    joinDate: '2024-03-22',
    contributionScore: 850,
    avatarUrl: 'https://i.pravatar.cc/150?u=marcus',
    bio: 'Parking lot warrior.',
    city: 'Sunset Ridge',
    state: 'CA',
    zipCode: '90210',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@example.com',
    password: 'password123',
    role: 'RESIDENT',
    communityId: 'comm-1',
    approvalStatus: 'APPROVED',
    unit: 'Unit 22C',
    phone: '(555) 201-1003',
    address: '22C Sunset Ridge Blvd',
    joinDate: '2024-01-20',
    contributionScore: 2100,
    avatarUrl: 'https://i.pravatar.cc/150?u=emily',
    bio: 'Garden committee chair. 🌱',
    city: 'Sunset Ridge',
    state: 'CA',
    zipCode: '90210',
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.k@example.com',
    password: 'password123',
    role: 'RESIDENT',
    communityId: 'comm-1',
    approvalStatus: 'APPROVED',
    unit: 'Unit 3D',
    phone: '(555) 201-1004',
    address: '3D Sunset Ridge Blvd',
    joinDate: '2024-04-10',
    contributionScore: 430,
    avatarUrl: 'https://i.pravatar.cc/150?u=david',
    bio: 'New homeowner, excited to be here!',
    city: 'Sunset Ridge',
    state: 'CA',
    zipCode: '90210',
  },
  {
    id: '5',
    name: 'Lisa Patel',
    email: 'lisa.p@example.com',
    password: 'password123',
    role: 'RESIDENT',
    communityId: 'comm-1',
    approvalStatus: 'PENDING',
    unit: 'Unit 9E',
    phone: '(555) 201-1005',
    address: '9E Sunset Ridge Blvd',
    joinDate: '2024-06-01',
    contributionScore: 0,
    avatarUrl: 'https://i.pravatar.cc/150?u=lisa',
    bio: 'Just moved in!',
    city: 'Sunset Ridge',
    state: 'CA',
    zipCode: '90210',
  },
];

// ─── Mock Leaders (Board & Management) ─────────────────────────────────────
export const mockLeaders: any[] = [
  {
    id: 'l1',
    name: 'Patricia Moore',
    title: 'Board President',
    role: 'Board President',
    department: 'Board',
    communityId: 'comm-1',
    city: 'Sunset Ridge',
    icon: '🏠',
    email: 'pmoore@sunsetridge.org',
    phone: '(555) 100-2000',
    avatar: 'https://i.pravatar.cc/150?u=patricia',
    approvalRating: 92,
    activeInitiatives: 5,
    responseRate: '95%',
  },
  {
    id: 'l2',
    name: 'James Carter',
    title: 'Property Manager',
    role: 'Property Manager',
    department: 'Property Management',
    communityId: 'comm-1',
    city: 'Sunset Ridge',
    icon: '🔧',
    email: 'jcarter@sunsetridge.org',
    phone: '(555) 100-3000',
    avatar: 'https://i.pravatar.cc/150?u=james',
    approvalRating: 88,
    activeInitiatives: 12,
    responseRate: '90%',
  },
  {
    id: 'l3',
    name: 'Linda Nguyen',
    title: 'Treasurer',
    role: 'Treasurer',
    department: 'Board',
    communityId: 'comm-1',
    city: 'Sunset Ridge',
    icon: '💰',
    email: 'lnguyen@sunsetridge.org',
    phone: '(555) 100-4000',
    avatar: 'https://i.pravatar.cc/150?u=linda',
    approvalRating: 90,
    activeInitiatives: 3,
    responseRate: '93%',
  },
  {
    id: 'l4',
    name: 'Robert Davis',
    title: 'Landscaping Committee Chair',
    role: 'Committee Chair',
    department: 'Landscaping Committee',
    communityId: 'comm-1',
    city: 'Sunset Ridge',
    icon: '🌳',
    email: 'rdavis@sunsetridge.org',
    phone: '(555) 100-5000',
    avatar: 'https://i.pravatar.cc/150?u=robert',
    approvalRating: 85,
    activeInitiatives: 7,
    responseRate: '88%',
  },
  {
    id: 'l5',
    name: 'Maria Santos',
    title: 'Safety & Compliance Officer',
    role: 'Compliance Officer',
    department: 'Safety Committee',
    communityId: 'comm-1',
    city: 'Sunset Ridge',
    icon: '🛡️',
    email: 'msantos@sunsetridge.org',
    phone: '(555) 100-6000',
    avatar: 'https://i.pravatar.cc/150?u=maria',
    approvalRating: 87,
    activeInitiatives: 4,
    responseRate: '91%',
  },
];

// ─── Mock Reports (formerly Posts) ─────────────────────────────────────────
export const mockPosts: any[] = [
  {
    id: 'r1',
    title: 'Pool Gate Latch Broken',
    description: 'The main gate latch to the community pool is broken — the gate no longer closes securely. Children could wander in unsupervised. This is an urgent safety concern.',
    category: 'Safety',
    status: 'in_progress',
    location: 'Community Pool – North Gate',
    date: '2024-06-10T10:30:00Z',
    authorId: '1',
    authorName: 'Sarah Chen',
    author: 'Sarah Chen',
    endorsements: 45,
    comments: 8,
    communityId: 'comm-1',
    city: 'Sunset Ridge',
    imageUrl: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800',
    statusHistory: [
      { status: 'pending', date: '2024-06-10T10:30:00Z', note: 'Report submitted by resident' },
      { status: 'under_review', date: '2024-06-11T09:15:00Z', note: 'Property manager reviewing' },
      { status: 'in_progress', date: '2024-06-12T14:20:00Z', note: 'Locksmith scheduled for Thursday' },
    ],
  },
  {
    id: 'r2',
    title: 'Parking Lot Lights Out – Section B',
    description: 'Three overhead lights in Parking Section B have been out for a week. It is very dark at night and residents feel unsafe walking to their cars.',
    category: 'Safety',
    status: 'pending',
    location: 'Parking Section B',
    date: '2024-06-14T19:45:00Z',
    authorId: '2',
    authorName: 'Marcus Johnson',
    author: 'Marcus Johnson',
    endorsements: 18,
    comments: 3,
    communityId: 'comm-1',
    city: 'Sunset Ridge',
    imageUrl: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800',
    statusHistory: [
      { status: 'pending', date: '2024-06-14T19:45:00Z', note: 'Report submitted' },
    ],
  },
  {
    id: 'r3',
    title: 'Sprinkler Head Spraying Onto Sidewalk',
    description: 'The sprinkler near Building 4 is misaligned and sprays water onto the sidewalk every morning, making it slippery. Someone nearly fell yesterday.',
    category: 'Landscaping',
    status: 'completed',
    location: 'Building 4 – West Walkway',
    date: '2024-06-08T16:20:00Z',
    authorId: '3',
    authorName: 'Emily Rodriguez',
    author: 'Emily Rodriguez',
    endorsements: 72,
    comments: 6,
    communityId: 'comm-1',
    city: 'Sunset Ridge',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800',
    statusHistory: [
      { status: 'pending', date: '2024-06-08T16:20:00Z', note: 'Report submitted' },
      { status: 'under_review', date: '2024-06-09T11:00:00Z', note: 'Landscaping contractor notified' },
      { status: 'completed', date: '2024-06-10T13:45:00Z', note: 'Sprinkler head re-aimed and tested' },
    ],
  },
  {
    id: 'r4',
    title: 'Trash Bins Overflowing Near Mailboxes',
    description: 'The communal trash bins at the mailbox station are consistently overflowing by Wednesday. We may need an extra pickup or larger bins.',
    category: 'Maintenance',
    status: 'under_review',
    location: 'Mailbox Station – Central',
    date: '2024-06-13T08:15:00Z',
    authorId: '1',
    authorName: 'Sarah Chen',
    author: 'Sarah Chen',
    endorsements: 34,
    comments: 5,
    communityId: 'comm-1',
    city: 'Sunset Ridge',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800',
    statusHistory: [
      { status: 'pending', date: '2024-06-13T08:15:00Z', note: 'Report submitted with photos' },
      { status: 'under_review', date: '2024-06-13T10:30:00Z', note: 'Waste management company contacted' },
    ],
  },
  {
    id: 'r5',
    title: 'Loud Music After 10 PM – Building 6',
    description: 'Repeated noise from Unit 6F playing loud music well past the 10 PM quiet hours. Multiple neighbors affected. This has happened at least 4 times this month.',
    category: 'Noise',
    status: 'pending',
    location: 'Building 6, Unit 6F',
    date: '2024-06-15T07:30:00Z',
    authorId: '2',
    authorName: 'Marcus Johnson',
    author: 'Marcus Johnson',
    endorsements: 12,
    comments: 2,
    communityId: 'comm-1',
    city: 'Sunset Ridge',
    imageUrl: '',
    statusHistory: [
      { status: 'pending', date: '2024-06-15T07:30:00Z', note: 'Noise complaint filed' },
    ],
  },
  {
    id: 'r6',
    title: 'Gym Treadmill #3 Not Working',
    description: 'Treadmill #3 in the fitness center displays an error code and the belt will not start. A sign was placed on it but no repair has been scheduled.',
    category: 'Amenities',
    status: 'in_progress',
    location: 'Fitness Center',
    date: '2024-06-11T12:00:00Z',
    authorId: '3',
    authorName: 'Emily Rodriguez',
    author: 'Emily Rodriguez',
    endorsements: 56,
    comments: 4,
    communityId: 'comm-1',
    city: 'Sunset Ridge',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    statusHistory: [
      { status: 'pending', date: '2024-06-11T12:00:00Z', note: 'Report submitted' },
      { status: 'in_progress', date: '2024-06-12T09:00:00Z', note: 'Repair tech visit scheduled for Monday' },
    ],
  },
  {
    id: 'r7',
    title: 'Visitor Parking Abuse',
    description: 'The same non-resident vehicle (silver SUV, no visitor pass) is parked in visitor spot #4 every day. This appears to be a full-time parker taking up a resident visitor space.',
    category: 'Parking',
    status: 'under_review',
    location: 'Visitor Parking – Spot #4',
    date: '2024-06-09T14:00:00Z',
    authorId: '4',
    authorName: 'David Kim',
    author: 'David Kim',
    endorsements: 63,
    comments: 9,
    communityId: 'comm-1',
    city: 'Sunset Ridge',
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800',
    statusHistory: [
      { status: 'pending', date: '2024-06-09T14:00:00Z', note: 'Report submitted' },
      { status: 'under_review', date: '2024-06-10T08:30:00Z', note: 'Board reviewing towing policy' },
    ],
  },
  {
    id: 'r8',
    title: 'Dog Waste Not Being Picked Up – Dog Park',
    description: 'Multiple residents are not cleaning up after their dogs in the community dog park area. The bag dispensers are also empty.',
    category: 'Rules Violation',
    status: 'completed',
    location: 'Community Dog Park',
    date: '2024-06-05T11:10:00Z',
    authorId: '2',
    authorName: 'Marcus Johnson',
    author: 'Marcus Johnson',
    endorsements: 29,
    comments: 6,
    communityId: 'comm-1',
    city: 'Sunset Ridge',
    imageUrl: '',
    statusHistory: [
      { status: 'pending', date: '2024-06-05T11:10:00Z', note: 'Report submitted' },
      { status: 'under_review', date: '2024-06-06T09:00:00Z', note: 'Signs to be posted' },
      { status: 'in_progress', date: '2024-06-07T13:00:00Z', note: 'New signage + bag dispensers ordered' },
      { status: 'completed', date: '2024-06-07T16:30:00Z', note: 'New signs installed and dispensers restocked' },
    ],
  },
  {
    id: 'r9',
    title: 'Playground Fence Has Sharp Edge',
    description: 'A section of the playground fence near the slide has a jagged metal edge where a post was bent. Children could get cut. Needs immediate attention.',
    category: 'Safety',
    status: 'in_progress',
    location: 'Playground – East Fence',
    date: '2024-06-12T09:45:00Z',
    authorId: '3',
    authorName: 'Emily Rodriguez',
    author: 'Emily Rodriguez',
    endorsements: 88,
    comments: 14,
    communityId: 'comm-1',
    city: 'Sunset Ridge',
    imageUrl: 'https://images.unsplash.com/photo-1575783970733-1aaedde1db74?w=800',
    statusHistory: [
      { status: 'pending', date: '2024-06-12T09:45:00Z', note: 'Marked as safety concern' },
      { status: 'under_review', date: '2024-06-12T15:00:00Z', note: 'Maintenance inspected – confirmed sharp edge' },
      { status: 'in_progress', date: '2024-06-13T10:00:00Z', note: 'Fence section taped off; replacement ordered' },
    ],
  },
  {
    id: 'r10',
    title: 'Unauthorized Short-Term Rental',
    description: 'Unit 10A appears to be listed on Airbnb. Different guests are seen weekly with suitcases. Our CC&Rs prohibit short-term rentals under 30 days.',
    category: 'Rules Violation',
    status: 'rejected',
    location: 'Building 10, Unit 10A',
    date: '2024-06-06T23:15:00Z',
    authorId: '4',
    authorName: 'David Kim',
    author: 'David Kim',
    endorsements: 41,
    comments: 7,
    communityId: 'comm-1',
    city: 'Sunset Ridge',
    imageUrl: '',
    statusHistory: [
      { status: 'pending', date: '2024-06-06T23:15:00Z', note: 'Report submitted' },
      { status: 'under_review', date: '2024-06-07T09:00:00Z', note: 'Board investigating' },
      { status: 'rejected', date: '2024-06-08T14:00:00Z', note: 'Owner provided long-term lease documentation – not a short-term rental' },
    ],
  },
  {
    id: 'r11',
    title: 'Clubhouse AC Not Working',
    description: 'The air conditioning in the clubhouse has been out for two days. With summer temperatures, the space is unusable for meetings and events.',
    category: 'Maintenance',
    status: 'pending',
    location: 'Clubhouse',
    date: '2024-06-14T08:00:00Z',
    authorId: '1',
    authorName: 'Sarah Chen',
    author: 'Sarah Chen',
    endorsements: 22,
    comments: 2,
    communityId: 'comm-1',
    city: 'Sunset Ridge',
    imageUrl: '',
    statusHistory: [
      { status: 'pending', date: '2024-06-14T08:00:00Z', note: 'Report submitted' },
    ],
  },
  {
    id: 'r12',
    title: 'Elevator Making Grinding Noise – Building 2',
    description: 'The elevator in Building 2 has been making a loud grinding noise and occasionally stops between floors for a few seconds before continuing.',
    category: 'Maintenance',
    status: 'in_progress',
    location: 'Building 2 Elevator',
    date: '2024-06-13T17:30:00Z',
    authorId: '4',
    authorName: 'David Kim',
    author: 'David Kim',
    endorsements: 35,
    comments: 5,
    communityId: 'comm-1',
    city: 'Sunset Ridge',
    imageUrl: '',
    statusHistory: [
      { status: 'pending', date: '2024-06-13T17:30:00Z', note: 'Report submitted' },
      { status: 'under_review', date: '2024-06-14T08:00:00Z', note: 'Elevator company contacted' },
      { status: 'in_progress', date: '2024-06-14T14:00:00Z', note: 'Technician scheduled for tomorrow AM' },
    ],
  },
];

// ─── Mock Notifications ─────────────────────────────────────────────────────
export const mockNotifications: any[] = [
  {
    id: 'n1',
    userId: '1',
    title: 'Status Update',
    message: 'Your report "Pool Gate Latch Broken" has been moved to In Progress. A locksmith has been scheduled.',
    type: 'status_update',
    read: false,
    date: '2024-06-12T14:20:00Z',
    createdAt: '2024-06-12T14:20:00Z',
    relatedId: 'r1',
  },
  {
    id: 'n2',
    userId: '1',
    title: 'New Endorsement',
    message: 'Your report "Pool Gate Latch Broken" received 5 new endorsements from neighbors.',
    type: 'endorsement',
    read: true,
    date: '2024-06-11T18:00:00Z',
    createdAt: '2024-06-11T18:00:00Z',
    relatedId: 'r1',
  },
  {
    id: 'n3',
    userId: '3',
    title: 'Issue Resolved',
    message: '"Sprinkler Head Spraying Onto Sidewalk" has been marked as Completed.',
    type: 'status_update',
    read: false,
    date: '2024-06-10T13:45:00Z',
    createdAt: '2024-06-10T13:45:00Z',
    relatedId: 'r3',
  },
  {
    id: 'n4',
    userId: '2',
    title: 'Comment on Your Report',
    message: 'The property manager commented on "Parking Lot Lights Out": "Electrician visit scheduled for Friday."',
    type: 'comment',
    read: false,
    date: '2024-06-15T10:00:00Z',
    createdAt: '2024-06-15T10:00:00Z',
    relatedId: 'r2',
  },
  {
    id: 'n5',
    userId: '1',
    title: 'Status Update',
    message: 'Your report "Trash Bins Overflowing" is now Under Review by the property manager.',
    type: 'status_update',
    read: true,
    date: '2024-06-13T10:30:00Z',
    createdAt: '2024-06-13T10:30:00Z',
    relatedId: 'r4',
  },
  {
    id: 'n6',
    userId: '3',
    title: 'New Endorsement',
    message: 'Your report "Playground Fence Has Sharp Edge" received 20 endorsements! It\'s now a trending issue.',
    type: 'endorsement',
    read: false,
    date: '2024-06-13T16:00:00Z',
    createdAt: '2024-06-13T16:00:00Z',
    relatedId: 'r9',
  },
  {
    id: 'n7',
    userId: '2',
    title: 'Issue Resolved',
    message: '"Dog Waste Not Being Picked Up" has been marked as Completed. New signs installed.',
    type: 'status_update',
    read: true,
    date: '2024-06-07T16:30:00Z',
    createdAt: '2024-06-07T16:30:00Z',
    relatedId: 'r8',
  },
  {
    id: 'n8',
    userId: '5',
    title: 'Welcome!',
    message: 'Welcome to CiviLink Community! Browse reports in your neighborhood or submit a new one.',
    type: 'system',
    read: true,
    date: '2024-06-01T08:00:00Z',
    createdAt: '2024-06-01T08:00:00Z',
    relatedId: null,
  },
];

// ─── Re-exports & Helpers ───────────────────────────────────────────────────
export const categories = Array.from(POST_CATEGORIES);
export const statuses = POST_STATUSES.map(s => ({ ...s }));

export const getStatusColor = (status: string) => {
  const statusObj = POST_STATUSES.find(s => s.value === status);
  return statusObj ? statusObj.color : 'text-gray-600 bg-gray-50';
};

export const getStatusLabel = (status: string) => {
  const statusObj = POST_STATUSES.find(s => s.value === status);
  return statusObj ? statusObj.label : status;
};

// ─── Service Functions ───────────────────────────────────────────────────────

/** Join community: validate invite code, create user, return user or throw */
export function joinCommunity(
  info: { name: string; email: string; phone: string; address: string; unit?: string; password: string },
  code: string
): { user: User; pending: boolean } {
  if (code.trim().toUpperCase() !== mockCommunity.inviteCode) {
    throw new Error('Invalid invite code');
  }
  if (mockUsers.find(u => u.email === info.email)) {
    throw new Error('Email already in use');
  }
  const status = mockCommunity.requireApproval ? 'PENDING' : 'APPROVED';
  const newUser: User & { password: string } = {
    id: `user-${Date.now()}`,
    email: info.email,
    name: info.name,
    phone: info.phone,
    address: info.address,
    role: 'RESIDENT',
    communityId: mockCommunity.id,
    approvalStatus: status,
    unit: info.unit || undefined,
    joinDate: new Date().toISOString().split('T')[0],
    contributionScore: 0,
    city: mockCommunity.name,
    state: '',
    zipCode: '',
    password: info.password,
  };
  mockUsers.push(newUser);
  return { user: newUser, pending: status === 'PENDING' };
}

/** Approve a pending user */
export function approveUser(userId: string): void {
  const user = mockUsers.find(u => u.id === userId);
  if (user) user.approvalStatus = 'APPROVED';
}

/** Deny / remove a user */
export function denyUser(userId: string): void {
  const user = mockUsers.find(u => u.id === userId);
  if (user) user.approvalStatus = 'DENIED';
}

/** Update community settings in-memory */
export function updateCommunitySettings(payload: Partial<Pick<typeof mockCommunity, 'name' | 'homeCount' | 'requireApproval' | 'commentsEnabled' | 'leadership'>>): void {
  Object.assign(mockCommunity, payload);
}

/** Create and store a new announcement */
export function createAnnouncement(payload: { title: string; message: string; urgent: boolean; authorName: string }): Announcement {
  const ann: Announcement = {
    id: `ann-${Date.now()}`,
    communityId: mockCommunity.id,
    title: payload.title,
    message: payload.message,
    urgent: payload.urgent,
    createdAt: new Date().toISOString(),
    authorName: payload.authorName,
  };
  mockCommunity.announcements.unshift(ann);
  // Also push to notifications for all residents
  const residentIds = mockUsers.filter(u => u.communityId === mockCommunity.id && u.approvalStatus === 'APPROVED').map(u => u.id);
  residentIds.forEach(uid => {
    mockNotifications.unshift({
      id: `n-ann-${Date.now()}-${uid}`,
      userId: uid,
      title: payload.urgent ? `Urgent: ${payload.title}` : payload.title,
      message: payload.message,
      type: 'announcement',
      read: false,
      date: ann.createdAt,
      createdAt: ann.createdAt,
      relatedId: ann.id,
    });
  });
  return ann;
}