import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Power, PowerOff } from "lucide-react";
import { cmsApiService, Menu } from "@/services/cms-api.service";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const MenusList = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const data = await cmsApiService.listMenus(false);
      setMenus(data.sort((a, b) => a.order - b.order));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch menus",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleToggleActive = async (identifier: string) => {
    try {
      await cmsApiService.toggleMenuActive(identifier);
      toast({
        title: "Success",
        description: "Menu status updated",
      });
      fetchMenus();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to toggle menu status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await cmsApiService.deleteMenu(deleteId);
      toast({
        title: "Success",
        description: "Menu deleted successfully",
      });
      setDeleteId(null);
      fetchMenus();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete menu",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Footer Menus</h1>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Footer Menus</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage footer navigation menus
          </p>
        </div>
        <Link to="/admin/menus/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Menu
          </Button>
        </Link>
      </div>

      {/* Menus List */}
      {menus.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">No menus found</p>
          <Link to="/admin/menus/new">
            <Button>Create First Menu</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {menus.map((menu) => (
            <div
              key={menu._id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {menu.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          menu.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {menu.active ? "Active" : "Inactive"}
                      </span>
                      <span className="text-xs text-gray-500">
                        Order: {menu.order}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      {menu.identifier}
                    </p>
                    {menu.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {menu.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {menu.items.map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-50 text-blue-700"
                        >
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(menu.identifier)}
                      title={menu.active ? "Deactivate" : "Activate"}
                    >
                      {menu.active ? (
                        <PowerOff className="h-4 w-4 text-orange-600" />
                      ) : (
                        <Power className="h-4 w-4 text-green-600" />
                      )}
                    </Button>
                    <Link to={`/admin/menus/${menu.identifier}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(menu.identifier)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MenusList;
