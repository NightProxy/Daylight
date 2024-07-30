//Go page
/* eslint-disable no-non-null-assertion */
//heyyy!!!
//go page
import { useEffect, Suspense, useState } from "react";
import Clock from "@/components/component/clock"
import "../routes/Go.css";
import { Button } from "@/components/ui/pill-button";
import "../app/globals.css";
import "../index.css";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";

import { Separator } from "@/components/ui/separator";

import React from "react";
import { Input } from "@/components/ui/input"

import 'animate.css'
import { Label } from "@/components/ui/label"


import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Navbar } from '@/components/component/navbar.tsx';
import "movement.css"
import $ from "jquery"
import { Search } from 'lucide-react';
import { motion, useIsPresent, useScroll, useSpring } from "framer-motion";

import { Link } from "react-router-dom";
import 'overlayscrollbars/overlayscrollbars.css';
import localForage from "localforage"
import { OverlayScrollbars } from 'overlayscrollbars';
import { useMediaQuery } from "@/hooks/use-media-query"

function Go() {
 




  return (


    <>
      <Suspense fallback={<div className="text-center justify-center items-center flex">Loading <h1>Loading <p className='horizon-outline'>Daylight</p> Systems Incorporated...</h1></div>}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          
         <iframe src="" id="landing">
          </iframe>
          /*
        
          */
          <iframe src="" id="main">
        </iframe>

        </ThemeProvider>
        <motion.div
          key="privacy-screen"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
          exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
          style={{ originX: 1 }}
          className="privacy-screen" />
      </Suspense >
    </>





  );
}

export default Go;


