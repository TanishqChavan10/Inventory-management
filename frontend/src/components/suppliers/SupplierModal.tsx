import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { SupplierGraphQL } from '@/types';

interface SupplierForm {
  name: string;
  email: string;
  phone_no: string;
  address?: string;
  contact_person?: string;
  registration_number?: string;
  tax_id?: string;
  status: 'Active' | 'Inactive';
}

interface SupplierModalProps {
  isOpen: boolean;
  isEditing: boolean;
  supplier?: SupplierGraphQL | null;
  onSave: (supplierData: SupplierForm) => void;
  onClose: () => void;
  loading?: boolean;
}

export function SupplierModal({
  isOpen,
  isEditing,
  supplier,
  onSave,
  onClose,
  loading = false,
}: SupplierModalProps) {
  const [form, setForm] = useState<SupplierForm>({
    name: '',
    email: '',
    phone_no: '',
    address: '',
    contact_person: '',
    registration_number: '',
    tax_id: '',
    status: 'Active',
  });

  const [errors, setErrors] = useState<Partial<SupplierForm>>({});

  // Reset form when supplier data changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (isEditing && supplier) {
        // Pre-fill form with existing supplier data
        setForm({
          name: supplier.name || '',
          email: supplier.email || '',
          phone_no: supplier.phone_no || '',
          address: supplier.address || '',
          contact_person: supplier.contact_person || '',
          registration_number: supplier.registration_number || '',
          tax_id: supplier.tax_id || '',
          status: supplier.status || 'Active',
        });
      } else {
        // Reset form for new supplier
        setForm({
          name: '',
          email: '',
          phone_no: '',
          address: '',
          contact_person: '',
          registration_number: '',
          tax_id: '',
          status: 'Active',
        });
      }
      // Clear any existing errors
      setErrors({});
    }
  }, [isOpen, isEditing, supplier]);

  const validateForm = (): boolean => {
    const newErrors: Partial<SupplierForm> = {};

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!form.phone_no.trim()) {
      newErrors.phone_no = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSave(form);
  };

  const handleInputChange = (field: keyof SupplierForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Supplier' : 'Add New Supplier'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 h-8 w-8"
            disabled={loading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Enter the details for the {isEditing ? 'supplier' : 'new supplier you want to add'}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="block font-medium mb-1 dark:text-gray-200">
              Supplier Name *
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter supplier name"
              className={`w-full ${errors.name ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="block font-medium mb-1 dark:text-gray-200">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
              className={`w-full ${errors.email ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone_no" className="block font-medium mb-1 dark:text-gray-200">
              Phone Number *
            </Label>
            <Input
              id="phone_no"
              value={form.phone_no}
              onChange={(e) => handleInputChange('phone_no', e.target.value)}
              placeholder="Enter phone number"
              className={`w-full ${errors.phone_no ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {errors.phone_no && <p className="text-red-500 text-sm mt-1">{errors.phone_no}</p>}
          </div>

          {/* Contact Person */}
          <div>
            <Label htmlFor="contact_person" className="block font-medium mb-1 dark:text-gray-200">
              Contact Person
            </Label>
            <Input
              id="contact_person"
              value={form.contact_person}
              onChange={(e) => handleInputChange('contact_person', e.target.value)}
              placeholder="Enter contact person name"
              className="w-full"
              disabled={loading}
            />
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address" className="block font-medium mb-1 dark:text-gray-200">
              Address
            </Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter address"
              className="w-full"
              disabled={loading}
            />
          </div>

          {/* Registration Number */}
          <div>
            <Label
              htmlFor="registration_number"
              className="block font-medium mb-1 dark:text-gray-200"
            >
              Registration Number
            </Label>
            <Input
              id="registration_number"
              value={form.registration_number}
              onChange={(e) => handleInputChange('registration_number', e.target.value)}
              placeholder="Enter registration number"
              className="w-full"
              disabled={loading}
            />
          </div>

          {/* Tax ID */}
          <div>
            <Label htmlFor="tax_id" className="block font-medium mb-1 dark:text-gray-200">
              Tax ID
            </Label>
            <Input
              id="tax_id"
              value={form.tax_id}
              onChange={(e) => handleInputChange('tax_id', e.target.value)}
              placeholder="Enter tax ID"
              className="w-full"
              disabled={loading}
            />
          </div>

          {/* Status */}
          <div>
            <Label className="block font-medium mb-2 dark:text-gray-200">Status</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleInputChange('status', 'Active')}
                disabled={loading}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  form.status === 'Active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('status', 'Inactive')}
                disabled={loading}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  form.status === 'Inactive'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditing ? 'Update Supplier' : 'Add Supplier'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
