import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { availabilityService } from "@/integrations/api/services/availability.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Trash2, Plus, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export const AvailabilityManager = () => {
    const { user } = useAuth();
    const [availabilities, setAvailabilities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [dayOfWeek, setDayOfWeek] = useState<string>("Monday");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");
    const [isRecurring, setIsRecurring] = useState(true);
    const [specificDate, setSpecificDate] = useState("");

    useEffect(() => {
        if (user?.teacherId) {
            fetchAvailability();
        }
    }, [user?.teacherId]);

    const fetchAvailability = async () => {
        if (!user?.teacherId) return;
        setLoading(true);
        try {
            const { data } = await availabilityService.getByTeacher(user.teacherId);
            if (data) {
                setAvailabilities(data);
            }
        } catch (error) {
            console.error("Failed to fetch availability", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.teacherId) return;

        setSubmitting(true);
        try {
            await availabilityService.create({
                dayOfWeek: isRecurring ? dayOfWeek : "",
                startTime,
                endTime,
                isRecurring,
                specificDate: !isRecurring ? specificDate : undefined,
            });

            toast({
                title: "Availability Added",
                description: "Your availability slot has been created.",
            });

            fetchAvailability();
        } catch (error) {
            console.error("Failed to create availability", error);
            toast({
                title: "Error",
                description: "Failed to create availability slot.",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this slot?")) return;
        try {
            await availabilityService.delete(id);
            toast({
                title: "Deleted",
                description: "Availability slot removed.",
            });
            setAvailabilities(prev => prev.filter(a => a._id !== id && a.id !== id));
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Availability</CardTitle>
                <CardDescription>
                    Set your recurring weekly hours or specific dates when you are available for sessions.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md bg-gray-50">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 space-y-2">
                            <Label>Type</Label>
                            <div className="flex items-center space-x-2">
                                <Switch checked={isRecurring} onCheckedChange={setIsRecurring} id="recurring-mode" />
                                <Label htmlFor="recurring-mode">{isRecurring ? "Recurring Weekly" : "Specific Date"}</Label>
                            </div>
                        </div>

                        {isRecurring ? (
                            <div className="flex-1 space-y-2">
                                <Label>Day of Week</Label>
                                <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : (
                            <div className="flex-1 space-y-2">
                                <Label>Date</Label>
                                <Input type="date" value={specificDate} onChange={e => setSpecificDate(e.target.value)} required={!isRecurring} />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 space-y-2">
                            <Label>Start Time</Label>
                            <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                        </div>
                        <div className="flex-1 space-y-2">
                            <Label>End Time</Label>
                            <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button type="submit" disabled={submitting}>
                            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                            Add Availability
                        </Button>
                    </div>
                </form>

                <div className="space-y-2">
                    <h3 className="font-medium">Current Availability</h3>
                    {loading ? (
                        <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
                    ) : availabilities.length === 0 ? (
                        <p className="text-gray-500 italic">No availability slots set.</p>
                    ) : (
                        <div className="grid gap-2">
                            {availabilities.map((slot) => (
                                <div key={slot._id || slot.id} className="flex justify-between items-center p-3 border rounded-md bg-white">
                                    <div className="flex items-center gap-3">
                                        <CalendarIcon className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <p className="font-medium">
                                                {slot.isRecurring ? `${slot.dayOfWeek}s` : format(new Date(slot.specificDate), "MMMM d, yyyy")}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {slot.startTime} - {slot.endTime}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(slot._id || slot.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
