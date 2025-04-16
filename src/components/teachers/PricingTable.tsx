
import { CheckCircle2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CheckMark = () => <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />;
const Dash = () => <span className="block text-center text-gray-400">-</span>;

const PricingTable = () => {
  return (
    <div className="w-full overflow-auto">
      <h2 className="text-3xl font-bold text-center mb-10">Feature Comparison</h2>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-800 text-white">
            <TableHead className="w-1/5 py-4">Features</TableHead>
            <TableHead className="w-1/5 text-center py-4">Free</TableHead>
            <TableHead className="w-1/5 text-center py-4">Pro</TableHead>
            <TableHead className="w-1/5 text-center py-4">Tuition Center</TableHead>
            <TableHead className="w-1/5 text-center py-4">B2B</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Core Features Section */}
          <TableRow className="bg-gray-100">
            <TableCell colSpan={5} className="font-medium py-3">Core Features</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Student Capacity</TableCell>
            <TableCell className="text-center">5 students</TableCell>
            <TableCell className="text-center">Unlimited</TableCell>
            <TableCell className="text-center">Unlimited</TableCell>
            <TableCell className="text-center">Unlimited</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Teacher Accounts</TableCell>
            <TableCell className="text-center">1</TableCell>
            <TableCell className="text-center">1</TableCell>
            <TableCell className="text-center">3+</TableCell>
            <TableCell className="text-center">Custom</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Course Materials</TableCell>
            <TableCell className="text-center">Basic</TableCell>
            <TableCell className="text-center">Premium</TableCell>
            <TableCell className="text-center">Premium</TableCell>
            <TableCell className="text-center">Premium + Custom</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Analytics</TableCell>
            <TableCell className="text-center">Basic</TableCell>
            <TableCell className="text-center">Advanced</TableCell>
            <TableCell className="text-center">Advanced</TableCell>
            <TableCell className="text-center">Enterprise</TableCell>
          </TableRow>

          {/* Administrative Tools Section */}
          <TableRow className="bg-gray-100">
            <TableCell colSpan={5} className="font-medium py-3">Administrative Tools</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Scheduling</TableCell>
            <TableCell className="text-center"><CheckMark /></TableCell>
            <TableCell className="text-center"><CheckMark /></TableCell>
            <TableCell className="text-center"><CheckMark /></TableCell>
            <TableCell className="text-center"><CheckMark /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Payment Processing</TableCell>
            <TableCell className="text-center"><CheckMark /></TableCell>
            <TableCell className="text-center"><CheckMark /></TableCell>
            <TableCell className="text-center"><CheckMark /></TableCell>
            <TableCell className="text-center"><CheckMark /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Teacher Management</TableCell>
            <TableCell className="text-center"><Dash /></TableCell>
            <TableCell className="text-center"><Dash /></TableCell>
            <TableCell className="text-center"><CheckMark /></TableCell>
            <TableCell className="text-center"><CheckMark /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Admin Dashboard</TableCell>
            <TableCell className="text-center"><Dash /></TableCell>
            <TableCell className="text-center"><Dash /></TableCell>
            <TableCell className="text-center"><CheckMark /></TableCell>
            <TableCell className="text-center"><CheckMark /></TableCell>
          </TableRow>

          {/* Customization & Support Section */}
          <TableRow className="bg-gray-100">
            <TableCell colSpan={5} className="font-medium py-3">Customization & Support</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Custom Branding</TableCell>
            <TableCell className="text-center"><Dash /></TableCell>
            <TableCell className="text-center"><CheckMark /></TableCell>
            <TableCell className="text-center"><CheckMark /></TableCell>
            <TableCell className="text-center"><CheckMark /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>API Access</TableCell>
            <TableCell className="text-center"><Dash /></TableCell>
            <TableCell className="text-center"><Dash /></TableCell>
            <TableCell className="text-center"><CheckMark /></TableCell>
            <TableCell className="text-center"><CheckMark /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>White-labeling</TableCell>
            <TableCell className="text-center"><Dash /></TableCell>
            <TableCell className="text-center"><Dash /></TableCell>
            <TableCell className="text-center"><Dash /></TableCell>
            <TableCell className="text-center"><CheckMark /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Support</TableCell>
            <TableCell className="text-center">Email</TableCell>
            <TableCell className="text-center">Email, Chat</TableCell>
            <TableCell className="text-center">Priority</TableCell>
            <TableCell className="text-center">Dedicated</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Revenue Share</TableCell>
            <TableCell className="text-center">30%</TableCell>
            <TableCell className="text-center">15%</TableCell>
            <TableCell className="text-center">10%</TableCell>
            <TableCell className="text-center">Custom</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default PricingTable;
