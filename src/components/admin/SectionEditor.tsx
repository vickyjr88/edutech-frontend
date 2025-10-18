import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Edit,
  ChevronUp,
  ChevronDown,
  Save,
  X,
} from "lucide-react";

interface Section {
  type: string;
  [key: string]: any;
}

interface SectionEditorProps {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}

/**
 * Visual Section Editor Component
 * Allows managing sections as a list instead of raw JSON
 */
const SectionEditor = ({ sections, onChange }: SectionEditorProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSection, setNewSection] = useState<Section>({ type: "hero" });

  // Add new section
  const handleAddSection = () => {
    const updatedSections = [...sections, newSection];
    onChange(updatedSections);
    setNewSection({ type: "hero" });
    setShowAddForm(false);
  };

  // Delete section
  const handleDeleteSection = (index: number) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    const updatedSections = sections.filter((_, i) => i !== index);
    onChange(updatedSections);
  };

  // Move section up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updatedSections = [...sections];
    [updatedSections[index - 1], updatedSections[index]] = [
      updatedSections[index],
      updatedSections[index - 1],
    ];
    onChange(updatedSections);
  };

  // Move section down
  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const updatedSections = [...sections];
    [updatedSections[index], updatedSections[index + 1]] = [
      updatedSections[index + 1],
      updatedSections[index],
    ];
    onChange(updatedSections);
  };

  // Start editing
  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditingSection({ ...sections[index] });
  };

  // Save edit
  const handleSaveEdit = () => {
    if (editingIndex !== null && editingSection) {
      const updatedSections = [...sections];
      updatedSections[editingIndex] = editingSection;
      onChange(updatedSections);
      setEditingIndex(null);
      setEditingSection(null);
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingSection(null);
  };

  // Update section field
  const updateSectionField = (
    section: Section,
    setter: (s: Section) => void,
    field: string,
    value: any
  ) => {
    setter({ ...section, [field]: value });
  };

  // Render section preview
  const renderSectionPreview = (section: Section, index: number) => {
    const isEditing = editingIndex === index;
    const currentSection = isEditing ? editingSection! : section;

    return (
      <Card key={index} className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="outline">Section {index + 1}</Badge>
              <Badge>{currentSection.type}</Badge>
              {currentSection.title && (
                <span className="text-sm text-gray-600 font-medium">
                  {currentSection.title}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === sections.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStartEdit(index)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSection(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveEdit}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        {isEditing && (
          <CardContent className="space-y-3">
            {/* Render all fields as editable */}
            {Object.entries(currentSection).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={`${index}-${key}`} className="capitalize">
                  {key}
                </Label>
                {typeof value === "string" && value.length > 100 ? (
                  <Textarea
                    id={`${index}-${key}`}
                    value={value}
                    onChange={(e) =>
                      updateSectionField(
                        currentSection,
                        setEditingSection,
                        key,
                        e.target.value
                      )
                    }
                    rows={3}
                  />
                ) : typeof value === "object" ? (
                  <Textarea
                    id={`${index}-${key}`}
                    value={JSON.stringify(value, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        updateSectionField(
                          currentSection,
                          setEditingSection,
                          key,
                          parsed
                        );
                      } catch {
                        // Invalid JSON, don't update
                      }
                    }}
                    className="font-mono text-sm"
                    rows={5}
                  />
                ) : (
                  <Input
                    id={`${index}-${key}`}
                    value={value?.toString() || ""}
                    onChange={(e) =>
                      updateSectionField(
                        currentSection,
                        setEditingSection,
                        key,
                        e.target.value
                      )
                    }
                  />
                )}
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Page Sections</h3>
          <p className="text-sm text-gray-500">
            {sections.length} section{sections.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      {/* Add Section Form */}
      {showAddForm && (
        <Card className="border-2 border-blue-300">
          <CardHeader>
            <CardTitle>Add New Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="new-type">Section Type *</Label>
              <Input
                id="new-type"
                value={newSection.type}
                onChange={(e) =>
                  setNewSection({ ...newSection, type: e.target.value })
                }
                placeholder="e.g., hero, features, cta"
              />
              <p className="text-xs text-gray-500 mt-1">
                Common types: hero, features, howItWorks, testimonials, cta,
                contentCards
              </p>
            </div>

            <div>
              <Label htmlFor="new-title">Title</Label>
              <Input
                id="new-title"
                value={newSection.title || ""}
                onChange={(e) =>
                  setNewSection({ ...newSection, title: e.target.value })
                }
                placeholder="Section title"
              />
            </div>

            <div>
              <Label htmlFor="new-description">Description</Label>
              <Textarea
                id="new-description"
                value={newSection.description || ""}
                onChange={(e) =>
                  setNewSection({ ...newSection, description: e.target.value })
                }
                placeholder="Section description"
                rows={3}
              />
            </div>

            <div>
              <Label>Additional Fields (JSON)</Label>
              <Textarea
                value={JSON.stringify(
                  Object.fromEntries(
                    Object.entries(newSection).filter(
                      ([key]) =>
                        key !== "type" &&
                        key !== "title" &&
                        key !== "description"
                    )
                  ),
                  null,
                  2
                )}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setNewSection({
                      type: newSection.type,
                      title: newSection.title,
                      description: newSection.description,
                      ...parsed,
                    });
                  } catch {
                    // Invalid JSON, don't update
                  }
                }}
                className="font-mono text-sm"
                rows={5}
                placeholder='{"subtitle": "...", "features": [...]}'
              />
              <p className="text-xs text-gray-500 mt-1">
                Add any additional fields as JSON
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddSection}>
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setNewSection({ type: "hero" });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sections List */}
      {sections.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">
            No sections yet. Click "Add Section" to create one.
          </p>
        </div>
      ) : (
        <div>{sections.map((section, index) => renderSectionPreview(section, index))}</div>
      )}
    </div>
  );
};

export default SectionEditor;
