-- =============================================================================
-- CiviLink Community — Supabase Schema
-- Run this in the Supabase SQL Editor to set up all tables and RLS policies.
-- =============================================================================

-- ─── Communities ─────────────────────────────────────────────────────────────
CREATE TABLE communities (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  invite_code      VARCHAR(8) UNIQUE NOT NULL,
  plan_tier        TEXT NOT NULL DEFAULT 'starter',
  home_count       INT NOT NULL DEFAULT 0,
  require_approval BOOLEAN NOT NULL DEFAULT false,
  comments_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── User Profiles (linked to Supabase Auth) ─────────────────────────────────
CREATE TABLE profiles (
  id                 UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name               TEXT NOT NULL,
  email              TEXT NOT NULL,
  role               TEXT NOT NULL DEFAULT 'RESIDENT', -- RESIDENT | ADMIN
  community_id       UUID REFERENCES communities(id),
  approval_status    TEXT NOT NULL DEFAULT 'APPROVED',  -- PENDING | APPROVED | DENIED
  unit               TEXT,
  phone              TEXT,
  address            TEXT,
  join_date          TIMESTAMPTZ NOT NULL DEFAULT now(),
  contribution_score INT NOT NULL DEFAULT 0,
  avatar_url         TEXT,
  bio                TEXT
);

-- ─── Reports ─────────────────────────────────────────────────────────────────
CREATE TABLE reports (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id      UUID NOT NULL REFERENCES communities(id),
  author_id         UUID NOT NULL REFERENCES profiles(id),
  title             TEXT NOT NULL,
  description       TEXT NOT NULL,
  category          TEXT NOT NULL,
  status            TEXT NOT NULL DEFAULT 'pending',
  location          TEXT,
  image_urls        TEXT[] DEFAULT '{}',
  endorsement_count INT NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Comments ────────────────────────────────────────────────────────────────
CREATE TABLE comments (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id),
  content   TEXT NOT NULL,
  likes     INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Endorsements (one per user per report) ──────────────────────────────────
CREATE TABLE endorsements (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id  UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(report_id, user_id)
);

-- ─── Announcements ───────────────────────────────────────────────────────────
CREATE TABLE announcements (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id),
  title        TEXT NOT NULL,
  message      TEXT NOT NULL,
  urgent       BOOLEAN NOT NULL DEFAULT false,
  author_name  TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Notifications ───────────────────────────────────────────────────────────
CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id),
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  type       TEXT NOT NULL DEFAULT 'info',
  read       BOOLEAN NOT NULL DEFAULT false,
  link       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE communities   ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports       ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE endorsements  ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Communities
CREATE POLICY "Anyone can read communities"
  ON communities FOR SELECT USING (true);
CREATE POLICY "Anyone can insert communities"
  ON communities FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update own community"
  ON communities FOR UPDATE
  USING (id IN (SELECT community_id FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- Profiles
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can read community members"
  ON profiles FOR SELECT
  USING (community_id IN (SELECT community_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (id = auth.uid());

-- Reports
CREATE POLICY "Community members can read reports"
  ON reports FOR SELECT
  USING (community_id IN (SELECT community_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Members can create reports"
  ON reports FOR INSERT
  WITH CHECK (community_id IN (SELECT community_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Authors and admins can update reports"
  ON reports FOR UPDATE
  USING (author_id = auth.uid() OR community_id IN (
    SELECT community_id FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- Comments
CREATE POLICY "Members can read comments"
  ON comments FOR SELECT
  USING (report_id IN (SELECT id FROM reports WHERE community_id IN (
    SELECT community_id FROM profiles WHERE id = auth.uid())));
CREATE POLICY "Members can create comments"
  ON comments FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "Authors can update own comments"
  ON comments FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Authors can delete own comments"
  ON comments FOR DELETE USING (author_id = auth.uid());

-- Endorsements
CREATE POLICY "Members can read endorsements"
  ON endorsements FOR SELECT
  USING (report_id IN (SELECT id FROM reports WHERE community_id IN (
    SELECT community_id FROM profiles WHERE id = auth.uid())));
CREATE POLICY "Members can endorse"
  ON endorsements FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Members can un-endorse"
  ON endorsements FOR DELETE USING (user_id = auth.uid());

-- Announcements
CREATE POLICY "Members can read announcements"
  ON announcements FOR SELECT
  USING (community_id IN (SELECT community_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Admins can create announcements"
  ON announcements FOR INSERT
  WITH CHECK (community_id IN (
    SELECT community_id FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- Notifications
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE USING (user_id = auth.uid());
