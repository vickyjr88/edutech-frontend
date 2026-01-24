import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { parentService } from "@/integrations/api/services/parent.service";

interface ChildFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    childToEdit?: any; // Using any for now to match flexible structure, preferably define interface
    onSuccess: () => void;
}

const ChildFormDialog = ({ open, onOpenChange, childToEdit, onSuccess }: ChildFormDialogProps) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

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

    useEffect(() => {
        if (childToEdit) {
            setFormData({
                fullName: childToEdit.fullName || "",
                dateOfBirth: childToEdit.dateOfBirth ? (typeof childToEdit.dateOfBirth === 'string' ? childToEdit.dateOfBirth.split('T')[0] : new Date(childToEdit.dateOfBirth).toISOString().split('T')[0]) : "",
                grade: childToEdit.grade || childToEdit.gradeLevel || "",
                school: childToEdit.school || "",
                curriculum: childToEdit.curriculum || "",
                email: childToEdit.email || "",
                interests: childToEdit.interests ? (Array.isArray(childToEdit.interests) ? childToEdit.interests.join(", ") : childToEdit.interests) : "",
                aboutMe: childToEdit.aboutMe || "",
            });
        } else {
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
        }
    }, [childToEdit, open]);

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
        if (!formData.fullName || (!childToEdit && !formData.dateOfBirth) || !formData.grade) {
            toast({
                title: "Missing information",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            if (childToEdit) {
                await parentService.updateChild(childToEdit._id, {
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

            onSuccess();
            onOpenChange(false);
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{childToEdit ? "Edit Child" : "Add a New Child"}</DialogTitle>
                    <DialogDescription>
                        {childToEdit ? "Update your child's information." : "Enter your child's information to add them to your account."}
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
                                Date of Birth {(!childToEdit) && <span className="text-red-500">*</span>}
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

                    {!childToEdit && (
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
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Saving..." : (childToEdit ? "Update Child" : "Add Child")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ChildFormDialog;
