import { Event } from '../../models/rule.model';

export const MOCK_EVENTS: Event[] = [
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
    },
    // Additional mock events for week view
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
