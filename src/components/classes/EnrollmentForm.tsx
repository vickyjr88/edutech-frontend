import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Check } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { enrollmentService } from "@/integrations/api/services/enrollment.service";
import { useToast } from "@/hooks/use-toast";

const enrollmentSchema = z.object({
  studentName: z.string().min(2, { message: "Student name is required" }),
  parentEmail: z.string().email({ message: "Valid email is required" }),
  parentPhone: z.string().min(10, { message: "Valid phone number is required" }),
  paymentMethod: z.enum(["credit", "mpesa", "bank"], {
    required_error: "Please select a payment method",
  }),
  agreeToTerms: z.boolean().refine(value => value === true, {
    message: "You must agree to the terms and conditions",
  }),
  additionalNotes: z.string().optional(),
});

type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;

interface EnrollmentFormProps {
  classId: string;
  cohortId?: string;
  classTitle: string;
  classPrice: string;
  onSubmitSuccess: () => void;
}

const EnrollmentForm = ({
  classId,
  cohortId,
  classTitle,
  classPrice,
  onSubmitSuccess
}: EnrollmentFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      studentName: user?.fullName || "",
      parentEmail: user?.email || "",
      parentPhone: "",
      paymentMethod: "credit",
      agreeToTerms: false,
      additionalNotes: "",
    },
  });

  // Pre-fill form when user loads
  useEffect(() => {
    if (user) {
      if (user.fullName) form.setValue('studentName', user.fullName);
      if (user.email) form.setValue('parentEmail', user.email);
    }
  }, [user, form]);

  const onSubmit = async (data: EnrollmentFormValues) => {
    if (!cohortId) {
      toast({
        title: "Error",
        description: "No active cohort selected for enrollment.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: enrollment, error } = await enrollmentService.selfEnroll({
        classId,
        cohortId,
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log("Enrollment successful:", enrollment);
      setIsSuccess(true);

      // Reset form after success
      setTimeout(() => {
        form.reset();
        onSubmitSuccess();
      }, 1500);

    } catch (error: any) {
      console.error("Enrollment error:", error);
      toast({
        title: "Enrollment Failed",
        description: error.message || "Could not complete enrollment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-4">
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center text-center py-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Enrollment Successful!</h3>
          <p className="text-gray-600 mb-4">
            Thank you for enrolling in {classTitle}. We have sent a confirmation email to {form.getValues().parentEmail} with all the details.
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Class</span>
                <span className="font-medium">{classTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Price</span>
                <span className="font-medium">{classPrice}</span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="studentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student's Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter student's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent/Guardian Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent/Guardian Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="credit" id="credit" />
                        <FormLabel htmlFor="credit" className="font-normal">Credit/Debit Card</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mpesa" id="mpesa" />
                        <FormLabel htmlFor="mpesa" className="font-normal">M-Pesa</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bank" id="bank" />
                        <FormLabel htmlFor="bank" className="font-normal">Bank Transfer</FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any specific requirements or information we should know"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the terms and conditions and privacy policy
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Complete Enrollment"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default EnrollmentForm;
