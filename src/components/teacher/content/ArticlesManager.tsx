import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { teacherResourcesService, Article } from "@/integrations/api/services/teacher-resources.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Loader2, Trash2, Plus, BookOpen, ExternalLink } from "lucide-react";

export const ArticlesManager = () => {
    const { user } = useAuth();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [readUrl, setReadUrl] = useState("");

    useEffect(() => {
        if (user?.teacherId) {
            fetchArticles();
        }
    }, [user?.teacherId]);

    const fetchArticles = async () => {
        if (!user?.teacherId) return;
        setLoading(true);
        try {
            const { data } = await teacherResourcesService.getArticles(user.teacherId);
            if (data) setArticles(data);
        } catch (error) {
            console.error("Failed to fetch articles", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.teacherId) return;

        setSubmitting(true);
        try {
            await teacherResourcesService.addArticle(user.teacherId, {
                title,
                description,
                date: new Date().toISOString(),
                readUrl
            });
            toast({ title: "Success", description: "Article added successfully." });
            setTitle("");
            setDescription("");
            setReadUrl("");
            fetchArticles();
        } catch (error) {
            toast({ title: "Error", description: "Failed to add article.", variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (index: number) => {
        if (!user?.teacherId || !confirm("Delete this article?")) return;
        try {
            await teacherResourcesService.deleteArticle(user.teacherId, index);
            toast({ title: "Deleted", description: "Article removed." });
            setArticles(prev => prev.filter((_, i) => i !== index));
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete article.", variant: "destructive" });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Articles</CardTitle>
                <CardDescription>Share links to articles, blog posts, or reading materials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md bg-gray-50">
                    <div className="space-y-2">
                        <Label>Article Title</Label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Benefits of Early Learning" />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief summary..." />
                    </div>
                    <div className="space-y-2">
                        <Label>Read URL</Label>
                        <Input value={readUrl} onChange={e => setReadUrl(e.target.value)} required placeholder="https://..." />
                    </div>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                        Add Article
                    </Button>
                </form>

                <div className="space-y-2">
                    <h3 className="font-medium">Published Articles</h3>
                    {loading ? <div className="flex justify-center"><Loader2 className="animate-spin" /></div> :
                        articles.length === 0 ? <p className="text-gray-500 italic">No articles added.</p> : (
                            <div className="grid gap-2">
                                {articles.map((art, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 border rounded-md">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <BookOpen className="h-5 w-5 text-purple-500 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="font-medium truncate">{art.title}</p>
                                                <p className="text-sm text-gray-500 truncate">{art.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <a href={art.readUrl} target="_blank" rel="noreferrer" className="text-purple-600 hover:text-purple-800 p-2">
                                                <ExternalLink className="h-4 w-4" />
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
