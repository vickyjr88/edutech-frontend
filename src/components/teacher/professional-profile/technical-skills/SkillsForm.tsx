
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { TechnicalSkillItem, TECHNICAL_SKILLS } from "../utils/technicalSkillUtils";
import FormCard from "../shared/FormCard";

interface SkillsFormProps {
  form: ReturnType<typeof useForm<TechnicalSkillItem>>;
  isEditing: boolean;
  isLoading: boolean;
  availableSkills: string[];
  onSubmit: (data: TechnicalSkillItem) => void;
  onCancel: () => void;
}

const SkillsForm = ({
  form,
  isEditing,
  isLoading,
  availableSkills,
  onSubmit,
  onCancel
}: SkillsFormProps) => {
  return (
    <div className="border rounded-md p-4">
      <h3 className="text-lg font-medium mb-4">
        {isEditing ? "Edit Technical Skill" : "Add Technical Skill"}
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technical Skill</FormLabel>
                {isEditing ? (
                  <div className="p-2 border rounded-md">{field.value}</div>
                ) : (
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a technical skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSkills.map(skill => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Why you enjoy using this skill)</FormLabel>
                <Textarea
                  placeholder="Describe how you use this skill in your teaching..."
                  disabled={isLoading}
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isCertified"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Certified</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Do you have a certification for this skill?
                  </div>
                </div>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex space-x-2">
            <Button type="submit" disabled={isLoading}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {isEditing ? "Update Skill" : "Add Skill"}
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SkillsForm;
