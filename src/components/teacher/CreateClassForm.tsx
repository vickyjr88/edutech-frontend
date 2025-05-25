
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ClassFormProvider } from "./class-setup/ClassFormContext";
import { ClassFormValues } from "./class-setup/types"; // Import from types
import FormTabs from "./class-setup/FormTabs";

type CreateClassFormProps = {
  onSubmit: (data: ClassFormValues) => void;
  onCancel: () => void;
};

const CreateClassForm = ({ onSubmit, onCancel }: CreateClassFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitForm = (values: ClassFormValues) => {
    // Validate minimum lesson plans
    setIsSubmitting(true);

  };

  return (
    <div className="w-full max-w-4xl mx-auto border rounded-lg shadow-sm bg-card text-card-foreground">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Create a New Class</h3>
        <p className="text-sm text-muted-foreground">
          Set up your class details, schedule, and teaching team
        </p>
      </div>
      <div className="p-6 pt-0">
        <ClassFormProvider onSubmit={handleSubmitForm}>
          <FormTabs onSubmit={handleSubmitForm} />
        </ClassFormProvider>
      </div>
    </div>
  );
};

export default CreateClassForm;
