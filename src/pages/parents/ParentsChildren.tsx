import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { UserPlus, User, Calendar, BookOpen, Mail, Edit, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { parentService } from "@/integrations/api/services/parent.service";
import { MvpParentService } from "@/integrations/api/services/mvp-parent.service";

const ParentsChildren = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [children, setChildren] = useState<any[]>([]);
  const [parentProfileId, setParentProfileId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [newChild, setNewChild] = useState({
    fullName: "",
    dateOfBirth: "",
    grade: "",
    school: "",
    email: "",
  });

  useEffect(() => {
    const fetchChildren = async () => {
      if (!user?.id) return;

      try {
        setIsFetching(true);
        // Using MvpParentService for simplified data
        const childrenData = await MvpParentService.getChildren();
        setChildren(childrenData || []);

        // Still fetch profile for profile ID (needed for delete/add actions)
        const profileResponse = await parentService.getProfile();
        if (profileResponse.data) {
          setParentProfileId(profileResponse.data._id);
        }
      } catch (error) {
        console.error("Failed to fetch children", error);
        toast({
          title: "Error",
          description: "Failed to load children. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchChildren();
  }, [user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewChild({
      ...newChild,
      [e.target.name]: e.target.value,
    });
  };

  const handleGradeChange = (value: string) => {
    setNewChild({
      ...newChild,
      grade: value,
    });
  };

  const handleAddChild = async () => {
    if (!newChild.fullName || !newChild.dateOfBirth || !newChild.grade) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await parentService.createChild({
        fullName: newChild.fullName,
        dateOfBirth: newChild.dateOfBirth,
        grade: newChild.grade,
        school: newChild.school,
        email: newChild.email || undefined,
      });

      if (response.data) {
        // Refresh children list
        const childrenData = await MvpParentService.getChildren();
        setChildren(childrenData || []);

        toast({
          title: "Child added",
          description: `${newChild.fullName} has been added successfully.`,
        });

        // Reset form
        setNewChild({
          fullName: "",
          dateOfBirth: "",
          grade: "",
          school: "",
          email: "",
        });
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to add child", error);
      toast({
        title: "Error",
        description: "Failed to add child. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChild = async (childId: string) => {
    if (!parentProfileId) return;

    try {
      await parentService.removeChild(parentProfileId, childId);

      // Refresh children list
      const childrenData = await MvpParentService.getChildren();
      setChildren(childrenData || []);

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

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const grades = [
    "Pre-K",
    "Kindergarten",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
  ];

  return (
    <PageWrapper>
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Children</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage your children's profiles and learning journeys
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-kidato-purple hover:bg-kidato-dark-blue">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Child
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add a New Child</DialogTitle>
                  <DialogDescription>
                    Enter your child's information to add them to your account.
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
                      value={newChild.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter child's full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={newChild.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade">
                      Grade <span className="text-red-500">*</span>
                    </Label>
                    <Select value={newChild.grade} onValueChange={handleGradeChange}>
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
                    <Label htmlFor="school">School Name</Label>
                    <Input
                      id="school"
                      name="school"
                      value={newChild.school}
                      onChange={handleInputChange}
                      placeholder="Enter school name (optional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newChild.email}
                      onChange={handleInputChange}
                      placeholder="Enter email for older children (optional)"
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
                  <Button onClick={handleAddChild} disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Child"}
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
                  onClick={() => setIsDialogOpen(true)}
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
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
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
                    {child.email && !child.email.includes('@kidato.internal') && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {child.email}
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
      </div>
    </PageWrapper>
  );
};

export default ParentsChildren;
