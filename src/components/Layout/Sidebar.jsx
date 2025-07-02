import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiHome, FiUsers, FiFolder, FiDollarSign, FiFileText, FiSettings, FiX } = FiIcons;

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: FiHome },
    { name: 'Accounts', href: '/accounts', icon: FiUsers },
    { name: 'Cases', href: '/cases', icon: FiFolder },
    { name: 'Financials', href: '/financials', icon: FiDollarSign },
    { name: 'Reports', href: '/reports', icon: FiFileText },
    { name: 'Settings', href: '/settings', icon: FiSettings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative lg:translate-x-0 
        z-30 flex flex-col w-80 h-full bg-white shadow-xl
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiFolder} className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">InvestiPro</h1>
              <p className="text-sm text-gray-500">Case Management</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
              onClick={() => setOpen(false)}
            >
              <SafeIcon icon={item.icon} className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-primary-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-primary-900">Need Help?</h3>
            <p className="text-xs text-primary-700 mt-1">Contact support for assistance</p>
            <button className="mt-2 text-xs text-primary-600 hover:text-primary-700 font-medium">
              Get Support
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;