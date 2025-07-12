import { User, CreditCard, Settings, Calendar, FileText } from 'lucide-react';
import { Code } from 'lucide-react';

export type MenuItem = {
    id: string;
    label: string;
    icon: React.ElementType;
    description: string;
};

export const menuItems: MenuItem[] = [
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
        id: 'rules',
        label: 'Rules',
        icon: Code,
        description: 'Create and edit synchronization rules'
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