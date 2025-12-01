# Clerk Authentication Migration Guide

## Overview
This project has been migrated from JWT-based authentication to **Clerk** for improved security, user management, and social logins.

## What Changed

### Backend Changes ✅
1. **New Clerk Integration**
   - `ClerkService` - Syncs Clerk users with local database
   - `ClerkAuthGuard` - Validates Clerk tokens
   - `@ClerkUser()` decorator - Get current Clerk user

2. **User Entity Updated**
   - Added `clerkId` field (unique identifier from Clerk)
   - Made `password` field optional (Clerk handles auth)
   - Made `fullName` optional

3. **Auth Module**
   - Added Clerk providers and guards
   - JWT auth still available for backward compatibility

4. **New GraphQL Query**
   - `meClerk` - Get current user via Clerk token

### Frontend Changes ✅
1. **Clerk Components**
   - Login page now uses `<SignIn />` component
   - Signup page now uses `<SignUp />` component
   - Middleware for route protection

2. **Layout Updated**
   - Wrapped with `<ClerkProvider>`

3. **Old Auth Context**
   - Can be removed or kept for backward compatibility

---

## Setup Instructions

### Step 1: Create Clerk Account

1. Go to https://clerk.com and sign up
2. Create a new application
3. Choose authentication methods (Email, Google, GitHub, etc.)

### Step 2: Get API Keys

From Clerk Dashboard → API Keys:

**Backend `.env`:**
```env
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Step 3: Configure Clerk Dashboard

In Clerk Dashboard:

1. **Paths**
   - Sign-in path: `/login`
   - Sign-up path: `/signup`
   - After sign-in: `/dashboard`

2. **User & Authentication → Email, Phone, Username**
   - Enable Email (required)
   - Optional: Enable Username
   - Optional: Enable social logins (Google, GitHub, etc.)

3. **Sessions**
   - Session lifetime: 7 days (default)
   - Multi-session support: Enabled

### Step 4: Update Database

Run migrations to add `clerkId` column:

```bash
# Backend will auto-create column with synchronize: true
cd backend
npm run start:dev
```

The User entity will automatically add the `clerkId` column.

### Step 5: Test Authentication

1. Start backend:
```bash
cd backend
npm run start:dev
```

2. Start frontend:
```bash
cd frontend
npm run dev
```

3. Navigate to `http://localhost:3000/signup`
4. Create an account with Clerk
5. Check Supabase to see the user synced

---

## How It Works

### Authentication Flow

1. **User Signs Up/In via Clerk** (Frontend)
   - Clerk handles authentication
   - Returns session token

2. **Token Sent to Backend** (GraphQL requests)
   - Frontend includes Clerk token in Authorization header
   - `ClerkAuthGuard` verifies token

3. **User Sync** (Backend)
   - `ClerkService.getUserByClerkId()` checks if user exists
   - If not, creates user from Clerk data
   - Returns local User entity

4. **Protected Routes**
   - Use `@UseGuards(ClerkAuthGuard)` on resolvers
   - Use `@ClerkUser()` decorator to get user info

### Example Usage

**Backend Resolver:**
```typescript
@Query(() => UserModel)
@UseGuards(ClerkAuthGuard)
async meClerk(@ClerkUser() clerkUser: { clerkId: string }): Promise<UserModel> {
  const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
  return user;
}
```

**Frontend Component:**
```tsx
import { useUser } from '@clerk/nextjs';

export function ProfileComponent() {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) return <div>Loading...</div>;
  
  return (
    <div>
      <p>Email: {user?.emailAddresses[0]?.emailAddress}</p>
      <p>Name: {user?.fullName}</p>
    </div>
  );
}
```

---

## Migration Checklist

### Backend
- [x] Install `@clerk/clerk-sdk-node`
- [x] Create `ClerkService`
- [x] Create `ClerkAuthGuard`
- [x] Update User entity (add `clerkId`)
- [x] Update `.env` with `CLERK_SECRET_KEY`
- [ ] Add your actual Clerk secret key
- [ ] Test user sync

### Frontend
- [x] Install `@clerk/nextjs`
- [x] Add `ClerkProvider` to layout
- [x] Create middleware for route protection
- [x] Update login page with Clerk component
- [x] Update signup page with Clerk component
- [x] Create `.env.local` with Clerk keys
- [ ] Add your actual Clerk publishable key
- [ ] Test sign up/in flow

### Database
- [x] User entity supports `clerkId`
- [ ] Run backend to auto-create column
- [ ] Verify column in Supabase

---

## Benefits of Clerk

✅ **Security**
- Enterprise-grade authentication
- Automatic security updates
- Bot detection and prevention

✅ **User Management**
- Built-in user dashboard
- Email verification
- Password reset flows

✅ **Social Logins**
- Google, GitHub, Facebook, etc.
- OAuth 2.0 / OIDC support

✅ **Developer Experience**
- Pre-built UI components
- Session management
- Multi-tenancy support

✅ **Features**
- MFA/2FA support
- Custom fields
- Webhooks
- Analytics

---

## Troubleshooting

### "Clerk publishable key not found"
- Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` to `.env.local`
- Restart frontend dev server

### "Invalid Clerk token"
- Check `CLERK_SECRET_KEY` in backend `.env`
- Ensure keys match your Clerk application

### User not syncing to database
- Check backend logs for errors
- Verify Supabase connection
- Check `ClerkService.syncUser()` logs

### Can't access protected routes
- Ensure middleware is configured
- Check Clerk session is active
- Verify route protection in middleware.ts

---

## Next Steps

1. **Remove Old Auth** (Optional)
   - Can remove JWT login/signup mutations
   - Can remove `auth-context.tsx` 
   - Can remove `LoginForm` and `SignupForm` components

2. **Add Social Logins**
   - Enable in Clerk Dashboard
   - No code changes needed!

3. **Customize Clerk UI**
   - Update appearance prop in SignIn/SignUp
   - Match your brand colors

4. **Add Webhooks**
   - Set up Clerk webhooks for real-time sync
   - Handle user.created, user.updated events

---

## Support

- Clerk Docs: https://clerk.com/docs
- Clerk Discord: https://clerk.com/discord
- Supabase Docs: https://supabase.com/docs
