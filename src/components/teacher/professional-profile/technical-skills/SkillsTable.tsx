
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TechnicalSkillItem } from "../utils/technicalSkillUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface SkillsTableProps {
  skills: TechnicalSkillItem[];
  onEdit: (skill: TechnicalSkillItem) => void;
  onDelete: (skillId: string, skillName: string) => void;
}

const SkillsTable = ({ skills, onEdit, onDelete }: SkillsTableProps) => {
  if (skills.length === 0) return null;

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Skill</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Certified</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skills.map(skill => (
            <TableRow key={skill._id}>
              <TableCell className="font-medium">{skill.name}</TableCell>
              <TableCell>{skill.description || "-"}</TableCell>
              <TableCell>{skill.isCertified ? "Yes" : "No"}</TableCell>
              <TableCell className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => onEdit(skill)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => onDelete(skill._id, skill.name)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SkillsTable;
