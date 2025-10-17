import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Save } from "lucide-react";
import { cmsApiService, SocialLink } from "@/services/cms-api.service";
import { useToast } from "@/components/ui/use-toast";

const SOCIAL_PLATFORMS = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
];

const SocialLinksManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [socialLinksId, setSocialLinksId] = useState<string | null>(null);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      const data = await cmsApiService.getSocialLinks("main");
      setSocialLinksId(data._id || null);
      setLinks(data.links.sort((a, b) => a.order - b.order));
    } catch (error: any) {
      // If not found, start with empty
      if (error.response?.status === 404) {
        setLinks([]);
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch social links",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = () => {
    const newOrder = links.length + 1;
    setLinks([
      ...links,
      {
        platform: "facebook" as any,
        url: "",
        order: newOrder,
        active: true,
      },
    ]);
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    // Reorder remaining links
    const reorderedLinks = newLinks.map((link, i) => ({
      ...link,
      order: i + 1,
    }));
    setLinks(reorderedLinks);
  };

  const handleLinkChange = (
    index: number,
    field: keyof SocialLink,
    value: any
  ) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setLinks(newLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const hasInvalidLinks = links.some(
      (link) => !link.platform || !link.url.trim()
    );
    if (hasInvalidLinks) {
      toast({
        title: "Error",
        description: "All links must have a platform and URL",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      if (socialLinksId) {
        // Update existing
        await cmsApiService.updateSocialLinks("main", {
          links,
          description: "Main footer social links",
        });
        toast({
          title: "Success",
          description: "Social links updated successfully",
        });
      } else {
        // Create new
        await cmsApiService.createSocialLinks({
          identifier: "main",
          links,
          description: "Main footer social links",
        });
        toast({
          title: "Success",
          description: "Social links created successfully",
        });
      }

      fetchSocialLinks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save social links",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Social Links</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Social Links</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage footer social media links
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Social Media Links</h2>
            <Button type="button" onClick={handleAddLink} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>

          <div className="space-y-4">
            {links.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No social links yet. Click "Add Link" to get started.
              </p>
            ) : (
              links.map((link, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-3 hover:border-gray-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Link {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveLink(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Platform */}
                    <div>
                      <Label>
                        Platform <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={link.platform}
                        onValueChange={(value) =>
                          handleLinkChange(index, "platform", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {SOCIAL_PLATFORMS.map((platform) => (
                            <SelectItem key={platform.value} value={platform.value}>
                              {platform.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* URL */}
                    <div>
                      <Label>
                        URL <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={link.url}
                        onChange={(e) =>
                          handleLinkChange(index, "url", e.target.value)
                        }
                        placeholder="https://..."
                        type="url"
                        required
                      />
                    </div>
                  </div>

                  {/* Active */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`active-${index}`}
                      checked={link.active}
                      onCheckedChange={(checked) =>
                        handleLinkChange(index, "active", checked)
                      }
                    />
                    <Label
                      htmlFor={`active-${index}`}
                      className="cursor-pointer text-sm"
                    >
                      Active (visible on website)
                    </Label>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <Button type="submit" disabled={saving || links.length === 0}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          About Social Links
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Social links appear in the footer of your website</li>
          <li>• Links are displayed in the order specified</li>
          <li>• Inactive links won't be shown to visitors</li>
          <li>• URLs must be complete (include https://)</li>
        </ul>
      </div>
    </div>
  );
};

export default SocialLinksManager;
