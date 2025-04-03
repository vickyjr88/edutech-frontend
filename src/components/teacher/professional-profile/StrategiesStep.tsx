
import { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  TEACHING_STRATEGIES,
  StrategyItem,
  fetchStrategyRecords,
  saveStrategyRecord,
  updateStrategyRecord,
  deleteStrategyRecord
} from "./utils/strategyUtils";

type StrategiesStepProps = {
  strategies: StrategyItem[];
  setStrategies: React.Dispatch<React.SetStateAction<StrategyItem[]>>;
};

const StrategiesStep = ({ strategies, setStrategies }: StrategiesStepProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentItem, setCurrentItem] = useState<StrategyItem>({
    id: "",
    strategy: "",
    description: "",
    is_certified: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchStrategies();
    }
  }, [user]);

  const fetchStrategies = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await fetchStrategyRecords(user.id);
      if (data.length > 0) {
        setStrategies(data);
      }
    } catch (error) {
      console.error("Error fetching strategies:", error);
      toast({
        title: "Error",
        description: "Failed to load teaching strategies",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStrategyChange = (value: string) => {
    setCurrentItem(prev => ({ ...prev, strategy: value }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentItem(prev => ({ ...prev, description: e.target.value }));
  };

  const handleCertifiedChange = (checked: boolean) => {
    setCurrentItem(prev => ({ ...prev, is_certified: checked }));
  };

  const handleAddOrUpdateStrategy = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save strategies",
        variant: "destructive"
      });
      return;
    }

    if (!currentItem.strategy) {
      toast({
        title: "Error",
        description: "Please select a teaching strategy",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing) {
        // Update existing strategy
        const success = await updateStrategyRecord(currentItem);
        if (success) {
          setStrategies(prev => 
            prev.map(s => 
              s.id === currentItem.id ? currentItem : s
            )
          );
          toast({
            title: "Success",
            description: "Teaching strategy updated successfully",
          });
        } else {
          throw new Error("Failed to update strategy");
        }
      } else {
        // Add new strategy
        const newStrategy = await saveStrategyRecord(user.id, currentItem);
        if (newStrategy) {
          setStrategies(prev => [newStrategy, ...prev]);
          toast({
            title: "Success",
            description: "New teaching strategy added successfully",
          });
        } else {
          throw new Error("Failed to save strategy");
        }
      }
      
      // Reset form
      setCurrentItem({
        id: "",
        strategy: "",
        description: "",
        is_certified: false
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving strategy:", error);
      toast({
        title: "Error",
        description: "Failed to save teaching strategy",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: StrategyItem) => {
    setCurrentItem(item);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teaching strategy?")) {
      return;
    }

    try {
      const success = await deleteStrategyRecord(id);
      if (success) {
        setStrategies(prev => prev.filter(s => s.id !== id));
        toast({
          title: "Success",
          description: "Teaching strategy deleted successfully",
        });
      } else {
        throw new Error("Failed to delete strategy");
      }
    } catch (error) {
      console.error("Error deleting strategy:", error);
      toast({
        title: "Error",
        description: "Failed to delete teaching strategy",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setCurrentItem({
      id: "",
      strategy: "",
      description: "",
      is_certified: false
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Strategies Table */}
      {strategies.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Your Teaching Strategies</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Strategy</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Certified</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {strategies.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.strategy}</TableCell>
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

      {/* Add/Edit Strategy Form */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">
            {isEditing ? "Edit Teaching Strategy" : "Add Teaching Strategy"}
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="strategy">Teaching Strategy</Label>
              <Select 
                value={currentItem.strategy} 
                onValueChange={handleStrategyChange}
              >
                <SelectTrigger id="strategy" className="w-full">
                  <SelectValue placeholder="Select a teaching strategy" />
                </SelectTrigger>
                <SelectContent>
                  {TEACHING_STRATEGIES.map((strategy, index) => (
                    <SelectItem key={index} value={strategy}>
                      {strategy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe how you implement this strategy"
                value={currentItem.description || ""}
                onChange={handleDescriptionChange}
                className="resize-none"
                rows={4}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="is_certified" 
                checked={currentItem.is_certified}
                onCheckedChange={handleCertifiedChange}
              />
              <Label htmlFor="is_certified" className="cursor-pointer">
                I am certified in this teaching strategy
              </Label>
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button
                type="button"
                onClick={handleAddOrUpdateStrategy}
                disabled={isSaving || !currentItem.strategy}
                className="flex items-center"
              >
                {isEditing ? "Update Strategy" : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Strategy
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

export default StrategiesStep;
