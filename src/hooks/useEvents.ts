
import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './use-toast';
import { ScheduleEvent } from '@/types/calendar';
import { format } from 'date-fns';

export function useEvents() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [events, setEvents] = useState<ScheduleEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = useCallback(async () => {
        if (!user?.studentId) return;

        setLoading(true);
        try {
            const response = await api.get(`/students/${user.studentId}/events`);

            // Map backend data to frontend model
            const mappedEvents: ScheduleEvent[] = response.data.map((e: any) => {
                const startDate = new Date(e.startDate);
                const endDate = e.endDate ? new Date(e.endDate) : null;

                let timeString = format(startDate, 'h:mm a');
                if (endDate) {
                    timeString += ` - ${format(endDate, 'h:mm a')}`;
                }

                return {
                    id: e._id,
                    title: e.title,
                    date: e.startDate, // ISO string
                    time: timeString,
                    location: e.location,
                    description: e.description,
                    type: e.type,
                    duration: e.duration
                };
            });

            setEvents(mappedEvents);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch events', err);
            setError('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    }, [user?.studentId]);

    const createEvent = async (eventData: Partial<ScheduleEvent>) => {
        if (!user?.studentId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Student profile not found.' });
            return;
        }

        try {
            // payload construction
            const payload = {
                title: eventData.title,
                description: eventData.description,
                startDate: eventData.date, // Assumes ISO string
                // Calculate endDate if not present but duration is
                endDate: eventData.duration
                    ? new Date(new Date(eventData.date!).getTime() + eventData.duration * 3600000).toISOString()
                    : eventData.date,
                type: eventData.type,
                location: eventData.location,
                duration: eventData.duration
            };

            await api.post(`/students/${user.studentId}/events`, payload);
            await fetchEvents(); // Refresh list
            return true;
        } catch (err) {
            console.error(err);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to create event' });
            throw err;
        }
    };

    const updateEvent = async (id: string | number, eventData: Partial<ScheduleEvent>) => {
        if (!user?.studentId) return;

        try {
            const payload = {
                title: eventData.title,
                description: eventData.description,
                startDate: eventData.date,
                endDate: eventData.duration
                    ? new Date(new Date(eventData.date!).getTime() + eventData.duration * 3600000).toISOString()
                    : eventData.date,
                type: eventData.type,
                location: eventData.location,
                duration: eventData.duration
            };

            await api.put(`/students/${user.studentId}/events/${id}`, payload);
            await fetchEvents();
            return true;
        } catch (err) {
            console.error(err);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to update event' });
            throw err;
        }
    };

    const deleteEvent = async (id: string | number) => {
        if (!user?.studentId) return;
        try {
            await api.delete(`/students/${user.studentId}/events/${id}`);
            setEvents(prev => prev.filter(e => e.id !== id));
            toast({ title: 'Success', description: 'Event deleted' });
            return true;
        } catch (err) {
            console.error(err);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete event' });
            throw err;
        }
    }

    // Initial fetch
    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return { events, loading, error, createEvent, updateEvent, deleteEvent, refreshEvents: fetchEvents };
}
