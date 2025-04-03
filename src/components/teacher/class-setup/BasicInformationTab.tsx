
import React from "react";
import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { BookOpen } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ClassFormValues } from "../CreateClassForm";

interface BasicInformationTabProps {
  form: UseFormReturn<ClassFormValues>;
  onNextTab: () => void;
}

const BasicInformationTab = ({ form, onNextTab }: BasicInformationTabProps) => {
  const classType = form.watch("type");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="afterschool">After School</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the type of class you are creating.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <Input placeholder="Enter subject" {...field} />
              <FormDescription>
                Enter the subject of the class.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Class Title</FormLabel>
            <Input placeholder="Enter class title" {...field} />
            <FormDescription>
              Enter a descriptive title for the class.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {classType === "academic" && (
        <FormField
          control={form.control}
          name="gradeLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1st Grade</SelectItem>
                  <SelectItem value="2">2nd Grade</SelectItem>
                  <SelectItem value="3">3rd Grade</SelectItem>
                  <SelectItem value="4">4th Grade</SelectItem>
                  <SelectItem value="5">5th Grade</SelectItem>
                  <SelectItem value="6">6th Grade</SelectItem>
                  <SelectItem value="7">7th Grade</SelectItem>
                  <SelectItem value="8">8th Grade</SelectItem>
                  <SelectItem value="9">9th Grade</SelectItem>
                  <SelectItem value="10">10th Grade</SelectItem>
                  <SelectItem value="11">11th Grade</SelectItem>
                  <SelectItem value="12">12th Grade</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the grade level for this class.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="summary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Class Summary</FormLabel>
            <Textarea
              placeholder="Write a brief summary of the class"
              className="resize-none"
              {...field}
            />
            <FormDescription>
              Write a brief summary of the class.
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
            <FormLabel>Detailed Description</FormLabel>
            <Textarea
              placeholder="Write a detailed description of the class"
              className="resize-none"
              {...field}
            />
            <FormDescription>
              Write a detailed description of the class.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Public Class</FormLabel>
                <FormDescription>
                  Make this class visible to all students.
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

        <FormField
          control={form.control}
          name="hasCohorts"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Multiple Cohorts</FormLabel>
                <FormDescription>
                  Enable multiple cohorts for this class.
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

        <FormField
          control={form.control}
          name="hasTeamTeaching"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Team Teaching</FormLabel>
                <FormDescription>
                  Enable team teaching for this class.
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
      </div>
      
      <div className="flex justify-between pt-4">
        <div></div>
        <Button type="button" variant="outline" onClick={onNextTab}>
          Next: Lesson Plans
        </Button>
      </div>
    </div>
  );
};

export default BasicInformationTab;
