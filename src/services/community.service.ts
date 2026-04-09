/**
 * Community Service — Supabase
 *
 * Handles community creation, invite-code validation, and joining.
 */

import { supabase } from '../lib/supabase';
import type { APIResponse } from '../types';

/** Characters used for invite codes (no ambiguous 0/O/1/I) */
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateInviteCode(): string {
  let code = '';
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  for (const b of bytes) code += CODE_CHARS[b % CODE_CHARS.length];
  return code;
}

export interface CommunityRow {
  id: string;
  name: string;
  invite_code: string;
  plan_tier: string;
  home_count: number;
  require_approval: boolean;
  comments_enabled: boolean;
  created_at: string;
}

/**
 * Create a new community during onboarding.
 * Called after the admin's Supabase Auth account is created.
 */
export async function createCommunity(opts: {
  name: string;
  planTier: string;
  homeCount: number;
  adminUserId: string;
}): Promise<APIResponse<CommunityRow>> {
  const inviteCode = generateInviteCode();

  const { data, error } = await supabase
    .from('communities')
    .insert({
      name: opts.name,
      invite_code: inviteCode,
      plan_tier: opts.planTier,
      home_count: opts.homeCount,
      require_approval: false,
      comments_enabled: true,
    })
    .select()
    .single();

  if (error || !data) {
    return { success: false, error: error?.message ?? 'Failed to create community' };
  }

  // Link the admin to the community in their profile
  await supabase
    .from('profiles')
    .update({ community_id: data.id, role: 'ADMIN' })
    .eq('id', opts.adminUserId);

  return { success: true, data: data as CommunityRow };
}

/**
 * Fetch a community's invite code (for the admin InvitePage).
 */
export async function getInviteCode(communityId: string): Promise<APIResponse<string>> {
  const { data, error } = await supabase
    .from('communities')
    .select('invite_code')
    .eq('id', communityId)
    .single();

  if (error || !data) {
    return { success: false, error: error?.message ?? 'Community not found' };
  }

  return { success: true, data: data.invite_code };
}

/**
 * Regenerate the invite code (invalidates the old one).
 */
export async function regenerateInviteCode(communityId: string): Promise<APIResponse<string>> {
  const newCode = generateInviteCode();

  const { error } = await supabase
    .from('communities')
    .update({ invite_code: newCode })
    .eq('id', communityId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: newCode };
}

/**
 * Validate an invite code and return the community it belongs to.
 */
export async function validateInviteCode(code: string): Promise<APIResponse<CommunityRow>> {
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .eq('invite_code', code.trim().toUpperCase())
    .single();

  if (error || !data) {
    return { success: false, error: 'Invalid invite code' };
  }

  return { success: true, data: data as CommunityRow };
}
