
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Target, Book, Brain, PieChart, BookOpen, TrendingUp, Users } from "lucide-react";
import { format } from "date-fns";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as CalendarPrimitive } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Define schema for the form
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  subject: z.string().min(1, { message: "Please select a subject" }),
  questType: z.enum(["short", "long"], { 
    required_error: "Please select a quest type" 
  }),
  questMode: z.enum(["individual", "group"], {
    required_error: "Please select if this is an individual or group quest"
  }),
  setBy: z.enum(["self", "teacher", "parent", "coach"], { 
    required_error: "Please select who set this quest" 
  }),
  goalTarget: z.string().min(3, { message: "Target must be at least 3 characters" }),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  dueDate: z.date({
    required_error: "Due date is required",
  }).refine(date => date > new Date(), {
    message: "Due date must be in the future",
  }),
  timeAmount: z.string().min(1, { message: "Time amount is required" }),
  timeFrequency: z.enum(["hours", "days", "weeks", "months"], {
    required_error: "Please select a time frequency"
  }),
});

type GoalFormValues = z.infer<typeof formSchema>;

type GoalFormDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit: (values: GoalFormValues) => void;
};

export default function GoalFormDialog({ isOpen, setIsOpen, onSubmit }: GoalFormDialogProps) {
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      subject: "",
      questType: "short",
      questMode: "individual",
      setBy: "self",
      goalTarget: "",
      startDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      timeAmount: "1",
      timeFrequency: "hours",
    },
  });

  function handleSubmit(values: GoalFormValues) {
    onSubmit(values);
    setIsOpen(false);
    form.reset();
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-full sm:max-w-[600px] overflow-y-auto">
        <SheetHeader className="pb-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-4 p-4">
          <SheetTitle className="text-xl flex items-center">
            <Target className="mr-2 h-5 w-5 text-blue-500" />
            Create New Quest
          </SheetTitle>
          <SheetDescription>
            Set up a new learning quest or challenge to track your progress.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 px-1">
            {/* Basic Quest Information Section */}
            <div className="space-y-4 border-b pb-4">
              <h3 className="font-medium text-sm text-muted-foreground">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quest Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Master Algebra Fundamentals" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quest Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your quest and what you want to achieve..."
                        className="resize-none min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Mathematics">
                          <div className="flex items-center">
                            <PieChart className="h-4 w-4 mr-2 text-blue-500" />
                            Mathematics
                          </div>
                        </SelectItem>
                        <SelectItem value="Science">
                          <div className="flex items-center">
                            <Brain className="h-4 w-4 mr-2 text-purple-500" />
                            Science
                          </div>
                        </SelectItem>
                        <SelectItem value="English">
                          <div className="flex items-center">
                            <Book className="h-4 w-4 mr-2 text-green-500" />
                            English
                          </div>
                        </SelectItem>
                        <SelectItem value="Computer Science">
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-orange-500" />
                            Computer Science
                          </div>
                        </SelectItem>
                        <SelectItem value="Other">
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2 text-gray-500" />
                            Other
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="goalTarget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quest Target</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Complete 20 practice problems" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Quest Type and Mode Section */}
            <div className="space-y-4 border-b pb-4">
              <h3 className="font-medium text-sm text-muted-foreground">Quest Type & Mode</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="questType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Quest Duration</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="short" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Challenge (Short-term)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="long" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Quest (Long-term)
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="questMode"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Quest Mode</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="individual" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Individual Quest
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="group" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer flex items-center">
                              <Users className="h-4 w-4 mr-1.5 text-blue-500" />
                              Group Quest
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="setBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quest Creator</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Who created this quest?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="self">Self</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="coach">Coach</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Time and Schedule Section */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground">Time & Schedule</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarPrimitive
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("2023-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarPrimitive
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3">
                <FormLabel className="block">Time Commitment</FormLabel>
                <div className="flex space-x-2">
                  <FormField
                    control={form.control}
                    name="timeAmount"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeFrequency"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hours">Hours</SelectItem>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="weeks">Weeks</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <SheetFooter className="mt-6 pt-4 border-t">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit">Create Quest</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
