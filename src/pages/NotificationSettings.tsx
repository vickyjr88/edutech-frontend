import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Save, Loader2 } from 'lucide-react';
import {
    notificationService,
    NotificationPreferences,
    CategoryPreference,
} from '../../services/notificationService';

const CATEGORY_LABELS: Record<string, string> = {
    student_enrollment_updates: 'Student enrollment updates',
    class_schedule_changes: 'Class schedule changes',
    payment_notifications: 'Payment notifications',
    new_messages: 'New messages',
    reviews_and_feedback: 'Reviews and feedback',
    system_updates_and_maintenance: 'System updates and maintenance',
};

export const NotificationSettings: React.FC = () => {
    const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        fetchPreferences();
    }, []);

    const fetchPreferences = async () => {
        setLoading(true);
        try {
            const data = await notificationService.getPreferences();
            setPreferences(data);
        } catch (error) {
            console.error('Failed to fetch preferences:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!preferences) return;

        setSaving(true);
        setSaveMessage('');
        try {
            await notificationService.updatePreferences(preferences);
            setSaveMessage('Preferences saved successfully!');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            console.error('Failed to save preferences:', error);
            setSaveMessage('Failed to save preferences. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const updateGlobalChannel = (channel: 'email' | 'sms' | 'inApp', value: boolean) => {
        if (!preferences) return;

        setPreferences({
            ...preferences,
            [`${channel}NotificationsEnabled`]: value,
        } as NotificationPreferences);
    };

    const updateCategoryEnabled = (categoryIndex: number, enabled: boolean) => {
        if (!preferences) return;

        const updated Categories = [...preferences.categories];
        updatedCategories[categoryIndex] = {
            ...updatedCategories[categoryIndex],
            enabled,
        };

        setPreferences({
            ...preferences,
            categories: updatedCategories,
        });
    };

    const updateCategoryChannel = (
        categoryIndex: number,
        channel: 'email' | 'sms' | 'inApp',
        value: boolean,
    ) => {
        if (!preferences) return;

        const updatedCategories = [...preferences.categories];
        updatedCategories[categoryIndex] = {
            ...updatedCategories[categoryIndex],
            channels: {
                ...updatedCategories[categoryIndex].channels,
                [channel]: value,
            },
        };

        setPreferences({
            ...preferences,
            categories: updatedCategories,
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!preferences) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Failed to load preferences</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 mb-8">
                <button className="px-6 py-3 text-gray-500 hover:text-gray-700">Profile</button>
                <button className="px-6 py-3 text-gray-500 hover:text-gray-700">Integrations</button>
                <button className="px-6 py-3 text-blue-600 border-b-2 border-blue-600 font-medium">
                    Notifications
                </button>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-8 py-6 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-900">Notification Preferences</h2>
                    <p className="text-gray-600 mt-1">Configure how and when you receive notifications</p>
                </div>

                <div className="px-8 py-6 space-y-8">
                    {/* Global Channel Settings */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>

                        {/* Email Notifications */}
                        <div className="flex items-center justify-between py-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <div>
                                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                                    <p className="text-sm text-gray-600">Get notified about important updates via email</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={preferences.emailNotificationsEnabled}
                                    onChange={(e) => updateGlobalChannel('email', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {/* SMS Notifications */}
                        <div className="flex items-center justify-between py-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-5 h-5 text-gray-400" />
                                <div>
                                    <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                                    <p className="text-sm text-gray-600">Receive text messages for urgent updates</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={preferences.smsNotificationsEnabled}
                                    onChange={(e) => updateGlobalChannel('sms', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {/* In-App Notifications */}
                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-3">
                                <Bell className="w-5 h-5 text-gray-400" />
                                <div>
                                    <h4 className="font-medium text-gray-900">In-App Notifications</h4>
                                    <p className="text-sm text-gray-600">Show notifications within the platform</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={preferences.inAppNotificationsEnabled}
                                    onChange={(e) => updateGlobalChannel('inApp', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>

                    {/* Notification Categories */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Categories</h3>
                        <div className="space-y-2">
                            {preferences.categories.map((category, index) => (
                                <div key={category.category} className="flex items-center gap-3 py-2">
                                    <input
                                        type="checkbox"
                                        checked={category.enabled}
                                        onChange={(e) => updateCategoryEnabled(index, e.target.checked)}
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-gray-900">
                                        {CATEGORY_LABELS[category.category] || category.category}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                        <div>
                            {saveMessage && (
                                <p className={`text-sm ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                                    {saveMessage}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
