import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    Users,
    CheckCircle2,
    XCircle,
    Clock,
    MoreVertical,
    User,
    GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { classService, ClassDetail } from '@/integrations/api/services/class.service';
import { useToast } from "@/hooks/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClassDetailsProps {
    classId: string;
    onBack: () => void;
}

const ClassDetails = ({ classId, onBack }: ClassDetailsProps) => {
    const [classData, setClassData] = useState<ClassDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchClassDetails();
    }, [classId]);

    const fetchClassDetails = async () => {
        setLoading(true);
        try {
            const response = await classService.getById(classId);
            if (response.data) {
                setClassData(response.data);
            }
        } catch (error) {
            console.error("Error fetching class details:", error);
            toast({
                title: "Error",
                description: "Failed to load class details",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (status: 'published' | 'archived' | 'draft') => {
        try {
            if (status === 'published') {
                await classService.publish(classId);
            } else if (status === 'archived') {
                await classService.archive(classId);
            } else {
                await classService.updateStatus(classId, status);
            }

            toast({
                title: "Success",
                description: `Class status updated to ${status}`,
            });
            fetchClassDetails();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update status",
                variant: "destructive"
            });
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading class details...</div>;
    }

    if (!classData) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-500 mb-4">Class not found</p>
                <Button onClick={onBack}>Go Back</Button>
            </div>
        );
    }

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'published':
                return <Badge className="bg-green-100 text-green-800 border-0">Published</Badge>;
            case 'draft':
                return <Badge className="bg-gray-100 text-gray-800 border-0">Draft</Badge>;
            case 'pending_review':
                return <Badge className="bg-yellow-100 text-yellow-800 border-0">Pending Review</Badge>;
            case 'archived':
                return <Badge className="bg-red-100 text-red-800 border-0">Archived</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{classData.title}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(classData.status)}
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">{classData._id}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Manage Status
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStatusChange('published')}>
                                Mark as Published
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange('draft')}>
                                Mark as Draft
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange('archived')} className="text-red-600">
                                Archive Class
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Overview Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Class Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Subject</label>
                                    <p className="text-base font-medium">{classData.subject}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Grade Level</label>
                                    <p className="text-base font-medium">{classData.gradeLevel}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Type</label>
                                    <p className="text-base font-medium capitalize">{classData.type}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Age Range</label>
                                    <p className="text-base font-medium">{classData.ageRange || 'Not specified'}</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Description</label>
                                <div className="mt-1 prose prose-sm max-w-none text-gray-700">
                                    {classData.description}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cohorts / Schedule Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cohorts & Schedule</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {classData.cohorts && classData.cohorts.length > 0 ? (
                                <div className="space-y-4">
                                    {classData.cohorts.map((cohort, index) => (
                                        <div key={index} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-lg">{cohort.name}</h3>
                                                <Badge variant={cohort.isActive ? "default" : "secondary"}>
                                                    {cohort.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(cohort.startDate).toLocaleDateString()} - {new Date(cohort.endDate).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    {cohort.startTime} - {cohort.endTime}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    {cohort.currentStudents} / {cohort.maximumStudents} Students
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No cohorts scheduled yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Teacher Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3 mb-4">
                                {classData.teacher?.user?.profileImage ? (
                                    <img
                                        src={classData.teacher.user.profileImage}
                                        alt={classData.teacher.user.fullName}
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        <User className="h-6 w-6 text-gray-400" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-gray-900">{classData.teacher?.user?.fullName || classData.teacher?.name}</p>
                                    <p className="text-sm text-gray-500">Primary Teacher</p>
                                </div>
                            </div>
                            <div className="text-sm space-y-2">
                                {classData.teacher?.subjects && (
                                    <div className="flex flex-wrap gap-1">
                                        {classData.teacher.subjects.map((sub, i) => (
                                            <Badge key={i} variant="secondary" className="text-xs">{sub.subject}</Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Enrolled Students</span>
                                <span className="font-semibold">{classData.enrollment?.current || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Total Reviews</span>
                                <span className="font-semibold">{classData.totalReviews}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Rating</span>
                                <span className="font-semibold flex items-center gap-1">
                                    {classData.rating.toFixed(1)} <span className="text-yellow-500">★</span>
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ClassDetails;
