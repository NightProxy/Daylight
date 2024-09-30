import React from "react";
type Theme = "dark" | "light" | "system";
type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};
type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};
export declare function ThemeProvider({ children, defaultTheme, storageKey, ...props }: ThemeProviderProps): React.JSX.Element;
export declare const useTheme: () => ThemeProviderState;
export {};
