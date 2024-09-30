/* eslint-disable no-non-null-assertion */

import { useRef, useState, useEffect } from "react";
import "./Favorites.css";
import { Button } from "@/components/ui/button";
import "../app/globals.css";
import "../index.css";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Progress } from "@/components/ui/progress-5s";
import { Separator } from "@/components/ui/separator";
import { inject } from '@vercel/analytics';
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Navbar } from "@/components/component/navbar"
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars } from 'overlayscrollbars';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import $ from "jquery"
import localForage from "localforage"
import {useMediaQuery} from "@/hooks/use-media-query"
function login() {
  const isDesktop = useMediaQuery("(min-width: 768px;)")
  const { theme } = useTheme();
  const icon = document.getElementById("favicon")
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

      if (!document.documentElement.classList.contains("light")){
        light.classList.add("opacity-0")
        dark.classList.remove("opacity-0")
      }
      
      
      if (!document.documentElement.classList.contains("dark")){
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
        modetlink?.removeChild(light);
        modetlink?.removeChild(dark);
      };
    } else {
      if (document.getElementById("light") && document.getElementById("dark")){
        const modetlink = document.getElementById("bgs");
        modetlink?.removeChild(document.getElementById("light") as HTMLDivElement)
        modetlink?.removeChild(document.getElementById("dark") as HTMLDivElement)
      }
    }
  }, [isDesktop]);
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
      for (let key in elements) {
        elements[key].setAttribute("disabled", "true")
      }

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

      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div id="bgs">

        </div>
        <div id="modetlink">
          <ModeToggle></ModeToggle>
          <Link style={{ left: "0", top: "0" }} className={"opacity-0"} id="redirectHome" to="/"></Link>
          <Link style={{ left: "0", top: "0" }} className={"opacity-0"} id="redirectFav" to="/favorites"></Link>
          <Link style={{ left: "0", top: "0" }} className={"opacity-0"} id="redirectAddons" to="/addons"></Link>
          <Link style={{ left: "0", top: "0" }} className={"opacity-0"} id="redirectSettings" to="/settings"></Link>
        </div>
        <Navbar favorites="true"></Navbar>

        <Card style={{width: "400px"}} className="text-left ">
          <CardHeader>
            <CardTitle>Womp Womp..</CardTitle>
            <CardDescription>  This feature is not yet available due to lack of time. </CardDescription>
          </CardHeader>
          <CardContent>

            This feature is not yet available. It already has some progress but is not in a state for presentation. This will release soon.
          </CardContent>
        </Card>

        {isDesktop && localStorage.getItem("clockEnabled") && (
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
    )}
        <motion.div
          key="privacy-screen"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
          exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
          style={{ originX: 1 }}
          className="privacy-screen"
        />
      </ThemeProvider>




    </>
  );
}

export default login;
