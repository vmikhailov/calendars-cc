# User Guide

## Welcome to Calendars CC

Calendars CC is a powerful calendar synchronization platform that helps you manage and synchronize events across multiple calendar systems with custom rules and automation.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Managing Calendars](#managing-calendars)
4. [Creating Rules](#creating-rules)
5. [User Profile & Settings](#user-profile--settings)
6. [Billing & Subscriptions](#billing--subscriptions)
7. [Troubleshooting](#troubleshooting)

## Getting Started

### Creating Your Account

1. **Sign Up**
   - Navigate to the signup page
   - Enter your name, email, and password
   - Confirm your password
   - Click "Create Account"

2. **Email Verification**
   - Check your email for a verification link
   - Click the link to verify your account

3. **First Login**
   - Use your email and password to log in
   - You'll be taken to the dashboard

### Initial Setup

1. **Connect Your Calendars**
   - Go to the "Calendars" section
   - Click "Add Calendar Source"
   - Choose your calendar provider (Google, Outlook, etc.)
   - Follow the authentication flow

2. **Create Your First Rule**
   - Navigate to the "Rules" section
   - Click "Create New Rule"
   - Choose a rule type and add your logic

## Dashboard Overview

The dashboard provides a comprehensive view of your calendar synchronization activities.

### Statistics Cards

- **Active Rules**: Number of currently active synchronization rules
- **Events Synced Today**: Total events processed in the last 24 hours
- **Success Rate**: Percentage of successful synchronizations
- **Need Attention**: Issues requiring your attention

### Quick Actions

- **View Recent Activity**: See latest sync events
- **Manage Rules**: Quick access to rule management
- **Check Sync Status**: Monitor synchronization health

### Calendar Preview

- View upcoming events from connected calendars
- See how rules are affecting your events
- Quick event details and modifications

## Managing Calendars

### Adding Calendar Sources

1. **Navigate to Calendars**
   - Click "Calendars" in the main navigation

2. **Add New Source**
   - Click "Add Calendar Source"
   - Select your calendar provider:
     - Google Calendar
     - Microsoft Outlook
     - Apple iCloud
     - CalDAV servers

3. **Authorization**
   - Complete the OAuth flow for your provider
   - Grant necessary permissions
   - Confirm calendar selection

### Calendar Settings

- **Sync Frequency**: Choose how often calendars sync (5min, 15min, 30min, 1hour)
- **Direction**: One-way or bidirectional sync
- **Event Types**: Choose which events to sync
- **Privacy**: Control what information is shared

### Managing Connected Calendars

- **View Status**: See connection health and last sync time
- **Refresh**: Manually trigger synchronization
- **Disconnect**: Remove calendar connections
- **Settings**: Modify sync preferences per calendar

## Creating Rules

Rules are the heart of Calendars CC, allowing you to customize how events are processed during synchronization.

### Rule Types

#### Filter Rules
Filter rules determine which events should be synchronized.

**Example: Work Hours Filter**
```javascript
// Only sync events during work hours (9 AM - 6 PM)
function filterWorkHours(event) {
  const startHour = new Date(event.start).getHours();
  const endHour = new Date(event.end).getHours();
  
  // Only sync events between 9 AM and 6 PM
  return startHour >= 9 && endHour <= 18;
}

// Apply filter to event
return filterWorkHours(event);
```

#### Transform Rules
Transform rules modify event properties during synchronization.

**Example: Add Work Prefix**
```javascript
// Add [WORK] prefix to all meeting titles
function transformTitle(event) {
  // Add [WORK] prefix if not already present
  if (!event.title.startsWith('[WORK]')) {
    event.title = '[WORK] ' + event.title;
  }
  
  return event;
}

// Apply transformation
return transformTitle(event);
```

#### Condition Rules
Condition rules apply logic to determine event processing.

**Example: Private Event Condition**
```javascript
// Skip private events from synchronization
function isPrivateEvent(event) {
  // Check if event is marked as private
  return event.visibility === 'private' || 
         event.title.toLowerCase().includes('private') ||
         event.description?.toLowerCase().includes('confidential');
}

// Skip private events
return !isPrivateEvent(event);
```

### Creating a New Rule

1. **Navigate to Rules**
   - Click "Rules" in the main navigation
   - Click "Create New Rule"

2. **Basic Information**
   - **Name**: Give your rule a descriptive name
   - **Description**: Explain what the rule does
   - **Type**: Choose Filter, Transform, or Condition

3. **Write Rule Code**
   - Use the code editor to write your JavaScript logic
   - Test your rule with sample events
   - Save your changes

4. **Rule Status**
   - **Draft**: Rule is saved but not active
   - **Active**: Rule is running on all sync operations
   - **Paused**: Rule is temporarily disabled
   - **Disabled**: Rule is completely turned off

### Rule Management

- **Edit Rules**: Modify existing rule code and settings
- **Duplicate Rules**: Create copies of existing rules
- **Enable/Disable**: Control rule activation
- **Delete Rules**: Remove rules permanently
- **Test Rules**: Validate rule logic with sample data

### Best Practices for Rules

1. **Keep Rules Simple**
   - Focus on one specific task per rule
   - Use clear, descriptive names
   - Add comments to explain complex logic

2. **Test Thoroughly**
   - Test with various event types
   - Consider edge cases
   - Monitor rule performance

3. **Error Handling**
   ```javascript
   function safeRule(event) {
     try {
       // Your rule logic here
       return processEvent(event);
     } catch (error) {
       console.error('Rule error:', error);
       return event; // Return original event on error
     }
   }
   ```

## User Profile & Settings

### Profile Management

1. **Personal Information**
   - Update name and email
   - Change password
   - Upload profile picture
   - Set timezone and language preferences

2. **Company Information**
   - Company name and role
   - Team settings (Enterprise plans)

### Application Settings

#### Notifications
- **Email Notifications**: Sync reports and alerts
- **Push Notifications**: Real-time sync status
- **Error Notifications**: Immediate failure alerts
- **Weekly Reports**: Summary of sync activities

#### Sync Preferences
- **Default Frequency**: How often to sync calendars
- **Auto Retry**: Automatically retry failed syncs
- **Max Retries**: Number of retry attempts
- **Conflict Resolution**: How to handle conflicting events

#### Privacy Settings
- **Data Sharing**: Control usage data collection
- **Analytics**: Allow performance analytics
- **Third-party Access**: Manage integrations

#### Appearance
- **Theme**: Light, dark, or auto mode
- **Compact Mode**: Condensed interface layout
- **Language**: Interface language selection

## Billing & Subscriptions

### Plan Comparison

#### Free Plan
- Up to 2 calendars
- Basic sync rules
- Email support
- 100 API requests/hour

#### Pro Plan ($9.99/month)
- Unlimited calendars
- Advanced rules
- Priority support
- Custom integrations
- 1,000 API requests/hour

#### Enterprise Plan ($29.99/month)
- Everything in Pro
- Team management
- SSO integration
- Dedicated support
- SLA guarantee
- 10,000 API requests/hour

### Managing Your Subscription

1. **Upgrade/Downgrade**
   - Go to "Billing" in your profile
   - Select "Change Plan"
   - Choose your new plan
   - Confirm billing changes

2. **Payment Methods**
   - Add credit cards or PayPal
   - Set default payment method
   - Update billing information

3. **Invoice History**
   - View past payments
   - Download invoices
   - Track usage and charges

### Billing Support

- **Questions**: Contact billing@calendars.cc
- **Payment Issues**: Check payment method and billing info
- **Refunds**: Available within 30 days of purchase

## Sync Logs & Monitoring

### Viewing Sync Logs

1. **Access Logs**
   - Click "Sync Logs" in the navigation
   - View recent synchronization activities

2. **Log Information**
   - **Timestamp**: When the sync occurred
   - **Status**: Success, failure, or warning
   - **Events Processed**: Number of events affected
   - **Rules Applied**: Which rules were executed
   - **Errors**: Any issues encountered

3. **Filtering Logs**
   - Filter by date range
   - Filter by status (success/failure)
   - Search by calendar or rule name

### Understanding Sync Status

- **✅ Success**: Sync completed without issues
- **⚠️ Warning**: Sync completed with minor issues
- **❌ Failed**: Sync failed completely
- **🔄 In Progress**: Sync currently running

## Troubleshooting

### Common Issues

#### Calendar Connection Problems

**Issue**: Calendar won't connect
**Solutions**:
1. Check your internet connection
2. Re-authorize the calendar connection
3. Verify calendar permissions
4. Contact support if issue persists

#### Rules Not Working

**Issue**: Rules aren't being applied
**Solutions**:
1. Check rule status (must be "Active")
2. Verify rule syntax in the code editor
3. Test rule with sample events
4. Check sync logs for rule errors

#### Sync Failures

**Issue**: Events aren't synchronizing
**Solutions**:
1. Check calendar connection status
2. Verify sync frequency settings
3. Review error messages in sync logs
4. Try manual sync trigger

#### Performance Issues

**Issue**: Slow synchronization
**Solutions**:
1. Reduce sync frequency temporarily
2. Optimize complex rules
3. Check for rule infinite loops
4. Contact support for performance analysis

### Getting Help

#### Self-Service Resources
- **Knowledge Base**: Comprehensive help articles
- **Video Tutorials**: Step-by-step guides
- **Community Forum**: User discussions and tips

#### Contact Support
- **Email**: support@calendars.cc
- **Priority Support**: Available for Pro/Enterprise users
- **Response Times**:
  - Free Plan: 48-72 hours
  - Pro Plan: 24 hours
  - Enterprise Plan: 4 hours

#### Reporting Bugs
1. Go to Settings > Help & Support
2. Click "Report a Bug"
3. Provide detailed description
4. Include steps to reproduce
5. Attach relevant logs or screenshots

### Best Practices

1. **Regular Monitoring**
   - Check sync logs weekly
   - Monitor rule performance
   - Update rules as needed

2. **Backup Important Data**
   - Export calendar data regularly
   - Keep copies of important rules
   - Document custom configurations

3. **Stay Updated**
   - Enable update notifications
   - Review new features and improvements
   - Update rules for new calendar providers

## Advanced Features

### API Access
- **API Keys**: Generate keys for custom integrations
- **Webhook Endpoints**: Real-time event notifications
- **Rate Limits**: Understand your plan's API limits

### Team Management (Enterprise)
- **User Roles**: Admin, Manager, User permissions
- **Shared Rules**: Team-wide rule libraries
- **Audit Logs**: Track team member activities

### Custom Integrations
- **Zapier**: Connect with 1000+ apps
- **Microsoft Power Automate**: Office 365 workflows
- **IFTTT**: Simple automation triggers

---

Need more help? Contact our support team at support@calendars.cc or visit our knowledge base for additional resources.
