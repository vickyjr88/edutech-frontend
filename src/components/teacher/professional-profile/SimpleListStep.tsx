
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2 } from "lucide-react";

type FormItem = {
  id: string;
  value: string;
  details?: string;
};

type SimpleListStepProps = {
  items: FormItem[];
  setItems: React.Dispatch<React.SetStateAction<FormItem[]>>;
  label: string;
  placeholder: string;
};

const SimpleListStep = ({ items, setItems, label, placeholder }: SimpleListStepProps) => {
  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      value: "",
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, value } : item
    ));
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="flex items-center space-x-2">
          <Input 
            value={item.value}
            onChange={(e) => updateItem(item.id, e.target.value)}
            placeholder={`${placeholder} ${index + 1}`}
            className="flex-1"
          />
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => removeItem(item.id)}
            disabled={items.length === 1}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}
      
      <Button
        variant="outline"
        className="w-full"
        onClick={addItem}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Another {label}
      </Button>
    </div>
  );
};

export default SimpleListStep;
