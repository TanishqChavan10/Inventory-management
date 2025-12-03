'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, Check, Loader2, AlertCircle, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMutation } from '@apollo/client';
import { ACCEPT_INVITE } from '@/app/graphql/auth';
import { toast } from 'sonner';

interface InviteDetails {
  companyName: string;
  invitedRole: string;
  inviterName: string;
}

export default function InviteAcceptancePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [inviteDetails, setInviteDetails] = useState<InviteDetails | null>(null);
  const [error, setError] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    const validateInvite = async () => {
      if (!token) {
        setError('Invalid invite link. Please check your email for a valid invitation.');
        setIsLoading(false);
        return;
      }

      try {
        // TODO: Implement invite validation API call
        // For now, simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Simulate invite details
        setInviteDetails({
          companyName: 'Orion Electronics Pvt. Ltd.',
          invitedRole: 'Manager',
          inviterName: 'Riya Sharma',
        });
      } catch (error) {
        setError('This invite link is invalid or has expired.');
      } finally {
        setIsLoading(false);
      }
    };

    validateInvite();
  }, [token]);

  const [acceptInvite, { loading: acceptLoading }] = useMutation(ACCEPT_INVITE);

  const handleAcceptInvite = async () => {
    setIsAccepting(true);

    try {
      const { data } = await acceptInvite({
        variables: { token },
      });

      if (data?.acceptInvite?.success) {
        toast.success(`You've joined ${inviteDetails?.companyName}!`);

        // TODO: Set active company
        // TODO: Redirect to dashboard

        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error('Failed to accept invite. Please try again.');
    } finally {
      setIsAccepting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Validating your invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <Button
            onClick={() => router.push('/onboarding/join-company')}
            className="bg-slate-600 hover:bg-slate-700 text-white"
          >
            Try Joining with Code
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-lg mx-auto text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
            <Users className="h-4 w-4" />
            Team Invitation
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            You've been invited!
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Join your team and start collaborating on inventory management
          </p>
        </div>

        {/* Invite Details Card */}
        {inviteDetails && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-lg mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center">
                <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {inviteDetails.companyName}
            </h2>

            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="font-medium">Role:</span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm">
                  {inviteDetails.invitedRole}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="font-medium">Invited by:</span>
                <span>{inviteDetails.inviterName}</span>
              </div>
            </div>

            <Button
              onClick={handleAcceptInvite}
              disabled={isAccepting || acceptLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {isAccepting || acceptLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Joining Team...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Accept Invitation
                </>
              )}
            </Button>
          </div>
        )}

        {/* Footer */}
        <p className="text-sm text-slate-500 dark:text-slate-400">
          By accepting this invitation, you'll have access to the company's inventory management
          system.
        </p>
      </div>
    </div>
  );
}
