
import React from "react";
import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { BookOpen, List } from "lucide-react";
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Title</FormLabel>
              <Input placeholder="Enter a catchy class title" {...field} />
              <FormDescription>
                Enter a descriptive title for the class.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        <FormField
          control={form.control}
          name="curriculum"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Curriculum</FormLabel>
              <Input placeholder="Enter curriculum" {...field} />
              <FormDescription>
                Enter the curriculum used in the class.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {classType === "academic" ? (
          <FormField
            control={form.control}
            name="gradeLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
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
        ) : (
          <FormField
            control={form.control}
            name="ageRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age Range</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="6-8">6-8 years</SelectItem>
                    <SelectItem value="9-11">9-11 years</SelectItem>
                    <SelectItem value="12-14">12-14 years</SelectItem>
                    <SelectItem value="15-18">15-18 years</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the age range for this after-school class.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

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
              Write a brief summary of the class (max 200 characters).
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
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <List className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-medium">Technical Requirements</h3>
        </div>
        <FormField
          control={form.control}
          name="technicalRequirements"
          render={({ field }) => (
            <FormItem>
              <Textarea
                placeholder="Enter each technical requirement on a new line (internet, devices, etc.)"
                className="resize-none"
                {...field}
              />
              <FormDescription>
                List any technical requirements students will need, one per line.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <List className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-medium">Materials Required</h3>
        </div>
        <FormField
          control={form.control}
          name="materialsRequired"
          render={({ field }) => (
            <FormItem>
              <Textarea
                placeholder="Enter each required material on a new line"
                className="resize-none"
                {...field}
              />
              <FormDescription>
                List any materials students will need for the class, one per line.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="commitmentRequired"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Commitment Required</FormLabel>
            <Textarea
              placeholder="Specify the commitment required (days/weeks/months)"
              className="resize-none"
              {...field}
            />
            <FormDescription>
              Specify the time commitment required for this class.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="numberOfLessons"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Lessons</FormLabel>
            <Input 
              type="number" 
              min="1" 
              placeholder="Enter the number of lessons" 
              {...field}
              onChange={(e) => {
                // Convert string to number before updating the form value
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  field.onChange(value);
                } else {
                  field.onChange(1); // Default to 1 if input is invalid
                }
              }}
            />
            <FormDescription>
              Set the total number of lessons for this class.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4 border rounded-lg p-4">
        <h3 className="text-lg font-medium">Class Settings</h3>
        
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Public Class</FormLabel>
                <FormDescription>
                  Make this class visible to all students in the catalog. If disabled, the class will only be visible to invited students.
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
                  Enable multiple cohorts to run different sessions of this class with different schedules and groups of students.
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
                  Enable team teaching to collaborate with other teachers on this class. You'll be able to invite co-teachers in the Teaching Team tab.
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
