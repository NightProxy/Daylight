import { useRef, useState, useEffect } from "react";
import "./Settings.css";
import { Button } from "@/components/ui/button";
import "../app/globals.css";
import "../index.css";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Progress } from "@/components/ui/progress-5s";
import { Separator } from "@/components/ui/separator";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { Navbar } from "@/components/component/navbar"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { motion, useIsPresent, useSpring, useScroll } from "framer-motion";
import $ from "jquery"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import 'overlayscrollbars/overlayscrollbars.css';
import {
    OverlayScrollbars,
    ScrollbarsHidingPlugin,
    SizeObserverPlugin,
    ClickScrollPlugin
} from 'overlayscrollbars';
import { ImageUp, Save } from "lucide-react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion-custom"
import { Combobox, ComboboxRef } from "@/components/ui/combobox"

import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { SiCanvas, SiGoogleclassroom, SiGoogledocs, SiGoogleslides } from "react-icons/si";
import { TbWorld } from "react-icons/tb";
import Schoology from "@/components/Icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import localForage from "localforage";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useMediaQuery } from "@/hooks/use-media-query"
export default function Landing({documentClassList}){
    useEffect(() => {
        document.documentElement.setAttribute("class", documentClassList)
    }, [])
    return(
        <>
        <div style={{top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", position: "fixed"}}>
        <h1 className="horizon-outline">Daylight</h1>
        <h3 style={{fontSize: "medium"}} className="horizon">The minimalistic browser</h3>
        <h5 id="theYapParent">How to use Daylight:
            <p id="theYap">There currently are no tabs feature due to a lack of time.
            You can access the sidebar, inspired by the Arc browser, to bring up browser controls and the URL bar.
            If you are not currently on a site, the sidebar will not disappear.
            However, if you currently are on a site, the sidebar will slide out, allowing you to view the full site.
            To bring it back, simply hover your mouse over to the very left of the screen for a small amount of time. This will then bring up the sidebar.
            This project only had 2 weeks of making time</p>
        </h5>

        </div>
        </>
    )
}