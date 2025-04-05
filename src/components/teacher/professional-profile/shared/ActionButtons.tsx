
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface ActionButtonsProps {
  isEditing: boolean;
  isSaving: boolean;
  isValid: boolean;
  onSave: () => void;
  onCancel: () => void;
  saveLabel?: string;
  addLabel?: string;
}

const ActionButtons = ({
  isEditing,
  isSaving,
  isValid,
  onSave,
  onCancel,
  saveLabel = "Update",
  addLabel = "Add"
}: ActionButtonsProps) => {
  return (
    <div className="flex space-x-2 pt-2">
      <Button
        type="button"
        onClick={onSave}
        disabled={isSaving || !isValid}
        className="flex items-center"
      >
        {isEditing ? saveLabel : (
          <>
            <PlusCircle className="mr-2 h-4 w-4" />
            {addLabel}
          </>
        )}
      </Button>
      
      {isEditing && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
