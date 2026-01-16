import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  DollarSign,
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTeacherPayoutPreferences } from "@/hooks/useTeacherPayoutPreferences";
import type { ApiUpdatePayoutPreferencesRequest } from "@/integrations/api";

const SuperTeacherPayoutPreferences = () => {
  const {
    preferences,
    isLoading,
    isUpdating,
    error,
    updatePreferences
  } = useTeacherPayoutPreferences();

  // Local state for form
  const [selectedPeriod, setSelectedPeriod] = useState<string>('monthly');
  const [minimumAmount, setMinimumAmount] = useState(50);
  const [automaticPayouts, setAutomaticPayouts] = useState(true);
  const [payoutDay, setPayoutDay] = useState(1);
  const [suspendPayouts, setSuspendPayouts] = useState(false);

  // Update local state when preferences load
  useEffect(() => {
    if (preferences) {
      if (!preferences.autoPayoutEnabled) {
        setSelectedPeriod('manual');
      } else {
        setSelectedPeriod(preferences.period);
      }
      setMinimumAmount(preferences.minimumPayoutAmount);
      setAutomaticPayouts(preferences.autoPayoutEnabled);
      setPayoutDay(preferences.payoutDay || 1);
      setSuspendPayouts(preferences.suspendPayouts);
    }
  }, [preferences]);

  // Available periods for payout
  const availablePeriods = [
    { value: 'manual', label: 'Manual', description: 'Custom payout schedule (Manual payouts only)' },
    { value: 'monthly', label: 'Monthly', description: 'Once per month' },
    { value: 'biweekly', label: 'Bi-weekly', description: 'Every two weeks' },
    { value: 'weekly', label: 'Weekly', description: 'Once per week' },
    // { value: 'daily', label: 'Daily', description: 'Every business day' },
    // { value: 'instant', label: 'Instant', description: 'On-demand payouts' }
  ] as const;

  // Save preferences
  const handleSavePreferences = async () => {
    let periodToSend = selectedPeriod;
    let autoPayoutEnabledToSend = automaticPayouts;

    if (selectedPeriod === 'manual') {
      periodToSend = 'monthly'; // Default valid enum
      autoPayoutEnabledToSend = false;
    } else {
      // If valid schedule selected, ensure auto is enabled unless specifically unchecked (though we hide the checkbox if manual)
      // For MVP, selecting a schedule implies auto-payout
      autoPayoutEnabledToSend = true;
    }

    const updateData: ApiUpdatePayoutPreferencesRequest = {
      period: periodToSend as any,
      minimumPayoutAmount: minimumAmount,
      autoPayoutEnabled: autoPayoutEnabledToSend,
      payoutDay: payoutDay,
      suspendPayouts: suspendPayouts
    };

    await updatePreferences(updateData);
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading payout preferences...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payout Configuration */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Payout Settings
          </CardTitle>
          <CardDescription>
            Your current payout configuration
          </CardDescription>
        </CardHeader>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <CardContent className="space-y-6">
          {/* Payout Period */}
          <div className="space-y-3">
            <Label htmlFor="payout-period">Payment Schedule</Label>
            <Select
              value={selectedPeriod}
              onValueChange={(value) => setSelectedPeriod(value as typeof selectedPeriod)}
            >
              <SelectTrigger id="payout-period" className="w-full">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {availablePeriods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{period.label}</span>
                      <span className="text-xs text-gray-500 ml-4">
                        {period.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Settings Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Minimum Payout Amount */}
            <div className="space-y-3">
              <Label htmlFor="minimum-payout">Minimum Payout Amount</Label>
              <div className="flex">
                <span className="flex items-center border border-r-0 rounded-l-md px-3 bg-gray-50 text-gray-500">$</span>
                <Input
                  id="minimum-payout"
                  type="number"
                  value={minimumAmount}
                  onChange={(e) => setMinimumAmount(Number(e.target.value))}
                  className="rounded-l-none"
                  min={1}
                />
              </div>
              <p className="text-xs text-gray-500">
                Earnings below this amount will be held until the threshold is met
              </p>
            </div>

            {/* Payout Day */}
            {/* Payout Day - Only show if not manual */}
            {selectedPeriod !== 'manual' && (
              <div className="space-y-3">
                <Label htmlFor="payout-day">Payout Day</Label>
                <Select
                  value={payoutDay.toString()}
                  onValueChange={(value) => setPayoutDay(Number(value))}
                >
                  <SelectTrigger id="payout-day">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedPeriod === 'monthly' ? (
                      Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                        <SelectItem key={day} value={day.toString()}>
                          {day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} of month
                        </SelectItem>
                      ))
                    ) : selectedPeriod === 'weekly' || selectedPeriod === 'biweekly' ? (
                      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                        <SelectItem key={index + 1} value={(index + 1).toString()}>
                          {day}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="1">Day 1</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  {selectedPeriod === 'monthly' ? 'Day of the month for payouts' :
                    selectedPeriod === 'weekly' || selectedPeriod === 'biweekly' ? 'Day of the week for payouts' :
                      'Preferred day for payouts'}
                </p>
              </div>
            )}
          </div>

          {/* Additional Settings */}
          <div className="space-y-4">
            {/* Suspend Payouts */}
            <div className="flex items-center py-2">
              <input
                type="checkbox"
                id="suspend-payouts"
                checked={suspendPayouts}
                onChange={(e) => setSuspendPayouts(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500 focus:ring-2"
              />
              <div className="ml-4">
                <Label htmlFor="suspend-payouts" className="text-base font-medium cursor-pointer">
                  Suspend Payouts
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  Temporarily stop all automatic payouts
                </p>
              </div>
            </div>
          </div>

          {/* Automatic Payouts Checkbox */}
          {selectedPeriod !== 'manual' && (
            <div className="flex items-center py-4">
              <input
                type="checkbox"
                id="automatic-payouts"
                checked={automaticPayouts}
                onChange={(e) => setAutomaticPayouts(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
              />
              <div className="ml-4">
                <Label htmlFor="automatic-payouts" className="text-base font-medium cursor-pointer">
                  Automatic Payouts
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  Automatically transfer earnings based on your settings
                </p>
              </div>
            </div>
          )}


          {/* Save Button */}
          <div className="pt-4 border-t">
            <Button
              onClick={handleSavePreferences}
              disabled={isUpdating}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              )}
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperTeacherPayoutPreferences;