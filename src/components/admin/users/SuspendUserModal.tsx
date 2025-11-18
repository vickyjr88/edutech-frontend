import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { adminService } from '@/integrations/api/services/admin.service';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Ban, CheckCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SuspendUserModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  isSuspended?: boolean;
}

type SuspensionReason =
  | 'policy_violation'
  | 'payment_issue'
  | 'fraudulent_activity'
  | 'inappropriate_behavior'
  | 'security_concern'
  | 'user_request'
  | 'other';

const reasonLabels: Record<SuspensionReason, string> = {
  policy_violation: 'Policy Violation',
  payment_issue: 'Payment Issue',
  fraudulent_activity: 'Fraudulent Activity',
  inappropriate_behavior: 'Inappropriate Behavior',
  security_concern: 'Security Concern',
  user_request: 'User Request',
  other: 'Other',
};

const SuspendUserModal = ({ open, onClose, userId, userName, isSuspended = false }: SuspendUserModalProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [reason, setReason] = useState<SuspensionReason>('other');
  const [notes, setNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [suspendedUntil, setSuspendedUntil] = useState('');
  const [unsuspendNotes, setUnsuspendNotes] = useState('');

  const suspendMutation = useMutation({
    mutationFn: async () => {
      return adminService.suspendUser(userId, {
        reason,
        notes,
        internalNotes,
        suspendedUntil: suspendedUntil || undefined,
      });
    },
    onSuccess: () => {
      toast({
        title: 'User suspended',
        description: `${userName} has been suspended.`,
      });
      queryClient.invalidateQueries({ queryKey: ['adminStudents'] });
      queryClient.invalidateQueries({ queryKey: ['adminTeachers'] });
      queryClient.invalidateQueries({ queryKey: ['adminParents'] });
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to suspend user',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  const unsuspendMutation = useMutation({
    mutationFn: async () => {
      return adminService.unsuspendUser(userId, unsuspendNotes);
    },
    onSuccess: () => {
      toast({
        title: 'User unsuspended',
        description: `${userName} has been unsuspended.`,
      });
      queryClient.invalidateQueries({ queryKey: ['adminStudents'] });
      queryClient.invalidateQueries({ queryKey: ['adminTeachers'] });
      queryClient.invalidateQueries({ queryKey: ['adminParents'] });
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to unsuspend user',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  const handleClose = () => {
    setReason('other');
    setNotes('');
    setInternalNotes('');
    setSuspendedUntil('');
    setUnsuspendNotes('');
    onClose();
  };

  const handleSubmit = () => {
    if (isSuspended) {
      unsuspendMutation.mutate();
    } else {
      if (!notes.trim()) {
        toast({
          title: 'Notes required',
          description: 'Please provide a reason for suspension that will be visible to the user',
          variant: 'destructive',
        });
        return;
      }
      suspendMutation.mutate();
    }
  };

  const isPending = suspendMutation.isPending || unsuspendMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isSuspended ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                Unsuspend User
              </>
            ) : (
              <>
                <Ban className="h-5 w-5 text-red-600" />
                Suspend User
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isSuspended
              ? `Restore account access for ${userName}`
              : `Temporarily suspend account access for ${userName}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isSuspended ? (
            <>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  The user will be immediately logged out and unable to access their account until unsuspended.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="reason">Suspension Reason *</Label>
                <Select value={reason} onValueChange={(value: SuspensionReason) => setReason(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(reasonLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Public Notes * (Visible to user)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Explain the reason for suspension to the user..."
                  rows={3}
                  required
                />
                <p className="text-xs text-gray-500">
                  This message will be shown to the user when they attempt to log in.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="internalNotes">Internal Notes (Optional)</Label>
                <Textarea
                  id="internalNotes"
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Internal notes for admin team only..."
                  rows={2}
                />
                <p className="text-xs text-gray-500">
                  These notes are only visible to administrators.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="suspendedUntil">Auto-Unsuspend Date (Optional)</Label>
                <Input
                  id="suspendedUntil"
                  type="datetime-local"
                  value={suspendedUntil}
                  onChange={(e) => setSuspendedUntil(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="text-xs text-gray-500">
                  If set, the user will be automatically unsuspended on this date.
                </p>
              </div>
            </>
          ) : (
            <>
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  The user will immediately regain access to their account.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="unsuspendNotes">Unsuspension Notes (Optional)</Label>
                <Textarea
                  id="unsuspendNotes"
                  value={unsuspendNotes}
                  onChange={(e) => setUnsuspendNotes(e.target.value)}
                  placeholder="Notes about why the suspension is being lifted..."
                  rows={3}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            variant={isSuspended ? 'default' : 'destructive'}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : isSuspended ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Unsuspend User
              </>
            ) : (
              <>
                <Ban className="mr-2 h-4 w-4" />
                Suspend User
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuspendUserModal;
