import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserPlus, User, BookOpen, Mail, Edit, Trash2, Loader2, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { parentService } from "@/integrations/api/services/parent.service";

const ChildrenManager = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [children, setChildren] = useState<any[]>([]);
    const [parentProfileId, setParentProfileId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [editingChildId, setEditingChildId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        fullName: "",
        dateOfBirth: "",
        grade: "",
        school: "",
        curriculum: "",
        email: "",
        interests: "",
        aboutMe: "",
    });

    const fetchChildren = async () => {
        if (!user?.id) return;

        try {
            const profileResponse = await parentService.getProfile();
            if (profileResponse.data) {
                setParentProfileId(profileResponse.data._id);
                setChildren(profileResponse.data.children || []);
            }
        } catch (error) {
            console.error("Failed to fetch children", error);
            toast({
                title: "Error",
                description: "Failed to load children.",
                variant: "destructive",
            });
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        setIsFetching(true);
        fetchChildren();
    }, [user?.id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleGradeChange = (value: string) => {
        setFormData({
            ...formData,
            grade: value,
        });
    };

    const handleCurriculumChange = (value: string) => {
        setFormData({
            ...formData,
            curriculum: value,
        });
    };

    const handleEditClick = (child: any) => {
        setEditingChildId(child._id);
        setFormData({
            fullName: child.fullName || "",
            dateOfBirth: child.dateOfBirth ? (typeof child.dateOfBirth === 'string' ? child.dateOfBirth.split('T')[0] : new Date(child.dateOfBirth).toISOString().split('T')[0]) : "",
            grade: child.grade || "",
            school: child.school || "",
            curriculum: child.curriculum || "",
            email: child.email || "",
            interests: child.interests ? (Array.isArray(child.interests) ? child.interests.join(", ") : child.interests) : "",
            aboutMe: child.aboutMe || "",
        });
        setIsDialogOpen(true);
    };

    const handleAddClick = () => {
        setEditingChildId(null);
        setFormData({
            fullName: "",
            dateOfBirth: "",
            grade: "",
            school: "",
            curriculum: "",
            email: "",
            interests: "",
            aboutMe: "",
        });
        setIsDialogOpen(true);
    };

    const calculateAge = (dob: string) => {
        if (!dob) return null;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleSubmit = async () => {
        if (!formData.fullName || (!editingChildId && !formData.dateOfBirth) || !formData.grade) {
            toast({
                title: "Missing information",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            if (editingChildId) {
                await parentService.updateChild(editingChildId, {
                    fullName: formData.fullName,
                    grade: formData.grade,
                    school: formData.school,
                    curriculum: formData.curriculum,
                    dateOfBirth: formData.dateOfBirth || undefined,
                    interests: formData.interests ? formData.interests.split(',').map(i => i.trim()) : [],
                    aboutMe: formData.aboutMe,
                });
                toast({
                    title: "Child updated",
                    description: "Child details have been updated.",
                });
            } else {
                await parentService.createChild({
                    fullName: formData.fullName,
                    dateOfBirth: formData.dateOfBirth,
                    grade: formData.grade,
                    school: formData.school,
                    curriculum: formData.curriculum,
                    email: formData.email || undefined,
                });
                toast({
                    title: "Child added",
                    description: `${formData.fullName} has been added successfully.`,
                });
            }

            await fetchChildren();
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Failed to save child", error);
            toast({
                title: "Error",
                description: "Failed to save changes. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteChild = async (childId: string) => {
        if (!parentProfileId) return;

        if (!window.confirm("Are you sure you want to remove this child?")) {
            return;
        }

        try {
            await parentService.removeChild(parentProfileId, childId);
            await fetchChildren();
            toast({
                title: "Child removed",
                description: "Child has been removed from your account.",
            });
        } catch (error) {
            console.error("Failed to remove child", error);
            toast({
                title: "Error",
                description: "Failed to remove child. Please try again.",
                variant: "destructive",
            });
        }
    };

    const grades = [
        "Pre-K", "Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4",
        "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
        "Grade 11", "Grade 12",
    ];

    const curriculums = [
        "CBC (Competency Based Curriculum)",
        "8-4-4 System",
        "British National Curriculum (BNC)",
        "American Curriculum",
        "International Baccalaureate (IB)",
        "ACE (Accelerated Christian Education)",
        "Montessori",
        "Other"
    ];

    const age = calculateAge(formData.dateOfBirth);

    const today = new Date();
    const maxDate = today.toISOString().split('T')[0];
    const minDateObj = new Date();
    minDateObj.setFullYear(today.getFullYear() - 20);
    const minDate = minDateObj.toISOString().split('T')[0];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Children</h2>
                    <p className="text-sm text-gray-500">
                        Manage your children's profiles
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-kidato-purple hover:bg-kidato-dark-blue" onClick={handleAddClick}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Child
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingChildId ? "Edit Child" : "Add a New Child"}</DialogTitle>
                            <DialogDescription>
                                {editingChildId ? "Update your child's information." : "Enter your child's information to add them to your account."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">
                                    Full Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Enter child's full name"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dateOfBirth">
                                        Date of Birth {(!editingChildId) && <span className="text-red-500">*</span>}
                                    </Label>
                                    <Input
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        type="date"
                                        min={minDate}
                                        max={maxDate}
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2 flex items-end pb-2">
                                    {age !== null && (
                                        <div className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded-md w-full text-center">
                                            Age: {age} years
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="grade">
                                    Grade <span className="text-red-500">*</span>
                                </Label>
                                <Select value={formData.grade} onValueChange={handleGradeChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select grade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {grades.map((grade) => (
                                            <SelectItem key={grade} value={grade}>
                                                {grade}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="curriculum">Curriculum</Label>
                                <Select value={formData.curriculum} onValueChange={handleCurriculumChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select curriculum" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {curriculums.map((curr) => (
                                            <SelectItem key={curr} value={curr}>
                                                {curr}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="school">School Name</Label>
                                <Input
                                    id="school"
                                    name="school"
                                    value={formData.school}
                                    onChange={handleInputChange}
                                    placeholder="Enter school name (optional)"
                                />
                            </div>

                            {!editingChildId && (
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email (Optional)</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter email for older children (optional)"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="interests">Interests (Comma separated)</Label>
                                <Input
                                    id="interests"
                                    name="interests"
                                    value={formData.interests}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Robotics, Art, Math"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="aboutMe">About Child</Label>
                                <Textarea
                                    id="aboutMe"
                                    name="aboutMe"
                                    value={formData.aboutMe}
                                    onChange={handleInputChange}
                                    placeholder="Tell us a bit about your child..."
                                    className="min-h-[100px]"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} disabled={isLoading}>
                                {isLoading ? "Saving..." : (editingChildId ? "Update Child" : "Add Child")}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {isFetching ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            ) : children.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <User className="h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No children added yet
                        </h3>
                        <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
                            Add your first child to start managing their learning journey and
                            enrolling them in classes.
                        </p>
                        <Button
                            onClick={handleAddClick}
                            className="bg-kidato-purple hover:bg-kidato-dark-blue"
                        >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Your First Child
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {children.map((child) => (
                        <Card key={child._id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-12 w-12 rounded-full bg-kidato-purple text-white flex items-center justify-center font-semibold text-lg">
                                            {child.fullName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">{child.fullName}</CardTitle>
                                            <CardDescription>
                                                {child.grade}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(child)}>
                                            <Edit className="h-4 w-4 text-gray-500" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteChild(child._id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {child.age ? (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <User className="h-4 w-4 mr-2" />
                                        {child.age} years old
                                    </div>
                                ) : child.dateOfBirth ? (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <User className="h-4 w-4 mr-2" />
                                        {calculateAge(child.dateOfBirth)} years old
                                    </div>
                                ) : null}
                                {child.curriculum && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <GraduationCap className="h-4 w-4 mr-2" />
                                        {child.curriculum}
                                    </div>
                                )}
                                {child.school && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <BookOpen className="h-4 w-4 mr-2" />
                                        {child.school}
                                    </div>
                                )}
                                <div className="pt-4">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => navigate(`/parents-dashboard/child/${child._id}`, { state: { childName: child.fullName } })}
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChildrenManager;
