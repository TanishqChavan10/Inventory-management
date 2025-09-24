import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility functions to ensure consistent formatting between server and client
export function formatCurrency(amount: number): string {
  // Use a consistent locale to avoid hydration issues
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  // Use a consistent locale to avoid hydration issues
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatDate(date: string | Date): string {
  // Use a consistent locale and format to avoid hydration issues
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
}

export function formatDateTime(date: string | Date): string {
  // Use a consistent locale and format to avoid hydration issues
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

export function formatTime(date: string | Date): string {
  // Use a consistent locale and format to avoid hydration issues
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(dateObj);
}
