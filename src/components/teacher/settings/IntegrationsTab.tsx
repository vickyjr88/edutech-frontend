import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Calendar, FileText, Loader2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { zoomService } from "@/integrations/api/services/zoom.service";
import { googleCalendarService } from "@/integrations/api/services/google-calendar.service";

export const IntegrationsTab = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [zoomStatus, setZoomStatus] = useState<{ connected: boolean; email?: string } | null>(null);
    const [calendarStatus, setCalendarStatus] = useState<{ connected: boolean; email?: string } | null>(null);
    const [driveStatus] = useState<{ connected: boolean; email?: string }>({ connected: false });

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchIntegrationStatuses();
    }, []);

    const fetchIntegrationStatuses = async () => {
        setLoading(true);
        try {
            const [zoomRes, calendarRes] = await Promise.allSettled([
                zoomService.getConnectionStatus(),
                googleCalendarService.getConnectionStatus()
            ]);

            if (zoomRes.status === 'fulfilled' && !zoomRes.value.error) {
                setZoomStatus(zoomRes.value.data);
            } else {
                console.error("Failed to fetch zoom status", zoomRes);
            }

            if (calendarRes.status === 'fulfilled' && !calendarRes.value.error) {
                setCalendarStatus(calendarRes.value.data);
            } else {
                console.error("Failed to fetch calendar status", calendarRes);
            }

        } catch (error) {
            console.error("Error fetching integration statuses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleConnectZoom = async () => {
        setActionLoading('zoom');
        try {
            const { data, error } = await zoomService.getAuthUrl();
            if (error) throw error;
            if (data?.auth_url) {
                window.location.href = data.auth_url;
            }
        } catch (error) {
            console.error("Error initiating Zoom auth:", error);
            toast({
                title: "Connection Failed",
                description: "Could not initiate Zoom connection. Please try again.",
                variant: "destructive"
            });
        } finally {
            setActionLoading(null);
        }
    };

    const handleConnectCalendar = async () => {
        setActionLoading('calendar');
        try {
            const { data, error } = await googleCalendarService.getAuthUrl();
            if (error) throw error;
            if (data?.authUrl) {
                window.location.href = data.authUrl;
            }
        } catch (error) {
            console.error("Error initiating Calendar auth:", error);
            toast({
                title: "Connection Failed",
                description: "Could not initiate Google Calendar connection. Please try again.",
                variant: "destructive"
            });
        } finally {
            setActionLoading(null);
        }
    };

    const handleConnectDrive = () => {
        toast({
            title: "Coming Soon",
            description: "Google Drive integration is currently under development.",
        });
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                    <p className="text-gray-500">Loading integration status...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle>Integrations</CardTitle>
                    <CardDescription>
                        Connect your teaching tools and services
                    </CardDescription>
                </div>
                {zoomStatus?.connected && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                        onClick={() => navigate("/teacher-dashboard/zoom")}
                    >
                        <Video className="mr-2 h-4 w-4" />
                        Manage Zoom
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Zoom Integration */}
                <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                            <Video className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium">Zoom</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Host virtual classes and meetings
                                    </p>
                                </div>
                                {zoomStatus?.connected ? (
                                    <Badge className="bg-green-100 text-green-800 border-0">Connected</Badge>
                                ) : (
                                    <Badge className="bg-gray-100 text-gray-800 border-0">Not Connected</Badge>
                                )}
                            </div>
                            <div className="mt-3 text-sm">
                                <p className="text-gray-600">
                                    {zoomStatus?.connected
                                        ? "Your Zoom account is connected and ready to use for scheduling online classes."
                                        : "Connect your Zoom account to automatically generate meeting links for your classes."}
                                </p>
                            </div>
                            <div className="mt-3 flex gap-2">
                                {zoomStatus?.connected ? (
                                    <>
                                        <Button size="sm" variant="outline" onClick={() => navigate("/teacher-dashboard/zoom")}>
                                            Configure
                                        </Button>
                                        <Button size="sm" variant="outline" className="text-blue-600" onClick={() => navigate("/teacher-dashboard/zoom?create=true")}>
                                            Create Meeting
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        size="sm"
                                        onClick={handleConnectZoom}
                                        disabled={actionLoading === 'zoom'}
                                    >
                                        {actionLoading === 'zoom' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Connect Zoom
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Google Calendar Integration */}
                <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                            <Calendar className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium">Google Calendar</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Sync your class schedule
                                    </p>
                                </div>
                                {calendarStatus?.connected ? (
                                    <Badge className="bg-green-100 text-green-800 border-0">Connected</Badge>
                                ) : (
                                    <Badge className="bg-gray-100 text-gray-800 border-0">Not Connected</Badge>
                                )}
                            </div>
                            <div className="mt-3 text-sm">
                                <p className="text-gray-600">
                                    {calendarStatus?.connected
                                        ? "Your Google Calendar is connected. Class schedules will be automatically synced."
                                        : "Connect your Google Calendar to automatically sync class schedules and receive reminders."}
                                </p>
                            </div>
                            <div className="mt-3">
                                {calendarStatus?.connected ? (
                                    <Button size="sm" variant="outline" onClick={() => navigate("/teacher-dashboard/calendar")}>
                                        Manage Calendar
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        onClick={handleConnectCalendar}
                                        disabled={actionLoading === 'calendar'}
                                    >
                                        {actionLoading === 'calendar' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Connect Calendar
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


                {/* Google Drive Integration */}
                <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                            <FileText className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium">Google Drive</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Manage and share class materials
                                    </p>
                                </div>
                                {driveStatus?.connected ? (
                                    <Badge className="bg-green-100 text-green-800 border-0">Connected</Badge>
                                ) : (
                                    <Badge className="bg-gray-100 text-gray-800 border-0">Not Connected</Badge>
                                )}
                            </div>
                            <div className="mt-3 text-sm">
                                <p className="text-gray-600">
                                    Connect your Google Drive to easily upload, store, and share teaching materials with your students.
                                </p>
                            </div>
                            <div className="mt-3">
                                <Button size="sm" onClick={handleConnectDrive}>
                                    Connect Drive
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};
