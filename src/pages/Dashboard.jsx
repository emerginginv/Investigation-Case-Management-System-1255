import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import { useData } from '../context/DataContext';
import { format } from 'date-fns';

const { FiFolder, FiUsers, FiDollarSign, FiClock, FiTrendingUp, FiAlertTriangle, FiCheck } = FiIcons;

const Dashboard = () => {
  const { accounts, cases, expenses, invoices } = useData();

  const stats = [
    {
      name: 'Active Cases',
      value: cases.filter(c => c.status === 'Active').length,
      icon: FiFolder,
      color: 'text-primary-600',
      bg: 'bg-primary-50'
    },
    {
      name: 'Total Accounts',
      value: accounts.length,
      icon: FiUsers,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      name: 'Monthly Revenue',
      value: `$${invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}`,
      icon: FiDollarSign,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      name: 'Overdue Tasks',
      value: cases.reduce((sum, c) => sum + c.tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Completed').length, 0),
      icon: FiClock,
      color: 'text-red-600',
      bg: 'bg-red-50'
    }
  ];

  const recentCases = cases.slice(0, 5);
  const upcomingTasks = cases.flatMap(c => 
    c.tasks.map(task => ({ ...task, caseTitle: c.title, caseId: c.id }))
  ).filter(task => task.status !== 'Completed').slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your investigations.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <SafeIcon icon={stat.icon} className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Cases */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Cases</h2>
            <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentCases.map((case_) => (
              <div key={case_.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{case_.title}</h3>
                  <p className="text-sm text-gray-500">Created {format(case_.createdAt, 'MMM d, yyyy')}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={case_.status === 'Active' ? 'success' : 'default'}>
                    {case_.status}
                  </Badge>
                  <Badge variant={case_.priority === 'High' ? 'danger' : case_.priority === 'Medium' ? 'warning' : 'default'}>
                    {case_.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
            <SafeIcon icon={FiClock} className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-500">{task.caseTitle}</p>
                  <p className="text-xs text-gray-400">Due {format(task.dueDate, 'MMM d, yyyy')}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={task.status === 'In Progress' ? 'info' : 'default'}>
                    {task.status}
                  </Badge>
                  {new Date(task.dueDate) < new Date() && (
                    <SafeIcon icon={FiAlertTriangle} className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {cases.flatMap(c => c.updates).slice(0, 10).map((update, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-primary-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{update.content}</p>
                <p className="text-xs text-gray-500">
                  {update.author} • {format(update.timestamp, 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;