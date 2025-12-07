import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, CheckCheck, Trash2 } from 'lucide-react';
import {
    notificationService,
    Notification,
    NotificationStats,
} from '../../services/notificationService';
import { formatDistanceToNow } from 'date-fns';

export const NotificationBell: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [stats, setStats] = useState<NotificationStats | null>(null);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchStats();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchStats = async () => {
        try {
            const data = await notificationService.getStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch notification stats:', error);
        }
    };

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await notificationService.getNotifications({
                page: 1,
                limit: 10,
            });
            setNotifications(data.notifications);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await notificationService.markAsRead([notificationId]);
            setNotifications((prev) =>
                prev.map((n) =>
                    n._id === notificationId ? { ...n, isRead: true } : n,
                ),
            );
            fetchStats();
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            fetchStats();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleDelete = async (notificationId: string) => {
        try {
            await notificationService.deleteNotification(notificationId);
            setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
            fetchStats();
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'assignment_due':
                return '📝';
            case 'class_reminder':
                return '🔔';
            case 'new_message':
                return '💬';
            case 'grade_posted':
                return '📊';
            case 'payment':
                return '💰';
            case 'review':
                return '⭐';
            default:
                return '🔔';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-6 h-6" />
                {stats && stats.unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                        {stats.unreadCount > 99 ? '99+' : stats.unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                            {stats && (
                                <p className="text-sm text-gray-500">
                                    {stats.unreadCount} unread
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {stats && stats.unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                    title="Mark all as read"
                                >
                                    <CheckCheck className="w-4 h-4" />
                                    <span className="hidden sm:inline">Mark all read</span>
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="px-4 py-8 text-center text-gray-500">
                                Loading notifications...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-500">
                                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl flex-shrink-0">
                                            {getTypeIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="text-sm font-semibold text-gray-900 truncate">
                                                    {notification.title}
                                                </h4>
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(notification.priority)}`}
                                                >
                                                    {notification.priority}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                {notification.content}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-xs text-gray-400">
                                                    {formatDistanceToNow(new Date(notification.createdAt), {
                                                        addSuffix: true,
                                                    })}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={() => handleMarkAsRead(notification._id)}
                                                            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                                        >
                                                            <Check className="w-3 h-3" />
                                                            Mark read
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(notification._id)}
                                                        className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                            {notification.actionUrl && notification.actionText && (
                                                <a
                                                    href={notification.actionUrl}
                                                    className="inline-block mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                                                >
                                                    {notification.actionText} →
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-200 text-center">
                            <a
                                href="/notifications"
                                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                View all notifications
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
