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

  // Start editing - use deep clone to avoid reference issues with nested objects
  const handleStartEdit = (index: number) => {
    console.log('[SectionEditor] Starting edit for section', index, sections[index]);
    setEditingIndex(index);
    // Deep clone to ensure nested objects (like callToAction) are properly isolated
    const clonedSection = JSON.parse(JSON.stringify(sections[index]));
    console.log('[SectionEditor] Cloned section:', clonedSection);
    setEditingSection(clonedSection);
  };

  // Close edit panel (changes are now auto-saved)
  const handleCloseEdit = () => {
    console.log('[SectionEditor] Closing edit panel');
    setEditingIndex(null);
    setEditingSection(null);
  };

  // Cancel edit - revert changes
  const handleCancelEdit = () => {
    console.log('[SectionEditor] Cancelling edit - reverting changes');
    setEditingIndex(null);
    setEditingSection(null);
  };

  // Update section field - NOW IMMEDIATELY PROPAGATES TO PARENT
  const updateSectionField = (
    section: Section,
    setter: (s: Section) => void,
    field: string,
    value: any
  ) => {
    console.log('[SectionEditor] Updating field:', field, 'to:', value);
    const updatedSection = { ...section, [field]: value };
    console.log('[SectionEditor] Updated section:', updatedSection);

    // Update local editing state
    setter(updatedSection);

    // IMMEDIATELY propagate to parent sections array
    if (editingIndex !== null) {
      const updatedSections = sections.map((s, idx) =>
        idx === editingIndex ? JSON.parse(JSON.stringify(updatedSection)) : s
      );
      console.log('[SectionEditor] Auto-saving to parent sections:', JSON.stringify(updatedSections[editingIndex], null, 2));
      onChange(updatedSections);
    }
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
                    variant="default"
                    size="sm"
                    onClick={handleCloseEdit}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Done
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Close
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        {isEditing && (
          <CardContent className="space-y-4">
            {/* Render all fields as editable */}
            {Object.entries(currentSection).map(([key, value]) => {
              // Helper function to detect CTA-like objects
              const isCTAField = (fieldKey: string, fieldValue: any): boolean => {
                if (typeof fieldValue !== 'object' || fieldValue === null || Array.isArray(fieldValue)) {
                  return false;
                }
                // Check if key contains CTA or callToAction
                const ctaKeyPatterns = ['cta', 'calltoaction', 'primarycta', 'secondarycta'];
                const keyLower = fieldKey.toLowerCase();
                const matchesKey = ctaKeyPatterns.some(pattern => keyLower.includes(pattern));
                // Also check if object has text + (link OR href)
                const hasTextAndLink = 'text' in fieldValue && ('link' in fieldValue || 'href' in fieldValue);
                return matchesKey || hasTextAndLink;
              };

              // Render CTA editor for CTA-like fields
              const renderCTAEditor = (fieldKey: string, fieldValue: any) => {
                const linkField = 'href' in fieldValue ? 'href' : 'link';
                const labelName = fieldKey
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase())
                  .trim();

                return (
                  <div key={fieldKey} className="border rounded-lg p-4 bg-blue-50">
                    <Label className="text-sm font-semibold mb-3 block">{labelName}</Label>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`${index}-${fieldKey}-text`} className="text-xs text-gray-600">Button Text</Label>
                        <Input
                          id={`${index}-${fieldKey}-text`}
                          value={fieldValue.text || ''}
                          onChange={(e) => {
                            const updated = { ...fieldValue, text: e.target.value };
                            updateSectionField(currentSection, setEditingSection, fieldKey, updated);
                          }}
                          placeholder="e.g., Get Started"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${index}-${fieldKey}-link`} className="text-xs text-gray-600">Link URL</Label>
                        <Input
                          id={`${index}-${fieldKey}-link`}
                          value={fieldValue[linkField] || ''}
                          onChange={(e) => {
                            const updated = { ...fieldValue, [linkField]: e.target.value };
                            updateSectionField(currentSection, setEditingSection, fieldKey, updated);
                          }}
                          placeholder="e.g., /register"
                        />
                      </div>
                      {fieldValue.variant !== undefined && (
                        <div>
                          <Label htmlFor={`${index}-${fieldKey}-variant`} className="text-xs text-gray-600">Variant</Label>
                          <Input
                            id={`${index}-${fieldKey}-variant`}
                            value={fieldValue.variant || ''}
                            onChange={(e) => {
                              const updated = { ...fieldValue, variant: e.target.value };
                              updateSectionField(currentSection, setEditingSection, fieldKey, updated);
                            }}
                            placeholder="e.g., primary, secondary, outline"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              };

              // Special handling for CTA-like objects
              if (isCTAField(key, value)) {
                return renderCTAEditor(key, value);
              }

              // Handle arrays of items (features, benefits, etc.)
              if (Array.isArray(value)) {
                return (
                  <div key={key} className="border rounded-lg p-4 bg-gray-50">
                    <Label className="text-sm font-semibold mb-2 block capitalize">{key} ({value.length} items)</Label>
                    <Textarea
                      id={`${index}-${key}`}
                      value={JSON.stringify(value, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          if (Array.isArray(parsed)) {
                            updateSectionField(currentSection, setEditingSection, key, parsed);
                          }
                        } catch {
                          // Invalid JSON during typing, don't update state
                        }
                      }}
                      className="font-mono text-sm"
                      rows={Math.min(10, Math.max(5, value.length * 2))}
                    />
                    <p className="text-xs text-gray-500 mt-1">Edit as JSON array</p>
                  </div>
                );
              }

              // Handle other objects
              if (typeof value === 'object' && value !== null) {
                return (
                  <div key={key} className="border rounded-lg p-4 bg-gray-50">
                    <Label className="text-sm font-semibold mb-2 block capitalize">{key}</Label>
                    <Textarea
                      id={`${index}-${key}`}
                      value={JSON.stringify(value, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          updateSectionField(currentSection, setEditingSection, key, parsed);
                        } catch {
                          // Invalid JSON during typing, don't update state
                        }
                      }}
                      className="font-mono text-sm"
                      rows={5}
                    />
                    <p className="text-xs text-gray-500 mt-1">Edit as JSON object</p>
                  </div>
                );
              }

              // Handle long strings with textarea
              if (typeof value === 'string' && value.length > 100) {
                return (
                  <div key={key}>
                    <Label htmlFor={`${index}-${key}`} className="capitalize">{key}</Label>
                    <Textarea
                      id={`${index}-${key}`}
                      value={value}
                      onChange={(e) =>
                        updateSectionField(currentSection, setEditingSection, key, e.target.value)
                      }
                      rows={3}
                    />
                  </div>
                );
              }

              // Handle simple strings and other primitives with input
              return (
                <div key={key}>
                  <Label htmlFor={`${index}-${key}`} className="capitalize">{key}</Label>
                  <Input
                    id={`${index}-${key}`}
                    value={value?.toString() || ''}
                    onChange={(e) =>
                      updateSectionField(currentSection, setEditingSection, key, e.target.value)
                    }
                  />
                </div>
              );
            })}
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
