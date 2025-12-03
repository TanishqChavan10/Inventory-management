'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { JOIN_COMPANY_WITH_CODE } from '@/app/graphql/auth';
import { toast } from 'sonner';

export default function JoinCompanyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');

  const [joinCompanyWithCode, { loading: joinLoading }] = useMutation(JOIN_COMPANY_WITH_CODE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteCode.trim()) {
      setError('Please enter an invite code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { data } = await joinCompanyWithCode({
        variables: { code: inviteCode.trim() },
      });

      if (data?.joinCompanyWithCode?.success) {
        toast.success('Successfully joined the company!');

        // TODO: Set active company
        // TODO: Redirect to dashboard

        router.push('/dashboard');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to join company. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to options
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm font-medium mb-6">
            <Users className="h-4 w-4" />
            Join Your Team
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Enter invite code
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Ask your admin for the invite code to join their company
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-lg"
        >
          <div className="space-y-6">
            {/* Invite Code */}
            <div>
              <Label
                htmlFor="inviteCode"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Invite Code *
              </Label>
              <Input
                id="inviteCode"
                type="text"
                placeholder="e.g., ABC123XYZ"
                value={inviteCode}
                onChange={(e) => {
                  setInviteCode(e.target.value.toUpperCase());
                  setError('');
                }}
                className="mt-2 text-center text-lg font-mono tracking-wider"
                maxLength={20}
                required
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                Enter the code exactly as provided by your admin
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || joinLoading || !inviteCode.trim()}
            className="w-full mt-8 h-12 bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            {isLoading || joinLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Joining Company...
              </>
            ) : (
              'Join Company'
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">Can't find your invite code?</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ask your admin to send you a new invitation or check your email for pending invites.
          </p>
        </div>
      </div>
    </div>
  );
}
