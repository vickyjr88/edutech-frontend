
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit, Trash2, Check, X } from "lucide-react";
import { LanguageItem, ALL_LANGUAGES, AFRICAN_LANGUAGES, INTERNATIONAL_LANGUAGES, saveLanguage, updateLanguage, deleteLanguage, fetchLanguages } from "./utils/languageUtils";

const languageSchema = z.object({
  language: z.string().min(1, "Please select a language"),
  description: z.string().optional(),
  isCertified: z.boolean().default(false)
});

type LanguageFormValues = z.infer<typeof languageSchema>;

interface LanguagesStepProps {
  languages: LanguageItem[];
  setLanguages: React.Dispatch<React.SetStateAction<LanguageItem[]>>;
}

const LanguagesStep = ({ languages, setLanguages }: LanguagesStepProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadLanguages();
    }
  }, [user]);

  const loadLanguages = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const languageItems = await fetchLanguages(user.id);
      setLanguages(languageItems);
    } catch (error) {
      console.error("Error loading languages:", error);
      toast({
        title: "Error",
        description: "Failed to load your languages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<LanguageFormValues>({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      language: "",
      description: "",
      isCertified: false
    }
  });

  const onSubmit = async (values: LanguageFormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add languages",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      if (editingId) {
        // Update existing language
        const updatedLanguage: LanguageItem = {
          id: editingId,
          ...values
        };

        const { success, error } = await updateLanguage(updatedLanguage);

        if (success) {
          setLanguages(prev => prev.map(item => 
            item.id === editingId ? updatedLanguage : item
          ));
          
          toast({
            title: "Language updated",
            description: `${values.language} has been updated successfully.`
          });
          
          resetForm();
        } else {
          throw new Error(error || "Failed to update language");
        }
      } else {
        // Add new language
        const newLanguage: LanguageItem = {
          id: "", // Will be set by the database
          ...values
        };

        const { success, id, error } = await saveLanguage(user.id, newLanguage);

        if (success && id) {
          newLanguage.id = id;
          setLanguages(prev => [...prev, newLanguage]);
          
          toast({
            title: "Language added",
            description: `${values.language} has been added successfully.`
          });
          
          resetForm();
        } else {
          throw new Error(error || "Failed to add language");
        }
      }
    } catch (error: any) {
      console.error("Error saving language:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while saving the language",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (language: LanguageItem) => {
    setEditingId(language.id);
    form.reset({
      language: language.language,
      description: language.description || "",
      isCertified: language.isCertified
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this language?")) {
      return;
    }

    setIsLoading(true);
    try {
      const { success, error } = await deleteLanguage(id);

      if (success) {
        setLanguages(prev => prev.filter(item => item.id !== id));
        toast({
          title: "Language deleted",
          description: "The language has been removed successfully."
        });
      } else {
        throw new Error(error || "Failed to delete language");
      }
    } catch (error: any) {
      console.error("Error deleting language:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while deleting the language",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset({
      language: "",
      description: "",
      isCertified: false
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      {languages.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableCaption>List of languages you can teach in</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Language</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Certified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {languages.map((language) => (
                <TableRow key={language.id}>
                  <TableCell className="font-medium">{language.language}</TableCell>
                  <TableCell className="max-w-xs truncate">{language.description || "—"}</TableCell>
                  <TableCell>{language.isCertified ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-gray-400" />}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(language)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(language.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <div className="max-h-[200px] overflow-y-auto">
                      {AFRICAN_LANGUAGES.length > 0 && (
                        <>
                          <p className="px-2 py-1.5 text-sm font-semibold">African Languages</p>
                          {AFRICAN_LANGUAGES.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </>
                      )}
                      {INTERNATIONAL_LANGUAGES.length > 0 && (
                        <>
                          <p className="px-2 py-1.5 text-sm font-semibold">International Languages</p>
                          {INTERNATIONAL_LANGUAGES.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </div>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select a language you can speak and teach in
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Why do you love this language? What's your proficiency level?"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Share any additional details about your experience with this language
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isCertified"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Certified
                  </FormLabel>
                  <FormDescription>
                    Do you have a certification for this language?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : editingId ? 'Update Language' : 'Add Language'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LanguagesStep;
