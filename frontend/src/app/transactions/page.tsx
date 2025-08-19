'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
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
import { Eye, Search, ChevronDownIcon } from 'lucide-react';
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
import { Label } from '@/components/ui/label';

// --- Mock Data for the transactions list ---
const mockTransactionsList = [
  {
    transaction_id: 'T001',
    transaction_date: '2025-08-15',
    total_amt: 245.5,
    payment_method: 'Credit Card',
    customer: { name: 'Rohan Sharma' },
    employee: { name: 'Priya Singh' },
  },
  {
    transaction_id: 'T002',
    transaction_date: '2025-08-15',
    total_amt: 390.0,
    payment_method: 'UPI',
    customer: { name: 'Anjali Mehta' },
    employee: { name: 'Amit Kumar' },
  },
  {
    transaction_id: 'T003',
    transaction_date: '2025-08-14',
    total_amt: 520.0,
    payment_method: 'Cash',
    customer: { name: 'Vikram Rathod' },
    employee: { name: 'Priya Singh' },
  },
  // Add more mock transactions to test pagination
  {
    transaction_id: 'T004',
    transaction_date: '2025-08-14',
    total_amt: 150.0,
    payment_method: 'Debit Card',
    customer: { name: 'Sneha Patil' },
    employee: { name: 'Amit Kumar' },
  },
  {
    transaction_id: 'T005',
    transaction_date: '2025-08-13',
    total_amt: 85.0,
    payment_method: 'Cash',
    customer: { name: 'Raj Verma' },
    employee: { name: 'Priya Singh' },
  },
  {
    transaction_id: 'T006',
    transaction_date: '2025-08-13',
    total_amt: 300.0,
    payment_method: 'Credit Card',
    customer: { name: 'Pooja Desai' },
    employee: { name: 'Amit Kumar' },
  },
];

export default function TransactionsListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredTransactions = useMemo(() => {
    let transactions = mockTransactionsList;

    // Filter by search term
    if (searchTerm) {
      transactions = transactions.filter(
        (transaction) =>
          transaction.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.employee.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by date
    if (date) {
      transactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.transaction_date);
        return transactionDate.toDateString() === date.toDateString();
      });
    }

    return transactions;
  }, [searchTerm, date]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  return (
    <div className="w-full px-4 py-10 sm:px-6 lg:px-8 bg-gray-50 dark:bg-black text-black dark:text-white min-h-screen">
      <header className="mb-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight">All Transactions</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
          Browse and manage all sales records.
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by ID, customer, or cashier..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="pl-10 w-full md:w-80"
            />
          </div>
          <div className="flex flex-col gap-3">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-full md:w-48 justify-between font-normal"
                >
                  {date ? date.toLocaleDateString() : 'Select date'}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown-buttons"
                  fromYear={2024}
                  toYear={2026}
                  onSelect={(date) => {
                    setDate(date);
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          {date && (
            <Button variant="ghost" onClick={() => setDate(undefined)}>
              Reset Date
            </Button>
          )}
        </div>
        <div className="border rounded-lg overflow-hidden bg-white dark:bg-neutral-900 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Cashier</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction.transaction_id}>
                    <TableCell className="font-medium">{transaction.transaction_id}</TableCell>
                    <TableCell>{transaction.transaction_date}</TableCell>
                    <TableCell>{transaction.customer.name}</TableCell>
                    <TableCell>{transaction.employee.name}</TableCell>
                    <TableCell className="text-right">
                      ₹{transaction.total_amt.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Link href={`/transactions/${transaction.transaction_id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    No transactions found for the selected criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <Pagination className="mt-6">
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
        )}
      </main>
    </div>
  );
}
