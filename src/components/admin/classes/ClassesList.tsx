import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MoreHorizontal,
    Search,
    Eye,
    Filter,
    Loader2,
    BookOpen
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { classService, Class } from '@/integrations/api/services/class.service';
import { adminService } from '@/integrations/api/services/admin.service';
import { useToast } from "@/hooks/use-toast";

interface ClassesListProps {
    onViewClass: (classId: string, type: 'class' | 'offering') => void;
}

const ClassesList = ({ onViewClass }: ClassesListProps) => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = classes.filter(c =>
                c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.teacher?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.teacher?.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredClasses(filtered);
        } else {
            setFilteredClasses(classes);
        }
    }, [searchQuery, classes]);

    const fetchClasses = async () => {
        setLoading(true);
        try {
            // Fetch both traditional classes and MVP offerings
            const [classesResponse, offeringsResponse] = await Promise.all([
                classService.getAllAdmin(),
                adminService.getOfferings()
            ]);

            let combinedData: any[] = [];

            if (classesResponse.data) {
                combinedData = [...combinedData, ...classesResponse.data.map(c => ({
                    ...c,
                    type: 'class'
                }))];
            }

            if (offeringsResponse.data) {
                combinedData = [...combinedData, ...offeringsResponse.data.map(o => ({
                    ...o,
                    type: 'offering',
                    // Normalize teacher data for offerings
                    teacher: {
                        user: {
                            fullName: o.teacherId?.fullName || "Unknown Teacher"
                        }
                    },
                    // Normalize status for offerings
                    status: o.isActive ? 'published' : 'draft'
                }))];
            }

            // Sort by createdAt descending
            combinedData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setClasses(combinedData);
            setFilteredClasses(combinedData);
        } catch (error) {
            console.error("Error fetching classes:", error);
            toast({
                title: "Error",
                description: "Failed to load classes",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'published':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">Published</Badge>;
            case 'draft':
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-0">Draft</Badge>;
            case 'pending_review':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-0">Pending Review</Badge>;
            case 'archived':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-0">Archived</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search classes..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                </Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Teacher</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Grade</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredClasses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No classes found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredClasses.map((cls) => (
                                <TableRow key={cls._id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                                                <BookOpen className="h-4 w-4" />
                                            </div>
                                            <span>{cls.title}</span>
                                            {cls.type === 'offering' && (
                                                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                                                    Offering
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {cls.teacher?.user?.fullName || cls.teacher?.name || "Unknown Teacher"}
                                    </TableCell>
                                    <TableCell>{cls.subject}</TableCell>
                                    <TableCell>{cls.gradeLevel}</TableCell>
                                    <TableCell>{getStatusBadge(cls.status)}</TableCell>
                                    <TableCell>
                                        {new Date(cls.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => onViewClass(cls._id, cls.type as any)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="text-sm text-gray-500">
                Showing {filteredClasses.length} of {classes.length} classes
            </div>
        </div>
    );
};

export default ClassesList;
