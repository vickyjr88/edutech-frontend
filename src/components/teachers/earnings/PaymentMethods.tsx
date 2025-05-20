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
  LockKeyhole
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

// Mock payment methods
const mockPaymentMethods = [
  {
    id: 1,
    type: "bank",
    name: "Chase Bank",
    details: { 
      accountNumber: "****4231",
      routingNumber: "322271627",
      accountType: "checking",
      bankName: "Chase Bank"
    },
    isDefault: true,
    last4: "4231"
  },
  {
    id: 2,
    type: "bank",
    name: "Bank of America",
    details: { 
      accountNumber: "****7890",
      routingNumber: "123456789",
      accountType: "savings",
      bankName: "Bank of America"
    },
    isDefault: false,
    last4: "7890"
  }
];

interface PaymentMethodCardProps {
  method: typeof mockPaymentMethods[0];
  onSetDefault: (id: number) => void;
  onEdit: (method: typeof mockPaymentMethods[0]) => void;
  onDelete: (id: number) => void;
}

const PaymentMethodCard = ({ method, onSetDefault, onEdit, onDelete }: PaymentMethodCardProps) => {
  return (
    <Card className={`shadow-sm relative ${method.isDefault ? 'border-blue-200' : ''}`}>
      {method.isDefault && (
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Default
          </span>
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-start">
          {method.type === "bank" ? (
            <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center mr-4">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center mr-4">
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
          )}
          
          <div className="flex-1">
            <h3 className="text-base font-medium">{method.name}</h3>
            <p className="text-sm text-gray-500">
              {method.type === "bank" ? "Bank Account" : "Credit Card"} ending in {method.last4}
            </p>
            
            {method.type === "bank" && (
              <div className="mt-2">
                <div className="text-xs text-gray-500">Account Type</div>
                <div className="text-sm capitalize">{method.details.accountType}</div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t flex justify-end gap-2">
          {!method.isDefault && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onSetDefault(method.id)}
            >
              <Check className="h-4 w-4 mr-1" />
              Set as Default
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(method)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => onDelete(method.id)}
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
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<typeof mockPaymentMethods[0] | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  
  // Form state for adding/editing bank account
  const [bankName, setBankName] = useState("");
  const [accountType, setAccountType] = useState("checking");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [makeDefault, setMakeDefault] = useState(false);
  
  // Reset form fields when dialog opens/closes
  const resetForm = () => {
    setBankName("");
    setAccountType("checking");
    setRoutingNumber("");
    setAccountNumber("");
    setConfirmAccountNumber("");
    setAccountName("");
    setMakeDefault(false);
    setEditingMethod(null);
  };
  
  // Populate form with existing data when editing
  const populateForm = (method: typeof mockPaymentMethods[0]) => {
    if (method.type === "bank") {
      setBankName(method.details.bankName);
      setAccountType(method.details.accountType);
      setRoutingNumber(method.details.routingNumber);
      // Don't set account number for security reasons in a real app
      setAccountName(method.name);
      setMakeDefault(method.isDefault);
    }
  };
  
  // Handle setting a method as default
  const handleSetDefault = (id: number) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };
  
  // Handle editing a payment method
  const handleEdit = (method: typeof mockPaymentMethods[0]) => {
    setEditingMethod(method);
    populateForm(method);
    setShowAddBankModal(true);
  };
  
  // Handle deleting a payment method
  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };
  
  // Confirm deletion of payment method
  const confirmDelete = () => {
    if (deleteConfirmId) {
      setPaymentMethods(paymentMethods.filter(method => method.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };
  
  // Save new or edited bank account
  const handleSaveBank = () => {
    // Validate form fields
    if (!bankName || !routingNumber || !accountNumber || !accountName) {
      // Show validation error in a real app
      return;
    }
    
    if (accountNumber !== confirmAccountNumber) {
      // Show account number mismatch error in a real app
      return;
    }
    
    if (editingMethod) {
      // Update existing method
      setPaymentMethods(paymentMethods.map(method => {
        if (method.id === editingMethod.id) {
          return {
            ...method,
            name: accountName,
            details: {
              ...method.details,
              bankName: bankName,
              accountType: accountType,
              routingNumber: routingNumber,
              // In a real app, you would not update the account number unless it was changed
            },
            isDefault: makeDefault ? true : method.isDefault
          };
        }
        
        // If setting this method as default, set other methods to not default
        if (makeDefault && method.id !== editingMethod.id) {
          return {
            ...method,
            isDefault: false
          };
        }
        
        return method;
      }));
    } else {
      // Add new method
      const last4 = accountNumber.slice(-4);
      const newMethod = {
        id: Date.now(),
        type: "bank" as const,
        name: accountName,
        details: {
          accountNumber: `****${last4}`,
          routingNumber,
          accountType,
          bankName
        },
        isDefault: makeDefault || paymentMethods.length === 0,
        last4
      };
      
      // If setting the new method as default, update other methods
      if (makeDefault || paymentMethods.length === 0) {
        setPaymentMethods([
          ...paymentMethods.map(method => ({
            ...method,
            isDefault: false
          })),
          newMethod
        ]);
      } else {
        setPaymentMethods([...paymentMethods, newMethod]);
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
            {paymentMethods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                onSetDefault={handleSetDefault}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
            
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
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Payout Preferences</CardTitle>
          <CardDescription>
            Configure how and when you receive your earnings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3">
            <Label htmlFor="payout-frequency">Payout Frequency</Label>
            <Select defaultValue="monthly">
              <SelectTrigger id="payout-frequency" className="w-full sm:w-80">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly (every Monday)</SelectItem>
                <SelectItem value="biweekly">Bi-weekly (every other Monday)</SelectItem>
                <SelectItem value="monthly">Monthly (1st of each month)</SelectItem>
                <SelectItem value="manual">Manual (request payouts)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              How often would you like your earnings to be transferred to your bank account
            </p>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="minimum-payout">Minimum Payout Amount</Label>
            <div className="flex">
              <span className="flex items-center border border-r-0 rounded-l-md px-3 bg-gray-50 text-gray-500">$</span>
              <Input
                id="minimum-payout"
                type="number"
                defaultValue="50"
                className="rounded-l-none w-32"
                min={1}
              />
            </div>
            <p className="text-xs text-gray-500">
              We'll hold your earnings until they reach this amount
            </p>
          </div>
          
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="block mb-1">Automatic Payouts</Label>
                <p className="text-xs text-gray-500">
                  Automatically transfer earnings to your default payment method
                </p>
              </div>
              <Toggle defaultPressed />
            </div>
          </div>
          
          <div className="pt-4 border-t mt-4">
            <Button>Save Preferences</Button>
          </div>
        </CardContent>
      </Card>
      
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
            <DialogTitle>{editingMethod ? "Edit Bank Account" : "Add Bank Account"}</DialogTitle>
            <DialogDescription>
              Connect your bank account to receive your earnings
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="bank-name">Bank Name</Label>
              <Input
                id="bank-name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. Chase, Bank of America"
              />
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
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="routing-number">Routing Number</Label>
              <div className="relative">
                <Input
                  id="routing-number"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  placeholder="9 digits"
                  maxLength={9}
                  className="pr-10"
                />
                <LockKeyhole className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500">
                The 9-digit routing number for your bank
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number</Label>
              <div className="relative">
                <Input
                  id="account-number"
                  type="password"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder={editingMethod ? "••••••••" : "Enter account number"}
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
                  placeholder={editingMethod ? "••••••••" : "Re-enter account number"}
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
            <Button onClick={handleSaveBank}>
              {editingMethod ? "Update Account" : "Save Account"}
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
            >
              Yes, Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentMethods;