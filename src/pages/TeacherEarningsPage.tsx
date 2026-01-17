import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EarningsSummary from "@/components/teachers/earnings/EarningsSummary";
import EarningsHistory from "@/components/teachers/earnings/EarningsHistory";
import PaymentMethods from "@/components/teachers/earnings/PaymentMethods";
import EarningsInsights from "@/components/teachers/earnings/EarningsInsights";
import { ArrowLeft, DollarSign, CreditCard, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TeacherEarningsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="mr-4"
            onClick={() => navigate("/teacher-dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">My Earnings</h1>
        </div>

        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-8 w-full justify-start">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Transaction History
            </TabsTrigger>
            <TabsTrigger value="payment-methods" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Methods
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Earnings Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <EarningsSummary />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <EarningsHistory />
          </TabsContent>

          <TabsContent value="payment-methods" className="space-y-6">
            <PaymentMethods />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <EarningsInsights />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherEarningsPage;