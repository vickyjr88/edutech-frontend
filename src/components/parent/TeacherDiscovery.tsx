/**
 * MVP Teacher Discovery Component
 *
 * Allows parents to:
 * - Browse all approved teachers
 * - Filter by subject, curriculum, grade level
 * - View teacher offerings and prices
 * - Navigate to book sessions
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  MapPin,
  Star,
  GraduationCap,
  BookOpen,
  DollarSign,
  Clock,
  Filter,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mvpApiClient } from '@/integrations/api/mvp-client';

interface TeacherOffering {
  _id: string;
  type: 'one-time' | 'monthly-package' | 'course';
  title: string;
  price: number;
  sessionDuration: number;
}

interface Teacher {
  _id: string;
  fullName: string;
  bio: string;
  subjects: string[];
  curriculums: string[];
  gradeLevels: string[];
  yearsOfExperience: number;
  city: string;
  profilePhotoUrl?: string;
  offerings: TeacherOffering[];
  rating?: number;
  totalReviews?: number;
}

const KENYAN_CURRICULUMS = ['CBC', '8-4-4', 'IGCSE', 'IB', 'American'];
const GRADE_LEVELS = ['Grade 1-3', 'Grade 4-6', 'Grade 7-9', 'Form 1-2', 'Form 3-4'];

export default function TeacherDiscovery() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>('all');
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Derived data
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);

  useEffect(() => {
    loadTeachers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [teachers, searchQuery, selectedSubject, selectedCurriculum, selectedGradeLevel]);

  const loadTeachers = async () => {
    try {
      setIsLoading(true);

      // TODO: Replace with actual API call
      // const data = await mvpApiClient.get<Teacher[]>('/teachers/approved');

      // Mock data for now
      setTeachers([]);

      // Extract unique subjects
      const subjects = new Set<string>();
      teachers.forEach(teacher => {
        teacher.subjects.forEach(subject => subjects.add(subject));
      });
      setAvailableSubjects(Array.from(subjects).sort());
    } catch (error) {
      console.error('Error loading teachers:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load teachers. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...teachers];

    // Search query filter (name, bio, subjects)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        teacher =>
          teacher.fullName.toLowerCase().includes(query) ||
          teacher.bio.toLowerCase().includes(query) ||
          teacher.subjects.some(s => s.toLowerCase().includes(query))
      );
    }

    // Subject filter
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(teacher =>
        teacher.subjects.includes(selectedSubject)
      );
    }

    // Curriculum filter
    if (selectedCurriculum !== 'all') {
      filtered = filtered.filter(teacher =>
        teacher.curriculums.includes(selectedCurriculum)
      );
    }

    // Grade level filter
    if (selectedGradeLevel !== 'all') {
      filtered = filtered.filter(teacher =>
        teacher.gradeLevels.includes(selectedGradeLevel)
      );
    }

    setFilteredTeachers(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSubject('all');
    setSelectedCurriculum('all');
    setSelectedGradeLevel('all');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedSubject !== 'all' ||
    selectedCurriculum !== 'all' ||
    selectedGradeLevel !== 'all';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600">Loading teachers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-3">Find Your Perfect Teacher</h1>
        <p className="text-lg text-gray-600">
          Browse approved teachers and book sessions that fit your needs
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, subject, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select
                    value={selectedSubject}
                    onValueChange={setSelectedSubject}
                  >
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="All subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {availableSubjects.map(subject => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="curriculum">Curriculum</Label>
                  <Select
                    value={selectedCurriculum}
                    onValueChange={setSelectedCurriculum}
                  >
                    <SelectTrigger id="curriculum">
                      <SelectValue placeholder="All curriculums" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Curriculums</SelectItem>
                      {KENYAN_CURRICULUMS.map(curriculum => (
                        <SelectItem key={curriculum} value={curriculum}>
                          {curriculum}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gradeLevel">Grade Level</Label>
                  <Select
                    value={selectedGradeLevel}
                    onValueChange={setSelectedGradeLevel}
                  >
                    <SelectTrigger id="gradeLevel">
                      <SelectValue placeholder="All grades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Grades</SelectItem>
                      {GRADE_LEVELS.map(grade => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {hasActiveFilters && (
                  <div className="md:col-span-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear all filters
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Active Filters */}
            {hasActiveFilters && !showFilters && (
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge variant="secondary">
                    Search: {searchQuery}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => setSearchQuery('')}
                    />
                  </Badge>
                )}
                {selectedSubject !== 'all' && (
                  <Badge variant="secondary">
                    Subject: {selectedSubject}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => setSelectedSubject('all')}
                    />
                  </Badge>
                )}
                {selectedCurriculum !== 'all' && (
                  <Badge variant="secondary">
                    Curriculum: {selectedCurriculum}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => setSelectedCurriculum('all')}
                    />
                  </Badge>
                )}
                {selectedGradeLevel !== 'all' && (
                  <Badge variant="secondary">
                    Grade: {selectedGradeLevel}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => setSelectedGradeLevel('all')}
                    />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          {filteredTeachers.length} teacher{filteredTeachers.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Teachers Grid */}
      {filteredTeachers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No teachers found</h3>
            <p className="text-gray-600 text-center mb-4">
              Try adjusting your filters or search terms
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters}>Clear Filters</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <Card key={teacher._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  {/* Teacher Avatar */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                    {teacher.fullName.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <CardTitle className="text-lg">{teacher.fullName}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span className="text-sm text-gray-600">{teacher.city}</span>
                    </div>
                    {teacher.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{teacher.rating}</span>
                        <span className="text-xs text-gray-500">
                          ({teacher.totalReviews})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Bio */}
                <p className="text-sm text-gray-600 line-clamp-2">{teacher.bio}</p>

                {/* Subjects */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Subjects</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {teacher.subjects.slice(0, 3).map(subject => (
                      <Badge key={subject} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                    {teacher.subjects.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{teacher.subjects.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Experience */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <GraduationCap className="h-4 w-4" />
                  <span>{teacher.yearsOfExperience} years experience</span>
                </div>

                {/* Offerings Preview */}
                {teacher.offerings.length > 0 && (
                  <div className="border-t pt-3">
                    <p className="text-xs text-gray-500 mb-2">Starting from:</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">
                        KES {Math.min(...teacher.offerings.map(o => o.price))}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {teacher.offerings.length} offering{teacher.offerings.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button className="w-full" asChild>
                  <Link to={`/teacher/${teacher.userId}`}>View Profile & Book</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
