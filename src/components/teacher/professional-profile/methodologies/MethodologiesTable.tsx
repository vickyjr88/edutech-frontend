
import { CheckCircle2, XCircle, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MethodologyItem } from "../utils/methodologyUtils";
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

interface MethodologiesTableProps {
  methodologies: MethodologyItem[];
  onEdit: (item: MethodologyItem) => void;
  onDelete: (id: string) => void;
}

const MethodologiesTable = ({ methodologies, onEdit, onDelete }: MethodologiesTableProps) => {
  return (
    <StepTable
      title="Your Teaching Methodologies"
      items={methodologies}
      columnHeaders={["Methodology", "Description", "Certified"]}
      renderRow={(item) => (
        <TableRow key={item.id}>
          <TableCell className="font-medium">{item.methodology}</TableCell>
          <TableCell>{item.description || "N/A"}</TableCell>
          <TableCell>
            {item.is_certified ? 
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
                <DropdownMenuItem onClick={() => onDelete(item.id)}>
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

export default MethodologiesTable;
