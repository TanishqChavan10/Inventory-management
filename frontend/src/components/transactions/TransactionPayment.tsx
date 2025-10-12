import { Badge } from '@/components/ui/badge';
import { CreditCard, Clock, CheckCircle, AlertCircle, IndianRupee } from 'lucide-react';
import { formatIndianRupee } from '@/lib/formatters';
import type { TransactionPaymentProps } from '@/types';

export function TransactionPayment({ transaction }: TransactionPaymentProps) {
  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'Pending':
        return <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'Failed':
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Information */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Payment Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {getPaymentStatusIcon(transaction.status)}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Payment Status</p>
                <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Payment Method</p>
                <p className="text-gray-600 dark:text-gray-400">{transaction.payment_method}</p>
              </div>
            </div>

            {transaction.payment_refno && (
              <div className="flex items-center gap-3">
                <IndianRupee className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Reference Number</p>
                  <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                    {transaction.payment_refno}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Payment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatIndianRupee(transaction.subtotal)}
                  </span>
                </div>

                {transaction.discount_amount && transaction.discount_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      -{formatIndianRupee(transaction.discount_amount)}
                    </span>
                  </div>
                )}

                {transaction.tax_amount && transaction.tax_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatIndianRupee(transaction.tax_amount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-neutral-600">
                  <span className="font-medium text-gray-900 dark:text-white">Total Amount:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {formatIndianRupee(transaction.total_amt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Notes */}
      {transaction.notes && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Transaction Notes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
            {transaction.notes}
          </p>
        </div>
      )}
    </div>
  );
}
