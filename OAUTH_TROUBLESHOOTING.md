# OAuth Loading Freeze - Troubleshooting Guide

## Issue
After clicking "Continue with Google", the page stays frozen on loading instead of redirecting to the dashboard.

## Root Cause
This is typically caused by missing redirect URIs in either Google Cloud Console, Supabase, or both.

## Solution Steps

### 1. Google Cloud Console Configuration
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** > **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized redirect URIs**, ensure you have ALL of these:
   ```
   https://xcuvffwuyrdmufvgzczs.supabase.co/auth/v1/callback
   https://app.beeylo.com/auth/callback
   http://localhost:3000/auth/callback
   ```
6. Click **Save**

### 2. Supabase Dashboard Configuration
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/xcuvffwuyrdmufvgzczs)
2. Navigate to **Authentication** > **URL Configuration**
3. Under **Redirect URLs**, add:
   ```
   https://app.beeylo.com/auth/callback
   http://localhost:3000/auth/callback
   ```
4. Set **Site URL** to: `https://app.beeylo.com`
5. Click **Save**

### 3. Azure AD (Microsoft) Configuration
For Microsoft OAuth to work, you need to add redirect URIs to Azure:

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Select your app
4. Go to **Authentication** > **Platform configurations** > **Add a platform** or edit existing **Web** platform
5. Under **Redirect URIs**, add:
   ```
   https://xcuvffwuyrdmufvgzczs.supabase.co/auth/v1/callback
   https://app.beeylo.com/auth/callback
   http://localhost:3000/auth/callback
   ```
6. Save changes

## Verification Steps

### Test Locally (Development)
1. Clear browser cache and cookies
2. Go to http://localhost:3000
3. Click "Login" and try Google OAuth
4. Should redirect to http://localhost:3000/auth/callback then to http://localhost:3000

### Test Production
1. Open incognito/private browser
2. Go to https://app.beeylo.com
3. Click "Login" and try Google OAuth
4. Should redirect to https://app.beeylo.com/auth/callback then to https://app.beeylo.com

## Common Errors and Solutions

### Error: "redirect_uri_mismatch"
**Cause**: The redirect URI used by Supabase doesn't match what's configured in Google Cloud Console

**Solution**:
- Check the exact error message for the URI being used
- Add that exact URI to Google Cloud Console
- The Supabase URI is usually: `https://xcuvffwuyrdmufvgzczs.supabase.co/auth/v1/callback`

### Error: "Invalid redirect URI"
**Cause**: Supabase doesn't recognize the redirect URI

**Solution**:
- Add the URI to Supabase Dashboard > Authentication > URL Configuration
- Make sure there are no trailing slashes
- URIs are case-sensitive

### Page Stays on Loading Forever
**Cause**: JavaScript error or auth state not updating

**Solution**:
1. Open browser console (F12)
2. Check for errors
3. Clear local storage: `localStorage.clear()`
4. Try again

## How OAuth Flow Works

1. User clicks "Continue with Google"
2. App calls `signInWithGoogle()` which redirects to Google
3. User authorizes on Google's page
4. Google redirects to: `https://xcuvffwuyrdmufvgzczs.supabase.co/auth/v1/callback?code=...`
5. Supabase exchanges code for session
6. Supabase redirects to: `https://app.beeylo.com/auth/callback?code=...`
7. Our callback page (`/auth/callback`) exchanges code for session
8. Callback page redirects to: `https://app.beeylo.com/` (dashboard)

## Debug Mode

Add this to `src/lib/auth.ts` to see what's happening:

```typescript
export async function signInWithGoogle() {
  console.log('Starting Google sign-in...');
  console.log('Redirect URL:', `${window.location.origin}/auth/callback`);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('OAuth error:', error);
    throw error;
  }

  console.log('OAuth data:', data);
  return data;
}
```

## Expected Console Output

When working correctly, you should see:
1. "Starting Google sign-in..."
2. "Redirect URL: https://app.beeylo.com/auth/callback"
3. Redirect to Google
4. Return to callback page
5. "Completing authentication..." (from callback page)
6. Redirect to dashboard

## Still Not Working?

1. Check Supabase logs:
   - Go to Supabase Dashboard > Logs > Auth Logs
   - Look for failed authentication attempts

2. Verify environment variables:
   ```bash
   # .env file should have:
   NEXT_PUBLIC_SUPABASE_URL=https://xcuvffwuyrdmufvgzczs.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Test auth callback manually:
   - Go to https://app.beeylo.com/auth/callback
   - Should show "Completing authentication..." or error message

## Contact Support

If still having issues:
1. Copy the error from browser console
2. Check Supabase auth logs
3. Verify all redirect URIs are exactly matching (no extra slashes, correct protocol)
