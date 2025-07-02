import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useData } from '../context/DataContext';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const { FiDownload, FiPrinter, FiShare2, FiBarChart, FiPieChart, FiTrendingUp } = FiIcons;

const Reports = () => {
  const { cases, expenses, invoices, accounts } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');

  const generateReport = () => {
    const currentDate = new Date();
    let startDate, endDate;

    switch (selectedPeriod) {
      case 'current-month':
        startDate = startOfMonth(currentDate);
        endDate = endOfMonth(currentDate);
        break;
      case 'last-month':
        const lastMonth = subMonths(currentDate, 1);
        startDate = startOfMonth(lastMonth);
        endDate = endOfMonth(lastMonth);
        break;
      case 'last-3-months':
        startDate = subMonths(currentDate, 3);
        endDate = currentDate;
        break;
      default:
        startDate = startOfMonth(currentDate);
        endDate = endOfMonth(currentDate);
    }

    const filteredCases = cases.filter(c => 
      c.createdAt >= startDate && c.createdAt <= endDate
    );
    const filteredExpenses = expenses.filter(e => 
      e.date >= startDate && e.date <= endDate
    );
    const filteredInvoices = invoices.filter(i => 
      i.createdAt >= startDate && i.createdAt <= endDate
    );

    return {
      period: { startDate, endDate },
      cases: filteredCases,
      expenses: filteredExpenses,
      invoices: filteredInvoices,
      totalRevenue: filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      totalExpenses: filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0),
      activeCases: filteredCases.filter(c => c.status === 'Active').length,
      completedCases: filteredCases.filter(c => c.status === 'Closed').length
    };
  };

  const reportData = generateReport();

  const reportSections = [
    {
      title: 'Case Performance',
      icon: FiBarChart,
      data: [
        { label: 'Total Cases', value: reportData.cases.length },
        { label: 'Active Cases', value: reportData.activeCases },
        { label: 'Completed Cases', value: reportData.completedCases },
        { label: 'Success Rate', value: `${Math.round((reportData.completedCases / Math.max(reportData.cases.length, 1)) * 100)}%` }
      ]
    },
    {
      title: 'Financial Summary',
      icon: FiPieChart,
      data: [
        { label: 'Total Revenue', value: `$${reportData.totalRevenue.toLocaleString()}` },
        { label: 'Total Expenses', value: `$${reportData.totalExpenses.toLocaleString()}` },
        { label: 'Net Profit', value: `$${(reportData.totalRevenue - reportData.totalExpenses).toLocaleString()}` },
        { label: 'Profit Margin', value: `${Math.round(((reportData.totalRevenue - reportData.totalExpenses) / Math.max(reportData.totalRevenue, 1)) * 100)}%` }
      ]
    },
    {
      title: 'Account Activity',
      icon: FiTrendingUp,
      data: [
        { label: 'Total Accounts', value: accounts.length },
        { label: 'Active Accounts', value: accounts.filter(a => a.status === 'Active').length },
        { label: 'Total Retainers', value: `$${accounts.reduce((sum, acc) => sum + acc.retainer, 0).toLocaleString()}` },
        { label: 'Remaining Retainers', value: `$${accounts.reduce((sum, acc) => sum + acc.remainingRetainer, 0).toLocaleString()}` }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">Generate and export business reports</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <SafeIcon icon={FiShare2} className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline">
            <SafeIcon icon={FiPrinter} className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button>
            <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Report Controls */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Report Period</h2>
            <p className="text-sm text-gray-600">
              {format(reportData.period.startDate, 'MMM d, yyyy')} - {format(reportData.period.endDate, 'MMM d, yyyy')}
            </p>
          </div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="current-month">Current Month</option>
            <option value="last-month">Last Month</option>
            <option value="last-3-months">Last 3 Months</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </Card>

      {/* Report Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {reportSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-center mb-4">
                <div className="p-2 bg-primary-100 rounded-lg mr-3">
                  <SafeIcon icon={section.icon} className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              </div>
              <div className="space-y-3">
                {section.data.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cases */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cases This Period</h3>
          <div className="space-y-3">
            {reportData.cases.slice(0, 5).map((case_) => (
              <div key={case_.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{case_.title}</p>
                  <p className="text-sm text-gray-600">{case_.type} • {case_.status}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {format(case_.createdAt, 'MMM d')}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Expenses */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Expenses</h3>
          <div className="space-y-3">
            {reportData.expenses
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 5)
              .map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{expense.description}</p>
                    <p className="text-sm text-gray-600">{expense.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${expense.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{format(expense.date, 'MMM d')}</p>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <div className="text-center">
          <h3 className="text-xl font-bold text-primary-900 mb-2">Executive Summary</h3>
          <p className="text-primary-700 mb-4">
            During this period, you handled {reportData.cases.length} cases, 
            generated ${reportData.totalRevenue.toLocaleString()} in revenue, 
            and maintained a {Math.round(((reportData.totalRevenue - reportData.totalExpenses) / Math.max(reportData.totalRevenue, 1)) * 100)}% profit margin.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary-900">{reportData.cases.length}</p>
              <p className="text-sm text-primary-600">Total Cases</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-900">${reportData.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-primary-600">Revenue</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-900">${reportData.totalExpenses.toLocaleString()}</p>
              <p className="text-sm text-primary-600">Expenses</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-900">
                {Math.round(((reportData.totalRevenue - reportData.totalExpenses) / Math.max(reportData.totalRevenue, 1)) * 100)}%
              </p>
              <p className="text-sm text-primary-600">Profit Margin</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;