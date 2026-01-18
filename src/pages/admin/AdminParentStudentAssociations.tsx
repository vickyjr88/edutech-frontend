import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { adminService } from '@/integrations/api/services/admin.service';
import { Loader2, UserPlus, Users, Search, Link, Unlink, X } from 'lucide-react';

interface User {
    _id: string;
    fullName: string;
    email: string;
    profileImage?: string;
}

interface ParentAssociation {
    parentId: string;
    parentUser: User;
    children: User[];
    childrenCount: number;
}

interface StudentAssociation {
    studentId: string;
    studentUser: User;
    parents: User[];
    parentsCount: number;
}

const AdminParentStudentAssociations: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [parentAssociations, setParentAssociations] = useState<ParentAssociation[]>([]);
    const [studentAssociations, setStudentAssociations] = useState<StudentAssociation[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('parents');

    // Association dialog state
    const [isAssociateDialogOpen, setIsAssociateDialogOpen] = useState(false);
    const [selectedParent, setSelectedParent] = useState<string>('');
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [selectedParents, setSelectedParents] = useState<string[]>([]);
    const [availableParents, setAvailableParents] = useState<User[]>([]);
    const [availableStudents, setAvailableStudents] = useState<User[]>([]);
    const [isLoadingAvailable, setIsLoadingAvailable] = useState(false);
    const [associationMode, setAssociationMode] = useState<'addToParent' | 'addToStudent'>('addToParent');
    const [dialogSearchTerm, setDialogSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<string>('');
    const [isAssociating, setIsAssociating] = useState(false);

    // Fetch all associations
    const fetchAssociations = async () => {
        setIsLoading(true);
        try {
            const response = await adminService.getAllAssociations();
            if (response.data) {
                setParentAssociations(response.data.parents || []);
                setStudentAssociations(response.data.students || []);
            }
        } catch (error: any) {
            console.error('Error fetching associations:', error);
            toast({
                title: 'Error',
                description: 'Failed to load parent-student associations.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAssociations();
    }, []);

    // Fetch available students for a parent
    const fetchAvailableStudents = async (parentUserId: string) => {
        setIsLoadingAvailable(true);
        try {
            const response = await adminService.getAvailableStudentsForParent(parentUserId);
            if (response.data) {
                setAvailableStudents(response.data.availableStudents || []);
            }
        } catch (error: any) {
            console.error('Error fetching available students:', error);
        } finally {
            setIsLoadingAvailable(false);
        }
    };

    // Fetch available parents for a student
    const fetchAvailableParents = async (studentUserId: string) => {
        setIsLoadingAvailable(true);
        try {
            const response = await adminService.getAvailableParentsForStudent(studentUserId);
            if (response.data) {
                setAvailableParents(response.data.availableParents || []);
            }
        } catch (error: any) {
            console.error('Error fetching available parents:', error);
        } finally {
            setIsLoadingAvailable(false);
        }
    };

    // Filter available items based on dialog search
    const filteredAvailableStudents = useMemo(() => {
        if (!dialogSearchTerm) return availableStudents;
        const search = dialogSearchTerm.toLowerCase();
        return availableStudents.filter(
            (s) =>
                s.fullName?.toLowerCase().includes(search) ||
                s.email?.toLowerCase().includes(search)
        );
    }, [availableStudents, dialogSearchTerm]);

    const filteredAvailableParents = useMemo(() => {
        if (!dialogSearchTerm) return availableParents;
        const search = dialogSearchTerm.toLowerCase();
        return availableParents.filter(
            (p) =>
                p.fullName?.toLowerCase().includes(search) ||
                p.email?.toLowerCase().includes(search)
        );
    }, [availableParents, dialogSearchTerm]);

    // Toggle selection for multiselect
    const toggleStudentSelection = (studentId: string) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    const toggleParentSelection = (parentId: string) => {
        setSelectedParents((prev) =>
            prev.includes(parentId)
                ? prev.filter((id) => id !== parentId)
                : [...prev, parentId]
        );
    };

    // Associate parent with multiple students (or vice versa)
    const handleAssociate = async () => {
        if (associationMode === 'addToParent') {
            if (!selectedParent || selectedStudents.length === 0) {
                toast({
                    title: 'Validation Error',
                    description: 'Please select at least one student.',
                    variant: 'destructive',
                });
                return;
            }

            setIsAssociating(true);
            let successCount = 0;
            let errorCount = 0;

            for (const studentId of selectedStudents) {
                try {
                    await adminService.associateParentWithStudent(selectedParent, studentId);
                    successCount++;
                } catch (error: any) {
                    console.error('Error associating:', error);
                    errorCount++;
                }
            }

            setIsAssociating(false);

            if (successCount > 0) {
                toast({
                    title: 'Success',
                    description: `Successfully associated ${successCount} student(s) with parent.${errorCount > 0 ? ` ${errorCount} failed.` : ''}`,
                });
            } else {
                toast({
                    title: 'Error',
                    description: 'Failed to create associations.',
                    variant: 'destructive',
                });
            }

            setIsAssociateDialogOpen(false);
            setSelectedParent('');
            setSelectedStudents([]);
            setDialogSearchTerm('');
            fetchAssociations();
        } else {
            if (!selectedStudent || selectedParents.length === 0) {
                toast({
                    title: 'Validation Error',
                    description: 'Please select at least one parent.',
                    variant: 'destructive',
                });
                return;
            }

            setIsAssociating(true);
            let successCount = 0;
            let errorCount = 0;

            for (const parentId of selectedParents) {
                try {
                    await adminService.associateParentWithStudent(parentId, selectedStudent);
                    successCount++;
                } catch (error: any) {
                    console.error('Error associating:', error);
                    errorCount++;
                }
            }

            setIsAssociating(false);

            if (successCount > 0) {
                toast({
                    title: 'Success',
                    description: `Successfully associated ${successCount} parent(s) with student.${errorCount > 0 ? ` ${errorCount} failed.` : ''}`,
                });
            } else {
                toast({
                    title: 'Error',
                    description: 'Failed to create associations.',
                    variant: 'destructive',
                });
            }

            setIsAssociateDialogOpen(false);
            setSelectedStudent('');
            setSelectedParents([]);
            setDialogSearchTerm('');
            fetchAssociations();
        }
    };

    // Disassociate parent from student
    const handleDisassociate = async (parentUserId: string, studentUserId: string) => {
        try {
            const response = await adminService.disassociateParentFromStudent(
                parentUserId,
                studentUserId
            );

            if (response.data) {
                toast({
                    title: 'Success',
                    description: 'Association removed successfully.',
                });
                fetchAssociations();
            }
        } catch (error: any) {
            console.error('Error disassociating:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to remove association.',
                variant: 'destructive',
            });
        }
    };

    // Open association dialog for adding student to parent
    const openAddStudentToParentDialog = (parentUserId: string) => {
        setSelectedParent(parentUserId);
        setSelectedStudents([]);
        setDialogSearchTerm('');
        setAssociationMode('addToParent');
        fetchAvailableStudents(parentUserId);
        setIsAssociateDialogOpen(true);
    };

    // Open association dialog for adding parent to student
    const openAddParentToStudentDialog = (studentUserId: string) => {
        setSelectedStudent(studentUserId);
        setSelectedParents([]);
        setDialogSearchTerm('');
        setAssociationMode('addToStudent');
        fetchAvailableParents(studentUserId);
        setIsAssociateDialogOpen(true);
    };

    // Filter associations based on search term
    const filteredParents = parentAssociations.filter(
        (assoc) =>
            assoc.parentUser?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assoc.parentUser?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredStudents = studentAssociations.filter(
        (assoc) =>
            assoc.studentUser?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assoc.studentUser?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get selected items for display
    const getSelectedStudentNames = () => {
        return selectedStudents
            .map((id) => availableStudents.find((s) => s._id === id)?.fullName)
            .filter(Boolean);
    };

    const getSelectedParentNames = () => {
        return selectedParents
            .map((id) => availableParents.find((p) => p._id === id)?.fullName)
            .filter(Boolean);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Parent-Student Associations</h1>
                    <p className="text-muted-foreground">
                        Manage relationships between parents and students
                    </p>
                </div>
                <Dialog open={isAssociateDialogOpen} onOpenChange={setIsAssociateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Link className="h-4 w-4" />
                            New Association
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Create New Association</DialogTitle>
                            <DialogDescription>
                                {associationMode === 'addToParent'
                                    ? 'Select students to associate with this parent'
                                    : 'Select parents to associate with this student'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            {associationMode === 'addToParent' ? (
                                <>
                                    <div>
                                        <Label>Parent</Label>
                                        <Input
                                            value={
                                                parentAssociations.find((p) => p.parentUser?._id === selectedParent)
                                                    ?.parentUser?.fullName || 'Selected Parent'
                                            }
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                    <div>
                                        <Label>Select Students</Label>
                                        {isLoadingAvailable ? (
                                            <div className="flex items-center gap-2 p-4 border rounded-md">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Loading students...
                                            </div>
                                        ) : (
                                            <div className="border rounded-md">
                                                {/* Search input */}
                                                <div className="p-2 border-b">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                        <Input
                                                            placeholder="Search students..."
                                                            value={dialogSearchTerm}
                                                            onChange={(e) => setDialogSearchTerm(e.target.value)}
                                                            className="pl-10"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Selected items display */}
                                                {selectedStudents.length > 0 && (
                                                    <div className="p-2 border-b flex flex-wrap gap-1 bg-muted/50">
                                                        {getSelectedStudentNames().map((name, idx) => (
                                                            <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                                                                {name}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleStudentSelection(selectedStudents[idx])}
                                                                    className="hover:text-destructive"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Scrollable list */}
                                                <ScrollArea className="h-48">
                                                    <div className="p-2 space-y-1">
                                                        {filteredAvailableStudents.length > 0 ? (
                                                            filteredAvailableStudents.map((student) => (
                                                                <div
                                                                    key={student._id}
                                                                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted transition-colors ${selectedStudents.includes(student._id) ? 'bg-primary/10' : ''
                                                                        }`}
                                                                    onClick={() => toggleStudentSelection(student._id)}
                                                                >
                                                                    <Checkbox
                                                                        checked={selectedStudents.includes(student._id)}
                                                                        onCheckedChange={() => toggleStudentSelection(student._id)}
                                                                    />
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-medium truncate">{student.fullName}</p>
                                                                        <p className="text-sm text-muted-foreground truncate">
                                                                            {student.email}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-center text-muted-foreground py-4">
                                                                No students available
                                                            </p>
                                                        )}
                                                    </div>
                                                </ScrollArea>

                                                {/* Selection count */}
                                                <div className="p-2 border-t text-sm text-muted-foreground">
                                                    {selectedStudents.length} student(s) selected
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <Label>Student</Label>
                                        <Input
                                            value={
                                                studentAssociations.find((s) => s.studentUser?._id === selectedStudent)
                                                    ?.studentUser?.fullName || 'Selected Student'
                                            }
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                    <div>
                                        <Label>Select Parents</Label>
                                        {isLoadingAvailable ? (
                                            <div className="flex items-center gap-2 p-4 border rounded-md">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Loading parents...
                                            </div>
                                        ) : (
                                            <div className="border rounded-md">
                                                {/* Search input */}
                                                <div className="p-2 border-b">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                        <Input
                                                            placeholder="Search parents..."
                                                            value={dialogSearchTerm}
                                                            onChange={(e) => setDialogSearchTerm(e.target.value)}
                                                            className="pl-10"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Selected items display */}
                                                {selectedParents.length > 0 && (
                                                    <div className="p-2 border-b flex flex-wrap gap-1 bg-muted/50">
                                                        {getSelectedParentNames().map((name, idx) => (
                                                            <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                                                                {name}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleParentSelection(selectedParents[idx])}
                                                                    className="hover:text-destructive"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Scrollable list */}
                                                <ScrollArea className="h-48">
                                                    <div className="p-2 space-y-1">
                                                        {filteredAvailableParents.length > 0 ? (
                                                            filteredAvailableParents.map((parent) => (
                                                                <div
                                                                    key={parent._id}
                                                                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted transition-colors ${selectedParents.includes(parent._id) ? 'bg-primary/10' : ''
                                                                        }`}
                                                                    onClick={() => toggleParentSelection(parent._id)}
                                                                >
                                                                    <Checkbox
                                                                        checked={selectedParents.includes(parent._id)}
                                                                        onCheckedChange={() => toggleParentSelection(parent._id)}
                                                                    />
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-medium truncate">{parent.fullName}</p>
                                                                        <p className="text-sm text-muted-foreground truncate">
                                                                            {parent.email}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-center text-muted-foreground py-4">
                                                                No parents available
                                                            </p>
                                                        )}
                                                    </div>
                                                </ScrollArea>

                                                {/* Selection count */}
                                                <div className="p-2 border-t text-sm text-muted-foreground">
                                                    {selectedParents.length} parent(s) selected
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAssociateDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAssociate} disabled={isAssociating}>
                                {isAssociating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Associations'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="parents" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Parents ({parentAssociations.length})
                            </TabsTrigger>
                            <TabsTrigger value="students" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Students ({studentAssociations.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="parents" className="mt-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Parent</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Children</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredParents.map((assoc) => (
                                        <TableRow key={assoc.parentId}>
                                            <TableCell className="font-medium">
                                                {assoc.parentUser?.fullName || 'Unknown'}
                                            </TableCell>
                                            <TableCell>{assoc.parentUser?.email || '-'}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-2">
                                                    {assoc.children.length > 0 ? (
                                                        assoc.children.map((child: any) => (
                                                            <Badge key={child._id} variant="secondary" className="flex items-center gap-1">
                                                                {child.fullName || 'Unknown'}
                                                                <button
                                                                    onClick={() => handleDisassociate(assoc.parentUser?._id, child._id)}
                                                                    className="ml-1 hover:text-destructive"
                                                                    title="Remove association"
                                                                >
                                                                    <Unlink className="h-3 w-3" />
                                                                </button>
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">No children associated</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openAddStudentToParentDialog(assoc.parentUser?._id)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <UserPlus className="h-4 w-4" />
                                                    Add Student
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredParents.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                No parents found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TabsContent>

                        <TabsContent value="students" className="mt-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Parents</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.map((assoc) => (
                                        <TableRow key={assoc.studentId}>
                                            <TableCell className="font-medium">
                                                {assoc.studentUser?.fullName || 'Unknown'}
                                            </TableCell>
                                            <TableCell>{assoc.studentUser?.email || '-'}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-2">
                                                    {assoc.parents.length > 0 ? (
                                                        assoc.parents.map((parent: any) => (
                                                            <Badge key={parent._id} variant="secondary" className="flex items-center gap-1">
                                                                {parent.fullName || 'Unknown'}
                                                                <button
                                                                    onClick={() => handleDisassociate(parent._id, assoc.studentUser?._id)}
                                                                    className="ml-1 hover:text-destructive"
                                                                    title="Remove association"
                                                                >
                                                                    <Unlink className="h-3 w-3" />
                                                                </button>
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">No parents associated</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openAddParentToStudentDialog(assoc.studentUser?._id)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <UserPlus className="h-4 w-4" />
                                                    Add Parent
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredStudents.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                No students found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminParentStudentAssociations;
