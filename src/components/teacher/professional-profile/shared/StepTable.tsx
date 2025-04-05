
import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

interface StepTableProps<T> {
  title: string;
  items: T[];
  columnHeaders: string[];
  renderRow: (item: T) => ReactNode;
}

function StepTable<T>({ title, items, columnHeaders, renderRow }: StepTableProps<T>) {
  if (items.length === 0) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4">{title}</h3>
        <Table>
          <TableHeader>
            <TableRow>
              {columnHeaders.map((header, index) => (
                <TableHead key={index}>{header}</TableHead>
              ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => renderRow(item))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default StepTable;
