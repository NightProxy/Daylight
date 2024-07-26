import { Toaster as Sonner } from "sonner";
import * as React from "react";
type ToasterProps = React.ComponentProps<typeof Sonner>;
declare const Toaster: ({ ...props }: ToasterProps) => React.JSX.Element;
export { Toaster };
