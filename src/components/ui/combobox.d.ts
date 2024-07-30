import * as React from "react";
interface ComboboxProps {
    list: {
        value: string;
        label: string;
    }[];
    placeHolderPlural: string;
    placeHolder: string;
    defaultValue: string | null;
    triggerID?: string;
    onValueChange?: (value: string) => void;
}
export interface ComboboxRef {
    setValue: (value: string) => void;
}
export declare const Combobox: React.ForwardRefExoticComponent<ComboboxProps & React.RefAttributes<ComboboxRef>>;
export {};
