import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
    notificationService,
    NotificationPreferences,
    CategoryPreference,
} from '@/services/notificationService';

const CATEGORY_LABELS: Record<string, string> = {
    student_enrollment_updates: 'Student enrollment updates',
    class_schedule_changes: 'Class schedule changes',
    payment_notifications: 'Payment notifications',
    new_messages: 'New messages',
    reviews_and_feedback: 'Reviews and feedback',
    system_updates_and_maintenance: 'System updates and maintenance',
};

export const NotificationSettingsTab: React.FC = () => {
    const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

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
            toast({
                title: 'Error',
                description: 'Failed to load notification preferences',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!preferences) return;

        setSaving(true);
        try {
            // Exclude updatedAt - it's auto-managed by the backend
            const { updatedAt, ...preferencesToSave } = preferences;

            await notificationService.updatePreferences(preferencesToSave);
            toast({
                title: 'Preferences saved',
                description: 'Your notification preferences have been updated successfully',
            });
        } catch (error) {
            console.error('Failed to save preferences:', error);
            toast({
                title: 'Error',
                description: 'Failed to save preferences. Please try again.',
                variant: 'destructive',
            });
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

        const updatedCategories = [...preferences.categories];
        updatedCategories[categoryIndex] = {
            ...updatedCategories[categoryIndex],
            enabled,
        };

        setPreferences({
            ...preferences,
            categories: updatedCategories,
        });
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-kidato-purple" />
                </CardContent>
            </Card>
        );
    }

    if (!preferences) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-12">
                    <p className="text-gray-500">Failed to load preferences</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                    Configure how and when you receive notifications
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Global Channel Settings */}
                <div className="space-y-4">
                    <h3 className="font-medium text-lg">Notification Channels</h3>

                    {/* Email Notifications */}
                    <div className="border rounded-md p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <div>
                                    <h4 className="font-medium">Email Notifications</h4>
                                    <p className="text-sm text-gray-500">Get notified about important updates via email</p>
                                </div>
                            </div>
                            <Switch
                                id="email-notifications"
                                checked={preferences.emailNotificationsEnabled}
                                onCheckedChange={(checked) => updateGlobalChannel('email', checked)}
                            />
                        </div>
                    </div>

                    {/* SMS Notifications */}
                    <div className="border rounded-md p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-5 h-5 text-gray-400" />
                                <div>
                                    <h4 className="font-medium">SMS Notifications</h4>
                                    <p className="text-sm text-gray-500">Receive text messages for urgent updates</p>
                                </div>
                            </div>
                            <Switch
                                id="sms-notifications"
                                checked={preferences.smsNotificationsEnabled}
                                onCheckedChange={(checked) => updateGlobalChannel('sms', checked)}
                            />
                        </div>
                    </div>

                    {/* In-App Notifications */}
                    <div className="border rounded-md p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bell className="w-5 h-5 text-gray-400" />
                                <div>
                                    <h4 className="font-medium">In-App Notifications</h4>
                                    <p className="text-sm text-gray-500">Show notifications within the platform</p>
                                </div>
                            </div>
                            <Switch
                                id="in-app-notifications"
                                checked={preferences.inAppNotificationsEnabled}
                                onCheckedChange={(checked) => updateGlobalChannel('inApp', checked)}
                            />
                        </div>
                    </div>
                </div>

                {/* Notification Categories */}
                <div className="space-y-4">
                    <h3 className="font-medium text-lg">Notification Categories</h3>
                    <div className="space-y-3">
                        {preferences.categories.map((category, index) => (
                            <div key={category.category} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`category-${category.category}`}
                                    checked={category.enabled}
                                    onCheckedChange={(checked) => updateCategoryEnabled(index, checked as boolean)}
                                />
                                <Label htmlFor={`category-${category.category}`} className="cursor-pointer">
                                    {CATEGORY_LABELS[category.category] || category.category}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t">
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-kidato-purple hover:bg-kidato-purple/90"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
