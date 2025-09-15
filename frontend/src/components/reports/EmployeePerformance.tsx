import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Target, 
  Clock, 
  Star, 
  Award, 
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { Employee, EmployeeMetrics } from '@/types';

interface EmployeePerformanceProps {
  employees?: Employee[];
  period?: 'daily' | 'weekly' | 'monthly';
  departmentFilter?: string;
}

// Mock employee performance data
const mockEmployeeMetrics: EmployeeMetrics[] = [
  {
    employee_id: 'EMP001',
    employee_name: 'Sarah Johnson',
    transactions_handled: 156,
    total_sales: 23450.75,
    avg_transaction_value: 150.33,
    customer_rating: 4.8,
    efficiency_score: 92,
  },
  {
    employee_id: 'EMP002',
    employee_name: 'Michael Chen',
    transactions_handled: 89,
    total_sales: 18200.30,
    avg_transaction_value: 204.50,
    customer_rating: 4.6,
    efficiency_score: 88,
  },
  {
    employee_id: 'EMP003',
    employee_name: 'Emily Rodriguez',
    transactions_handled: 134,
    total_sales: 15670.45,
    avg_transaction_value: 116.94,
    customer_rating: 4.9,
    efficiency_score: 95,
  },
  {
    employee_id: 'EMP004',
    employee_name: 'David Kim',
    transactions_handled: 201,
    total_sales: 31200.80,
    avg_transaction_value: 155.22,
    customer_rating: 4.7,
    efficiency_score: 90,
  }
];

// Extended employee data for UI purposes
const extendedEmployeeData = [
  {
    ...mockEmployeeMetrics[0],
    department: 'Sales',
    position: 'Sales Associate',
    attendanceRate: 97.5,
    goals: { salesTarget: 25000, completed: 23450.75, percentage: 93.8 },
    achievements: ['Top Performer', 'Customer Favorite'],
    recentActivities: [
      { date: '2024-01-15', action: 'Completed high-value transaction', amount: 1200 },
      { date: '2024-01-14', action: 'Resolved customer complaint', rating: 5 },
      { date: '2024-01-13', action: 'Processed bulk order', amount: 850 }
    ]
  },
  {
    ...mockEmployeeMetrics[1],
    department: 'Inventory',
    position: 'Inventory Manager',
    attendanceRate: 95.2,
    goals: { salesTarget: 20000, completed: 18200.30, percentage: 91.0 },
    achievements: ['Efficiency Expert'],
    recentActivities: [
      { date: '2024-01-15', action: 'Optimized stock levels', category: 'Dairy' },
      { date: '2024-01-14', action: 'Prevented stockout', items: 5 },
      { date: '2024-01-13', action: 'Quality inspection', passed: 98 }
    ]
  },
  {
    ...mockEmployeeMetrics[2],
    department: 'Customer Service',
    position: 'Service Representative',
    attendanceRate: 98.7,
    goals: { salesTarget: 18000, completed: 15670.45, percentage: 87.1 },
    achievements: ['Customer Champion', 'Perfect Attendance'],
    recentActivities: [
      { date: '2024-01-15', action: 'Handled customer inquiry', satisfaction: 5 },
      { date: '2024-01-14', action: 'Processed return', efficiency: 'High' },
      { date: '2024-01-13', action: 'Upsold product', amount: 45 }
    ]
  },
  {
    ...mockEmployeeMetrics[3],
    department: 'Sales',
    position: 'Senior Sales Executive',
    attendanceRate: 94.8,
    goals: { salesTarget: 35000, completed: 31200.80, percentage: 89.1 },
    achievements: ['Team Leader'],
    recentActivities: [
      { date: '2024-01-15', action: 'Closed major deal', amount: 2500 },
      { date: '2024-01-14', action: 'Mentored new employee', hours: 2 },
      { date: '2024-01-13', action: 'Customer presentation', outcome: 'Successful' }
    ]
  }
];

const departmentSummary = {
  'Sales': { employees: 8, avgPerformance: 91.2, totalRevenue: 124500 },
  'Inventory': { employees: 5, avgPerformance: 87.8, totalRevenue: 89200 },
  'Customer Service': { employees: 6, avgPerformance: 93.5, totalRevenue: 67800 },
  'Management': { employees: 3, avgPerformance: 89.7, totalRevenue: 45600 }
};

export const EmployeePerformance: React.FC<EmployeePerformanceProps> = ({
  period = 'monthly',
  departmentFilter = 'All'
}) => {
  const extendedData = extendedEmployeeData;
  const filteredMetrics = departmentFilter === 'All' 
    ? extendedData 
    : extendedData.filter(emp => emp.department === departmentFilter);

  const topPerformer = filteredMetrics.reduce((top, emp) => 
    emp.efficiency_score > top.efficiency_score ? emp : top
  );

  const getPerformanceBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">Excellent</Badge>;
    if (score >= 80) return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">Good</Badge>;
    if (score >= 70) return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">Average</Badge>;
    return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">Needs Improvement</Badge>;
  };

  const getSatisfactionStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-gray-600 text-gray-600' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Department Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(departmentSummary).map(([dept, data]) => (
          <Card key={dept}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {dept}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Employees</span>
                <span className="font-semibold">{data.employees}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Avg Performance</span>
                <span className="font-semibold">{data.avgPerformance}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Total Revenue</span>
                <span className="font-semibold">${data.totalRevenue.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Performer Spotlight */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            Top Performer of the {period.charAt(0).toUpperCase() + period.slice(1)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {topPerformer.employee_name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {topPerformer.position} • {topPerformer.department}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm">{topPerformer.efficiency_score}% Performance</span>
                </div>
                <div className="flex items-center gap-1">
                  {getSatisfactionStars(Math.floor(topPerformer.customer_rating))}
                  <span className="text-sm ml-1">{topPerformer.customer_rating}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {topPerformer.achievements.map((achievement) => (
                  <Badge key={achievement} className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                    {achievement}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                ${topPerformer.total_sales.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Revenue Generated
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Employee Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMetrics.map((employee) => (
              <div 
                key={employee.employee_id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {employee.employee_name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {employee.position} • {employee.department}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {getPerformanceBadge(employee.efficiency_score)}
                      <span className="text-xs text-gray-500">
                        {employee.attendanceRate}% Attendance
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {employee.transactions_handled}
                    </div>
                    <div className="text-xs text-gray-500">Transactions</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                      ${employee.total_sales.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {getSatisfactionStars(Math.floor(employee.customer_rating))}
                    </div>
                    <div className="text-xs text-gray-500">{employee.customer_rating} Rating</div>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                      {employee.goals.percentage.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Goal Progress</div>
                  </div>

                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Employee Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredMetrics.slice(0, 2).map((employee) => (
              <div key={employee.employee_id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium">{employee.employee_name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {employee.department}
                  </Badge>
                </div>
                {employee.recentActivities.slice(0, 2).map((activity, index) => (
                  <div key={index} className="ml-6 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {activity.action}
                      </span>
                      <span className="text-xs text-gray-500">{activity.date}</span>
                    </div>
                    {'amount' in activity && activity.amount && (
                      <div className="text-xs text-green-600 font-medium">
                        ${activity.amount.toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};