import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  CreditCard, 
  Plus, 
  Building2, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  AlertCircle,
  Shield,
  LockKeyhole,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Toggle } from "@/components/ui/toggle";
import { useSupportedBanks } from "@/hooks/useSupportedBanks";
import { useTeacherBankAccounts } from "@/hooks/useTeacherBankAccounts";
import SuperTeacherPayoutPreferences from "./SuperTeacherPayoutPreferences";
import type { TeacherBankAccount, AddBankAccountRequest } from "@/integrations/api";

interface PaymentMethodCardProps {
  account: TeacherBankAccount;
  onSetDefault: (accountId: string) => void;
  onEdit: (account: TeacherBankAccount) => void;
  onDelete: (accountId: string) => void;
  isSubmitting: boolean;
}

const getVerificationStatusIcon = (status: string) => {
  switch (status) {
    case 'verified':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-amber-500" />;
    case 'failed':
    case 'rejected':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

const getVerificationStatusColor = (status: string) => {
  switch (status) {
    case 'verified':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-amber-100 text-amber-800';
    case 'failed':
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const PaymentMethodCard = ({ account, onSetDefault, onEdit, onDelete, isSubmitting }: PaymentMethodCardProps) => {
  const last4 = account.maskedAccountNumber.slice(-4);
  
  return (
    <Card className={`shadow-sm relative ${account.isPrimary ? 'border-blue-200' : ''}`}>
      {account.isPrimary && (
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Primary
          </span>
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-start">
          <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center mr-4">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-base font-medium">{account.bank.bankName}</h3>
            <p className="text-sm text-gray-500">
              Bank Account ending in {last4}
            </p>
            
            <div className="mt-2 space-y-1">
              <div>
                <span className="text-xs text-gray-500">Account Type: </span>
                <span className="text-sm capitalize">{account.accountType}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500">Account Holder: </span>
                <span className="text-sm">{account.accountHolderName}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                {getVerificationStatusIcon(account.verificationStatus)}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getVerificationStatusColor(account.verificationStatus)}`}>
                  {account.verificationStatus.charAt(0).toUpperCase() + account.verificationStatus.slice(1)}
                </span>
              </div>
              {(account.successfulTransactions > 0 || account.failedTransactions > 0) && (
                <div className="text-xs text-gray-500 mt-1">
                  {account.successfulTransactions} successful, {account.failedTransactions} failed transactions
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t flex justify-end gap-2">
          {!account.isPrimary && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onSetDefault(account._id)}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
              Set as Primary
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(account)}
            disabled={isSubmitting}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => onDelete(account._id)}
            disabled={isSubmitting}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const PaymentMethods = () => {
  // API hooks
  const { banks, isLoading: banksLoading } = useSupportedBanks();
  const { 
    bankAccounts, 
    isLoading: accountsLoading, 
    error: accountsError,
    refetch,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    setPrimaryAccount,
    isSubmitting 
  } = useTeacherBankAccounts();

  // Modal and form state
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<TeacherBankAccount | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Form state for adding/editing bank account
  const [selectedBankId, setSelectedBankId] = useState("");
  const [accountType, setAccountType] = useState<'current' | 'savings' | 'business'>("current");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [makeDefault, setMakeDefault] = useState(false);
  
  // Reset form fields when dialog opens/closes
  const resetForm = () => {
    setSelectedBankId("");
    setAccountType("current");
    setAccountNumber("");
    setConfirmAccountNumber("");
    setAccountName("");
    setMakeDefault(false);
    setEditingAccount(null);
  };
  
  // Populate form with existing data when editing
  const populateForm = (account: TeacherBankAccount) => {
    setSelectedBankId(account.bank._id);
    setAccountType(account.accountType);
    // Don't set account number for security reasons
    setAccountName(account.accountHolderName);
    setMakeDefault(account.isPrimary);
  };
  
  // Handle setting a method as default
  const handleSetDefault = async (accountId: string) => {
    const result = await setPrimaryAccount(accountId);
    if (result) {
      // Local state is updated by the hook
    }
  };
  
  // Handle editing a payment method
  const handleEdit = (account: TeacherBankAccount) => {
    setEditingAccount(account);
    populateForm(account);
    setShowAddBankModal(true);
  };
  
  // Handle deleting a payment method
  const handleDelete = (accountId: string) => {
    setDeleteConfirmId(accountId);
  };
  
  // Confirm deletion of payment method
  const confirmDelete = async () => {
    if (deleteConfirmId) {
      try {
        const success = await deleteBankAccount(deleteConfirmId);
        // Always close the modal regardless of API response
        setDeleteConfirmId(null);
        
        if (success) {
          // Extra safety: refresh bank accounts to ensure UI consistency
          // Small delay to ensure state is clean before refresh
          setTimeout(() => {
            refetch();
          }, 100);
        } else {
          // Error is already handled by the hook, just ensure modal closes
          console.log('Delete operation completed with errors - check error state');
        }
      } catch (error) {
        // Always close modal even on unexpected errors
        setDeleteConfirmId(null);
        console.error('Unexpected error during deletion:', error);
      }
    }
  };
  
  // Save new or edited bank account
  const handleSaveBank = async () => {
    // Validate form fields
    if (!selectedBankId || !accountNumber || !accountName) {
      // Show validation error in a real app
      return;
    }
    
    if (accountNumber !== confirmAccountNumber) {
      // Show account number mismatch error in a real app
      return;
    }
    
    if (editingAccount) {
      // Update existing account
      const updateData: UpdateBankAccountRequest = {
        accountHolderName: accountName,
        // Only update account type if changed
        ...(accountType !== editingAccount.accountType && { accountType }),
        // Only update bank if changed
        ...(selectedBankId !== editingAccount.bank._id && { bank: selectedBankId }),
        // Only update account number if provided (for security)
        ...(accountNumber && { accountNumber })
      };
      
      const result = await updateBankAccount(editingAccount._id, updateData);
      if (result) {
        // If making this the default, set it as primary
        if (makeDefault && !editingAccount.isPrimary) {
          await setPrimaryAccount(editingAccount._id);
        }
      }
    } else {
      // Add new account
      const newAccountData: AddBankAccountRequest = {
        bank: selectedBankId,
        accountType,
        accountNumber,
        accountHolderName: accountName,
        isPrimary: makeDefault || bankAccounts.length === 0
      };
      
      const result = await addBankAccount(newAccountData);
      if (result) {
        // Hook will refresh the data automatically
      }
    }
    
    resetForm();
    setShowAddBankModal(false);
  };
  
  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Manage your bank accounts and payment preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200 text-blue-800">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertTitle>Secure payments</AlertTitle>
            <AlertDescription>
              Your banking information is securely stored and encrypted. We never share your financial details with third parties.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accountsLoading ? (
              <div className="col-span-full flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading payment methods...</span>
              </div>
            ) : accountsError ? (
              <div className="col-span-full">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{accountsError}</AlertDescription>
                </Alert>
              </div>
            ) : bankAccounts.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                No payment methods added yet
              </div>
            ) : (
              bankAccounts.map((account) => (
                <PaymentMethodCard
                  key={account._id}
                  account={account}
                  onSetDefault={handleSetDefault}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isSubmitting={isSubmitting}
                />
              ))
            )}
            
            <Card className="shadow-sm border-dashed h-full flex items-center justify-center">
              <CardContent className="text-center py-8">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full h-16 w-16 mb-4" 
                  onClick={() => {
                    resetForm();
                    setShowAddBankModal(true);
                  }}
                >
                  <Plus className="h-6 w-6" />
                </Button>
                <h3 className="text-lg font-medium mb-2">Add Payment Method</h3>
                <p className="text-sm text-gray-500 mb-4 max-w-xs mx-auto">
                  Connect a bank account to receive your earnings directly
                </p>
                <Button onClick={() => {
                  resetForm();
                  setShowAddBankModal(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bank Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      {/* Super Teacher Payout Preferences */}
      <SuperTeacherPayoutPreferences />
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Tax Information</CardTitle>
          <CardDescription>
            Manage your tax documents and reporting settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle>Tax information required</AlertTitle>
            <AlertDescription>
              Please submit your tax information to ensure proper reporting and avoid payment holds.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Tax Form Status</h3>
            <div className="bg-gray-50 border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">W-9 Form</p>
                  <p className="text-sm text-gray-500 mt-1">Required for U.S. taxpayers</p>
                </div>
                <Button>Submit Form</Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Tax Documents</h3>
            <p className="text-sm text-gray-500">
              Your annual tax documents will be available here in January for the previous year.
            </p>
            <div className="bg-gray-50 border rounded-md p-4 text-center text-gray-500">
              <p>No tax documents available yet</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Add/Edit Bank Account Dialog */}
      <Dialog open={showAddBankModal} onOpenChange={setShowAddBankModal}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{editingAccount ? "Edit Bank Account" : "Add Bank Account"}</DialogTitle>
            <DialogDescription>
              Connect your bank account to receive your earnings
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="bank-select">Bank</Label>
              <Select
                value={selectedBankId}
                onValueChange={setSelectedBankId}
              >
                <SelectTrigger id="bank-select">
                  <SelectValue placeholder={banksLoading ? "Loading banks..." : "Select your bank"} />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank._id} value={bank._id}>
                      {bank.bankName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="account-type">Account Type</Label>
              <Select
                value={accountType}
                onValueChange={setAccountType}
              >
                <SelectTrigger id="account-type">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            
            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number</Label>
              <div className="relative">
                <Input
                  id="account-number"
                  type="password"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder={editingAccount ? "••••••••" : "Enter account number"}
                  className="pr-10"
                />
                <LockKeyhole className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-account-number">Confirm Account Number</Label>
              <div className="relative">
                <Input
                  id="confirm-account-number"
                  type="password"
                  value={confirmAccountNumber}
                  onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder={editingAccount ? "••••••••" : "Re-enter account number"}
                  className="pr-10"
                />
                <LockKeyhole className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="account-name">Account Holder Name</Label>
              <Input
                id="account-name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Your full name as it appears on your account"
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="make-default"
                checked={makeDefault}
                onChange={(e) => setMakeDefault(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="make-default" className="text-sm font-normal">
                Make this my default payment method
              </Label>
            </div>
          </div>
          
          <div className="border-t mt-2 pt-4 text-xs text-gray-500 flex items-start space-x-2">
            <Shield className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p>
              Your banking information is securely stored and encrypted according to industry standards. 
              We use this information only to process your payouts.
            </p>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setShowAddBankModal(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveBank} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {editingAccount ? "Update Account" : "Save Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove Payment Method</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this payment method? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                If this is your default payment method, any pending payouts may be delayed until you set a new default.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                "Yes, Remove"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentMethods;