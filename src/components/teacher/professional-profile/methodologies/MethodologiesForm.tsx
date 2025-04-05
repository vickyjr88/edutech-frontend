
import { useState, ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MethodologyItem, TEACHING_METHODOLOGIES } from "../utils/methodologyUtils";
import FormCard from "../shared/FormCard";
import ActionButtons from "../shared/ActionButtons";

interface MethodologiesFormProps {
  currentItem: MethodologyItem;
  isEditing: boolean;
  isSaving: boolean;
  onMethodologyChange: (value: string) => void;
  onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onCertifiedChange: (checked: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
}

const MethodologiesForm = ({
  currentItem,
  isEditing,
  isSaving,
  onMethodologyChange,
  onDescriptionChange,
  onCertifiedChange,
  onSave,
  onCancel
}: MethodologiesFormProps) => {
  return (
    <FormCard title={isEditing ? "Edit Teaching Methodology" : "Add Teaching Methodology"}>
      <div>
        <Label htmlFor="methodology">Teaching Methodology</Label>
        <Select 
          value={currentItem.methodology} 
          onValueChange={onMethodologyChange}
        >
          <SelectTrigger id="methodology" className="w-full">
            <SelectValue placeholder="Select a teaching methodology" />
          </SelectTrigger>
          <SelectContent>
            {TEACHING_METHODOLOGIES.map((methodology, index) => (
              <SelectItem key={index} value={methodology}>
                {methodology}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe how you implement this methodology"
          value={currentItem.description || ""}
          onChange={onDescriptionChange}
          className="resize-none"
          rows={4}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_certified"
            checked={currentItem.is_certified}
            onCheckedChange={onCertifiedChange}
          />
          <Label htmlFor="is_certified" className="cursor-pointer">
            I am certified in this teaching methodology
          </Label>
        </div>
      </div>
      
      <ActionButtons
        isEditing={isEditing}
        isSaving={isSaving}
        isValid={!!currentItem.methodology}
        onSave={onSave}
        onCancel={onCancel}
        saveLabel="Update Methodology"
        addLabel="Add Methodology"
      />
    </FormCard>
  );
};

export default MethodologiesForm;
