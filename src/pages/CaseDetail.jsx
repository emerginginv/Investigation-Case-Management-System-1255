import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import { useData } from '../context/DataContext';
import { format } from 'date-fns';

const { FiArrowLeft, FiEdit, FiPlus, FiUser, FiCar, FiMapPin, FiList, FiCalendar, FiMessageSquare, FiDollarSign } = FiIcons;

const CaseDetail = () => {
  const { id } = useParams();
  const { cases, accounts } = useData();
  const [activeTab, setActiveTab] = useState('overview');

  const case_ = cases.find(c => c.id === id);
  const account = accounts.find(acc => acc.id === case_?.accountId);

  if (!case_) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Case not found</h2>
        <Link to="/cases" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
          ← Back to Cases
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FiList },
    { id: 'subjects', name: 'Subjects', icon: FiUser, count: case_.subjects?.length || 0 },
    { id: 'vehicles', name: 'Vehicles', icon: FiCar, count: case_.vehicles?.length || 0 },
    { id: 'locations', name: 'Locations', icon: FiMapPin, count: case_.locations?.length || 0 },
    { id: 'tasks', name: 'Tasks', icon: FiList, count: case_.tasks?.length || 0 },
    { id: 'events', name: 'Events', icon: FiCalendar, count: case_.events?.length || 0 },
    { id: 'updates', name: 'Updates', icon: FiMessageSquare, count: case_.updates?.length || 0 },
    { id: 'financials', name: 'Financials', icon: FiDollarSign },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab case_={case_} account={account} />;
      case 'subjects':
        return <SubjectsTab subjects={case_.subjects || []} />;
      case 'vehicles':
        return <VehiclesTab vehicles={case_.vehicles || []} />;
      case 'locations':
        return <LocationsTab locations={case_.locations || []} />;
      case 'tasks':
        return <TasksTab tasks={case_.tasks || []} />;
      case 'events':
        return <EventsTab events={case_.events || []} />;
      case 'updates':
        return <UpdatesTab updates={case_.updates || []} />;
      case 'financials':
        return <FinancialsTab expenses={case_.expenses || []} />;
      default:
        return <OverviewTab case_={case_} account={account} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/cases">
            <Button variant="outline" size="sm">
              <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
              Back to Cases
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{case_.title}</h1>
            <div className="flex items-center space-x-3 mt-2">
              <Badge variant={case_.status === 'Active' ? 'success' : 'default'}>
                {case_.status}
              </Badge>
              <Badge variant={case_.priority === 'High' ? 'danger' : case_.priority === 'Medium' ? 'warning' : 'default'}>
                {case_.priority}
              </Badge>
              <span className="text-gray-500">Case #{case_.id}</span>
            </div>
          </div>
        </div>
        <Button>
          <SafeIcon icon={FiEdit} className="w-4 h-4 mr-2" />
          Edit Case
        </Button>
      </div>

      {/* Tabs */}
      <Card className="p-0">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.name}</span>
                {tab.count !== undefined && (
                  <span className="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                    {tab.count}
                  </span>
                )}
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

