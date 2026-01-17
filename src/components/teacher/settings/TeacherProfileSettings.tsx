import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Plus, Briefcase, Globe, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MvpTeacherService, MvpExperience, MvpLanguage } from "@/integrations/api/services/mvp-teacher.service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function TeacherProfileSettings() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [experience, setExperience] = useState<MvpExperience[]>([]);
    const [languages, setLanguages] = useState<MvpLanguage[]>([]);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const profile = await MvpTeacherService.getCurrentProfile();
            if (profile) {
                setExperience(profile.experience || []);
                setLanguages(profile.languages || []);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast({
                title: "Error",
                description: "Failed to load profile data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await MvpTeacherService.updateProfile({
                experience,
                languages
            });
            toast({
                title: "Success",
                description: "Profile updated successfully",
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    // Experience Handlers
    const addExperience = () => {
        setExperience([...experience, { position: "", institution: "", dates: "", description: "" }]);
    };

    const removeExperience = (index: number) => {
        const newExp = [...experience];
        newExp.splice(index, 1);
        setExperience(newExp);
    };

    const updateExperience = (index: number, field: keyof MvpExperience, value: string) => {
        const newExp = [...experience];
        newExp[index] = { ...newExp[index], [field]: value };
        setExperience(newExp);
    };

    // Language Handlers
    const addLanguage = () => {
        setLanguages([...languages, { language: "", level: "Intermediate" }]);
    };

    const removeLanguage = (index: number) => {
        const newLang = [...languages];
        newLang.splice(index, 1);
        setLanguages(newLang);
    };

    const updateLanguage = (index: number, field: keyof MvpLanguage, value: string) => {
        const newLang = [...languages];
        newLang[index] = { ...newLang[index], [field]: value };
        setLanguages(newLang);
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-kidato-purple" /></div>;
    }

    return (
        <div className="space-y-6">
            {/* Experience Section */}
            <Card className="border-2 border-blue-100">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                        <Briefcase className="mr-2 h-5 w-5 text-kidato-purple" />
                        Detailed Experience
                    </CardTitle>
                    <Button onClick={addExperience} variant="outline" size="sm" className="border-kidato-purple text-kidato-purple">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Experience
                    </Button>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {experience.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No experience added yet.</p>
                    ) : (
                        experience.map((exp, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group">
                                <Button
                                    onClick={() => removeExperience(index)}
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                    <div className="space-y-2">
                                        <Label>Position</Label>
                                        <Input
                                            value={exp.position}
                                            onChange={(e) => updateExperience(index, "position", e.target.value)}
                                            placeholder="e.g. Senior Math Teacher"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Institution</Label>
                                        <Input
                                            value={exp.institution}
                                            onChange={(e) => updateExperience(index, "institution", e.target.value)}
                                            placeholder="e.g. Nairobi Academy"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 mb-3">
                                    <Label>Dates</Label>
                                    <Input
                                        value={exp.dates}
                                        onChange={(e) => updateExperience(index, "dates", e.target.value)}
                                        placeholder="e.g. 2018 - 2022"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={exp.description || ""}
                                        onChange={(e) => updateExperience(index, "description", e.target.value)}
                                        placeholder="Briefly describe your responsibilities..."
                                        className="min-h-[80px]"
                                    />
                                </div>
                                {index < experience.length - 1 && <Separator className="mt-4" />}
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Languages Section */}
            <Card className="border-2 border-blue-100">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                        <Globe className="mr-2 h-5 w-5 text-blue-600" />
                        Languages
                    </CardTitle>
                    <Button onClick={addLanguage} variant="outline" size="sm" className="border-blue-600 text-blue-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Language
                    </Button>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {languages.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No languages added yet.</p>
                    ) : (
                        languages.map((lang, index) => (
                            <div key={index} className="flex gap-4 items-end bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex-1 space-y-2">
                                    <Label>Language</Label>
                                    <Input
                                        value={lang.language}
                                        onChange={(e) => updateLanguage(index, "language", e.target.value)}
                                        placeholder="e.g. English"
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label>Level</Label>
                                    <Select
                                        value={lang.level}
                                        onValueChange={(val) => updateLanguage(index, "level", val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Native">Native</SelectItem>
                                            <SelectItem value="Fluent">Fluent</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Basic">Basic</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    onClick={() => removeLanguage(index)}
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500"
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-end sticky bottom-4 bg-white/80 p-4 rounded-xl backdrop-blur-sm border border-gray-100 shadow-lg z-10">
                <Button onClick={handleSave} disabled={saving} className="bg-kidato-purple hover:bg-blue-700 min-w-[150px]">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
