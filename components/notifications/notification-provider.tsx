"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  userId?: string;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast notification
    switch (notification.type) {
      case 'success':
        toast.success(notification.title, { description: notification.message });
        break;
      case 'error':
        toast.error(notification.title, { description: notification.message });
        break;
      case 'warning':
        toast.warning(notification.title, { description: notification.message });
        break;
      default:
        toast.info(notification.title, { description: notification.message });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Simulate real-time notifications (in a real app, this would come from WebSocket or polling)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random notifications for demo purposes
      const randomNotifications = [
        {
          type: 'info' as const,
          title: 'New Comment',
          message: 'Someone commented on your post "E-Commerce Trends"',
        },
        {
          type: 'success' as const,
          title: 'Post Published',
          message: 'Your post has been successfully published',
        },
        {
          type: 'warning' as const,
          title: 'Pending Review',
          message: 'You have 3 comments pending moderation',
        },
      ];

      // Randomly add a notification every 30 seconds (for demo)
      if (Math.random() > 0.95) {
        const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        addNotification(randomNotification);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}