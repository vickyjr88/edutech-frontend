import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, User, Mail, Phone } from 'lucide-react';
import { adminService, AdminUser } from '@/integrations/api/services/admin.service';
import { useToast } from '@/hooks/use-toast';

interface CreateTicketFormProps {
  open: boolean;
  onClose: () => void;
  userId?: string;
  userName?: string;
}

interface FormData {
  userId: string;
  subject: string;
  message: string;
  category: string;
  priority: string;
}

const CreateTicketForm = ({ open, onClose, userId, userName }: CreateTicketFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    userId: userId || '',
    subject: '',
    message: '',
    category: 'general',
    priority: 'medium',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Search users query
  const { data: usersData, isLoading: isSearchingUsers } = useQuery({
    queryKey: ['searchUsers', userSearch],
    queryFn: async () => {
      if (userSearch.length < 2) return { data: { users: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } } };
      return adminService.getUsers({ search: userSearch, limit: 10 });
    },
    enabled: showUserDropdown && userSearch.length >= 2,
  });

  // If userId is pre-filled, fetch that user's details
  useEffect(() => {
    if (userId && !selectedUser) {
      adminService.getUserById(userId).then((response) => {
        if (response.data) {
          setSelectedUser(response.data);
        }
      }).catch(() => {
        // Ignore error, user can still select manually
      });
    }
  }, [userId, selectedUser]);

  const createTicketMutation = useMutation({
    mutationFn: (data: FormData) => adminService.createTicket(data),
    onSuccess: () => {
      toast({
        title: 'Ticket Created',
        description: 'Support ticket has been created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['adminTickets'] });
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create ticket',
        variant: 'destructive',
      });
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.userId.trim()) {
      newErrors.userId = 'Please select a user';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    createTicketMutation.mutate(formData);
  };

  const handleSelectUser = (user: AdminUser) => {
    setSelectedUser(user);
    setFormData({ ...formData, userId: user._id });
    setUserSearch('');
    setShowUserDropdown(false);
    setErrors({ ...errors, userId: undefined });
  };

  const handleClearUser = () => {
    setSelectedUser(null);
    setFormData({ ...formData, userId: '' });
    setUserSearch('');
  };

  const handleClose = () => {
    setFormData({
      userId: userId || '',
      subject: '',
      message: '',
      category: 'general',
      priority: 'medium',
    });
    setErrors({});
    setUserSearch('');
    setSelectedUser(null);
    setShowUserDropdown(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
          <DialogDescription>
            Create a new support ticket {userName && `for ${userName}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* User Picker */}
          <div className="space-y-2">
            <Label htmlFor="userPicker">
              User <span className="text-red-500">*</span>
            </Label>

            {selectedUser ? (
              // Display selected user
              <div className="border rounded-lg p-3 bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white rounded-full p-2">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedUser.fullName}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {selectedUser.email}
                        </span>
                        {selectedUser.phoneNumber && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {selectedUser.phoneNumber}
                          </span>
                        )}
                      </div>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {selectedUser.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!userId && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClearUser}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Change
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              // User search
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="userPicker"
                    placeholder="Search users by name or email..."
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setShowUserDropdown(true);
                    }}
                    onFocus={() => setShowUserDropdown(true)}
                    className={`pl-10 ${errors.userId ? 'border-red-500' : ''}`}
                  />
                </div>

                {/* User dropdown */}
                {showUserDropdown && userSearch.length >= 2 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {isSearchingUsers ? (
                      <div className="p-4 text-center text-gray-500">
                        <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                        <p className="text-sm mt-2">Searching users...</p>
                      </div>
                    ) : usersData?.data?.users && usersData.data.users.length > 0 ? (
                      <div className="py-1">
                        {usersData.data.users.map((user) => (
                          <button
                            key={user._id}
                            type="button"
                            onClick={() => handleSelectUser(user)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-100 text-blue-600 rounded-full p-2">
                                <User className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{user.fullName}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
                                  <span>{user.email}</span>
                                  <span>•</span>
                                  <span className="capitalize">{user.role}</span>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : userSearch.length >= 2 ? (
                      <div className="p-4 text-center text-gray-500">
                        <p className="text-sm">No users found matching "{userSearch}"</p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )}

            {errors.userId && (
              <p className="text-sm text-red-500">{errors.userId}</p>
            )}
            <p className="text-xs text-gray-500">
              Search and select the user this ticket is for
            </p>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">
              Subject <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject"
              placeholder="Brief description of the issue"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className={errors.subject ? 'border-red-500' : ''}
            />
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject}</p>
            )}
          </div>

          {/* Message/Description */}
          <div className="space-y-2">
            <Label htmlFor="message">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Detailed description of the issue..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={6}
              className={errors.message ? 'border-red-500' : ''}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message}</p>
            )}
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account_access">Account Access</SelectItem>
                  <SelectItem value="payment">Payment Issues</SelectItem>
                  <SelectItem value="technical">Technical Support</SelectItem>
                  <SelectItem value="content">Content Related</SelectItem>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="feature_request">Feature Request</SelectItem>
                  <SelectItem value="bug_report">Bug Report</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">
                Priority <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger className={errors.priority ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-red-500">{errors.priority}</p>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-medium mb-2">Ticket Categories:</p>
            <ul className="space-y-1 text-xs">
              <li><strong>Account Access:</strong> Login issues, password resets, account lockouts</li>
              <li><strong>Payment:</strong> Payment problems, billing questions, refunds</li>
              <li><strong>Technical:</strong> Platform bugs, errors, technical issues</li>
              <li><strong>Content:</strong> Course content issues, material problems</li>
              <li><strong>General:</strong> Questions, feedback, general inquiries</li>
              <li><strong>Feature Request:</strong> Suggestions for new features</li>
              <li><strong>Bug Report:</strong> Report bugs or unexpected behavior</li>
              <li><strong>Other:</strong> Issues that don't fit other categories</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={createTicketMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createTicketMutation.isPending}
          >
            {createTicketMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Ticket
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketForm;
