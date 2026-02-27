-- =====================================================
-- 1. PROFILES TABLE
-- =====================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  email TEXT NOT NULL,
  age_group TEXT NOT NULL DEFAULT '',
  reduction_reason TEXT NOT NULL DEFAULT '',
  rank TEXT NOT NULL DEFAULT 'beginner' CHECK (rank IN ('beginner', 'regular', 'expert', 'master')),
  points INTEGER NOT NULL DEFAULT 0,
  is_device_owner BOOLEAN NOT NULL DEFAULT FALSE,
  device_number TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nickname', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 2. RECIPES TABLE
-- =====================================================
CREATE TABLE public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_nickname TEXT NOT NULL,
  user_avatar TEXT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  estimated_salt NUMERIC(4,2) NOT NULL DEFAULT 0,
  image_url TEXT NOT NULL DEFAULT '',
  views INTEGER NOT NULL DEFAULT 0,
  avg_rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  rating_count INTEGER NOT NULL DEFAULT 0,
  is_official BOOLEAN NOT NULL DEFAULT FALSE,
  current_level INTEGER,
  stimulus_quality TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recipes are viewable by everyone"
  ON public.recipes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create recipes"
  ON public.recipes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes"
  ON public.recipes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes"
  ON public.recipes FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_recipes_user_id ON public.recipes(user_id);
CREATE INDEX idx_recipes_category ON public.recipes(category);
CREATE INDEX idx_recipes_created_at ON public.recipes(created_at DESC);

-- =====================================================
-- 3. SPOTS TABLE
-- =====================================================
CREATE TABLE public.spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_nickname TEXT NOT NULL,
  place_id TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL DEFAULT 0,
  lng DOUBLE PRECISION NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  salt_level TEXT NOT NULL DEFAULT 'low' CHECK (salt_level IN ('low', 'medium', 'high')),
  menu_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT NOT NULL DEFAULT '',
  avg_rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  rating_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.spots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Spots are viewable by everyone"
  ON public.spots FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create spots"
  ON public.spots FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own spots"
  ON public.spots FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own spots"
  ON public.spots FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_spots_user_id ON public.spots(user_id);
CREATE INDEX idx_spots_category ON public.spots(category);
CREATE INDEX idx_spots_salt_level ON public.spots(salt_level);
CREATE INDEX idx_spots_created_at ON public.spots(created_at DESC);

-- =====================================================
-- 4. RATINGS TABLE
-- =====================================================
CREATE TABLE public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_nickname TEXT NOT NULL,
  user_avatar TEXT,
  target_type TEXT NOT NULL CHECK (target_type IN ('recipe', 'spot')),
  target_id UUID NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  comment TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ratings are viewable by everyone"
  ON public.ratings FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create ratings"
  ON public.ratings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
  ON public.ratings FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX idx_ratings_target ON public.ratings(target_type, target_id);
CREATE INDEX idx_ratings_user_id ON public.ratings(user_id);

-- =====================================================
-- 5. SUPPORT_TICKETS TABLE
-- =====================================================
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tickets"
  ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets"
  ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 6. VALID DEVICE NUMBERS TABLE
-- =====================================================
CREATE TABLE public.valid_device_numbers (
  device_number TEXT PRIMARY KEY,
  is_used BOOLEAN NOT NULL DEFAULT FALSE,
  used_by UUID REFERENCES public.profiles(id),
  used_at TIMESTAMPTZ
);

ALTER TABLE public.valid_device_numbers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Device numbers are checkable by authenticated users"
  ON public.valid_device_numbers FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Device registration updates"
  ON public.valid_device_numbers FOR UPDATE USING (auth.uid() IS NOT NULL);

-- =====================================================
-- 7. TRIGGER: Update avg_rating on rating insert
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_avg_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.target_type = 'recipe' THEN
    UPDATE public.recipes
    SET avg_rating = (
      SELECT COALESCE(AVG(score), 0) FROM public.ratings
      WHERE target_type = 'recipe' AND target_id = NEW.target_id
    ),
    rating_count = (
      SELECT COUNT(*) FROM public.ratings
      WHERE target_type = 'recipe' AND target_id = NEW.target_id
    )
    WHERE id = NEW.target_id;
  ELSIF NEW.target_type = 'spot' THEN
    UPDATE public.spots
    SET avg_rating = (
      SELECT COALESCE(AVG(score), 0) FROM public.ratings
      WHERE target_type = 'spot' AND target_id = NEW.target_id
    ),
    rating_count = (
      SELECT COUNT(*) FROM public.ratings
      WHERE target_type = 'spot' AND target_id = NEW.target_id
    )
    WHERE id = NEW.target_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_rating_change
  AFTER INSERT OR UPDATE OR DELETE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_avg_rating();

-- =====================================================
-- 8. Insert valid device numbers
-- =====================================================
INSERT INTO public.valid_device_numbers (device_number) VALUES
  ('UMN-2025-001234'),
  ('UMN-2025-005678'),
  ('UMN-2025-009999'),
  ('UMN-2025-012345'),
  ('UMN-2025-067890');
