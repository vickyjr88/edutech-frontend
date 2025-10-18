import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";
import { cmsApiService, MenuItem } from "@/services/cms-api.service";
import { useToast } from "@/components/ui/use-toast";

const MenuEditor = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!identifier;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    title: "",
    description: "",
    order: 1,
    active: true,
    items: [] as MenuItem[],
  });

  useEffect(() => {
    if (isEdit) {
      fetchMenu();
    }
  }, [identifier]);

  const fetchMenu = async () => {
    if (!identifier) return;

    try {
      setLoading(true);
      const menu = await cmsApiService.getMenu(identifier);
      setFormData({
        identifier: menu.identifier,
        title: menu.title,
        description: menu.description || "",
        order: menu.order,
        active: menu.active,
        items: menu.items.sort((a, b) => a.order - b.order),
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch menu",
        variant: "destructive",
      });
      navigate("/admin/menus");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    const newOrder = formData.items.length + 1;
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { label: "", href: "", order: newOrder, external: false },
      ],
    });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    // Reorder remaining items
    const reorderedItems = newItems.map((item, i) => ({
      ...item,
      order: i + 1,
    }));
    setFormData({ ...formData, items: reorderedItems });
  };

  const handleItemChange = (
    index: number,
    field: keyof MenuItem,
    value: any
  ) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.identifier.trim()) {
      toast({
        title: "Error",
        description: "Identifier is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    if (formData.items.length === 0) {
      toast({
        title: "Error",
        description: "At least one menu item is required",
        variant: "destructive",
      });
      return;
    }

    // Check all items have label and href
    const hasInvalidItems = formData.items.some(
      (item) => !item.label.trim() || !item.href.trim()
    );
    if (hasInvalidItems) {
      toast({
        title: "Error",
        description: "All menu items must have a label and href",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      if (isEdit) {
        await cmsApiService.updateMenu(identifier!, {
          title: formData.title,
          description: formData.description || undefined,
          order: formData.order,
          active: formData.active,
          items: formData.items,
        });
        toast({
          title: "Success",
          description: "Menu updated successfully",
        });
      } else {
        await cmsApiService.createMenu({
          identifier: formData.identifier,
          title: formData.title,
          description: formData.description || undefined,
          order: formData.order,
          active: formData.active,
          items: formData.items,
        });
        toast({
          title: "Success",
          description: "Menu created successfully",
        });
      }

      navigate("/admin/menus");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save menu",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" disabled>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/menus")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Edit Menu" : "Create Menu"}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Menu Details</h2>

          <div className="grid gap-4">
            {/* Identifier */}
            <div>
              <Label htmlFor="identifier">
                Identifier <span className="text-red-500">*</span>
              </Label>
              <Input
                id="identifier"
                value={formData.identifier}
                onChange={(e) =>
                  setFormData({ ...formData, identifier: e.target.value })
                }
                placeholder="e.g., footer-platform"
                disabled={isEdit}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Unique identifier for this menu (cannot be changed after creation)
              </p>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Platform"
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Optional description for this menu"
                rows={2}
              />
            </div>

            {/* Order */}
            <div>
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Lower numbers appear first
              </p>
            </div>

            {/* Active */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked as boolean })
                }
              />
              <Label htmlFor="active" className="cursor-pointer">
                Active (visible on website)
              </Label>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Menu Items</h2>
            <Button type="button" onClick={handleAddItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {formData.items.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No menu items yet. Click "Add Item" to get started.
              </p>
            ) : (
              formData.items.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-3 hover:border-gray-300"
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Item {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                      className="ml-auto"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>
                        Label <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={item.label}
                        onChange={(e) =>
                          handleItemChange(index, "label", e.target.value)
                        }
                        placeholder="e.g., Courses"
                        required
                      />
                    </div>

                    <div>
                      <Label>
                        Link (href) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={item.href}
                        onChange={(e) =>
                          handleItemChange(index, "href", e.target.value)
                        }
                        placeholder="e.g., /courses"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`external-${index}`}
                      checked={item.external || false}
                      onCheckedChange={(checked) =>
                        handleItemChange(index, "external", checked)
                      }
                    />
                    <Label
                      htmlFor={`external-${index}`}
                      className="cursor-pointer text-sm"
                    >
                      External link (opens in new tab)
                    </Label>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/menus")}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Update Menu" : "Create Menu"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MenuEditor;
