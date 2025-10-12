'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/auth-context';
import { z } from 'zod';

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().optional(),
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    email: '',
    password: '',
    fullName: '',
  });
  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    try {
      signupSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<SignupFormData> = {};
        for (const issue of error.issues) {
          const path = issue.path[0] as keyof SignupFormData;
          fieldErrors[path] = issue.message;
        }
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName || undefined,
      });

      toast({
        title: 'Account created!',
        description: "You've successfully signed up and logged in.",
        variant: 'default',
      });

      // No need to redirect here as it's handled in auth context
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create an Account</h1>
                <p className="text-muted-foreground text-balance">
                  Sign up to access the inventory management system
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  aria-invalid={!!errors.username}
                  disabled={isLoading}
                />
                {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  aria-invalid={!!errors.email}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="fullName">Full Name (Optional)</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  aria-invalid={!!errors.password}
                  disabled={isLoading}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{' '}
                <a
                  href="/login"
                  className="text-primary font-medium hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push('/login');
                  }}
                >
                  Log in
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/inventoryBg.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking Sign Up, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
