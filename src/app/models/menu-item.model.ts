export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'calendar',
    description: 'Calendar overview and sync management'
  },
  {
    id: 'calendars',
    label: 'Calendars',
    icon: 'calendar-days',
    description: 'Manage calendar sources and connections'
  },
  {
    id: 'rules',
    label: 'Rules',
    icon: 'code',
    description: 'Create and edit synchronization rules'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'user',
    description: 'Personal information and account settings'
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: 'credit-card',
    description: 'Subscription plans and payment management'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    description: 'General application settings'
  },
  {
    id: 'logs',
    label: 'Sync Logs',
    icon: 'file-text',
    description: 'View synchronization history and status'
  },
  {
    id: 'tech-info',
    label: 'Technical Info',
    icon: 'info',
    description: 'Node, npm, and Angular version details'
  }
];