
import { CheckCircle2, XCircle, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StrategyItem } from "../utils/strategyUtils";
import StepTable from "../shared/StepTable";
import {
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StrategiesTableProps {
  strategies: StrategyItem[];
  onEdit: (item: StrategyItem) => void;
  onDelete: (id: string) => void;
}

const StrategiesTable = ({ strategies, onEdit, onDelete }: StrategiesTableProps) => {
  return (
    <StepTable
      title="Your Teaching Strategies"
      items={strategies}
      columnHeaders={["Strategy", "Description", "Certified"]}
      renderRow={(item) => (
        <TableRow key={item._id}>
          <TableCell className="font-medium">{item.strategy}</TableCell>
          <TableCell>{item.description || "N/A"}</TableCell>
          <TableCell>
            {item.isCertified ? 
              <CheckCircle2 className="h-5 w-5 text-green-600" /> : 
              <XCircle className="h-5 w-5 text-gray-400" />
            }
          </TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(item)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(item._id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      )}
    />
  );
};

export default StrategiesTable;
