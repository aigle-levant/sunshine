# VoiceKart AI - Supabase Authentication & Persistence Implementation

## Overview
This implementation adds:
- Email/Password authentication (Sign up & Login)
- Protected dashboard (requires authentication)
- Supabase persistence for business analysis
- Session management

## Files Created

### 1. Supabase Configuration
**File**: `frontend/src/lib/supabase.js`
- Initializes Supabase client with environment variables
- Exports `supabase` instance for use across the app

### 2. Authentication Service
**File**: `frontend/src/services/auth.js`
- `signUp(email, password, businessName)` - Create new account and profile
- `signInWithPassword(email, password)` - Login existing user
- `signOut()` - Logout user
- `getCurrentUser()` - Get current authenticated user
- `saveAnalysis(userId, analysisData)` - Save analysis to Supabase
- `getLatestAnalysis(userId)` - Fetch latest analysis for user
- `getAnalysisHistory(userId, limit)` - Fetch analysis history

### 3. Authentication Pages
**File**: `frontend/src/pages/Login.jsx`
- Email/password login form
- Integrated with Supabase auth
- Redirects to dashboard on success

**File**: `frontend/src/pages/Signup.jsx`
- Business name, email, password signup
- Auto-creates user profile in database
- Redirects to dashboard on success

### 4. Protected Route Component
**File**: `frontend/src/components/ProtectedRoute.jsx`
- Checks authentication status
- Redirects unauthenticated users to login
- Shows loading state while checking auth

## Files Modified

### 1. App.jsx
- Added Login and Signup routes
- Added Signup import
- Added ProtectedRoute import
- Wrapped Dashboard with `<ProtectedRoute>`

### 2. SpeakHero.jsx
- Added imports: `getCurrentUser`, `saveAnalysis`
- Modified `handleSave` to:
  - Save analysis to localStorage (existing behavior)
  - Save analysis to Supabase if user authenticated
  - Gracefully handle when user not authenticated

### 3. frontend/.env.local.example
- Template for environment variables

## Database Schema (Supabase)

Run this SQL in your Supabase dashboard:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create business_analysis table
CREATE TABLE business_analysis (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for business_analysis
CREATE POLICY "Users can view their own analysis"
  ON business_analysis FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analysis"
  ON business_analysis FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX business_analysis_user_id_created_at_idx
  ON business_analysis(user_id, created_at DESC);
```

See `SUPABASE_SCHEMA.sql` in the project root.

## Setup Instructions

### 1. Create Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Copy your Project URL and Anon Key

### 2. Create Database Tables
1. In Supabase Dashboard → SQL Editor
2. Copy the SQL from `SUPABASE_SCHEMA.sql`
3. Execute the SQL

### 3. Environment Variables
1. Copy `frontend/.env.local.example` to `frontend/.env.local`
2. Fill in your Supabase URL and Anon Key:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Start the Application
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

## Flow

### Sign Up
1. User enters Business Name, Email, Password
2. `signUp()` creates auth user in Supabase Auth
3. Profile created in `profiles` table with business_name
4. User redirected to dashboard

### Login
1. User enters Email, Password
2. `signInWithPassword()` authenticates with Supabase Auth
3. User redirected to dashboard
4. Session persists across page refreshes (Supabase handles this)

### Voice Analysis
1. User records or types input in Speak page
2. Claude API processes it and returns structured JSON
3. `handleSave()` is called with analysis data
4. Analysis saved to localStorage (existing behavior)
5. If user authenticated, analysis also saved to Supabase `business_analysis` table
6. Full Claude JSON response stored in `analysis` JSONB column

### Dashboard Loading
Currently, Dashboard reads from localStorage. To use Supabase data:
1. Modify `dashboardData.js` `readEntries()` to fetch from `business_analysis` table
2. Transform Supabase rows into the expected format

**Note**: The current implementation keeps localStorage as primary to avoid breaking existing flows. To migrate to Supabase as primary:
- Update Dashboard to call Supabase API
- Keep localStorage as fallback

## Key Design Decisions

1. **Minimal Changes**: No state management libraries added (no Redux, Context, Zustand)
2. **Graceful Degradation**: If user not authenticated, app still works (saves to localStorage only)
3. **No UI Changes**: Login/Signup pages maintain design consistency with existing app
4. **Session Persistence**: Supabase Auth handles session persistence automatically
5. **Complete JSON Storage**: Full Claude response stored in JSONB, not flattened

## Testing

### Test Sign Up
1. Go to `/signup`
2. Enter business name, email, password
3. Should redirect to dashboard
4. Check Supabase dashboard → Auth Users (new user created)
5. Check `profiles` table (business_name saved)

### Test Login
1. Go to `/login`
2. Enter email and password from signup
3. Should redirect to dashboard
4. Refresh page - should stay on dashboard (session persisted)

### Test Analysis Persistence
1. Go to `/speak`
2. Record audio or type text
3. Get analysis result
4. Click "Save" button
5. Check Supabase `business_analysis` table (new row created with full JSON)
6. Check localStorage (existing behavior preserved)

### Test Protected Route
1. Go to `/dashboard` without logging in
2. Should redirect to `/login`
3. Log in and try again
4. Should load dashboard normally

## Environment Variables Reference

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key (public) |

## Error Handling

- **Auth errors**: Displayed in form as error messages
- **Supabase save errors**: Logged to console, doesn't break UI
- **Session expired**: User redirected to login on next protected route access

## Future Enhancements

1. **Social Auth**: Add Google/GitHub login
2. **Password Reset**: Implement forgot password flow
3. **Dashboard Data Source**: Modify to use Supabase as primary data source
4. **Real-time Updates**: Use Supabase Realtime for live updates
5. **Business Settings**: Allow users to update business name/settings
6. **Analysis Export**: Export analysis history as CSV/PDF

## Troubleshooting

### "Missing Supabase environment variables"
- Check `frontend/.env.local` exists
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart dev server after adding env vars

### "User already registered"
- This is expected if you try to sign up with the same email twice
- Use a different email or log in instead

### "Failed to save analysis to Supabase"
- Check user is authenticated
- Verify RLS policies are set correctly
- Check Supabase table structure matches schema

### Session not persisting
- Supabase Auth uses cookies - check if cookies are enabled
- Check browser console for any errors
- Verify Supabase project is active

