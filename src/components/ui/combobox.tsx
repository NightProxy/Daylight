"use client"

import * as React from "react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [selectedStatus, setSelectedStatus] = React.useState(defaultValue);

    React.useEffect(() => {
      setSelectedStatus(defaultValue);
    }, [defaultValue]);

    const handleSelect = (currentValue: string) => {
      const newValue = currentValue === selectedStatus ? "" : currentValue;
      setSelectedStatus(newValue);
      setOpen(false);
      if (onValueChange) {
        onValueChange(newValue);
      }
    };

    React.useImperativeHandle(ref, () => ({
      setValue: (newValue: string) => {
        setSelectedStatus(newValue);
        if (onValueChange) {
          onValueChange(newValue);
        }
      },
    }));

    if (isDesktop) {
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
              {selectedStatus
                ? list.find((entry) => entry.value === selectedStatus)?.label
                : `Select ${placeHolder}...`}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0 transition-all" align="start">
            <StatusList
              list={list}
              setOpen={setOpen}
              setSelectedStatus={handleSelect}
              placeHolderPlural={placeHolderPlural}
              selectedStatus={selectedStatus as string}
            />
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[150px] justify-start"
            id={triggerID}
          >
            {selectedStatus
              ? list.find((entry) => entry.value === selectedStatus)?.label
              : `Select ${placeHolder}...`}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <StatusList
              list={list}
              setOpen={setOpen}
              setSelectedStatus={handleSelect}
              placeHolderPlural={placeHolderPlural}
              selectedStatus={selectedStatus as string}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
);

Combobox.displayName = 'Combobox';

function StatusList({
  list,
  setOpen,
  setSelectedStatus,
  placeHolderPlural,
  selectedStatus,
}: {
  list: { value: string; label: string }[];
  setOpen: (open: boolean) => void;
  setSelectedStatus: (status: string) => void;
  placeHolderPlural: string;
  selectedStatus: string;
}) {
  return (
    <Command>
      <CommandInput placeholder={`Search ${placeHolderPlural}...`} />
      <CommandList>
        <CommandEmpty>No {placeHolderPlural} found.</CommandEmpty>
        <CommandGroup>
          {list.map((entry) => (
            <CommandItem
              key={entry.value}
              value={entry.value}
              onSelect={() => {
                setSelectedStatus(entry.value);
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selectedStatus === entry.value ? "opacity-100" : "opacity-0"
                )}
              />
              {entry.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
