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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
import CardPaymentWrapper from './CardPaymentForm';
import { BillingAddress } from './types';

interface AddPaymentMethodDialogProps {
  apiKey: string;
  onSuccess?: (paymentMethod: any) => void;
  onError?: (error: string) => void;
  collectBillingAddress?: boolean;
  children?: React.ReactNode;
}

const AddPaymentMethodDialog: React.FC<AddPaymentMethodDialogProps> = ({
  apiKey,
  onSuccess,
  onError,
  collectBillingAddress = false,
  children
}) => {
  const [open, setOpen] = useState(false);
  const [setAsDefault, setSetAsDefault] = useState(true);
  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US'
  });

  const handleSuccess = (result: any) => {
    const paymentMethod = {
      ...result,
      isDefault: setAsDefault,
      billingAddress: collectBillingAddress ? billingAddress : undefined
    };
    
    onSuccess?.(paymentMethod);
    setOpen(false);
    
    // Reset form
    setSetAsDefault(true);
    setBillingAddress({
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US'
    });
  };

  const handleError = (error: string) => {
    onError?.(error);
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
            Add a new payment method to your account. This will be used for future payments.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Card Payment Form */}
          <CardPaymentWrapper
            apiKey={apiKey}
            amount={0} // We're just adding a payment method, not charging
            title="Card Information"
            description="Enter your card details"
            onSuccess={handleSuccess}
            onError={handleError}
          />
          
          {/* Billing Address (Optional) */}
          {collectBillingAddress && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Billing Address</h3>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="line1">Address Line 1</Label>
                  <Input
                    id="line1"
                    value={billingAddress.line1}
                    onChange={(e) => setBillingAddress(prev => ({ ...prev, line1: e.target.value }))}
                    placeholder="123 Main Street"
                  />
                </div>
                <div>
                  <Label htmlFor="line2">Address Line 2 (Optional)</Label>
                  <Input
                    id="line2"
                    value={billingAddress.line2}
                    onChange={(e) => setBillingAddress(prev => ({ ...prev, line2: e.target.value }))}
                    placeholder="Apt, suite, etc."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={billingAddress.city}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={billingAddress.state}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="NY"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={billingAddress.postalCode}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                      placeholder="10001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={billingAddress.country}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, country: e.target.value }))}
                      placeholder="US"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
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