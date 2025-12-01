# 🚀 Quick Setup: Clerk + Supabase

## 1. Get Clerk Keys (2 minutes)

Visit: https://dashboard.clerk.com/

1. Create account → New Application
2. Copy keys from **API Keys** section

## 2. Configure Environment Variables

### Backend `.env`
```env
# Supabase (already configured ✅)
DATABASE_URL="postgresql://postgres.wrofqkwmtuwqtbvowaod:Tanishqt@123@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"

# Clerk - ADD THIS
CLERK_SECRET_KEY=sk_test_PASTE_YOUR_KEY_HERE
```

### Frontend `.env.local` (create new file)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_PASTE_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_PASTE_YOUR_KEY_HERE

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

NEXT_PUBLIC_GRAPHQL_URL=http://localhost:5000/api/graphql
```

## 3. Start Your Apps

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 4. Test It Out

1. Go to: `http://localhost:3000/signup`
2. Create an account
3. Check Supabase → users table (user auto-synced!)
4. Go to dashboard

---

## ✅ What's Done

- ✅ Supabase connected
- ✅ Clerk installed (backend & frontend)
- ✅ Login/Signup pages with Clerk UI
- ✅ Auto user sync to Supabase
- ✅ Protected routes
- ✅ JWT auth still works (backward compatible)

## 📝 What You Need To Do

1. **Get Clerk keys** from dashboard.clerk.com
2. **Add keys** to `.env` files (both backend and frontend)
3. **Restart** both servers
4. **Test** signup/login

---

## 🔧 Clerk Dashboard Setup

1. **Application Name**: "Inventory Management"
2. **Authentication**: 
   - ✅ Email + Password
   - Optional: Google, GitHub
3. **Paths**:
   - Sign in: `/login`
   - Sign up: `/signup`
   - Home: `/dashboard`

---

## 🎯 Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can visit `/login` page
- [ ] Can visit `/signup` page
- [ ] Can create new account
- [ ] User appears in Supabase `users` table
- [ ] Can access `/dashboard` after login
- [ ] Cannot access `/dashboard` when logged out

---

## 🐛 Common Issues

**"Clerk key not found"**
→ Add keys to `.env.local` and restart frontend

**"Cannot connect to database"**
→ Check DATABASE_URL in backend `.env`

**"User not syncing"**
→ Check backend logs, verify CLERK_SECRET_KEY

---

## 📚 Full Guide

See `CLERK_MIGRATION.md` for complete documentation.
