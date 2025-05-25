
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import { CreditCard } from "lucide-react";

const ParentsBilling = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />
      
      <div className="flex-1 flex flex-col">
        <ParentDashboardHeader parentName="Kate Johnson" />
        
        <main className="p-6 flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="h-6 w-6 text-kidato-purple" />
              <h1 className="text-2xl font-bold">Billing</h1>
            </div>
            
            {/* Billing content will go here */}
            <div className="grid gap-6">
              {/* Add your billing components here */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ParentsBilling;
