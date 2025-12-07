import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { teacherResourcesService, SuccessStory } from "@/integrations/api/services/teacher-resources.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, Trash2, Plus, Star, Quote } from "lucide-react";

export const SuccessStoriesManager = () => {
    const { user } = useAuth();
    const [stories, setStories] = useState<SuccessStory[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form
    const [category, setCategory] = useState("Recent Win");
    const [content, setContent] = useState("");

    useEffect(() => {
        if (user?.teacherId) {
            fetchStories();
        }
    }, [user?.teacherId]);

    const fetchStories = async () => {
        if (!user?.teacherId) return;
        setLoading(true);
        try {
            const { data } = await teacherResourcesService.getSuccessStories(user.teacherId);
            if (data) setStories(data);
        } catch (error) {
            console.error("Failed to fetch stories", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.teacherId) return;

        setSubmitting(true);
        try {
            await teacherResourcesService.addSuccessStory(user.teacherId, {
                category,
                content,
                date: new Date().toISOString()
            });
            toast({ title: "Success", description: "Success story added." });
            setContent("");
            setCategory("Recent Win");
            fetchStories();
        } catch (error) {
            toast({ title: "Error", description: "Failed to add story.", variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (index: number) => {
        if (!user?.teacherId || !confirm("Delete this story?")) return;
        try {
            await teacherResourcesService.deleteSuccessStory(user.teacherId, index);
            toast({ title: "Deleted", description: "Story removed." });
            setStories(prev => prev.filter((_, i) => i !== index));
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete story.", variant: "destructive" });
        }
    };

    const getIcon = (cat: string) => {
        switch (cat) {
            case "Parent Feedback": return <Quote className="h-5 w-5 text-blue-500" />;
            case "Recent Win": return <Star className="h-5 w-5 text-yellow-500" />;
            default: return <Star className="h-5 w-5 text-purple-500" />;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Success Stories</CardTitle>
                <CardDescription>Share your teaching wins, student improvements, and parent testimonials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md bg-gray-50">
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Recent Win">Recent Win</SelectItem>
                                <SelectItem value="Parent Feedback">Parent Feedback</SelectItem>
                                <SelectItem value="Long-term Impact">Long-term Impact</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Story / Testimonial</Label>
                        <Textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            required
                            placeholder="e.g. James solved his first calculus problem!"
                        />
                    </div>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                        Add Story
                    </Button>
                </form>

                <div className="space-y-2">
                    <h3 className="font-medium">Your Stories</h3>
                    {loading ? <div className="flex justify-center"><Loader2 className="animate-spin" /></div> :
                        stories.length === 0 ? <p className="text-gray-500 italic">No stories added yet.</p> : (
                            <div className="grid gap-2">
                                {stories.map((story, idx) => (
                                    <div key={idx} className="flex justify-between items-start p-4 border rounded-md">
                                        <div className="flex gap-3">
                                            {getIcon(story.category)}
                                            <div>
                                                <p className="font-semibold text-sm text-gray-700">{story.category}</p>
                                                <p className="text-gray-900 mt-1">{story.content}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(idx)}>
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
