import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cmsApiService, PageVersion } from "@/services/cms-api.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, RotateCcw, Eye } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

/**
 * Version History Component
 * View and rollback to previous versions of a page
 */
const VersionHistory = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [versions, setVersions] = useState<PageVersion[]>([]);
  const [rollingBack, setRollingBack] = useState<number | null>(null);
  const [previewVersion, setPreviewVersion] = useState<PageVersion | null>(null);

  useEffect(() => {
    if (slug) {
      loadVersions();
    }
  }, [slug]);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const history = await cmsApiService.getVersionHistory(slug!);
      setVersions(history);
    } catch (error: any) {
      toast({
        title: "Error loading versions",
        description: error.message || "Failed to load version history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (version: number) => {
    if (!confirm(`Are you sure you want to rollback to version ${version}?`)) {
      return;
    }

    try {
      setRollingBack(version);
      await cmsApiService.rollbackToVersion(slug!, version);
      toast({
        title: "Rollback successful",
        description: `Page restored to version ${version}`,
      });
      navigate(`/admin/pages/${slug}/edit`);
    } catch (error: any) {
      toast({
        title: "Error rolling back",
        description: error.message || "Failed to rollback to version",
        variant: "destructive",
      });
    } finally {
      setRollingBack(null);
    }
  };

  const handlePreview = (version: PageVersion) => {
    setPreviewVersion(version);
  };

  const formatDate = (date: Date) => {
    try {
      return format(new Date(date), "PPpp");
    } catch {
      return "N/A";
    }
  };

  const formatRelativeTime = (date: Date) => {
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
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/pages")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pages
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Version History</h1>
            <p className="text-gray-500 mt-1">
              Page: <span className="font-mono">{slug}</span>
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/admin/pages/${slug}/edit`)}>
          Edit Current Version
        </Button>
      </div>

      {/* Versions List */}
      <Card>
        <CardHeader>
          <CardTitle>All Versions ({versions.length})</CardTitle>
          <CardDescription>
            View and restore previous versions of this page
          </CardDescription>
        </CardHeader>
        <CardContent>
          {versions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No versions found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Change Log</TableHead>
                  <TableHead>Sections</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.map((version, index) => (
                  <TableRow key={version._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">v{version.version}</Badge>
                        {index === 0 && (
                          <Badge className="bg-green-500">Current</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">
                          {formatDate(version.createdAt)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatRelativeTime(version.createdAt)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">
                        {version.changeLog || "No change log"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {version.content.sections.length} sections
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreview(version)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {index !== 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRollback(version.version)}
                            disabled={rollingBack === version.version}
                          >
                            {rollingBack === version.version ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Restore
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Version Preview Modal */}
      {previewVersion && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewVersion(null)}
        >
          <Card
            className="max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Version {previewVersion.version} Preview</CardTitle>
                  <CardDescription>
                    Created {formatRelativeTime(previewVersion.createdAt)}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewVersion(null)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Metadata */}
              <div>
                <h3 className="font-semibold mb-2">Metadata</h3>
                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                  <div>
                    <span className="text-sm font-medium">Title:</span>
                    <p className="text-sm">{previewVersion.content.metadata.title}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Description:</span>
                    <p className="text-sm">
                      {previewVersion.content.metadata.description}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Keywords:</span>
                    <p className="text-sm">
                      {previewVersion.content.metadata.keywords.join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div>
                <h3 className="font-semibold mb-2">
                  Sections ({previewVersion.content.sections.length})
                </h3>
                <pre className="bg-gray-50 p-4 rounded-md text-xs overflow-auto max-h-96">
                  {JSON.stringify(previewVersion.content.sections, null, 2)}
                </pre>
              </div>

              {/* Change Log */}
              {previewVersion.changeLog && (
                <div>
                  <h3 className="font-semibold mb-2">Change Log</h3>
                  <p className="text-sm bg-gray-50 p-4 rounded-md">
                    {previewVersion.changeLog}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setPreviewVersion(null)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setPreviewVersion(null);
                    handleRollback(previewVersion.version);
                  }}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restore This Version
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VersionHistory;
