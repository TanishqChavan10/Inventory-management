'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Search, ChevronDownIcon, Plus, DollarSign, TrendingUp, Receipt } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NewTransactionForm } from '@/components/transactions/NewTransactionForm';
import {
  mockProducts,
  mockEmployees,
  mockCustomers,
  generateTransactionId,
  generatePaymentRefNo,
} from '@/data/transactionData';

export default function TransactionsListPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // New Transaction Form State
  const [isNewTransactionFormOpen, setIsNewTransactionFormOpen] = useState(false);

  // Transactions state - start with empty array
  const [transactions, setTransactions] = useState<any[]>([]);

  // Calculate summary stats based on current transactions
  const totalRevenue = transactions
    .filter((t) => t.status === 'Completed')
    .reduce((sum, t) => sum + t.total_amt, 0);

  const todaysSales = transactions.filter(
    (t) =>
      t.transaction_date === new Date().toISOString().split('T')[0] && t.status === 'Completed',
  ).length;

  const totalTransactions = transactions.length;

  // Handler for creating a new transaction
  const handleCreateTransaction = async (transactionData: any) => {
    try {
      console.log('Creating transaction:', transactionData);

      // Generate transaction ID and payment reference if needed
      const transactionId = generateTransactionId();
      const paymentRefNo =
        transactionData.payment_refno || generatePaymentRefNo(transactionData.payment_method);

      // Find customer and employee names for display
      const customer =
        transactionData.customer_id && transactionData.customer_id !== 'walk-in'
          ? mockCustomers.find((c) => c.customer_id === transactionData.customer_id)
          : null;

      const employee = mockEmployees.find((e) => e.employee_id === transactionData.cashier_id);

      // Create the complete transaction object for display
      const newTransaction = {
        transaction_id: transactionId,
        transaction_date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        }),
        total_amt: transactionData.total_amt,
        payment_method: transactionData.payment_method,
        customer: customer ? { name: customer.name } : { name: 'Walk-in Customer' },
        employee: employee ? { name: employee.name } : { name: 'Unknown' },
        status: 'Completed' as const,
        // Store additional data for potential API calls
        customer_id: transactionData.customer_id,
        cashier_id: transactionData.cashier_id,
        payment_refno: paymentRefNo,
        tax_amount: transactionData.tax_amount,
        discount_amount: transactionData.discount_amount,
        subtotal: transactionData.subtotal,
        notes: transactionData.notes,
        items: transactionData.items,
      };

      // Add the new transaction to the state
      setTransactions((prevTransactions) => [newTransaction, ...prevTransactions]);

      // Here you would typically make an API call to save the transaction
      console.log('New transaction created:', newTransaction);

      // Show success message (you can replace this with a proper toast notification)
      alert(`Transaction ${transactionId} created successfully!`);
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error; // Re-throw to let the form handle the error
    }
  };

  const filteredTransactions = useMemo(() => {
    let filteredList = transactions;

    // Filter by search term
    if (searchTerm) {
      filteredList = filteredList.filter(
        (transaction: any) =>
          transaction.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by date
    if (date) {
      filteredList = filteredList.filter((transaction: any) => {
        const transactionDate = new Date(transaction.transaction_date);
        return transactionDate.toDateString() === date.toDateString();
      });
    }

    return filteredList;
  }, [transactions, searchTerm, date]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handleRowClick = (transactionId: string) => {
    router.push(`/transactions/${transactionId}`);
  };

  const handleViewClick = (e: React.MouseEvent, transactionId: string) => {
    e.stopPropagation(); // Prevent row click
    router.push(`/transactions/${transactionId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-black text-white dark:bg-white dark:text-black';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'Credit Card':
      case 'Debit Card':
        return '💳';
      case 'Cash':
        return '💵';
      case 'Mobile Payment':
        return '📱';
      default:
        return '💳';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-8">
      <div className="max-w-8xl mx-auto sm:px-6 lg:px-32 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Transaction Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 ">
              View and manage all sales transactions and payment records.
            </p>
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={() => setIsNewTransactionFormOpen(true)}
          >
            <Plus className="w-4 h-4" />
            New Transaction
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                From completed transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Today&apos;s Sales
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{todaysSales}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Transactions today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Transactions
              </CardTitle>
              <Receipt className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalTransactions}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Transaction History
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                View and manage all sales transactions
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search transactions, customers, or cashiers..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-between">
                    {date ? date.toLocaleDateString() : 'All Status'}
                    <ChevronDownIcon className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      setDate(date);
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              {date && (
                <Button variant="ghost" onClick={() => setDate(undefined)}>
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium text-gray-900 dark:text-white">
                    Transaction ID
                  </TableHead>
                  <TableHead className="font-medium text-gray-900 dark:text-white">
                    Date & Time
                  </TableHead>
                  <TableHead className="font-medium text-gray-900 dark:text-white">
                    Customer
                  </TableHead>
                  <TableHead className="font-medium text-gray-900 dark:text-white">
                    Cashier
                  </TableHead>
                  <TableHead className="font-medium text-gray-900 dark:text-white">
                    Payment Method
                  </TableHead>
                  <TableHead className="text-right font-medium text-gray-900 dark:text-white">
                    Total
                  </TableHead>
                  <TableHead className="font-medium text-gray-900 dark:text-white">
                    Status
                  </TableHead>
                  <TableHead className="font-medium text-gray-900 dark:text-white">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((transaction: any) => (
                    <TableRow
                      key={transaction.transaction_id}
                      className="border-b border-gray-100 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                      onClick={() => handleRowClick(transaction.transaction_id)}
                    >
                      <TableCell className="font-medium text-gray-900 dark:text-white">
                        {transaction.transaction_id}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">
                        <div>
                          <div>{transaction.transaction_date}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.time}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white">
                        {transaction.customer?.name || 'Walk-in Customer'}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">
                        {transaction.employee?.name || 'Unknown'}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <span>{getPaymentMethodIcon(transaction.payment_method)}</span>
                          {transaction.payment_method}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-gray-900 dark:text-white">
                        ${transaction.total_amt.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleViewClick(e, transaction.transaction_id)}
                          className="p-1 h-8 w-8"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center h-32 text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Receipt className="w-8 h-8 text-gray-400" />
                        <div>
                          <p className="font-medium">No transactions found</p>
                          <p className="text-sm">Start by creating your first transaction</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      {/* New Transaction Form Modal */}
      <NewTransactionForm
        isOpen={isNewTransactionFormOpen}
        onClose={() => setIsNewTransactionFormOpen(false)}
        onSubmit={handleCreateTransaction}
        products={mockProducts}
        employees={mockEmployees}
        customers={mockCustomers}
      />
    </div>
  );
}
