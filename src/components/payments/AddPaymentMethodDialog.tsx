import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
import UnifiedPaymentForm from './UnifiedPaymentForm';
import type { BoyaCustomer } from '@/services/boya-payment.service';

interface AddPaymentMethodDialogProps {
  basisTheoryApiKey?: string;
  stripePublishableKey?: string;
  customer?: BoyaCustomer;
  customerId?: string;
  useBoyaFlow?: boolean;
  onSuccess?: (paymentMethod: any) => void;
  onError?: (error: string, boyaError?: any) => void;
  onRequires3DSecure?: (authUrl: string) => void;
  children?: React.ReactNode;
}

const AddPaymentMethodDialog: React.FC<AddPaymentMethodDialogProps> = ({
  basisTheoryApiKey,
  stripePublishableKey,
  customer,
  customerId,
  useBoyaFlow = true,
  onSuccess,
  onError,
  onRequires3DSecure,
  children
}) => {
  const [open, setOpen] = useState(false);
  const [setAsDefault, setSetAsDefault] = useState(true);

  const handleSuccess = (result: any) => {
    const paymentMethod = {
      ...result,
      isDefault: setAsDefault,
      // Billing address will be retrieved from parent profile
    };
    
    onSuccess?.(paymentMethod);
    setOpen(false);
    
    // Reset form
    setSetAsDefault(true);
  };

  const handleError = (error: string, boyaError?: any) => {
    onError?.(error, boyaError);
  };

  const handle3DSecure = (authUrl: string) => {
    onRequires3DSecure?.(authUrl);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            Add a new payment method to your account. Billing address will be used from your profile.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Card Payment Form */}
          <UnifiedPaymentForm
            amount={1} // Small test amount to verify card (will be refunded)
            currency="USD"
            customer={customer}
            customerId={customerId}
            paymentDescription="Payment method verification"
            saveForRecurringPayments={true}
            title="Card Information"
            description="Enter your card details"
            basisTheoryApiKey={basisTheoryApiKey}
            stripePublishableKey={stripePublishableKey}
            preferredProvider={useBoyaFlow ? "boya" : "stripe"}
            useBoyaFlow={useBoyaFlow}
            onSuccess={handleSuccess}
            onError={handleError}
            onRequires3DSecure={handle3DSecure}
          />
          
          {/* Set as Default */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="setAsDefault"
              checked={setAsDefault}
              onCheckedChange={(checked) => setSetAsDefault(checked as boolean)}
            />
            <Label
              htmlFor="setAsDefault"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Set as default payment method
            </Label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentMethodDialog;