import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cmsApiService, PageContent } from "@/services/cms-api.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Eye, ArrowLeft } from "lucide-react";
import SectionEditor from "@/components/admin/SectionEditor";

/**
 * Page Editor Component
 * Create new pages or edit existing ones
 */
const PageEditor = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  // Check if slug exists and is not undefined to determine edit mode
  const isEditMode = Boolean(slug);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState<PageContent | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [sections, setSections] = useState<any[]>([]);
  const [changeLog, setChangeLog] = useState("");

  // Load page if editing
  useEffect(() => {
    if (isEditMode && slug) {
      loadPage(slug);
    }
  }, [slug, isEditMode]);

  const loadPage = async (pageSlug: string) => {
    try {
      setLoading(true);
      const pageData = await cmsApiService.getPage(pageSlug);
      setPage(pageData);

      // Populate form - deep clone sections to avoid reference issues
      setTitle(pageData.metadata.title);
      setDescription(pageData.metadata.description);
      setKeywords(pageData.metadata.keywords.join(", "));
      setPageSlug(pageData.slug);
      // Deep clone sections to prevent mutation issues
      setSections(JSON.parse(JSON.stringify(pageData.sections || [])));
    } catch (error: any) {
      toast({
        title: "Error loading page",
        description: error.message || "Failed to load page",
        variant: "destructive",
      });
      navigate("/admin/pages");
    } finally {
      setLoading(false);
    }
  };

  // Save as draft
  const handleSaveDraft = async () => {

    if (!isEditMode && !pageSlug) {
      toast({
        title: "Slug required",
        description: "Please enter a slug for the page",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      // Build payload with current state values
      const payload = {
        metadata: {
          title,
          description,
          keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
        },
        sections: JSON.parse(JSON.stringify(sections)), // Deep clone to ensure clean data
        ...(isEditMode && changeLog ? { changeLog } : {}),
      };

      // Debug: Log the payload being sent
      console.log('[PageEditor] Saving page with payload:', JSON.stringify(payload, null, 2));

      if (isEditMode) {
        await cmsApiService.updatePage(slug!, payload);
        toast({
          title: "Page updated",
          description: "Changes saved as draft",
        });
        loadPage(slug!);
      } else {
        const created = await cmsApiService.createPage({
          slug: pageSlug,
          ...payload,
        });
        toast({
          title: "Page created",
          description: "Page saved as draft",
        });
        navigate(`/admin/pages/${created.slug}/edit`);
      }
    } catch (error: any) {
      toast({
        title: "Error saving page",
        description: error.message || "Failed to save page",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Save and publish
  const handleSaveAndPublish = async () => {

    if (!isEditMode && !pageSlug) {
      toast({
        title: "Slug required",
        description: "Please enter a slug for the page",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      // Build payload with current state values
      const payload = {
        metadata: {
          title,
          description,
          keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
        },
        sections: JSON.parse(JSON.stringify(sections)), // Deep clone to ensure clean data
        ...(isEditMode && changeLog ? { changeLog } : {}),
      };

      // Debug: Log the payload being sent
      console.log('[PageEditor] Publishing page with payload:', JSON.stringify(payload, null, 2));

      let targetSlug = pageSlug;

      if (isEditMode) {
        await cmsApiService.updatePage(slug!, payload);
        targetSlug = slug!;
      } else {
        const created = await cmsApiService.createPage({
          slug: pageSlug,
          ...payload,
        });
        targetSlug = created.slug;
      }

      // Publish the page
      await cmsApiService.publishPage(targetSlug);

      toast({
        title: "Page published",
        description: "Page is now live",
      });

      navigate("/admin/pages");
    } catch (error: any) {
      toast({
        title: "Error publishing page",
        description: error.message || "Failed to publish page",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Generate slug from title
  const generateSlug = () => {
    if (isEditMode) return; // Don't change slug in edit mode
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setPageSlug(generated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/pages")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? "Edit Page" : "Create Page"}
            </h1>
            {page && (
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">Version {page.version}</Badge>
                <Badge
                  className={
                    page.status === "published"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }
                >
                  {page.status}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metadata Card */}
      <Card>
        <CardHeader>
          <CardTitle>Page Metadata</CardTitle>
          <CardDescription>Basic information about the page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={generateSlug}
              placeholder="Page title"
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={pageSlug}
              onChange={(e) => setPageSlug(e.target.value)}
              placeholder="page-slug"
              disabled={isEditMode}
              className="font-mono"
            />
            {!isEditMode && (
              <p className="text-sm text-gray-500 mt-1">
                URL path for this page (auto-generated from title)
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the page"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="keyword1, keyword2, keyword3"
            />
            <p className="text-sm text-gray-500 mt-1">
              Comma-separated list of keywords for SEO
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sections Card */}
      <Card>
        <CardHeader>
          <CardTitle>Page Sections</CardTitle>
          <CardDescription>
            Add and manage content sections for this page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="visual">
            <TabsList>
              <TabsTrigger value="visual">Visual Editor</TabsTrigger>
              <TabsTrigger value="json">JSON Editor</TabsTrigger>
            </TabsList>
            <TabsContent value="visual" className="mt-4">
              <SectionEditor sections={sections} onChange={setSections} />
            </TabsContent>
            <TabsContent value="json" className="mt-4">
              <Textarea
                value={JSON.stringify(sections, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    if (Array.isArray(parsed)) {
                      setSections(parsed);
                    }
                  } catch {
                    // Invalid JSON, don't update
                  }
                }}
                placeholder='[{"type": "hero", "title": "Welcome"}]'
                rows={15}
                className="font-mono text-sm"
              />
              <p className="text-sm text-gray-500 mt-2">
                JSON array of section objects. Each section should have a "type" field.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Change Log (Edit Mode Only) */}
      {isEditMode && (
        <Card>
          <CardHeader>
            <CardTitle>Change Log</CardTitle>
            <CardDescription>
              Describe the changes you made (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={changeLog}
              onChange={(e) => setChangeLog(e.target.value)}
              placeholder="Updated hero section content..."
              rows={3}
            />
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pb-8">
        <Button
          variant="outline"
          onClick={() => navigate("/admin/pages")}
          disabled={saving}
        >
          Cancel
        </Button>

        <div className="flex gap-3">
          {isEditMode && (
            <Button
              variant="outline"
              onClick={() => window.open(`/${slug}`, "_blank")}
              disabled={saving}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Draft
          </Button>
          <Button onClick={handleSaveAndPublish} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save & Publish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageEditor;
