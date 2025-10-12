'use client';

import { useEmployees } from '@/hooks/useTransactions';

export function EmployeeQueryTest() {
  const { employees, loading, error } = useEmployees();

  if (loading) return <div>Loading employees...</div>;
  if (error) return <div>Error loading employees: {error.message}</div>;

  return (
    <div>
      <h2>Employees Query Test</h2>
      {employees.length === 0 ? (
        <p>No employees found</p>
      ) : (
        <ul>
          {employees.map((employee: any) => (
            <li key={employee.employee_id}>
              ID: {employee.employee_id}, Name: {employee.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