// Tab Components
const OverviewTab = ({ case_, account }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Case Description</h3>
        <p className="text-gray-600">{case_.description}</p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h3>
        <div className="space-y-3">
          {case_.updates?.slice(0, 5).map((update) => (
            <div key={update.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <SafeIcon icon={FiMessageSquare} className="w-4 h-4 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{update.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {update.author} • {format(update.timestamp, 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Case Details</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Account:</span>
            <span className="font-medium">{account?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium">{case_.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Assigned To:</span>
            <span className="font-medium">{case_.assignedTo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Created:</span>
            <span className="font-medium">{format(case_.createdAt, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Due Date:</span>
            <span className="font-medium">{format(case_.dueDate, 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Progress</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Tasks Completed</span>
            <span>{case_.tasks?.filter(t => t.status === 'Completed').length || 0} / {case_.tasks?.length || 0}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
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
  </div>
);

const SubjectsTab = ({ subjects }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-900">Subjects</h3>
      <Button size="sm">
        <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
        Add Subject
      </Button>
    </div>
    
    {subjects.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        <SafeIcon icon={FiUser} className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No subjects added yet</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((subject) => (
          <Card key={subject.id} className="p-4">
            <div className="flex items-start space-x-4">
              {subject.images && subject.images[0] && (
                <img 
                  src={subject.images[0]} 
                  alt={subject.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                <p className="text-sm text-gray-600">{subject.relationship}</p>
                {subject.aliases && subject.aliases.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Aliases: {subject.aliases.join(', ')}
                  </p>
                )}
                {subject.notes && (
                  <p className="text-sm text-gray-600 mt-2">{subject.notes}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    )}
  </div>
);

const VehiclesTab = ({ vehicles }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-900">Vehicles</h3>
      <Button size="sm">
        <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
        Add Vehicle
      </Button>
    </div>
    
    {vehicles.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        <SafeIcon icon={FiCar} className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No vehicles added yet</p>
      </div>
    ) : (
      <div className="space-y-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h4>
                <p className="text-sm text-gray-600">License: {vehicle.plate}</p>
                <p className="text-sm text-gray-600">Color: {vehicle.color}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">VIN: {vehicle.vin}</p>
                {vehicle.notes && (
                  <p className="text-sm text-gray-600 mt-2">{vehicle.notes}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    )}
  </div>
);

const LocationsTab = ({ locations }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-900">Locations</h3>
      <Button size="sm">
        <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
        Add Location
      </Button>
    </div>
    
    {locations.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        <SafeIcon icon={FiMapPin} className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No locations added yet</p>
      </div>
    ) : (
      <div className="space-y-4">
        {locations.map((location) => (
          <Card key={location.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{location.name}</h4>
                <p className="text-sm text-gray-600">{location.address}</p>
                <Badge variant="default" className="mt-2">{location.type}</Badge>
                {location.notes && (
                  <p className="text-sm text-gray-600 mt-2">{location.notes}</p>
                )}
              </div>
              <div className="text-right text-sm text-gray-500">
                {location.coordinates && (
                  <p>{location.coordinates.lat}, {location.coordinates.lng}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    )}
  </div>
);

const TasksTab = ({ tasks }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
      <Button size="sm">
        <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
        Add Task
      </Button>
    </div>
    
    {tasks.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        <SafeIcon icon={FiList} className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No tasks added yet</p>
      </div>
    ) : (
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{task.title}</h4>
                <p className="text-sm text-gray-600">Assigned to: {task.assignee}</p>
                <p className="text-sm text-gray-600">Due: {format(task.dueDate, 'MMM d, yyyy')}</p>
                {task.notes && (
                  <p className="text-sm text-gray-600 mt-2">{task.notes}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={task.status === 'Completed' ? 'success' : task.status === 'In Progress' ? 'info' : 'default'}>
                  {task.status}
                </Badge>
                <Badge variant={task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'default'}>
                  {task.priority}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )}
  </div>
);

const EventsTab = ({ events }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-900">Events</h3>
      <Button size="sm">
        <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
        Add Event
      </Button>
    </div>
    
    {events.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        <SafeIcon icon={FiCalendar} className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No events added yet</p>
      </div>
    ) : (
      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="p-4">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <SafeIcon icon={FiCalendar} className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{event.type}</h4>
                <p className="text-sm text-gray-600">{format(event.date, 'MMM d, yyyy h:mm a')}</p>
                <p className="text-sm text-gray-600">Location: {event.location}</p>
                <p className="text-sm text-gray-600">Investigator: {event.investigator}</p>
                {event.notes && (
                  <p className="text-sm text-gray-600 mt-2">{event.notes}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    )}
  </div>
);

const UpdatesTab = ({ updates }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-900">Case Updates</h3>
      <Button size="sm">
        <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
        Add Update
      </Button>
    </div>
    
    {updates.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        <SafeIcon icon={FiMessageSquare} className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No updates added yet</p>
      </div>
    ) : (
      <div className="space-y-4">
        {updates.map((update) => (
          <Card key={update.id} className="p-4">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <SafeIcon icon={FiMessageSquare} className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900">{update.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {update.author} • {format(update.timestamp, 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )}
  </div>
);

const FinancialsTab = ({ expenses }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-900">Case Expenses</h3>
      <Button size="sm">
        <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
        Add Expense
      </Button>
    </div>
    
    {expenses.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        <SafeIcon icon={FiDollarSign} className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No expenses recorded yet</p>
      </div>
    ) : (
      <div className="space-y-4">
        {expenses.map((expense) => (
          <Card key={expense.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">{expense.description}</h4>
                <p className="text-sm text-gray-600">Category: {expense.category}</p>
                <p className="text-sm text-gray-600">Date: {format(expense.date, 'MMM d, yyyy')}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">${expense.amount.toFixed(2)}</p>
                <Badge variant="success">Billable</Badge>
              </div>
            </div>
          </Card>
        ))}
        
        <Card className="p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total Expenses:</span>
            <span className="text-xl font-bold text-gray-900">
              ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
            </span>
          </div>
        </Card>
      </div>
    )}
  </div>
);

export default CaseDetail;