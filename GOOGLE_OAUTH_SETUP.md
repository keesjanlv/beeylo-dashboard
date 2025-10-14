# Google OAuth Setup for app.beeylo.com

## Required Action

You need to add the following Authorized Redirect URI to your Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" > "Credentials"
4. Click on your OAuth 2.0 Client ID
5. Under "Authorized redirect URIs", add:
   ```
   https://app.beeylo.com/auth/callback
   ```
6. Also ensure these are present:
   ```
   http://localhost:3000/auth/callback
   https://xcuvffwuyrdmufvgzczs.supabase.co/auth/v1/callback
   ```
7. Click "Save"

## Supabase Configuration

In your Supabase project dashboard (https://supabase.com/dashboard/project/xcuvffwuyrdmufvgzczs):

1. Go to Authentication > URL Configuration
2. Add to "Redirect URLs":
   ```
   https://app.beeylo.com/auth/callback
   http://localhost:3000/auth/callback
   ```
3. Set "Site URL" to: `https://app.beeylo.com`

## Testing

After configuration:
- Test login at https://app.beeylo.com/login
- Verify redirect works correctly after Google authentication
- Check that session persists after refresh
