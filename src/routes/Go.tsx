//Go page
/* eslint-disable no-non-null-assertion */
//heyyy!!!
//go page
import { useEffect, Suspense, useState } from "react";
import Clock from "@/components/component/clock"
import "../routes/Go.css";
import { Button } from "@/components/ui/button";
import "../app/globals.css";
import "../index.css";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import Landing from "./Landing"
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
import { ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';
function Go() {
  const isDesktop = useMediaQuery("(min-width: 768px)")
 


  useEffect(() => {
    if (!isDesktop){
      document.querySelector(".sidebar")?.remove()

    }
    (document.getElementById("main") as HTMLIFrameElement)?.contentWindow?.document.documentElement.setAttribute("class", localStorage.getItem("documentClassList") as string)
    document.documentElement.setAttribute("class", localStorage.getItem("documentClassList") as string)
    if (window.innerWidth >= 1024){
      document.getElementById("titleg")!.textContent = "DYLT"
    } else {
      document.getElementById("titleg")!.textContent = 'DYL'
        }
  }, [])
  $(window).on("resize", function(){
    if (window.innerWidth >= 1024){
      if (document.getElementById("titleg")){
        document.getElementById("titleg")!.textContent = "DYLT"
      }
      
    } else {
      if (document.getElementById("titleg")){
        document.getElementById("titleg")!.textContent = 'DYL'
      }
      
        }
  })
  //this is prob the page that uses the most less components from Radix
  return (


    <>
    
      <Suspense fallback={<div className="text-center justify-center items-center flex">Loading <h1>Loading <p className='horizon-outline'>Daylight</p> Systems Incorporated...</h1></div>}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          
          <div className="topbar">

          </div>
          
          <div className="sidebar">
            <br />
            <div style={{alignItems: "right", justifyContent: "right", display: "flex", marginBottom: "5px"}}>
            <h5 id="titleg" style={{position: "relative", top: "3px", textAlign: "center", width: "100%"}} className="horizon">dyl</h5>
            <Button variant='ghost' style={{ padding: "0", width: "30px", height: "30px", marginRight: "5px", marginLeft: "3px"}}><ArrowLeft scale = "1" /></Button>
            <Button variant='ghost' style={{ padding: "0", width: "30px", height: "30px", marginRight: "5px"}}><ArrowRight scale = "1" /></Button>
            <Button variant='ghost' style={{ padding: "0", width: "30px", height: "30px", marginRight: "5px"}}><RotateCw size="20" /></Button>
            </div>
            
          <Input style={{width: '15vw', marginLeft: "1vw", borderRadius: "8px"}} placeholder="Search the web"></Input>
          <br />
          <Separator orientation="horizontal" style={{width: "calc(100% - 5%)", marginLeft: "2.5%"}}></Separator>
          <br />
          <Button variant="ghost" style={{width: "15vw"}}>How To | Daylight</Button>
          </div>
          <div className="parent">
          <iframe src="/landing" id="main">

          </iframe>
          <div className="mobileBar">
          <Input style={{width: '15vw', marginLeft: "1vw", borderRadius: "8px"}} placeholder="Search the web"></Input>
          </div>
          </div>
          
        

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


