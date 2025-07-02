import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([
    {
      id: '1',
      name: 'Meridian Insurance Corp',
      type: 'Corporate',
      retainer: 25000,
      remainingRetainer: 18500,
      contacts: [
        {
          id: '1',
          name: 'Sarah Mitchell',
          role: 'Claims Manager',
          email: 'sarah.mitchell@meridian.com',
          phone: '(555) 123-4567',
          preferred: true
        }
      ],
      serviceHistory: ['Insurance Fraud Investigation', 'Asset Recovery'],
      createdAt: new Date('2024-01-15'),
      status: 'Active'
    },
    {
      id: '2',
      name: 'Thompson & Associates Law',
      type: 'Legal',
      retainer: 15000,
      remainingRetainer: 12300,
      contacts: [
        {
          id: '2',
          name: 'Michael Thompson',
          role: 'Partner',
          email: 'mthompson@tlaw.com',
          phone: '(555) 987-6543',
          preferred: true
        }
      ],
      serviceHistory: ['Background Checks', 'Surveillance'],
      createdAt: new Date('2024-02-01'),
      status: 'Active'
    }
  ]);

  const [cases, setCases] = useState([
    {
      id: '1',
      title: 'Insurance Fraud - Vehicle Claim',
      accountId: '1',
      contactId: '1',
      status: 'Active',
      priority: 'High',
      type: 'Insurance Fraud',
      createdAt: new Date('2024-03-01'),
      dueDate: new Date('2024-04-15'),
      assignedTo: 'Detective Smith',
      description: 'Investigate suspicious vehicle damage claim',
      subjects: [
        {
          id: '1',
          name: 'Robert Chen',
          aliases: ['Bob Chen', 'R. Chen'],
          relationship: 'Claimant',
          notes: 'Primary suspect in fraudulent claim',
          images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face']
        }
      ],
      vehicles: [
        {
          id: '1',
          make: 'Toyota',
          model: 'Camry',
          year: '2020',
          plate: 'ABC-123',
          color: 'Silver',
          vin: '1HGBH41JXMN109186',
          notes: 'Alleged damage to front bumper'
        }
      ],
      locations: [
        {
          id: '1',
          name: 'Incident Location',
          address: '123 Main St, Anytown, ST 12345',
          coordinates: { lat: 40.7128, lng: -74.0060 },
          type: 'Incident Site',
          notes: 'Location of alleged accident'
        }
      ],
      tasks: [
        {
          id: '1',
          title: 'Interview claimant',
          assignee: 'Detective Smith',
          dueDate: new Date('2024-03-15'),
          status: 'In Progress',
          priority: 'High',
          notes: 'Schedule and conduct initial interview'
        }
      ],
      events: [
        {
          id: '1',
          type: 'Surveillance',
          date: new Date('2024-03-05'),
          location: '123 Main St',
          notes: 'Subject observed at incident location',
          investigator: 'Detective Smith'
        }
      ],
      updates: [
        {
          id: '1',
          content: 'Case opened and initial investigation begun',
          author: 'Detective Smith',
          timestamp: new Date('2024-03-01'),
          type: 'status'
        }
      ],
      expenses: [
        {
          id: '1',
          category: 'Travel',
          amount: 150.00,
          description: 'Mileage to investigation site',
          date: new Date('2024-03-05'),
          receipt: null
        }
      ]
    }
  ]);

  const [expenses, setExpenses] = useState([
    {
      id: '1',
      caseId: '1',
      category: 'Travel',
      amount: 150.00,
      description: 'Mileage to investigation site',
      date: new Date('2024-03-05'),
      receipt: null,
      billable: true
    }
  ]);

  const [invoices, setInvoices] = useState([
    {
      id: '1',
      accountId: '1',
      caseId: '1',
      number: 'INV-2024-001',
      amount: 2500.00,
      status: 'Sent',
      dueDate: new Date('2024-04-01'),
      createdAt: new Date('2024-03-01'),
      items: [
        {
          description: 'Investigation Services - 20 hours',
          quantity: 20,
          rate: 125.00,
          amount: 2500.00
        }
      ]
    }
  ]);

  // Helper functions
  const addAccount = (account) => {
    const newAccount = {
      ...account,
      id: Date.now().toString(),
      createdAt: new Date(),
      contacts: [],
      serviceHistory: []
    };
    setAccounts(prev => [...prev, newAccount]);
    return newAccount;
  };

  const updateAccount = (id, updates) => {
    setAccounts(prev => prev.map(account => 
      account.id === id ? { ...account, ...updates } : account
    ));
  };

  const addCase = (caseData) => {
    const newCase = {
      ...caseData,
      id: Date.now().toString(),
      createdAt: new Date(),
      subjects: [],
      vehicles: [],
      locations: [],
      tasks: [],
      events: [],
      updates: [],
      expenses: []
    };
    setCases(prev => [...prev, newCase]);
    return newCase;
  };

  const updateCase = (id, updates) => {
    setCases(prev => prev.map(case_ => 
      case_.id === id ? { ...case_, ...updates } : case_
    ));
  };

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString()
    };
    setExpenses(prev => [...prev, newExpense]);
    return newExpense;
  };

  const value = {
    accounts,
    cases,
    expenses,
    invoices,
    addAccount,
    updateAccount,
    addCase,
    updateCase,
    addExpense,
    setAccounts,
    setCases,
    setExpenses,
    setInvoices
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};