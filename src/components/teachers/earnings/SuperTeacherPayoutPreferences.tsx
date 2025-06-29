import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Crown, 
  Zap, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Target,
  Sparkles,
  Calendar,
  ArrowRight,
  Shield,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Lightbulb
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTeacherPayoutPreferences } from "@/hooks/useTeacherPayoutPreferences";
import { PAYOUT_FREQUENCIES } from "@/integrations/api";
import type { PayoutFrequency, UpdatePayoutPreferencesRequest } from "@/integrations/api";

const SuperTeacherPayoutPreferences = () => {
  const {
    preferences,
    recommendations,
    analytics,
    teacherTier,
    isLoading,
    isUpdating,
    isLoadingRecommendations,
    isRequestingPayout,
    error,
    updatePreferences,
    requestInstantPayout
  } = useTeacherPayoutPreferences();

  // Local state for form
  const [selectedFrequency, setSelectedFrequency] = useState<PayoutFrequency | null>(null);
  const [minimumAmount, setMinimumAmount] = useState(50);
  const [automaticPayouts, setAutomaticPayouts] = useState(true);
  const [taxWithholding, setTaxWithholding] = useState(0);
  const [savingsPercentage, setSavingsPercentage] = useState(0);

  // Update local state when preferences load
  useState(() => {
    if (preferences) {
      setSelectedFrequency(preferences.frequency);
      setMinimumAmount(preferences.minimumAmount);
      setAutomaticPayouts(preferences.automaticPayouts);
      setTaxWithholding(preferences.taxWithholdingPercentage || 0);
      setSavingsPercentage(preferences.savingsPercentage || 0);
    }
  });

  // Get available frequencies based on teacher tier
  const availableFrequencies = useMemo(() => {
    if (!teacherTier) return PAYOUT_FREQUENCIES.standard;
    return PAYOUT_FREQUENCIES[teacherTier.level] || PAYOUT_FREQUENCIES.standard;
  }, [teacherTier]);

  // Teacher tier badge component
  const TierBadge = () => {
    if (!teacherTier) return null;

    const tierConfig = {
      standard: { color: "bg-gray-100 text-gray-800", icon: Shield },
      advanced: { color: "bg-blue-100 text-blue-800", icon: TrendingUp },
      super: { color: "bg-purple-100 text-purple-800", icon: Crown },
      elite: { color: "bg-yellow-100 text-yellow-800", icon: Sparkles }
    };

    const config = tierConfig[teacherTier.level];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} px-3 py-1 text-sm font-semibold flex items-center gap-2`}>
        <Icon className="h-4 w-4" />
        {teacherTier.name}
      </Badge>
    );
  };

  // Save preferences
  const handleSavePreferences = async () => {
    if (!selectedFrequency) return;

    const updateData: UpdatePayoutPreferencesRequest = {
      frequency: selectedFrequency,
      minimumAmount,
      automaticPayouts,
      taxWithholdingPercentage: taxWithholding,
      savingsPercentage
    };

    await updatePreferences(updateData);
  };

  // Handle instant payout
  const handleInstantPayout = async () => {
    const result = await requestInstantPayout();
    if (result?.success) {
      // Show success message
    }
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
      {/* Teacher Tier & Status */}
      <Card className="shadow-sm border-2 border-purple-100 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-purple-600" />
                Payout Center
              </CardTitle>
              <CardDescription>
                Manage when you receive funds
              </CardDescription>
            </div>
            <TierBadge />
          </div>
        </CardHeader>
        
        {teacherTier?.level === 'super' && (
          <CardContent className="pt-0">
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-purple-200">
              <Zap className="h-8 w-8 text-yellow-500" />
              <div className="flex-1">
                <h3 className="font-semibold">Instant Payout Available</h3>
                <p className="text-sm text-gray-600">Get your earnings in minutes, not days</p>
              </div>
              <Button 
                onClick={handleInstantPayout}
                disabled={isRequestingPayout}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isRequestingPayout ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                Request Now
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <Card className="shadow-sm border-blue-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              AI Payout Recommendations
            </CardTitle>
            <CardDescription>
              Optimized suggestions based on your earning patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.slice(0, 2).map((rec, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-blue-700 border-blue-300">
                        {rec.frequency.description}
                      </Badge>
                      <Badge variant="outline" className={`
                        ${rec.riskLevel === 'low' ? 'text-green-700 border-green-300' : 
                          rec.riskLevel === 'medium' ? 'text-yellow-700 border-yellow-300' : 
                          'text-red-700 border-red-300'}
                      `}>
                        {rec.riskLevel} risk
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{rec.reasoning}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-600 font-medium">
                        Potential savings: ${rec.potentialSavings}
                      </span>
                      <span className="text-gray-500">
                        Confidence: {rec.confidence}%
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedFrequency(rec.frequency)}
                    className="ml-4"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Main Payout Preferences */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle>Payout Preferences</CardTitle>
          <CardDescription>
            Configure your advanced payout settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payout Frequency */}
          <div className="space-y-3">
            <Label htmlFor="payout-frequency">Payout Frequency</Label>
            <Select 
              value={selectedFrequency?.type || ""} 
              onValueChange={(value) => {
                const frequency = availableFrequencies.find(f => f.type === value);
                if (frequency) setSelectedFrequency(frequency);
              }}
            >
              <SelectTrigger id="payout-frequency" className="w-full">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {availableFrequencies.map((frequency) => (
                  <SelectItem key={frequency.type} value={frequency.type}>
                    <div className="flex items-center justify-between w-full">
                      <span>{frequency.description}</span>
                      <div className="flex items-center gap-2 ml-4">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {frequency.processingTime}
                        </span>
                        {frequency.minimumTierRequired && (
                          <Crown className="h-3 w-3 text-purple-500" />
                        )}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedFrequency && (
              <p className="text-xs text-gray-500">
                Processing time: {selectedFrequency.processingTime}
              </p>
            )}
          </div>

          {/* Minimum Payout Amount */}
          <div className="space-y-3">
            <Label htmlFor="minimum-payout">Minimum Payout Amount</Label>
            <div className="flex max-w-md">
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
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <Calendar className="h-4 w-4 inline mr-2" />
                Payout dates are automatically scheduled by our system for optimal processing times
              </p>
            </div>
          </div>

          {/* Super Teacher Features */}
          {teacherTier?.level === 'super' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="space-y-3">
                <Label htmlFor="tax-withholding">Tax Withholding %</Label>
                <div className="flex">
                  <Input
                    id="tax-withholding"
                    type="number"
                    value={taxWithholding}
                    onChange={(e) => setTaxWithholding(Number(e.target.value))}
                    className="rounded-r-none"
                    min={0}
                    max={50}
                  />
                  <span className="flex items-center border border-l-0 rounded-r-md px-3 bg-gray-50 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500">
                  Automatically hold percentage for taxes
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="savings-percentage">Auto-Save %</Label>
                <div className="flex">
                  <Input
                    id="savings-percentage"
                    type="number"
                    value={savingsPercentage}
                    onChange={(e) => setSavingsPercentage(Number(e.target.value))}
                    className="rounded-r-none"
                    min={0}
                    max={100}
                  />
                  <span className="flex items-center border border-l-0 rounded-r-md px-3 bg-gray-50 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500">
                  Automatically save percentage to savings account
                </p>
              </div>
            </div>
          )}

          {/* Automatic Payouts Checkbox */}
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

          {/* Analytics Preview */}
          {analytics && (
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Earning Insights
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Weekly Avg</p>
                  <p className="font-semibold">${analytics.averageEarningsPerWeek}</p>
                </div>
                <div>
                  <p className="text-gray-500">Monthly Avg</p>
                  <p className="font-semibold">${analytics.averageEarningsPerMonth}</p>
                </div>
                <div>
                  <p className="text-gray-500">Optimal Frequency</p>
                  <p className="font-semibold">{analytics.optimalFrequency.description}</p>
                </div>
                <div>
                  <p className="text-gray-500">Next Prediction</p>
                  <p className="font-semibold">
                    {analytics.cashFlowPrediction[0] ? 
                      `$${analytics.cashFlowPrediction[0].predictedEarnings}` : 
                      'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-4 border-t">
            <Button 
              onClick={handleSavePreferences}
              disabled={isUpdating || !selectedFrequency}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
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