
import { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2, CheckCircle2, XCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TEACHING_METHODOLOGIES,
  MethodologyItem,
  fetchMethodologyRecords,
  saveMethodologyRecord,
  updateMethodologyRecord,
  deleteMethodologyRecord
} from "./utils/methodologyUtils";

type MethodologiesStepProps = {
  methodologies: MethodologyItem[];
  setMethodologies: React.Dispatch<React.SetStateAction<MethodologyItem[]>>;
};

const MethodologiesStep = ({ methodologies, setMethodologies }: MethodologiesStepProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentItem, setCurrentItem] = useState<MethodologyItem>({
    id: "",
    methodology: "",
    description: "",
    is_certified: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMethodologies();
    }
  }, [user]);

  const fetchMethodologies = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await fetchMethodologyRecords(user.id);
      if (data.length > 0) {
        setMethodologies(data);
      }
    } catch (error) {
      console.error("Error fetching methodologies:", error);
      toast({
        title: "Error",
        description: "Failed to load teaching methodologies",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMethodologyChange = (value: string) => {
    setCurrentItem(prev => ({ ...prev, methodology: value }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentItem(prev => ({ ...prev, description: e.target.value }));
  };

  const handleCertifiedChange = (checked: boolean) => {
    setCurrentItem(prev => ({ ...prev, is_certified: checked }));
  };

  const handleAddOrUpdateMethodology = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save methodologies",
        variant: "destructive"
      });
      return;
    }

    if (!currentItem.methodology) {
      toast({
        title: "Error",
        description: "Please select a teaching methodology",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing) {
        // Update existing methodology
        const success = await updateMethodologyRecord(currentItem);
        if (success) {
          setMethodologies(prev => 
            prev.map(m => 
              m.id === currentItem.id ? currentItem : m
            )
          );
          toast({
            title: "Success",
            description: "Teaching methodology updated successfully",
          });
        } else {
          throw new Error("Failed to update methodology");
        }
      } else {
        // Add new methodology
        const newMethodology = await saveMethodologyRecord(user.id, currentItem);
        if (newMethodology) {
          setMethodologies(prev => [newMethodology, ...prev]);
          toast({
            title: "Success",
            description: "New teaching methodology added successfully",
          });
        } else {
          throw new Error("Failed to save methodology");
        }
      }
      
      // Reset form
      setCurrentItem({
        id: "",
        methodology: "",
        description: "",
        is_certified: false
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving methodology:", error);
      toast({
        title: "Error",
        description: "Failed to save teaching methodology",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: MethodologyItem) => {
    setCurrentItem(item);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teaching methodology?")) {
      return;
    }

    try {
      const success = await deleteMethodologyRecord(id);
      if (success) {
        setMethodologies(prev => prev.filter(m => m.id !== id));
        toast({
          title: "Success",
          description: "Teaching methodology deleted successfully",
        });
      } else {
        throw new Error("Failed to delete methodology");
      }
    } catch (error) {
      console.error("Error deleting methodology:", error);
      toast({
        title: "Error",
        description: "Failed to delete teaching methodology",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setCurrentItem({
      id: "",
      methodology: "",
      description: "",
      is_certified: false
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Methodologies Table */}
      {methodologies.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Your Teaching Methodologies</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Methodology</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Certified</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {methodologies.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.methodology}</TableCell>
                    <TableCell>{item.description || "N/A"}</TableCell>
                    <TableCell>
                      {item.is_certified ? 
                        <CheckCircle2 className="h-5 w-5 text-green-600" /> : 
                        <XCircle className="h-5 w-5 text-gray-400" />
                      }
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Methodology Form */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">
            {isEditing ? "Edit Teaching Methodology" : "Add Teaching Methodology"}
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="methodology">Teaching Methodology</Label>
              <Select 
                value={currentItem.methodology} 
                onValueChange={handleMethodologyChange}
              >
                <SelectTrigger id="methodology" className="w-full">
                  <SelectValue placeholder="Select a teaching methodology" />
                </SelectTrigger>
                <SelectContent>
                  {TEACHING_METHODOLOGIES.map((methodology, index) => (
                    <SelectItem key={index} value={methodology}>
                      {methodology}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe how you implement this methodology"
                value={currentItem.description || ""}
                onChange={handleDescriptionChange}
                className="resize-none"
                rows={4}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_certified"
                  checked={currentItem.is_certified}
                  onCheckedChange={handleCertifiedChange}
                />
                <Label htmlFor="is_certified" className="cursor-pointer">
                  I am certified in this teaching methodology
                </Label>
              </div>
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button
                type="button"
                onClick={handleAddOrUpdateMethodology}
                disabled={isSaving || !currentItem.methodology}
                className="flex items-center"
              >
                {isEditing ? "Update Methodology" : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Methodology
                  </>
                )}
              </Button>
              
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MethodologiesStep;
