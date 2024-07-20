import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import "./routes/Onboarding.css";
import viteLogo from "/trace.svg";
import "./app/globals.css";
import "./index.css";
import { Button } from "@/components/ui/button";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Progress } from "@/components/ui/progress-5s";
import { Separator } from "@/components/ui/separator";
import { inject } from '@vercel/analytics';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ErrorPage() {
  const error = useRouteError();
  
  console.error(error);

  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = "Unknown error occurred";
  }

  return (
    <Card style={{textAlign: "left"}}>
      <CardHeader>
        <CardTitle>Whoops, an error has occurred</CardTitle>
        <CardDescription>{errorMessage}</CardDescription>
      </CardHeader>
      <CardContent>
        Exact error: {errorMessage}<br />
        This error may occur for a number of reasons, however it is most likely an error in the Horizon front-end itself.
        Report this to Horizon's devs, or the DTD team.
      </CardContent>
    </Card>
  );
}
