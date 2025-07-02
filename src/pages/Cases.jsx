import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import { useData } from '../context/DataContext';
import { format } from 'date-fns';

const { FiPlus, FiSearch, FiFilter, FiEye, FiCalendar, FiUser, FiClock } = FiIcons;

const Cases = () => {
  const { cases, accounts } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || case_.status === statusFilter;
    const matchesType = !typeFilter || case_.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getAccount = (accountId) => accounts.find(acc => acc.id === accountId);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'default';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Closed': return 'default';
      case 'On Hold': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cases</h1>
          <p className="text-gray-600 mt-2">Manage and track investigation cases</p>
        </div>
        <Button>
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          New Case
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
            <option value="On Hold">On Hold</option>
          </select>
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="Insurance Fraud">Insurance Fraud</option>
            <option value="Surveillance">Surveillance</option>
            <option value="Background Check">Background Check</option>
            <option value="Missing Person">Missing Person</option>
          </select>
        </div>
      </Card>

      {/* Cases List */}
      <div className="space-y-4">
        {filteredCases.map((case_, index) => {
          const account = getAccount(case_.accountId);
          return (
            <motion.div
              key={case_.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{case_.title}</h3>
                      <Badge variant={getStatusColor(case_.status)}>{case_.status}</Badge>
                      <Badge variant={getPriorityColor(case_.priority)}>{case_.priority}</Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{case_.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <SafeIcon icon={FiUser} className="w-4 h-4 mr-2" />
                        <div>
                          <div className="font-medium">Account</div>
                          <div>{account?.name || 'Unknown'}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-2" />
                        <div>
                          <div className="font-medium">Created</div>
                          <div>{format(case_.createdAt, 'MMM d, yyyy')}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <SafeIcon icon={FiClock} className="w-4 h-4 mr-2" />
                        <div>
                          <div className="font-medium">Due Date</div>
                          <div>{format(case_.dueDate, 'MMM d, yyyy')}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <SafeIcon icon={FiUser} className="w-4 h-4 mr-2" />
                        <div>
                          <div className="font-medium">Assigned To</div>
                          <div>{case_.assignedTo}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link to={`/cases/${case_.id}`}>
                      <Button variant="outline" size="sm">
                        <SafeIcon icon={FiEye} className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
                
                {/* Progress Indicators */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex space-x-6">
                      <span>{case_.subjects?.length || 0} Subjects</span>
                      <span>{case_.vehicles?.length || 0} Vehicles</span>
                      <span>{case_.locations?.length || 0} Locations</span>
                      <span>{case_.tasks?.length || 0} Tasks</span>
                      <span>{case_.events?.length || 0} Events</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">Progress:</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ 
                            width: `${Math.round((case_.tasks?.filter(t => t.status === 'Completed').length || 0) / Math.max(case_.tasks?.length || 1, 1) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredCases.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-gray-500">
            <SafeIcon icon={FiSearch} className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No cases found</h3>
            <p>Try adjusting your search criteria or create a new case.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Cases;