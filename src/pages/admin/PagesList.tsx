import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cmsApiService, PageContent } from "@/services/cms-api.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  MoreVertical,
  Eye,
  Archive,
  CheckCircle,
  XCircle,
  History,
  Copy,
  Loader2,
  Search,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

/**
 * Pages List Component
 * Displays all CMS pages with filtering, search, and actions
 */
const PagesList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pages, setPages] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Load pages
  const loadPages = async () => {
    try {
      setLoading(true);
      const query: any = {};
      if (statusFilter !== "all") {
        query.status = statusFilter;
      }
      if (search) {
        query.search = search;
      }

      const response = await cmsApiService.listPages(query);
      setPages(response.pages);
    } catch (error: any) {
      toast({
        title: "Error loading pages",
        description: error.message || "Failed to load pages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, [statusFilter]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== undefined) {
        loadPages();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Publish page
  const handlePublish = async (slug: string) => {
    try {
      setActionLoading(slug);
      await cmsApiService.publishPage(slug);
      toast({
        title: "Page published",
        description: "The page is now live",
      });
      loadPages();
    } catch (error: any) {
      toast({
        title: "Error publishing page",
        description: error.message || "Failed to publish page",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Unpublish page
  const handleUnpublish = async (slug: string) => {
    try {
      setActionLoading(slug);
      await cmsApiService.unpublishPage(slug);
      toast({
        title: "Page unpublished",
        description: "The page is now in draft",
      });
      loadPages();
    } catch (error: any) {
      toast({
        title: "Error unpublishing page",
        description: error.message || "Failed to unpublish page",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Archive page
  const handleArchive = async (slug: string) => {
    if (!confirm("Are you sure you want to archive this page?")) {
      return;
    }

    try {
      setActionLoading(slug);
      await cmsApiService.archivePage(slug);
      toast({
        title: "Page archived",
        description: "The page has been archived",
      });
      loadPages();
    } catch (error: any) {
      toast({
        title: "Error archiving page",
        description: error.message || "Failed to archive page",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Duplicate page
  const handleDuplicate = async (slug: string, title: string) => {
    const newSlug = prompt("Enter new slug for duplicated page:");
    if (!newSlug) return;

    const newTitle = prompt("Enter new title for duplicated page:", `${title} (Copy)`);
    if (!newTitle) return;

    try {
      setActionLoading(slug);
      await cmsApiService.duplicatePage(slug, { newSlug, newTitle });
      toast({
        title: "Page duplicated",
        description: `Created new page: ${newSlug}`,
      });
      loadPages();
    } catch (error: any) {
      toast({
        title: "Error duplicating page",
        description: error.message || "Failed to duplicate page",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Delete page permanently
  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to PERMANENTLY DELETE "${title}"?\n\nThis action CANNOT be undone. All versions and history will be lost.`)) {
      return;
    }

    // Double confirmation for safety
    if (!confirm("This is your final warning. Type 'DELETE' to confirm.") && prompt("Type 'DELETE' to confirm:") !== "DELETE") {
      return;
    }

    try {
      setActionLoading(slug);
      await cmsApiService.deletePage(slug);
      toast({
        title: "Page deleted",
        description: "The page has been permanently deleted",
      });
      loadPages();
    } catch (error: any) {
      toast({
        title: "Error deleting page",
        description: error.message || "Failed to delete page",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">Published</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "archived":
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Format date
  const formatDate = (date?: Date) => {
    if (!date) return "N/A";
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
        <p className="text-gray-500 mt-1">Manage your CMS pages</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pages Table */}
      {pages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500">No pages found</p>
          <Button
            className="mt-4"
            onClick={() => navigate("/admin/pages/new")}
          >
            Create your first page
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page._id}>
                  <TableCell className="font-medium">
                    {page.metadata.title}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-gray-600">
                    {page.slug}
                  </TableCell>
                  <TableCell>{getStatusBadge(page.status)}</TableCell>
                  <TableCell className="text-gray-600">
                    v{page.version}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(page.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={actionLoading === page.slug}
                        >
                          {actionLoading === page.slug ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreVertical className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`/admin/pages/${page.slug}/edit`)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/admin/pages/${page.slug}/versions`)}
                        >
                          <History className="h-4 w-4 mr-2" />
                          Version History
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => window.open(`/${page.slug}`, "_blank")}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleDuplicate(page.slug, page.metadata.title)
                          }
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        {page.status === "published" ? (
                          <DropdownMenuItem
                            onClick={() => handleUnpublish(page.slug)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Unpublish
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handlePublish(page.slug)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Publish
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleArchive(page.slug)}
                          className="text-orange-600"
                        >
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(page.slug, page.metadata.title)}
                          className="text-red-600 font-semibold"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Permanently
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default PagesList;
