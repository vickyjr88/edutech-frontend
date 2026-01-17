import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface Option {
    value: string;
    label: string;
    group?: string;
}

interface MultiSelectAutocompleteProps {
    options: Option[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    emptyMessage?: string;
    className?: string;
}

export function MultiSelectAutocomplete({
    options,
    selectedValues,
    onChange,
    placeholder = "Select options...",
    emptyMessage = "No results found.",
    className,
}: MultiSelectAutocompleteProps) {
    const [open, setOpen] = React.useState(false);

    const selectedOptions = selectedValues
        .map((val) => {
            // Try to find in options first
            const opt = options.find((opt) => opt.value === val);
            if (opt) return opt;
            // If not found in options (maybe loading or legacy value), return a placeholder
            return { value: val, label: val };
        });

    const handleSelect = (value: string) => {
        if (selectedValues.includes(value)) {
            onChange(selectedValues.filter((v) => v !== value));
        } else {
            onChange([...selectedValues, value]);
        }
    };

    const handleRemove = (value: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(selectedValues.filter((v) => v !== value));
    };

    // Group options if they have a group property
    const groupedOptions = React.useMemo(() => {
        const groups: Record<string, Option[]> = {};
        const ungrouped: Option[] = [];

        options.forEach((opt) => {
            // Avoid duplicate options if key is not unique or if already selected??? 
            // No, standard display is fine.

            if (opt.group) {
                if (!groups[opt.group]) groups[opt.group] = [];
                groups[opt.group].push(opt);
            } else {
                ungrouped.push(opt);
            }
        });

        // Sort groups alphabetically
        const sortedGroupKeys = Object.keys(groups).sort();

        // Create new object with sorted keys
        const sortedGroups: Record<string, Option[]> = {};
        sortedGroupKeys.forEach(key => {
            sortedGroups[key] = groups[key];
        });

        return { groups: sortedGroups, ungrouped };
    }, [options]);

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between min-h-[42px] h-auto p-2"
                    >
                        <div className="flex flex-wrap gap-1 items-center">
                            {selectedOptions.length > 0 ? (
                                selectedOptions.map((option) => (
                                    <Badge
                                        key={option.value}
                                        variant="secondary"
                                        className="mr-1"
                                    >
                                        {option.label}
                                        <div
                                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer text-muted-foreground hover:text-foreground"
                                            onClick={(e) => handleRemove(option.value, e)}
                                        >
                                            <X className="h-3 w-3" />
                                        </div>
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-muted-foreground ml-1 font-normal">{placeholder}</span>
                            )}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                        <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
                        <CommandList className="max-h-[300px] overflow-y-auto">
                            <CommandEmpty>{emptyMessage}</CommandEmpty>

                            {groupedOptions.ungrouped.length > 0 && (
                                <CommandGroup>
                                    {groupedOptions.ungrouped.map((option) => (
                                        <CommandItem
                                            key={option.value}
                                            value={option.label}
                                            onSelect={() => handleSelect(option.value)}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedValues.includes(option.value)
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            {option.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}

                            {Object.entries(groupedOptions.groups).map(([groupName, groupOptions], index) => (
                                <React.Fragment key={groupName}>
                                    {(index > 0 || groupedOptions.ungrouped.length > 0) && <CommandSeparator />}
                                    <CommandGroup heading={groupName.charAt(0).toUpperCase() + groupName.slice(1)}>
                                        {groupOptions.map((option) => (
                                            <CommandItem
                                                key={option.value}
                                                value={option.label}
                                                onSelect={() => handleSelect(option.value)}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedValues.includes(option.value)
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {option.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </React.Fragment>
                            ))}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
