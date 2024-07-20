import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import "../routes/loading.css";
import viteLogo from "/trace.svg";
import "../app/globals.css";
import "../index.css";
import { Button } from "@/components/ui/button";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Progress } from "@/components/ui/progress-5s";
import { Separator } from "@/components/ui/separator";
import { inject } from '@vercel/analytics';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
export default function Loading(){
    return(
        <>
        <Card>
       
    
            <CardTitle>
                Loading..
            </CardTitle>
            <CardDescription>
                This won't take long.
            </CardDescription>
            <CardContent>
            <div className="loader"></div>
            </CardContent>
    
        </Card>
        </>
    )
   
}