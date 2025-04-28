
import { useState, ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { StrategyItem, TEACHING_STRATEGIES } from "../utils/strategyUtils";
import FormCard from "../shared/FormCard";
import ActionButtons from "../shared/ActionButtons";

interface StrategiesFormProps {
  currentItem: StrategyItem;
  isEditing: boolean;
  isSaving: boolean;
  onStrategyChange: (value: string) => void;
  onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onCertifiedChange: (checked: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
}

const StrategiesForm = ({
  currentItem,
  isEditing,
  isSaving,
  onStrategyChange,
  onDescriptionChange,
  onCertifiedChange,
  onSave,
  onCancel
}: StrategiesFormProps) => {
  return (
    <FormCard title={isEditing ? "Edit Teaching Strategy" : "Add Teaching Strategy"}>
      <div>
        <Label htmlFor="strategy">Teaching Strategy</Label>
        <Select 
          value={currentItem.strategy} 
          onValueChange={onStrategyChange}
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
          onChange={onDescriptionChange}
          className="resize-none"
          rows={4}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="isCertified" 
          checked={currentItem.isCertified}
          onCheckedChange={onCertifiedChange}
        />
        <Label htmlFor="isCertified" className="cursor-pointer">
          I am certified in this teaching strategy
        </Label>
      </div>
      
      <ActionButtons
        isEditing={isEditing}
        isSaving={isSaving}
        isValid={!!currentItem.strategy}
        onSave={onSave}
        onCancel={onCancel}
        saveLabel="Update Strategy"
        addLabel="Add Strategy"
      />
    </FormCard>
  );
};

export default StrategiesForm;
