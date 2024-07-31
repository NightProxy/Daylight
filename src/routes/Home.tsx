/* eslint-disable no-non-null-assertion */
//heyyy!!!

import 'lucide-static/font/lucide.css';
import { useEffect, Suspense, useState } from "react";
import Clock from "@/components/component/clock"
import "../routes/Home.css";
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
import { searchProxy, setTransports } from "../lib/utils"

function Home() {
  
  useEffect(() => {
    
    searchProxy()

  }, [])

  const searchChangeFr = () => {
    //uhh so basically, it will just change the tooltip text to say "Travel to website" 
    //if its a valid url
    //it will also change the icon from a search to a globe
    //no like search term or url
    //like users can search stuff up on google just by putting it in the thing
    //LOOK IN THE PLACEHOLDER "Search google or t"
    console.log("changed, input")

    var input = document.getElementById("uv-address") as HTMLInputElement
    if (isValidUrl(input)) {
      document.getElementById("tooltipTextSearch")!.textContent = "Travel to website"
    }
    //yes its al
    

  }
  const isDesktop = useMediaQuery("(min-width: 768px)")



  var themeee = document.documentElement.classList.contains("dark") ? "dark" : "light";
  const osInstance = OverlayScrollbars(document.body, {
    scrollbars: {
      theme: `os-theme-${themeee}`,
    }

  });
  useEffect(() => {
    if (isDesktop && localStorage.getItem('appearanceMode') == "true") {
      const light = document.createElement('div');
      light.id = 'light';
      Object.assign(light.style, {
        backgroundImage: 'url("/img/bg/bgLight.png")',
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
        zIndex: 0,
      });
      const dark = document.createElement('div');
      dark.id = 'dark';
      Object.assign(dark.style, {
        backgroundImage: 'url("/img/bg/bgDark.png")',
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
        zIndex: 0,
        opacity: '0',
      });

      if (!document.documentElement.classList.contains("light")) {
        light.classList.add("opacity-0")
        dark.classList.remove("opacity-0")
      }


      if (!document.documentElement.classList.contains("dark")) {
        dark.classList.add("opacity-0")
        light.classList.remove("opacity-0")
      }

      const themeClass = document.documentElement.classList.contains("dark") ? "dark" : "light";
      const modetlink = document.getElementById("bgs");
      if (modetlink) {
        modetlink?.appendChild(light);
        modetlink?.appendChild(dark);
        setInitialColor()
      }

      document.body.style.backgroundImage = `url(/img/bg/bg${themeClass.charAt(0).toUpperCase() + themeClass.slice(1)}.png)`;
      document.body.style.backgroundPosition = 'center center';
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.height = '100%';
      return () => {
        if (document.getElementById("light") && document.getElementById("dark")) {
          modetlink?.removeChild(light);
          modetlink?.removeChild(dark);
        }

      };
    } else {
      if (document.getElementById("light") && document.getElementById("dark")) {
        const modetlink = document.getElementById("bgs");
        modetlink?.removeChild(document.getElementById("light") as HTMLDivElement)
        modetlink?.removeChild(document.getElementById("dark") as HTMLDivElement)
      }
    }
  }, [isDesktop]);
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  }


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
  async function setInitialColor() {
    if (document.getElementById("light") && document.getElementById("dark")) {
      const themeClass = document.documentElement.classList.contains("dark") ? "dark" : "light";


      const box = document.getElementById("searchBox")
      var themeEl = document.getElementById(themeClass as string)
      if (themeClass == "dark") {
        var themeOpp = document.getElementById("light")
        osInstance.options({ scrollbars: { theme: `os-theme-light` } });
      } else {
        var themeOpp = document.getElementById("dark")
        osInstance.options({ scrollbars: { theme: `os-theme-dark` } });
      }
      if (themeEl?.classList.contains("opacity-0")) {
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

      if (localStorage.getItem("customCloak")) {
        if (localStorage.getItem('customCloak') == "active") {
          document.title = await localForage.getItem("customCloakTitle") as string
          var favIcon = document.getElementById('favicon') as HTMLLinkElement
          favIcon.href = await localForage.getItem("customCloakImg") as string
        }
      }
      if (!localStorage.getItem("cloak")) {
        icon?.setAttribute("href", `/img/favicon_${themeClass}.png`)
      }
    } else {
      const themeClass = document.documentElement.classList.contains("dark") ? "dark" : "light";
      if (themeClass == "dark") {

        osInstance.options({ scrollbars: { theme: `os-theme-light` } });
      } else {

        osInstance.options({ scrollbars: { theme: `os-theme-dark` } });
      }
      if (localStorage.getItem("customCloak")) {
        if (localStorage.getItem('customCloak') == "active") {
          document.title = await localForage.getItem("customCloakTitle") as string
          var favIcon = document.getElementById('favicon') as HTMLLinkElement
          favIcon.href = await localForage.getItem("customCloakImg") as string
        }
      }
      if (!localStorage.getItem("cloak")) {
        icon?.setAttribute("href", `/img/favicon_${themeClass}.png`)
      }
    }


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


    <>
      <Suspense fallback={<div className="text-center justify-center items-center flex">Loading Daylight Systems Incorporated..</div>}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <div id="bgs">

          </div>
          <div id="modetlink">
            <ModeToggle></ModeToggle>
            <Link style={{ left: "0", top: "0" }} className={"opacity-0"} id="redirectHome" to="/">Go Home</Link>
            <Link style={{ left: "0", top: "0" }} className={"opacity-0"} id="redirectFav" to="/favorites">Go to Favorites</Link>
            <Link style={{ left: "0", top: "0" }} className={"opacity-0"} id="redirectAddons" to="/addons">Go to Addons</Link>
            <Link style={{ left: "0", top: "0" }} className={"opacity-0"} id="redirectSettings" to="/settings">Go to Settings</Link>
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
                          aria-label="Search"
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
                  type="search" //here!
                  placeholder="Search..."
                  id="uv-address"
                  onChange={searchChangeFr}
                  className="flex-1 border-none bg-transparent text-sm focus:outline-none"
                  style={{ height: "32px", borderTopRightRadius: "999px", borderBottomRightRadius: "999px", transition: "all 0.2s ease" }} />
              </div>
              <div className="text-container" style={{ background: "transparent", opacity: "0" }}>
                <h2 style={{ fontSize: "medium" }} className="horizon">The minimalistic browser</h2>
              </div>
            </div>
            <br></br>

            <div className="text-container" style={{ background: "transparent" }}>
              <h2 className="horizon" style={{ paddingRight: "10px", paddingLeft: "10px", borderRadius: "999px", backdropFilter: "blur(10px)", fontSize: 'medium' }}>The minimalistic browser</h2>
            </div>


          </div>




          <Clock isDesktop={isDesktop} />
          <Dialog >
            <DialogTrigger asChild>
              <Button variant="outline" style={{ right: "10px", position: "fixed", bottom: "10px" }}>Why the lack of time?</Button>
            </DialogTrigger>
            <DialogContent style={{ zIndex: "100000000", marginTop: "-10px", width: "750px", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}} className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Why the lack of time?</DialogTitle>
                <DialogDescription>
                  Why do I mention frequently that I lack time to add features?
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">

                <Label htmlFor="name" className="text-left">
                  Why do I mention frequently that I have no time?
                </Label>
                <p className="text-muted-foreground ">Well, it's because I started this project late (7/12/2024). You might think that's a ton of time, or you might think what was I doing before that. I was working on what originally was supposed to be my Proxathon entry, however due to some issues, I scrapped the project. This project may come out as a service soon, I don't know. I started the Horizon project back in June, and I spent a lot of time on it, which is why I have (in my book) so little time to complete this. Since I planned on having Tabs as well, I started priortizing certain features (specifically Tabs, because the way I want is complex) which is why some small but important features may not be there.</p>




              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit">Okay (Close)</Button>
                </DialogClose>

              </DialogFooter>
            </DialogContent>
          </Dialog>

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


