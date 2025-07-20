"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// OPTIONAL: If you have user context, import it here
// import { useApp } from "@/context/app-context";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  // OPTIONAL: const { login } = useApp();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    // Save username to localStorage for simple auth/username display (unless using context)
    localStorage.setItem('user', username);
    // OPTIONAL: If using context: login(username);

    // Redirect after login
    router.push('/dashboard');   // or "/"
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-white dark:bg-black transition-colors">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-700 transition-colors"
      >
        <h1 className="text-xl font-bold mb-6 text-center text-black dark:text-white">
          Login
        </h1>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 bg-white dark:bg-neutral-800 text-black dark:text-white transition-colors"
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 bg-white dark:bg-neutral-800 text-black dark:text-white transition-colors"
          required
        />

        <Button
          type="submit"
          className="w-full bg-black text-white border border-white dark:bg-white dark:text-black dark:border-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
        >
          Login
        </Button>
      </form>
    </div>
  );
}
