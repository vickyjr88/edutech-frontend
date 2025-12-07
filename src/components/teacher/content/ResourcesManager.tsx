import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { teacherResourcesService, Resource } from "@/integrations/api/services/teacher-resources.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, Trash2, Plus, FileText, Download } from "lucide-react";

export const ResourcesManager = () => {
    const { user } = useAuth();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("worksheet");
    const [downloadUrl, setDownloadUrl] = useState("");

    useEffect(() => {
        if (user?.teacherId) {
            fetchResources();
        }
    }, [user?.teacherId]);

    const fetchResources = async () => {
        if (!user?.teacherId) return;
        setLoading(true);
        try {
            const { data } = await teacherResourcesService.getResources(user.teacherId);
            if (data) setResources(data);
        } catch (error) {
            console.error("Failed to fetch resources", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.teacherId) return;

        setSubmitting(true);
        try {
            await teacherResourcesService.addResource(user.teacherId, {
                title,
                description,
                type,
                downloadUrl
            });
            toast({ title: "Success", description: "Resource added successfully." });
            setTitle("");
            setDescription("");
            setDownloadUrl("");
            fetchResources();
        } catch (error) {
            toast({ title: "Error", description: "Failed to add resource.", variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (index: number) => {
        if (!user?.teacherId || !confirm("Delete this resource?")) return;
        try {
            await teacherResourcesService.deleteResource(user.teacherId, index);
            toast({ title: "Deleted", description: "Resource removed." });
            setResources(prev => prev.filter((_, i) => i !== index));
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete resource.", variant: "destructive" });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Resources</CardTitle>
                <CardDescription>Share downloadable files, worksheets, and materials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Algebra Worksheet 1" />
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="worksheet">Worksheet</SelectItem>
                                    <SelectItem value="pdf">PDF Guide</SelectItem>
                                    <SelectItem value="image">Image</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Briefly describe this resource" />
                    </div>
                    <div className="space-y-2">
                        <Label>Download URL</Label>
                        <Input value={downloadUrl} onChange={e => setDownloadUrl(e.target.value)} required placeholder="https://..." />
                        <p className="text-xs text-gray-500">Paste a link to the file (Google Drive, Dropbox, etc.)</p>
                    </div>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                        Add Resource
                    </Button>
                </form>

                <div className="space-y-2">
                    <h3 className="font-medium">Library</h3>
                    {loading ? <div className="flex justify-center"><Loader2 className="animate-spin" /></div> :
                        resources.length === 0 ? <p className="text-gray-500 italic">No resources added yet.</p> : (
                            <div className="grid gap-2">
                                {resources.map((res, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 border rounded-md">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="font-medium truncate">{res.title}</p>
                                                <p className="text-sm text-gray-600 truncate">{res.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <a href={res.downloadUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 p-2">
                                                <Download className="h-4 w-4" />
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
