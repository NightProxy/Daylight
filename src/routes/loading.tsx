import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import "../routes/loading.css";
import "../app/globals.css";
import "../index.css";

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