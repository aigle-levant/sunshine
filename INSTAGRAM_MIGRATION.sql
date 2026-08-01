-- Create social_accounts table for Instagram analysis
CREATE TABLE public.social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  profile JSONB,
  brand_context JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index on user_id for faster queries
CREATE INDEX idx_social_accounts_user_id ON public.social_accounts(user_id);

-- Enable RLS
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read their own social accounts
CREATE POLICY "Users can read their own social accounts"
  ON public.social_accounts
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own social accounts
CREATE POLICY "Users can insert their own social accounts"
  ON public.social_accounts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own social accounts
CREATE POLICY "Users can update their own social accounts"
  ON public.social_accounts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own social accounts
CREATE POLICY "Users can delete their own social accounts"
  ON public.social_accounts
  FOR DELETE
  USING (auth.uid() = user_id);
