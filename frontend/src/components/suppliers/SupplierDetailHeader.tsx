import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Mail, Phone, Building } from 'lucide-react';
import Link from 'next/link';
import type { SupplierDetailHeaderProps } from '@/types';

export function SupplierDetailHeader({ supplier }: SupplierDetailHeaderProps) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/suppliers">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{supplier.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Supplier ID: {supplier.supplier_id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={supplier.status === 'Active' ? 'default' : 'secondary'}
            className={
              supplier.status === 'Active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-gray-300'
            }
          >
            {supplier.status}
          </Badge>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Supplier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
          <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{supplier.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
          <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Phone</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{supplier.phone_no}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
          <Building className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Registration</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {supplier.registration_number || 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
          <div className="w-5 h-5 bg-orange-600 dark:bg-orange-400 rounded" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Member Since</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {new Date(supplier.created_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
