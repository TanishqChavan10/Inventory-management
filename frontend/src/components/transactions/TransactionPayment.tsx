import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, RefreshCw, Clock, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import type { TransactionPaymentProps } from '@/types';

export function TransactionPayment({ transaction, refundHistory }: TransactionPaymentProps) {
  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'Pending':
        return <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'Failed':
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'Refunded':
        return <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
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
      case 'Refunded':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleProcessRefund = () => {
    toast.info('Refund process initiated');
  };

  const totalRefunded = refundHistory?.reduce((sum, refund) => sum + refund.amount, 0) || 0;
  const remainingAmount = transaction.total_amt - totalRefunded;

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
                <Badge className={getStatusColor(transaction.status)}>
                  {transaction.status}
                </Badge>
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
                <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
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
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                Payment Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Original Amount:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${transaction.total_amt.toFixed(2)}
                  </span>
                </div>
                {totalRefunded > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Refunded:</span>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        -${totalRefunded.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-neutral-600">
                      <span className="font-medium text-gray-900 dark:text-white">Net Amount:</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        ${remainingAmount.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {transaction.status === 'Completed' && remainingAmount > 0 && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleProcessRefund}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Process Refund
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Refund History */}
      {refundHistory && refundHistory.length > 0 && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Refund History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-neutral-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Refund ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Date
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Reason
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Processed By
                  </th>
                </tr>
              </thead>
              <tbody>
                {refundHistory.map((refund) => (
                  <tr
                    key={refund.refund_id}
                    className="border-b border-gray-100 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {refund.refund_id}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {new Date(refund.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-red-600 dark:text-red-400">
                      ${refund.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {refund.reason}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {refund.processed_by}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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