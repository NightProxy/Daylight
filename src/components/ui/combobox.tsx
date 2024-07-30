import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define the interface for the Combobox props
interface ComboboxProps {
  list: { value: string; label: string }[];
  placeHolderPlural: string;
  placeHolder: string;
  defaultValue: string | null;
  triggerID?: string;
  onValueChange?: (value: string) => void;
}

// Define the interface for the custom ref
export interface ComboboxRef {
  setValue: (value: string) => void;
}

export const Combobox = React.forwardRef<ComboboxRef, ComboboxProps>(
  ({ list, placeHolderPlural, placeHolder, defaultValue, triggerID = "", onValueChange }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(defaultValue);

    const handleSelect = (currentValue: string) => {
      const newValue = currentValue === value ? "" : currentValue;
      setValue(newValue);
      setOpen(false);
      if (onValueChange) {
        onValueChange(newValue);
      }
    };

    React.useImperativeHandle(ref, () => ({
      setValue: (newValue: string) => {
        setValue(newValue);
        if (onValueChange) {
          onValueChange(newValue);
        }
      },
    }));

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="transition-all justify-between"
            id={triggerID}
          >
            {value
              ? list.find((entry) => entry.value === value)?.label
              : `Select ${placeHolder}...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="transition-all p-0">
          <Command>
            <CommandInput placeholder={`Search ${placeHolderPlural}...`} />
            <CommandEmpty>No {placeHolder} found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {list.map((entry) => (
                  <CommandItem
                    key={entry.value}
                    value={entry.value}
                    onSelect={() => handleSelect(entry.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === entry.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {entry.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);
