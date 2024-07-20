import { Moon, Sun } from "lucide-react"
import React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from "@/components/ui/tooltip"
export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <>
    <DropdownMenu>

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" style={{ borderRadius: "100%" }} className="modetoggle" size="icon">
          <Sun className="absolute h-[2rem] w-[2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[2rem] w-[2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
    </TooltipTrigger>
    <TooltipContent>
      Change color scheme
    </TooltipContent>
  </Tooltip>
</TooltipProvider>


<DropdownMenuContent style={{ borderRadius: "10%" }} align="end">
  <DropdownMenuItem style={{ borderRadius: "6px" }} onClick={() => setTheme("light")}>
    Light
  </DropdownMenuItem>
  <DropdownMenuItem style={{ borderRadius: "6px" }} onClick={() => setTheme("dark")}>
    Dark
  </DropdownMenuItem>
  <DropdownMenuItem style={{ borderRadius: "6px" }} onClick={() => setTheme("system")}>
    System
  </DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
    </>
    
  )
}
