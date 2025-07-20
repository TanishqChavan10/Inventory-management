'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    router.push('/');
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-white dark:bg-black transition-colors">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-700"
      >
<<<<<<< HEAD
        <h1 className="text-xl font-bold mb-6 text-center text-black dark:text-white">
          Login
        </h1>

=======
        <h1 className="text-xl font-bold mb-6 text-center text-black">Login</h1>
>>>>>>> 600a76657cc0fa7f6e8e82b45e477d00a169d147
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 bg-white dark:bg-neutral-800 text-black dark:text-white"
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 bg-white dark:bg-neutral-800 text-black dark:text-white"
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
