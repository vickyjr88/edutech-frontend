import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { teachingConfigService, TeachingCurriculum, TeachingSubject, TeachingGradeLevel } from '@/integrations/api/services/teaching-config.service';
import { Plus, Edit, Trash2, BookOpen, GraduationCap, Award } from 'lucide-react';

const TeachingConfigManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('curricula');

  // Dialog states
  const [curriculumDialog, setCurriculumDialog] = useState(false);
  const [subjectDialog, setSubjectDialog] = useState(false);
  const [gradeLevelDialog, setGradeLevelDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states
  const [curriculumForm, setCurriculumForm] = useState({ code: '', name: '', description: '', isActive: true, sortOrder: 0 });
  const [subjectForm, setSubjectForm] = useState({ code: '', name: '', description: '', category: 'core', isActive: true, sortOrder: 0, keywords: '' });
  const [gradeLevelForm, setGradeLevelForm] = useState({ code: '', name: '', description: '', level: 'primary', ageRange: '', isActive: true, sortOrder: 0 });

  // Fetch data
  const { data: curricula, isLoading: loadingCurricula } = useQuery({
    queryKey: ['curricula'],
    queryFn: async () => {
      const response = await teachingConfigService.getAllCurricula();
      return response.data;
    },
  });

  const { data: subjects, isLoading: loadingSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const response = await teachingConfigService.getAllSubjects();
      return response.data;
    },
  });

  const { data: gradeLevels, isLoading: loadingGradeLevels } = useQuery({
    queryKey: ['gradeLevels'],
    queryFn: async () => {
      const response = await teachingConfigService.getAllGradeLevels();
      return response.data;
    },
  });

  // Mutations
  const createCurriculumMutation = useMutation({
    mutationFn: teachingConfigService.createCurriculum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curricula'] });
      toast({ title: 'Success', description: 'Curriculum created successfully' });
      setCurriculumDialog(false);
      resetCurriculumForm();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to create curriculum', variant: 'destructive' });
    },
  });

  const updateCurriculumMutation = useMutation({
    mutationFn: ({ code, data }: { code: string; data: any }) => teachingConfigService.updateCurriculum(code, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curricula'] });
      toast({ title: 'Success', description: 'Curriculum updated successfully' });
      setCurriculumDialog(false);
      setEditingItem(null);
      resetCurriculumForm();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to update curriculum', variant: 'destructive' });
    },
  });

  const deleteCurriculumMutation = useMutation({
    mutationFn: teachingConfigService.deleteCurriculum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curricula'] });
      toast({ title: 'Success', description: 'Curriculum deleted successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to delete curriculum', variant: 'destructive' });
    },
  });

  const createSubjectMutation = useMutation({
    mutationFn: teachingConfigService.createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast({ title: 'Success', description: 'Subject created successfully' });
      setSubjectDialog(false);
      resetSubjectForm();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to create subject', variant: 'destructive' });
    },
  });

  const updateSubjectMutation = useMutation({
    mutationFn: ({ code, data }: { code: string; data: any }) => teachingConfigService.updateSubject(code, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast({ title: 'Success', description: 'Subject updated successfully' });
      setSubjectDialog(false);
      setEditingItem(null);
      resetSubjectForm();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to update subject', variant: 'destructive' });
    },
  });

  const deleteSubjectMutation = useMutation({
    mutationFn: teachingConfigService.deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast({ title: 'Success', description: 'Subject deleted successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to delete subject', variant: 'destructive' });
    },
  });

  const createGradeLevelMutation = useMutation({
    mutationFn: teachingConfigService.createGradeLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gradeLevels'] });
      toast({ title: 'Success', description: 'Grade level created successfully' });
      setGradeLevelDialog(false);
      resetGradeLevelForm();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to create grade level', variant: 'destructive' });
    },
  });

  const updateGradeLevelMutation = useMutation({
    mutationFn: ({ code, data }: { code: string; data: any }) => teachingConfigService.updateGradeLevel(code, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gradeLevels'] });
      toast({ title: 'Success', description: 'Grade level updated successfully' });
      setGradeLevelDialog(false);
      setEditingItem(null);
      resetGradeLevelForm();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to update grade level', variant: 'destructive' });
    },
  });

  const deleteGradeLevelMutation = useMutation({
    mutationFn: teachingConfigService.deleteGradeLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gradeLevels'] });
      toast({ title: 'Success', description: 'Grade level deleted successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to delete grade level', variant: 'destructive' });
    },
  });

  // Reset forms
  const resetCurriculumForm = () => {
    setCurriculumForm({ code: '', name: '', description: '', isActive: true, sortOrder: 0 });
  };

  const resetSubjectForm = () => {
    setSubjectForm({ code: '', name: '', description: '', category: 'core', isActive: true, sortOrder: 0, keywords: '' });
  };

  const resetGradeLevelForm = () => {
    setGradeLevelForm({ code: '', name: '', description: '', level: 'primary', ageRange: '', isActive: true, sortOrder: 0 });
  };

  // Handlers
  const handleEditCurriculum = (curriculum: TeachingCurriculum) => {
    setEditingItem(curriculum);
    setCurriculumForm({
      code: curriculum.code,
      name: curriculum.name,
      description: curriculum.description || '',
      isActive: curriculum.isActive,
      sortOrder: curriculum.sortOrder,
    });
    setCurriculumDialog(true);
  };

  const handleEditSubject = (subject: TeachingSubject) => {
    setEditingItem(subject);
    setSubjectForm({
      code: subject.code,
      name: subject.name,
      description: subject.description || '',
      category: subject.category,
      isActive: subject.isActive,
      sortOrder: subject.sortOrder,
      keywords: subject.keywords?.join(', ') || '',
    });
    setSubjectDialog(true);
  };

  const handleEditGradeLevel = (gradeLevel: TeachingGradeLevel) => {
    setEditingItem(gradeLevel);
    setGradeLevelForm({
      code: gradeLevel.code,
      name: gradeLevel.name,
      description: gradeLevel.description || '',
      level: gradeLevel.level,
      ageRange: gradeLevel.ageRange || '',
      isActive: gradeLevel.isActive,
      sortOrder: gradeLevel.sortOrder,
    });
    setGradeLevelDialog(true);
  };

  const handleSaveCurriculum = () => {
    if (editingItem) {
      updateCurriculumMutation.mutate({ code: editingItem.code, data: curriculumForm });
    } else {
      createCurriculumMutation.mutate(curriculumForm);
    }
  };

  const handleSaveSubject = () => {
    const data = {
      ...subjectForm,
      keywords: subjectForm.keywords ? subjectForm.keywords.split(',').map(k => k.trim()) : [],
    };
    if (editingItem) {
      updateSubjectMutation.mutate({ code: editingItem.code, data });
    } else {
      createSubjectMutation.mutate(data);
    }
  };

  const handleSaveGradeLevel = () => {
    if (editingItem) {
      updateGradeLevelMutation.mutate({ code: editingItem.code, data: gradeLevelForm });
    } else {
      createGradeLevelMutation.mutate(gradeLevelForm);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teaching Configuration</h1>
        <p className="text-muted-foreground">
          Manage curricula, subjects, and grade levels used throughout the platform
        </p>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="curricula">
            <Award className="h-4 w-4 mr-2" />
            Curricula
          </TabsTrigger>
          <TabsTrigger value="subjects">
            <BookOpen className="h-4 w-4 mr-2" />
            Subjects
          </TabsTrigger>
          <TabsTrigger value="gradeLevels">
            <GraduationCap className="h-4 w-4 mr-2" />
            Grade Levels
          </TabsTrigger>
        </TabsList>

        {/* Curricula Tab */}
        <TabsContent value="curricula">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Curricula</CardTitle>
                <CardDescription>Manage educational curricula (IGCSE, KCSE, IB, etc.)</CardDescription>
              </div>
              <Button onClick={() => { resetCurriculumForm(); setEditingItem(null); setCurriculumDialog(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Curriculum
              </Button>
            </CardHeader>
            <CardContent>
              {loadingCurricula ? (
                <div className="text-center py-8">Loading curricula...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sort Order</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {curricula?.map((curriculum) => (
                      <TableRow key={curriculum._id}>
                        <TableCell className="font-mono">{curriculum.code}</TableCell>
                        <TableCell className="font-medium">{curriculum.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{curriculum.description}</TableCell>
                        <TableCell>
                          {curriculum.isActive ? (
                            <Badge variant="secondary">Active</Badge>
                          ) : (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>{curriculum.sortOrder}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditCurriculum(curriculum)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this curriculum?')) {
                                deleteCurriculumMutation.mutate(curriculum.code);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Subjects</CardTitle>
                <CardDescription>Manage academic subjects (Mathematics, Physics, etc.)</CardDescription>
              </div>
              <Button onClick={() => { resetSubjectForm(); setEditingItem(null); setSubjectDialog(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </CardHeader>
            <CardContent>
              {loadingSubjects ? (
                <div className="text-center py-8">Loading subjects...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects?.map((subject) => (
                      <TableRow key={subject._id}>
                        <TableCell className="font-mono">{subject.code}</TableCell>
                        <TableCell className="font-medium">{subject.name}</TableCell>
                        <TableCell>
                          <Badge variant={subject.category === 'core' ? 'default' : subject.category === 'elective' ? 'secondary' : 'outline'}>
                            {subject.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{subject.description}</TableCell>
                        <TableCell>
                          {subject.isActive ? (
                            <Badge variant="secondary">Active</Badge>
                          ) : (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditSubject(subject)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this subject?')) {
                                deleteSubjectMutation.mutate(subject.code);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grade Levels Tab */}
        <TabsContent value="gradeLevels">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Grade Levels</CardTitle>
                <CardDescription>Manage grade levels (Grade 1, Form 1, etc.)</CardDescription>
              </div>
              <Button onClick={() => { resetGradeLevelForm(); setEditingItem(null); setGradeLevelDialog(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Grade Level
              </Button>
            </CardHeader>
            <CardContent>
              {loadingGradeLevels ? (
                <div className="text-center py-8">Loading grade levels...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Age Range</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gradeLevels?.map((gradeLevel) => (
                      <TableRow key={gradeLevel._id}>
                        <TableCell className="font-mono">{gradeLevel.code}</TableCell>
                        <TableCell className="font-medium">{gradeLevel.name}</TableCell>
                        <TableCell>
                          <Badge variant={gradeLevel.level === 'primary' ? 'default' : gradeLevel.level === 'secondary' ? 'secondary' : 'outline'}>
                            {gradeLevel.level}
                          </Badge>
                        </TableCell>
                        <TableCell>{gradeLevel.ageRange}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{gradeLevel.description}</TableCell>
                        <TableCell>
                          {gradeLevel.isActive ? (
                            <Badge variant="secondary">Active</Badge>
                          ) : (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditGradeLevel(gradeLevel)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this grade level?')) {
                                deleteGradeLevelMutation.mutate(gradeLevel.code);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Curriculum Dialog */}
      <Dialog open={curriculumDialog} onOpenChange={setCurriculumDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Curriculum' : 'Add Curriculum'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the curriculum details below' : 'Add a new curriculum to the system'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="curriculum-code">Code *</Label>
              <Input
                id="curriculum-code"
                value={curriculumForm.code}
                onChange={(e) => setCurriculumForm({ ...curriculumForm, code: e.target.value })}
                placeholder="e.g., igcse"
                disabled={!!editingItem}
              />
            </div>
            <div>
              <Label htmlFor="curriculum-name">Name *</Label>
              <Input
                id="curriculum-name"
                value={curriculumForm.name}
                onChange={(e) => setCurriculumForm({ ...curriculumForm, name: e.target.value })}
                placeholder="e.g., IGCSE"
              />
            </div>
            <div>
              <Label htmlFor="curriculum-description">Description</Label>
              <Textarea
                id="curriculum-description"
                value={curriculumForm.description}
                onChange={(e) => setCurriculumForm({ ...curriculumForm, description: e.target.value })}
                placeholder="Brief description of the curriculum"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="curriculum-active"
                  checked={curriculumForm.isActive}
                  onChange={(e) => setCurriculumForm({ ...curriculumForm, isActive: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="curriculum-active">Active</Label>
              </div>
              <div className="flex-1">
                <Label htmlFor="curriculum-sort">Sort Order</Label>
                <Input
                  id="curriculum-sort"
                  type="number"
                  value={curriculumForm.sortOrder}
                  onChange={(e) => setCurriculumForm({ ...curriculumForm, sortOrder: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCurriculumDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveCurriculum}>
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subject Dialog */}
      <Dialog open={subjectDialog} onOpenChange={setSubjectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Subject' : 'Add Subject'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the subject details below' : 'Add a new subject to the system'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject-code">Code *</Label>
              <Input
                id="subject-code"
                value={subjectForm.code}
                onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                placeholder="e.g., mathematics"
                disabled={!!editingItem}
              />
            </div>
            <div>
              <Label htmlFor="subject-name">Name *</Label>
              <Input
                id="subject-name"
                value={subjectForm.name}
                onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                placeholder="e.g., Mathematics"
              />
            </div>
            <div>
              <Label htmlFor="subject-category">Category</Label>
              <Select value={subjectForm.category} onValueChange={(value: any) => setSubjectForm({ ...subjectForm, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="core">Core</SelectItem>
                  <SelectItem value="elective">Elective</SelectItem>
                  <SelectItem value="optional">Optional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subject-description">Description</Label>
              <Textarea
                id="subject-description"
                value={subjectForm.description}
                onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                placeholder="Brief description of the subject"
              />
            </div>
            <div>
              <Label htmlFor="subject-keywords">Keywords (comma-separated)</Label>
              <Input
                id="subject-keywords"
                value={subjectForm.keywords}
                onChange={(e) => setSubjectForm({ ...subjectForm, keywords: e.target.value })}
                placeholder="e.g., math, maths, pure math"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="subject-active"
                  checked={subjectForm.isActive}
                  onChange={(e) => setSubjectForm({ ...subjectForm, isActive: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="subject-active">Active</Label>
              </div>
              <div className="flex-1">
                <Label htmlFor="subject-sort">Sort Order</Label>
                <Input
                  id="subject-sort"
                  type="number"
                  value={subjectForm.sortOrder}
                  onChange={(e) => setSubjectForm({ ...subjectForm, sortOrder: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubjectDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveSubject}>
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Grade Level Dialog */}
      <Dialog open={gradeLevelDialog} onOpenChange={setGradeLevelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Grade Level' : 'Add Grade Level'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the grade level details below' : 'Add a new grade level to the system'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="grade-code">Code *</Label>
              <Input
                id="grade-code"
                value={gradeLevelForm.code}
                onChange={(e) => setGradeLevelForm({ ...gradeLevelForm, code: e.target.value })}
                placeholder="e.g., grade-1"
                disabled={!!editingItem}
              />
            </div>
            <div>
              <Label htmlFor="grade-name">Name *</Label>
              <Input
                id="grade-name"
                value={gradeLevelForm.name}
                onChange={(e) => setGradeLevelForm({ ...gradeLevelForm, name: e.target.value })}
                placeholder="e.g., Grade 1"
              />
            </div>
            <div>
              <Label htmlFor="grade-level">Level</Label>
              <Select value={gradeLevelForm.level} onValueChange={(value: any) => setGradeLevelForm({ ...gradeLevelForm, level: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="grade-age-range">Age Range</Label>
              <Input
                id="grade-age-range"
                value={gradeLevelForm.ageRange}
                onChange={(e) => setGradeLevelForm({ ...gradeLevelForm, ageRange: e.target.value })}
                placeholder="e.g., 6-7"
              />
            </div>
            <div>
              <Label htmlFor="grade-description">Description</Label>
              <Textarea
                id="grade-description"
                value={gradeLevelForm.description}
                onChange={(e) => setGradeLevelForm({ ...gradeLevelForm, description: e.target.value })}
                placeholder="Brief description of the grade level"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="grade-active"
                  checked={gradeLevelForm.isActive}
                  onChange={(e) => setGradeLevelForm({ ...gradeLevelForm, isActive: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="grade-active">Active</Label>
              </div>
              <div className="flex-1">
                <Label htmlFor="grade-sort">Sort Order</Label>
                <Input
                  id="grade-sort"
                  type="number"
                  value={gradeLevelForm.sortOrder}
                  onChange={(e) => setGradeLevelForm({ ...gradeLevelForm, sortOrder: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGradeLevelDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveGradeLevel}>
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeachingConfigManagement;
