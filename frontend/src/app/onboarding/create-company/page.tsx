'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Upload, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { CREATE_COMPANY } from '@/app/graphql/auth';
import { toast } from 'sonner';

interface CompanyFormData {
  name: string;
  gstNumber: string;
  currency: string;
  businessType: string;
  logo?: File;
}

export default function CreateCompanyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    gstNumber: '',
    currency: '',
    businessType: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleInputChange = (field: keyof CompanyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
    }
  };

  const [createCompany, { loading: mutationLoading }] = useMutation(CREATE_COMPANY);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.gstNumber || !formData.currency || !formData.businessType) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await createCompany({
        variables: {
          input: {
            name: formData.name,
            gstNumber: formData.gstNumber,
            currency: formData.currency,
            businessType: formData.businessType,
            logo: logoFile,
          },
        },
      });

      if (data?.createCompany) {
        toast.success('Company created successfully!');

        // TODO: Save company ID as active company in context
        // TODO: Redirect to dashboard or company settings

        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create company. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to options
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
            <Building2 className="h-4 w-4" />
            Create Your Company
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Set up your workspace
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Tell us about your business so we can customize your experience
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-lg"
        >
          <div className="space-y-6">
            {/* Company Name */}
            <div>
              <Label
                htmlFor="name"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Company Name *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Orion Electronics Pvt. Ltd."
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-2"
                required
              />
            </div>

            {/* GST Number */}
            <div>
              <Label
                htmlFor="gstNumber"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                GST Number *
              </Label>
              <Input
                id="gstNumber"
                type="text"
                placeholder="e.g., 27XYZAB1234C1Z9"
                value={formData.gstNumber}
                onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                className="mt-2"
                required
              />
            </div>

            {/* Currency */}
            <div>
              <Label
                htmlFor="currency"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Currency *
              </Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleInputChange('currency', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Business Type */}
            <div>
              <Label
                htmlFor="businessType"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Business Type *
              </Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) => handleInputChange('businessType', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="wholesale">Wholesale</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="distribution">Distribution</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Logo Upload */}
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Company Logo (Optional)
              </Label>
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {logoFile ? logoFile.name : 'Click to upload logo'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      PNG, JPG up to 2MB
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || mutationLoading}
            className="w-full mt-8 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          >
            {isLoading || mutationLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating Company...
              </>
            ) : (
              'Create Company'
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Need help?{' '}
          <a
            href="mailto:support@flowventory.com"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
