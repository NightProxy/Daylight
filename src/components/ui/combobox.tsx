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

/*const list = [
  /{
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];
*/

export function Combobox({list, placeHolderPlural, placeHolder, defaultValue, triggerID = ""}) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("")
    React.useEffect(() => {
        setValue(defaultValue);
      }, [defaultValue]);
    function e(){
      //pass
    }



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
            :`Select ${placeHolder}...`}
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
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
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
