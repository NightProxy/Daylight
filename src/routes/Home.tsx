/* eslint-disable no-non-null-assertion */
import 'lucide-static/font/lucide.css';
import { useRef, useState, useEffect, lazy, Suspense } from "react";

import "../routes/Home.css";
import { Button } from "@/components/ui/pill-button";
import "../app/globals.css";
import "../index.css";
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Progress } from "@/components/ui/progress-5s";
import { Separator } from "@/components/ui/separator";
import { inject } from '@vercel/analytics';
import React from "react";
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageTransition } from '@steveeeie/react-page-transition';
import { useLocation } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import $ from 'jquery';

import 'animate.css'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
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
import { obfuscateJSON, deobfuscateJSON } from '../obf.ts';
import { Home as HomeIcon, Search } from 'lucide-react';
import { motion, useIsPresent, useScroll, useSpring } from "framer-motion";
import Loading from "./loading.tsx"
import { Link } from "react-router-dom";
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars } from 'overlayscrollbars';
// yes i use dotLottie for animations u have a problem lmao
function Home() {
  var themeee = document.documentElement.classList.contains("dark") ? "dark" : "light";
  const osInstance = OverlayScrollbars(document.body, {
    scrollbars: {
      theme: `os-theme-${themeee}`,
    }
    
});
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  }
  useEffect(() => {
    Array.from(document.getElementsByClassName('os-scrollbar') as HTMLCollectionOf<HTMLElement>).forEach(element => {
      element.style.transition = ''
      element.style.opacity = ""
      
  });
    const secondHand = document.querySelector('.clock-times__second') as HTMLDivElement;
    const minsHand = document.querySelector('.clock-times__minute') as HTMLDivElement;
    const hourHand = document.querySelector('.clock-times__hour') as HTMLDivElement;

    function setDate() {
      const now = new Date();

      const seconds = now.getSeconds();
      const secondsDegrees = 6 * seconds;
      if (secondHand) {
        if (secondsDegrees === 0) {
          secondHand.setAttribute("style", `transition: all 0s ease; transform: rotate(${secondsDegrees}deg)`);
        } else {
          secondHand.setAttribute("style", `transition: transform 0.3s ease; transform: rotate(${secondsDegrees}deg)`);
        }
      }

      const mins = now.getMinutes();
      const minsDegrees = 6 * mins;
      if (minsHand) {
        minsHand.style.transform = `rotate(${minsDegrees}deg)`;
      }

      const hour = now.getHours() % 12;
      const hourDegrees = 30 * hour + mins / 2;
      if (hourHand) {
        hourHand.style.transform = `rotate(${hourDegrees}deg)`;
      }
    }

    const intervalId = setInterval(setDate, 1000);
    setDate();

    return () => clearInterval(intervalId);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const isPresent = useIsPresent();

  // this code should be in every page, handles favicon changing!
  const { setTheme } = useTheme()
  const { theme } = useTheme();
  const icon = document.getElementById("favicon")
  function setInitialColor() {
    const themeClass = document.documentElement.classList.contains("dark") ? "dark" : "light";
    
    
  
    
    const box = document.getElementById("searchBox")
    var themeEl = document.getElementById(themeClass as string)
    if (themeClass == "dark"){
      var themeOpp = document.getElementById("light")
      osInstance.options({ scrollbars: { theme: `os-theme-light` }  });
    } else {
      var themeOpp = document.getElementById("dark")
      osInstance.options({ scrollbars: { theme: `os-theme-dark` }  });
    }
    if (themeEl?.classList.contains("opacity-0")){
      themeOpp?.classList.add("opacity-0")
      themeEl.classList.remove("opacity-0")
    }



    Array.from(document.getElementsByClassName('bgImage') as HTMLCollectionOf<HTMLElement>).forEach(element => {
      element.style.backgroundImage = `url(/img/bg/bg${themeClass.charAt(0).toUpperCase() + themeClass.slice(1)}.png)`;
      element.style.backgroundPosition = 'center center';
      element.style.backgroundSize = 'cover';
      element.style.backgroundRepeat = 'no-repeat';
      element.style.backgroundAttachment = 'fixed';
      element.style.height = '100%';
    });
    document.body.style.backgroundImage = `url(/img/bg/bg${themeClass.charAt(0).toUpperCase() + themeClass.slice(1)}.png)`;
    document.body.style.backgroundPosition = 'center center';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.height = '100%';
    icon?.setAttribute("href", `/img/favicon_${themeClass}.png`);
  }
  useEffect(() => {


    setInitialColor();

    const classObserver = new MutationObserver(handleClassAttributeChanges);

    const observerOptions = {
      attributes: true,
      attributeFilter: ["class"],
      subtree: false,
    };

    classObserver.observe(document.documentElement, observerOptions);

    return () => {
      classObserver.disconnect();
    };
  }, [theme]);

  function handleClassAttributeChanges(
    mutationsList,
    observer,
  ) {
    for (const mutation of mutationsList || []) {
      if (mutation.type === "attributes" && mutation.attributeName === "class") {
        setInitialColor();
      }
    }
  }
  useEffect(() => {
    //any code that you want to happen AFTER DOM loads, should go in this useEffect
    $("#home").on("click", function () {

      var elements = {
        home: document.getElementById("home"),
        addons: document.getElementById("addons"),
        favorites: document.getElementById("favorites"),
        settings: document.getElementById("settings")
      }


      for (let key in elements) {
        elements[key].removeAttribute("data-focus")
      }
      elements["home"]?.setAttribute("data-focus", "true")
      document.getElementById("redirectHome")?.click()


    });
    $("#addons").on("click", function () {

      var elements = {
        home: document.getElementById("home"),
        addons: document.getElementById("addons"),
        favorites: document.getElementById("favorites"),
        settings: document.getElementById("settings")
      }


      for (let key in elements) {
        elements[key].removeAttribute("data-focus")
      }
      elements["addons"]?.setAttribute("data-focus", "true")
      document.getElementById("redirectAddons")?.click()
      for (let key in elements) {
        elements[key].setAttribute("disabled", "true")
      }

    });
    $("#favorites").on("click", function () {

      var elements = {
        home: document.getElementById("home"),
        addons: document.getElementById("addons"),
        favorites: document.getElementById("favorites"),
        settings: document.getElementById("settings")
      }


      for (let key in elements) {
        elements[key].removeAttribute("data-focus")
      }
      elements["favorites"]?.setAttribute("data-focus", "true")
      document.getElementById("redirectFav")?.click()
      for (let key in elements) {
        elements[key].setAttribute("disabled", "true")
      }
    });
    $("#settings").on("click", function () {

      var elements = {
        home: document.getElementById("home"),
        addons: document.getElementById("addons"),
        favorites: document.getElementById("favorites"),
        settings: document.getElementById("settings")
      }


      for (let key in elements) {
        elements[key].removeAttribute("data-focus")
      }
      elements["settings"]?.setAttribute("data-focus", "true")
      document.getElementById("redirectSettings")?.click()
      for (let key in elements) {
        elements[key].setAttribute("disabled", "true")
      }

    });

  }, [])









  return (


    <><Suspense fallback={<Loading></Loading>}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div id="light" style={{  backgroundImage: 'url("/img/bg/bgLight.png")',
  backgroundPosition: 'center center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  height: '100%',
  width: '100%',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 0,}}>

      </div>
      <div id="dark" style={{  backgroundImage: 'url("/img/bg/bgDark.png")',
  backgroundPosition: 'center center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  height: '100%',
  width: '100%',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 0,}} className="opacity-0">

      </div>
        <div>
          <ModeToggle></ModeToggle>
          <Link style={{ left: "0", top: "0" }} className={"opacity-0"} id="redirectHome" to="/"></Link>
          <Link style={{ left: "0", top: "0" }} className={"opacity-0"} id="redirectFav" to="/favorites"></Link>
          <Link style={{ left: "0", top: "0" }} className={"opacity-0"} id="redirectAddons" to="/addons"></Link>
          <Link style={{ left: "0", top: "0" }} className={"opacity-0"} id="redirectSettings" to="/settings"></Link>
        </div>
        <Navbar home="true"></Navbar>
        <div className="container3 relative">
          <div className="text-container">
            <h1 className="horizon-outline">Daylight</h1>

          </div>
          <div className="search-container">
            <div className="flex items-center rounded-full border bg-background shadow-sm" id="searchBox" style={{ background: "hsl(var(--background) / 0.4)" }}>
              <div className="flex items-center">
                <TooltipProvider >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        style={{ height: "40px", borderBottomRightRadius: "10px", borderTopRightRadius: "10px" }}
                        className="rounded-full hover:bg-muted"
                      >
                        <Search className="h-5 w-5 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-background">
                      <p id="tooltipTextSearch">Search on Google</p>
                    </TooltipContent>
                  </Tooltip>

                </TooltipProvider>

                <Separator orientation="vertical" style={{ height: "40px" }} />
              </div>
              <Input
                type="search"
                placeholder="Search..."
                className="flex-1 border-none bg-transparent text-sm focus:outline-none"
                style={{ height: "32px", borderTopRightRadius: "999px", borderBottomRightRadius: "999px", transition: "all 0.2s ease" }} />
            </div>
            <div className="text-container" style={{ background: "transparent", opacity: "0" }}>
            <h5 className="horizon">The minimalistic browser</h5>
            </div>
          </div>
          <br></br>

          <div className="text-container" style={{ background: "transparent" }}>
            <h5 className="horizon" style={{paddingRight: "10px", paddingLeft: "10px", borderRadius: "999px", backdropFilter: "blur(10px)"}}>The minimalistic browser</h5>
          </div>


        </div>
        


      <div className="wrapper">
        <div className="clock-container">
          <div className="clock">
            <div className="clock-circles">
              <div className="clock-circles__item"></div>
              <div className="clock-circles__item"></div>
              <div className="clock-circles__item"></div>
              <div className="clock-circles__item"></div>
            </div>
            <div className="clock-indicators">
              <div className="clock-indicators__item"></div>
              <div className="clock-indicators__item"></div>
              <div className="clock-indicators__item"></div>
              <div className="clock-indicators__item"></div>
              <div className="clock-indicators__item"></div>
              <div className="clock-indicators__item"></div>
              <div className="clock-indicators__item"></div>
              <div className="clock-indicators__item"></div>
              <div className="clock-indicators__item"></div>
              <div className="clock-indicators__item"></div>
              <div className="clock-indicators__item"></div>
              <div className="clock-indicators__item"></div>
              <div className="clock-indicators__item"></div>
            </div>
            <div className="clock-times">
              <div className="clock-times__second"></div>
              <div className="clock-times__minute"></div>
              <div className="clock-times__hour"></div>
            </div>
          </div>
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

export default Home;


