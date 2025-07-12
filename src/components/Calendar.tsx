import React from 'react';
import { useState } from 'react';
import { Clock, MapPin, Users } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  time: string;
  location?: string;
  attendees?: number;
  calendar: string;
  color: string;
}

const events: Event[] = [
  {
    id: '1',
    title: 'Team Meeting',
    time: '09:00 - 10:30',
    location: 'Conference Room A',
    attendees: 5,
    calendar: 'Work',
    color: 'bg-blue-500'
  },
  {
    id: '2',
    title: 'Project Presentation',
    time: '14:00 - 15:00',
    location: 'Main Conference Hall',
    attendees: 12,
    calendar: 'Work',
    color: 'bg-green-500'
  },
  {
    id: '3',
    title: 'Gym Workout',
    time: '18:00 - 19:30',
    location: 'Fitness Center',
    calendar: 'Personal',
    color: 'bg-purple-500'
  }
];

const Calendar: React.FC = () => {
  const [activeView, setActiveView] = useState<'yesterday' | 'today' | 'tomorrow' | 'week'>('today');

  const getViewTitle = () => {
    switch (activeView) {
      case 'yesterday': return 'Yesterday';
      case 'today': return 'Today';
      case 'tomorrow': return 'Tomorrow';
      case 'week': return 'This Week';
      default: return 'Today';
    }
  };

  const getViewDate = () => {
    const today = new Date();
    switch (activeView) {
      case 'yesterday': 
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return yesterday.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      case 'today': 
        return today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      case 'tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return tomorrow.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      case 'week':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      default: 
        return today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
  };

  // Filter events based on active view (for demo purposes, showing same events)
  const getEventsForView = () => {
    if (activeView === 'week') {
      // For week view, show more events
      return [
        ...events,
        {
          id: '4',
          title: 'Client Call',
          time: '10:00 - 11:00',
          location: 'Video Conference',
          attendees: 3,
          calendar: 'Work',
          color: 'bg-orange-500'
        },
        {
          id: '5',
          title: 'Lunch Meeting',
          time: '12:30 - 13:30',
          location: 'Downtown Restaurant',
          attendees: 2,
          calendar: 'Work',
          color: 'bg-green-500'
        }
      ];
    }
    return events;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{getViewTitle()}</h2>
          <div className="text-sm text-gray-500 mt-1">
            {getViewDate()}
          </div>
        </div>
        
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveView('yesterday')}
            className={`px-3 py-1 text-sm rounded transition-all ${
              activeView === 'yesterday' 
                ? 'bg-white shadow text-gray-900' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yesterday
          </button>
          <button
            onClick={() => setActiveView('today')}
            className={`px-3 py-1 text-sm rounded transition-all ${
              activeView === 'today' 
                ? 'bg-white shadow text-gray-900' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveView('tomorrow')}
            className={`px-3 py-1 text-sm rounded transition-all ${
              activeView === 'tomorrow' 
                ? 'bg-white shadow text-gray-900' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tomorrow
          </button>
          <button
            onClick={() => setActiveView('week')}
            className={`px-3 py-1 text-sm rounded transition-all ${
              activeView === 'week' 
                ? 'bg-white shadow text-gray-900' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Week
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {getEventsForView().map((event) => (
          <div
            key={event.id}
            className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors card-hover"
          >
            <div className={`w-1 h-16 ${event.color} rounded-full`}></div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {event.title}
                </h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {event.calendar}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                
                {event.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                )}
                
                {event.attendees && (
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{event.attendees}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {getEventsForView().length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No events for {getViewTitle().toLowerCase()}</p>
        </div>
      )}
    </div>
  );
};

export default Calendar;