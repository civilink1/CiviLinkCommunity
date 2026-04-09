/**
 * Authentication Service — Supabase
 *
 * Uses Supabase Auth for login/register/logout and a `profiles` table
 * for app-specific user data (role, communityId, approvalStatus, etc.).
 */

import { supabase } from '../lib/supabase';
import type { User, AuthCredentials, RegisterData, APIResponse } from '../types';
import { USER_DATA_KEY } from '../config/constants';

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Log in with email + password via Supabase Auth,
 * then fetch the matching profile row.
 */
export async function login(credentials: AuthCredentials): Promise<APIResponse<{ user: User; token: string }>> {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (authError || !authData.session) {
    return { success: false, error: authError?.message ?? 'Invalid email or password' };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profile) {
    return { success: false, error: 'User profile not found. Please contact support.' };
  }

  const user = mapProfileToUser(profile, authData.user.email ?? credentials.email);
  setCurrentUser(user);

  return {
    success: true,
    data: { user, token: authData.session.access_token },
  };
}

/**
 * Register a new resident.
 * 1. Validate the invite code against the `communities` table.
 * 2. Create a Supabase Auth user.
 * 3. Insert a row in `profiles`.
 */
export async function register(data: RegisterData): Promise<APIResponse<{ user: User; token: string }>> {
  // 1 — Validate invite code
  const code = data.inviteCode.trim().toUpperCase();
  const { data: community, error: communityError } = await supabase
    .from('communities')
    .select('id, require_approval')
    .eq('invite_code', code)
    .single();

  if (communityError || !community) {
    return { success: false, error: 'Invalid invite code' };
  }

  // 2 — Create auth user (pass profile data as metadata so the DB trigger can create the profile)
  const approvalStatus = community.require_approval ? 'PENDING' : 'APPROVED';
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        role: 'RESIDENT',
        community_id: community.id,
        approval_status: approvalStatus,
        unit: data.unit ?? null,
        phone: data.phone ?? null,
        address: data.address ?? null,
      },
    },
  });

  if (authError || !authData.user) {
    return { success: false, error: authError?.message ?? 'Registration failed' };
  }

  const user: User = {
    id: authData.user.id,
    email: data.email,
    name: data.name,
    role: 'RESIDENT',
    communityId: community.id,
    approvalStatus,
    unit: data.unit,
    joinDate: new Date().toISOString(),
    contributionScore: 0,
  };

  // Auto-login if session was returned (email confirmation disabled)
  if (authData.session) {
    setCurrentUser(user);
    return { success: true, data: { user, token: authData.session.access_token } };
  }

  // Email confirmation enabled — user needs to verify first
  setCurrentUser(user);
  return { success: true, data: { user, token: '' } };
}

/**
 * Log out — clears Supabase session + localStorage.
 */
export async function logout(): Promise<void> {
  await supabase.auth.signOut();
  clearCurrentUser();
}

/**
 * Refresh the auth session via Supabase.
 */
export async function refreshToken(): Promise<APIResponse<{ token: string }>> {
  const { data, error } = await supabase.auth.refreshSession();
  if (error || !data.session) {
    return { success: false, error: error?.message ?? 'Session expired' };
  }
  return { success: true, data: { token: data.session.access_token } };
}

/**
 * Get the currently authenticated user from Supabase + profiles table.
 */
export async function getCurrentUserFromAPI(): Promise<APIResponse<User>> {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) {
    return { success: false, error: 'Not authenticated' };
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (error || !profile) {
    return { success: false, error: 'Profile not found' };
  }

  const user = mapProfileToUser(profile, authUser.email ?? '');
  setCurrentUser(user);
  return { success: true, data: user };
}

// ============================================================================
// HELPERS
// ============================================================================

/** Map a Supabase `profiles` row to the app's User type */
function mapProfileToUser(profile: Record<string, unknown>, email: string): User {
  return {
    id: profile.id as string,
    email,
    name: (profile.name ?? '') as string,
    role: (profile.role ?? 'RESIDENT') as User['role'],
    communityId: (profile.community_id ?? '') as string,
    approvalStatus: (profile.approval_status ?? 'APPROVED') as User['approvalStatus'],
    unit: (profile.unit ?? undefined) as string | undefined,
    phone: (profile.phone ?? undefined) as string | undefined,
    address: (profile.address ?? undefined) as string | undefined,
    joinDate: (profile.join_date ?? new Date().toISOString()) as string,
    contributionScore: (profile.contribution_score ?? 0) as number,
    avatarUrl: (profile.avatar_url ?? undefined) as string | undefined,
    bio: (profile.bio ?? undefined) as string | undefined,
  };
}

/**
 * Register a new HOA admin (no invite code required — they create the community).
 * Call createCommunity() after this to link the admin to their community.
 */
export async function registerAdmin(data: {
  name: string;
  email: string;
  password: string;
}): Promise<APIResponse<{ user: User; token: string }>> {
  // Pass profile data as metadata so the DB trigger creates the profile (bypasses RLS)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        role: 'ADMIN',
        approval_status: 'APPROVED',
      },
    },
  });

  if (authError || !authData.user) {
    return { success: false, error: authError?.message ?? 'Registration failed' };
  }

  const user: User = {
    id: authData.user.id,
    email: data.email,
    name: data.name,
    role: 'ADMIN',
    communityId: '',
    approvalStatus: 'APPROVED',
    joinDate: new Date().toISOString(),
    contributionScore: 0,
  };

  if (authData.session) {
    setCurrentUser(user);
    return { success: true, data: { user, token: authData.session.access_token } };
  }

  setCurrentUser(user);
  return { success: true, data: { user, token: '' } };
}

// ============================================================================
// LOCAL STORAGE HELPERS
// ============================================================================

export function setCurrentUser(user: User): void {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
}

export function getCurrentUser(): User | null {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
}

export function clearCurrentUser(): void {
  localStorage.removeItem(USER_DATA_KEY);
}

export function updateCurrentUser(updates: Partial<User>): void {
  const currentUser = getCurrentUser();
  if (currentUser) {
    setCurrentUser({ ...currentUser, ...updates });
  }
}
