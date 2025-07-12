import React, { useState } from 'react';
import { User, CreditCard, Settings, Zap, Calendar, FileText } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Calendar,
      description: 'Calendar overview and sync management'
    },
    {
      id: 'logs',
      label: 'Sync Logs',
      icon: FileText,
      description: 'View synchronization history and status'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Personal information and account settings'
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: CreditCard,
      description: 'Subscription plans and payment management'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'General application settings'
    }
  ];

  return (
    <nav className="bg-white border-r border-gray-200 w-64 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">CalendarSync</h1>
            <p className="text-sm text-gray-500">Calendar Synchronization</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`h-5 w-5 ${
                activeSection === item.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-gray-500 mt-0.5 truncate">
                  {item.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;