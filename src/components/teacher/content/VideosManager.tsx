import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { teacherVideosService, Video } from "@/integrations/api/services/teacher-videos.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Loader2, Trash2, Plus, Video as VideoIcon, Play } from "lucide-react";

export const VideosManager = () => {
    const { user } = useAuth();
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (user?.teacherId) {
            fetchVideos();
        }
    }, [user?.teacherId]);

    const fetchVideos = async () => {
        if (!user?.teacherId) return;
        setLoading(true);
        try {
            const { data } = await teacherVideosService.getVideos(user.teacherId);
            if (data) setVideos(data);
        } catch (error) {
            console.error("Failed to fetch videos", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.teacherId) return;

        setSubmitting(true);
        try {
            await teacherVideosService.addVideo(user.teacherId, {
                title,
                description,
                url
            });
            toast({ title: "Success", description: "Video added successfully." });
            setTitle("");
            setDescription("");
            setUrl("");
            fetchVideos();
        } catch (error) {
            toast({ title: "Error", description: "Failed to add video.", variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (index: number) => {
        if (!user?.teacherId || !confirm("Delete this video?")) return;
        try {
            await teacherVideosService.deleteVideo(user.teacherId, index);
            toast({ title: "Deleted", description: "Video removed." });
            setVideos(prev => prev.filter((_, i) => i !== index));
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete video.", variant: "destructive" });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Videos</CardTitle>
                <CardDescription>Share educational videos or recordings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md bg-gray-50">
                    <div className="space-y-2">
                        <Label>Video Title</Label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Introduction to Calculus" />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What is this video about?" />
                    </div>
                    <div className="space-y-2">
                        <Label>Video URL</Label>
                        <Input value={url} onChange={e => setUrl(e.target.value)} required placeholder="https://youtube.com/..." />
                        <p className="text-xs text-gray-500">YouTube, Vimeo, or direct video links supported.</p>
                    </div>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                        Add Video
                    </Button>
                </form>

                <div className="space-y-2">
                    <h3 className="font-medium">Video Library</h3>
                    {loading ? <div className="flex justify-center"><Loader2 className="animate-spin" /></div> :
                        videos.length === 0 ? <p className="text-gray-500 italic">No videos added.</p> : (
                            <div className="grid gap-2">
                                {videos.map((vid, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 border rounded-md">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <VideoIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="font-medium truncate">{vid.title}</p>
                                                <p className="text-sm text-gray-500 truncate">{vid.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <a href={vid.url} target="_blank" rel="noreferrer" className="text-red-600 hover:text-red-800 p-2">
                                                <Play className="h-4 w-4" />
                                            </a>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(idx)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                </div>
            </CardContent>
        </Card>
    );
};
