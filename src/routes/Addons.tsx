/* eslint-disable no-non-null-assertion */

import { useRef, useState, useEffect } from "react";
import "./Addons.css";
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
import { motion } from "framer-motion";
import $ from "jquery"
import { Link } from "react-router-dom"
import { Navbar } from "@/components/component/navbar"
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars } from 'overlayscrollbars';
function login() {
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
        $("#home").on("click", function() {
          
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
      $("#addons").on("click", function() {
        
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
       
        
    });
    $("#favorites").on("click", function() {
        
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
    $("#settings").on("click", function() {
        
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
                <div>
                    <ModeToggle></ModeToggle>
                    <Link style={{ left: "0", top: "0" }} className={"opacity-0"} id="redirectHome" to="/"></Link>
          <Link style={{ left: "0", top: "0" }} className={"opacity-0"} id="redirectFav" to="/favorites"></Link>
          <Link style={{ left: "0", top: "0" }} className={"opacity-0"} id="redirectAddons" to="/addons"></Link>
          <Link style={{ left: "0", top: "0" }} className={"opacity-0"} id="redirectSettings" to="/settings"></Link>
                </div>
                <Navbar addons="true" />
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome back</CardTitle>
                        <CardDescription>Login with your username and password to access.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       THIS IS THE ADDONS PAGE
                    </CardContent>
                </Card>
                
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
