import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import { useData } from '../context/DataContext';
import { format } from 'date-fns';

const { FiPlus, FiDollarSign, FiFileText, FiTrendingUp, FiClock, FiDownload } = FiIcons;

const Financials = () => {
  const { expenses, invoices, accounts } = useData();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'expenses', name: 'Expenses' },
    { id: 'invoices', name: 'Invoices' },
    { id: 'retainers', name: 'Retainers' }
  ];

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalInvoices = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalRetainers = accounts.reduce((sum, acc) => sum + acc.remainingRetainer, 0);
  const pendingInvoices = invoices.filter(inv => inv.status === 'Sent').length;

  const stats = [
    {
      name: 'Total Expenses',
      value: `$${totalExpenses.toLocaleString()}`,
      icon: FiDollarSign,
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
    {
      name: 'Total Invoiced',
      value: `$${totalInvoices.toLocaleString()}`,
      icon: FiFileText,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      name: 'Retainer Balance',
      value: `$${totalRetainers.toLocaleString()}`,
      icon: FiTrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      name: 'Pending Invoices',
      value: pendingInvoices,
      icon: FiClock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab stats={stats} expenses={expenses} invoices={invoices} />;
      case 'expenses':
        return <ExpensesTab expenses={expenses} />;
      case 'invoices':
        return <InvoicesTab invoices={invoices} accounts={accounts} />;
      case 'retainers':
        return <RetainersTab accounts={accounts} />;
      default:
        return <OverviewTab stats={stats} expenses={expenses} invoices={invoices} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financials</h1>
          <p className="text-gray-600 mt-2">Track expenses, invoices, and retainers</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
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

      {/* Tabs */}
      <Card className="p-0">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          {renderTabContent()}
        </div>
      </Card>
    </div>
  );
};

const OverviewTab = ({ stats, expenses, invoices }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
      <div className="space-y-3">
        {expenses.slice(0, 5).map((expense) => (
          <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{expense.description}</p>
              <p className="text-sm text-gray-600">{expense.category} • {format(expense.date, 'MMM d, yyyy')}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">${expense.amount.toFixed(2)}</p>
              <Badge variant="success" size="sm">Billable</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
    
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Invoices</h3>
      <div className="space-y-3">
        {invoices.slice(0, 5).map((invoice) => (
          <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{invoice.number}</p>
              <p className="text-sm text-gray-600">Due {format(invoice.dueDate, 'MMM d, yyyy')}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">${invoice.amount.toFixed(2)}</p>
              <Badge variant={invoice.status === 'Paid' ? 'success' : 'warning'} size="sm">
                {invoice.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ExpensesTab = ({ expenses }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-900">All Expenses</h3>
      <Button size="sm">
        <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
        Add Expense
      </Button>
    </div>
    
    <div className="space-y-3">
      {expenses.map((expense) => (
        <Card key={expense.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{expense.description}</h4>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                <span>Category: {expense.category}</span>
                <span>Date: {format(expense.date, 'MMM d, yyyy')}</span>
                {expense.caseId && <span>Case ID: {expense.caseId}</span>}
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">${expense.amount.toFixed(2)}</p>
              <Badge variant={expense.billable ? 'success' : 'default'} size="sm">
                {expense.billable ? 'Billable' : 'Non-billable'}
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
    
    <Card className="p-4 bg-primary-50">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-primary-900">Total Expenses:</span>
        <span className="text-xl font-bold text-primary-900">
          ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
        </span>
      </div>
    </Card>
  </div>
);

const InvoicesTab = ({ invoices, accounts }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-900">All Invoices</h3>
      <Button size="sm">
        <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
        Create Invoice
      </Button>
    </div>
    
    <div className="space-y-3">
      {invoices.map((invoice) => {
        const account = accounts.find(acc => acc.id === invoice.accountId);
        return (
          <Card key={invoice.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{invoice.number}</h4>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                  <span>Account: {account?.name}</span>
                  <span>Created: {format(invoice.createdAt, 'MMM d, yyyy')}</span>
                  <span>Due: {format(invoice.dueDate, 'MMM d, yyyy')}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">${invoice.amount.toFixed(2)}</p>
                <Badge variant={invoice.status === 'Paid' ? 'success' : invoice.status === 'Sent' ? 'warning' : 'default'}>
                  {invoice.status}
                </Badge>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  </div>
);

const RetainersTab = ({ accounts }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900">Retainer Balances</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {accounts.map((account) => (
        <Card key={account.id} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">{account.name}</h4>
            <Badge variant={account.remainingRetainer > 5000 ? 'success' : account.remainingRetainer > 1000 ? 'warning' : 'danger'}>
              {account.remainingRetainer > 5000 ? 'Good' : account.remainingRetainer > 1000 ? 'Low' : 'Critical'}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Initial Retainer:</span>
              <span className="font-medium">${account.retainer.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Remaining:</span>
              <span className="font-medium text-green-600">${account.remainingRetainer.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Used:</span>
              <span className="font-medium">${(account.retainer - account.remainingRetainer).toLocaleString()}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  (account.remainingRetainer / account.retainer) > 0.5 ? 'bg-green-600' :
                  (account.remainingRetainer / account.retainer) > 0.2 ? 'bg-yellow-600' : 'bg-red-600'
                }`}
                style={{ width: `${(account.remainingRetainer / account.retainer) * 100}%` }}
              ></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default Financials;