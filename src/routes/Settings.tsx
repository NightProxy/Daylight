/* eslint-disable no-non-null-assertion */

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
import { Combobox } from "@/components/ui/combobox"

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

function login() {
    const isDesktop = false
    const [imgPreviewSrc, setImgPreviewSrc] = useState("")
    const [hintVisibility, setHintVisibility] = useState("none")
    var ct = document.getElementById("cloakTitle")
    var cd = document.getElementById("cloakDescription")
    var gen = document.getElementById("generalCard")
    var themec = document.getElementById("themeCard")
    var cloc = document.getElementById("cloakCard")
    var sea = document.getElementById("searchCard")
    function handleCloakInputChange() {
        console.log("changeeee")
        var ccti = document.getElementById("customCloakTitleInput") as HTMLInputElement
        localForage.setItem("customCloakTitle", ccti.value)
        if (ccti.value == "") {
            document.title = "Daylight | Proxathon 2024"
        } else {
            document.title = ccti.value
        }
        ;

    }
    function check() {

        if (document.getElementById("searchCard")!.style.height == "400px" && window.innerWidth >= 1024) {
            gen!.style.transition = "margin-top 0.2s ease-out"
            themec!.style.height = ""
            document.getElementById("cloakCard")!.style.height = ""
            gen!.style.marginTop = "157.5px"
            gen!.style.transition = "all 0.2s ease-out"
            sea!.style.height = "715px"


            gen!.style.width = "205%"
            gen!.style.marginLeft = "105%"

            setTimeout(function () {
                document.getElementById('generalCard')!.style.marginTop = "0"
                $("#accTrigger").removeAttr("disabled")

            }, 200)
            setTimeout(function () {
                gen!.style.marginTop = "-315px"
                gen!.style.transition = "all 0.2s ease-out"
            }, 200)
        }
    }
    setInterval(check, 100)
    const capitalizefr = <T extends string>(s: T) => (s[0].toUpperCase() + s.slice(1)) as Capitalize<typeof s>;
    const [accordionDelay, setAccordionDelay] = useState(0)
    const proxyChange = (value: string) => {
        console.log("gyatt", value)
        //add handling 
        if (value == null || value == "" || value == " ") {
            console.error('user has fumbled something!!!!! ')
        }
    }
    const searchChange = (value: string) => {
        console.log("User has changed their serach engine to: ", value)
        localStorage.setItem("search", value)
    }
    const transportChange = (value: string) => {
        //add bareMux transport switching
    }
    const [isOpen, setIsOpen] = React.useState(false)
    const transportList = [
        {
            value: "epoxy",
            label: "Epoxy",
        },
        {
            value: "libcurl",
            label: "Libcurl",
        },
        {
            value: "bare",
            label: "Original Bare client",
        }
    ];
    const searchList = [
        {
            value: "google",
            label: "Google (Default)",
        },
        {
            value: "bing",
            label: "Bing",
        },
        {
            value: "ecosia",
            label: "Ecosia",
        },
        {
            value: "ddg",
            label: "DuckDuckGo"
        },
        {
            value: "brave",
            label: "Brave"
        }
    ];
    const proxyList = [
        {
            value: "ultraviolet",
            label: "Ultraviolet (Default)",
        },
        {
            value: "rammerhead",
            label: "Rammerhead",
        },

        {
            value: "scramjet",
            label: "Scramjet (experimental)"
        },
        {
            value: "meteor",
            label: "Meteor (experimental)"
        }
    ];
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
        if (isDesktop) {
          const lightDiv = document.createElement('div');
          lightDiv.id = 'light';
          Object.assign(lightDiv.style, {
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
    
          const darkDiv = document.createElement('div');
          darkDiv.id = 'dark';
          Object.assign(darkDiv.style, {
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
          
          const themeClass = document.documentElement.classList.contains("dark") ? "dark" : "light";
          document.body.appendChild(lightDiv);
          document.body.appendChild(darkDiv);
          document.body.style.backgroundImage = `url(/img/bg/bg${themeClass.charAt(0).toUpperCase() + themeClass.slice(1)}.png)`;
          document.body.style.backgroundPosition = 'center center';
          document.body.style.backgroundSize = 'cover';
          document.body.style.backgroundRepeat = 'no-repeat';
          document.body.style.backgroundAttachment = 'fixed';
          document.body.style.height = '100%';
          return () => {
            document.body.removeChild(lightDiv);
            document.body.removeChild(darkDiv);
          };
        }
      }, [isDesktop]);
    useEffect(() => {
        if (!localStorage.getItem("search")) {
            localStorage.setItem("search", "google")
        }
        if (!localStorage.getItem("proxy")) {
            localStorage.setItem('proxy', "ultraviolet")
        }
        if (!localStorage.getItem("transport")) {
            localStorage.setItem("transport", "libcurl")


        }
        if (localStorage.getItem("cloak")) {
            $(`#${localStorage.getItem("cloak")}Cloak`).trigger("click")
            setTimeout(function () {
                $(`#${localStorage.getItem("cloak")}Cloak`).trigger("click")
                setTimeout(function () {
                    $(`#${localStorage.getItem("cloak")}Cloak`).trigger("click")
                }, 100)
            }, 350)


            if (localStorage.getItem("cloak") == "custom") {
                document.getElementById("cloakTitle")!.style.opacity = "0";
                document.getElementById("cloakDescription")!.style.opacity = "0";
                document.getElementById("customCloakTitleInput")!.style.opacity = "0";
                document.getElementById("saveCloak")!.style.opacity = "0";
                document.getElementById("uploadIcon")!.style.opacity = "0";
                setTimeout(async function () {
                    if ($("#customCloak").attr("data-state") == "off") {
                        document.getElementById("cloakTitle")!.textContent = "No cloak set.";
                        document.getElementById("cloakDescription")!.textContent = "Enable a cloak to reduce the chances of this link getting blocked.";
                        document.getElementById("cloakTitle")!.style.opacity = "1"
                        document.getElementById("cloakDescription")!.style.opacity = "1"
                    } else {
                        localStorage.setItem("cloak", "custom");
                        localStorage.setItem("cloakTab", "custom");
                        document.getElementById("customCloakTitleInput")!.style.opacity = "1";
                        document.getElementById("saveCloak")!.style.opacity = "1";
                        document.getElementById("uploadIcon")!.style.opacity = "1";
                        document.getElementById("cloakTitle")!.textContent = "Custom Cloaks";
                        document.getElementById("cloakDescription")!.textContent = "Want to cloak a website that's not listed? Make your own!";
                        if (localStorage.getItem("customCloak") == "active") {
                            document.getElementById("cloakTitle")!.textContent = "Custom Cloak Active";
                        }
                        document.getElementById("cloakTitle")!.style.opacity = "1";
                        document.getElementById("cloakDescription")!.style.opacity = "1";
                        if (await localForage.getItem("customCloakTitle") && await localForage.getItem("customCloakTitle") !== "" && await localForage.getItem("customCloakImg") && await localForage.getItem("customCloakImg") !== "") {
                            var ccti = document.getElementById("customCloakTitleInput") as HTMLInputElement
                            ccti.value = (await localForage.getItem("customCloakTitle") as string)
                            var upi = document.getElementById("uploadIcon")
                            var sc = document.getElementById("saveCloak")
                            var ip = document.getElementById("iconPreview")
                            var ii = document.getElementById("iconIMG")
                            setImgPreviewSrc(await localForage.getItem("customCloakImg") as string)
                            upi!.style.top = "0"
                            sc!.style.top = "0"
                            upi!.style.position = ""
                            sc!.style.position = ""
                            setTimeout(function () {
                                ip!.style.opacity = "1"
                                setHintVisibility("block")



                            }, 150)


                        }
                    }
                }, 200);
            }
        }

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
    async function setInitialColor() {
        if (isDesktop){
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
            for (let key in elements) {
                elements[key].setAttribute("disabled", "true")
            }
            Array.from(document.getElementsByClassName('os-scrollbar') as HTMLCollectionOf<HTMLElement>).forEach(element => {
                element.style.transition = '0.2s all ease'
                element.style.opacity = "0"

            });

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
            Array.from(document.getElementsByClassName('os-scrollbar') as HTMLCollectionOf<HTMLElement>).forEach(element => {
                element.style.transition = '0.2s all ease'
                element.style.opacity = "0"

            });

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
            Array.from(document.getElementsByClassName('os-scrollbar') as HTMLCollectionOf<HTMLElement>).forEach(element => {
                element.style.transition = '0.2s all ease'
                element.style.opacity = "0"

            });
        });
        $("#saveCloak").on("click", async function () {
            if (await localForage.getItem('customCloakTitle') && await localForage.getItem("customCloakTitle") !== "") {
                if (await localForage.getItem("customCloakImg") && await localForage.getItem('customCloakImg') !== "") {
                    console.log("Both image and title have been set. Updating Document title and favicon across all pages.")
                    localStorage.setItem("customCloak", "active")
                    document.title = await localForage.getItem("customCloakTitle") as string
                    var favIcon = document.getElementById("favicon") as HTMLLinkElement
                    favIcon.href = await localForage.getItem("customCloakImg") as string

                }
            }
        })
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


        });

        $("#accTrigger").on("click", function () {
            var gen = document.getElementById("generalCard")
            var themec = document.getElementById("themeCard")
            var cloc = document.getElementById("cloakCard")
            var sea = document.getElementById("searchCard")
            var isClosed = $("#accTrigger").attr("data-state") === "closed";
            $("#accTrigger").attr("disabled", "true")
            console.log("AHAHAHAH")
            if (window.innerWidth >= 1024) {
                    if (isClosed){
                        sea!.style.height = "100%"
                        document.getElementById("themeCard1024")!.style.height = "100%"
                        cloc!.style.height = "100%"
                        setTimeout(function(){
                            $("#accTrigger").removeAttr('disabled')
                        }, 200)
                    } else {
                        $("#accTrigger").removeAttr("disabled")
                    }
                    
                
                










            } else {
                console.log(window.innerWidth)
                if (isClosed) {
                    document.getElementById("cloakDescription")!.style.opacity = "0"
                    document.getElementById("saveCloak")!.style.opacity = "0"
                    document.getElementById("customCloakTitleInput")!.style.opacity = "0"
                    document.getElementById("iconPreview")!.style.opacity = "0"
                    document.getElementById('iconHint')!.style.opacity = "0"
                    document.getElementById("uploadIcon")!.style.opacity = "0"
                    document.getElementById("cloakTitle")!.textContent = "Hide the Advanced \n menu to reveal \n the cloak settings."
                    cloc!.style.height = "285px"
                    themec!.style.marginTop = "-275px"
                    themec!.style.height = "260px"
                    document.getElementById("searchCard")!.style.height = "100%"
                    setTimeout(function () {
                        gen!.style.width = "205%"
                        $("#accTrigger").removeAttr("disabled")
                    }, 200)

                } else {
                    gen!.style.width = "100%"

                    cloc!.style.height = "100%"
                    themec!.style.marginTop = "0"
                    themec!.style.height = "100%"
                    setTimeout(function () {
                        $("#accTrigger").removeAttr("disabled")
                        document.getElementById("cloakDescription")!.style.opacity = "1"

                        if (localStorage.getItem("cloak")) {
                            if (localStorage.getItem("cloak") == "custom") {
                                document.getElementById("cloakTitle")!.textContent = "Custom Cloak Active"
                                document.getElementById("saveCloak")!.style.opacity = "1"
                                document.getElementById("customCloakTitleInput")!.style.opacity = "1"
                                document.getElementById("cloakDescription")!.style.opacity = "1"
                    document.getElementById("saveCloak")!.style.opacity = "1"
                    document.getElementById("customCloakTitleInput")!.style.opacity = "1"
                    document.getElementById("iconPreview")!.style.opacity = "1"
                    document.getElementById('iconHint')!.style.opacity = "1"
                    document.getElementById("uploadIcon")!.style.opacity = "1"
                            } else {

                                document.getElementById("cloakTitle")!.textContent = `${capitalizefr(localStorage.getItem("cloak") as string)} Cloak Active`
                            }
                        } else {
                            document.getElementById("cloakTitle")!.textContent = "No cloak set."
                            document.getElementById("saveCloak")!.style.opacity = "0"
                            document.getElementById("customCloakTitleInput")!.style.opacity = "0"
                        }


                    }, 200)


                }
            }



        });
        var ct = document.getElementById("cloakTitle")
        var cd = document.getElementById("cloakDescription")
        var saveC = document.getElementById("saveCloak")
        $(window).on("resize", function () {
            //responsive!!!
            //well somewhat
            //it also works on phones but not phones going to middle school (12 year old phones lmao)
            if (window.innerWidth >= 1024) {
                document.getElementById('generalCard')!.style.marginTop = ""
                document.getElementById("generalCard")!.style.width = "310%"
                document.getElementById("generalCard")!.style.marginLeft = "auto"
                document.getElementById("searchCard")!.style.height = "auto"





                document.getElementById("themeCard")!.style.height = ""
                document.getElementById("cloakCard")!.style.height = "100%"

            } else {
                document.getElementById("cloakCard")!.style.height = "300px"
                document.getElementById("themeCard")!.style.marginTop = "-275px"
                document.getElementById("themeCard")!.style.height = "260px"
                document.getElementById("generalCard")!.style.width = "205%"
                document.getElementById("generalCard")!.style.width = "100%"

                document.getElementById("cloakCard")!.style.height = "100%"
                document.getElementById("themeCard")!.style.marginTop = "0"
                document.getElementById("themeCard")!.style.height = "100%"

            }
        })



        $(document).ready(function () {
            function setCloak(cloak, title, description, element) {
                document.getElementById("cloakTitle")!.style.opacity = "0";
                document.getElementById("cloakDescription")!.style.opacity = "0";
                document.getElementById("customCloakTitleInput")!.style.opacity = "0";
                document.getElementById("saveCloak")!.style.opacity = "0";
                document.getElementById("uploadIcon")!.style.opacity = "0";
                document.getElementById("iconPreview")!.style.opacity = "0"
                document.getElementById("iconHint")!.style.transition = "opacity 0.2s ease;"
                document.getElementById("iconHint")!.style.opacity = "0"
                setTimeout(function () {
                    if (element.getAttribute("data-state") == "off") {
                        document.getElementById("customCloakTitleInput")!.style.display = "none";
                        document.getElementById("saveCloak")!.style.display = "none";
                        document.getElementById("uploadIcon")!.style.display = "none";
                        document.getElementById("iconPreview")!.style.display = "none"
                        setHintVisibility("none")
                        console.log(cloak)
                        document.getElementById("cloakTitle")!.textContent = "No cloak set.";
                        document.getElementById("cloakDescription")!.textContent = "Enable a cloak to reduce the chances of this link getting blocked. Tab cloaks cloak the tab title and icon to reduce the chances of this link getting blocked.";
                        document.getElementById("cloakTitle")!.style.opacity = "1";
                        document.getElementById("cloakDescription")!.style.opacity = "1";
                        localStorage.removeItem("cloak")
                        if (document.documentElement.classList.contains("dark")) {
                            document.getElementById("favicon")?.setAttribute("href", "/img/favicon_dark.png")
                        } else {
                            document.getElementById("favicon")?.setAttribute("href", "/img/favicon_light.png")
                        }
                    } else {
                        localStorage.setItem("cloak", cloak);
                        localStorage.setItem("cloakTab", cloak);
                        document.getElementById("cloakTitle")!.textContent = title;
                        document.getElementById("cloakDescription")!.textContent = description;
                        document.getElementById("customCloakTitleInput")!.style.display = "none";
                        document.getElementById("saveCloak")!.style.display = "none";
                        document.getElementById("uploadIcon")!.style.display = "none";
                        document.getElementById("iconPreview")!.style.display = "none"
                        document.getElementById("cloakTitle")!.style.opacity = "1";
                        document.getElementById("cloakDescription")!.style.opacity = "1";
                        document.getElementById("iconHint")!.style.opacity = "0"
                        setHintVisibility("none")
                        if (cloak == "google" || cloak == "schoology" || cloak == "docs" || cloak == "slides") {
                            document.getElementById("favicon")?.setAttribute("href", `/img/cloaks/${cloak}.png`)
                            if (localStorage.getItem("customCloak")) {
                                localStorage.removeItem("customCloak")
                            }

                        } else {
                            if (cloak == "canvas") {
                                document.getElementById("favicon")?.setAttribute("href", "/img/cloaks/canvas.ico")
                                if (localStorage.getItem("customCloak")) {
                                    localStorage.removeItem("customCloak")
                                }
                            } else {
                                document.getElementById("favicon")?.setAttribute("href", "/img/cloaks/classroom.svg")
                                if (localStorage.getItem("customCloak")) {
                                    localStorage.removeItem("customCloak")
                                }
                            }
                        }
                        switch (localStorage.getItem("cloak")) {
                            case "google":
                                document.title = 'Google'
                                break
                            case "schoology":
                                document.title = "Home | Schoology"
                                break
                            case "docs":
                                document.title = "Google Docs"
                                break
                            case "slides":
                                document.title = "Google Slides"
                                break
                            case "canvas":
                                document.title = "Canvas"
                                break
                            case "classroom":
                                document.title = "Google Classroom"
                                break
                            default:
                                document.title = "what the sigma"
                                break


                        }

                    }
                }, 200);
            }

            $("#googleCloak").on("click", function () {
                setCloak("google", "Google Cloak Active", 'You have selected the "Google" website as your cloak. Chances of proctor or admin not finding out (the higher the better, approximate, this is my opinion): 2/5', document.getElementById("googleCloak"));
            });

            $("#schoologyCloak").on("click", function () {
                setCloak("schoology", "Schoology Cloak Active", 'You have selected the "Schoology" service as your cloak. Chances of proctor or admin not finding out (the higher the better, approximate, my opinion, if your school uses this service): 5/5 (Most schools have custom domains for Schoology). If your school does not use this service, your chances are: 2/5', document.getElementById("schoologyCloak"));
            });

            $("#canvasCloak").on("click", function () {
                setCloak("canvas", "Canvas Cloak Active", `You have selected the "Canvas" service as your cloak. Chances of proctor or admin not finding out (the higher the better, approximate, this is my opinion, if your school uses this service): 3/5 (The title set as the cloak may differ than Canvas' actual title)`, document.getElementById("canvasCloak"));
            });

            $("#docsCloak").on("click", function () {
                setCloak("docs", "Docs Cloak Active", 'You have selected the "Google Docs" service as your cloak. Chances of proctor or admin not finding out (the higher the better, approximate, this is my opinion): 4/5 (They would think your writing an essay)', document.getElementById("docsCloak"));
            });

            $("#slidesCloak").on("click", function () {
                setCloak("slides", "Slides Cloak Active", 'You have selected the "Google Slides" service as your cloak. Chances of proctor or admin not finding out (the higher the better, approximate, this is my opinion): 3/5', document.getElementById("slidesCloak"));
            });

            $("#classroomCloak").on("click", function () {
                setCloak("classroom", "Classroom Cloak Active", 'You have selected the "Google Classroom" service as your cloak. Chances of your proctor or admin not finding out (if your school uses Google Classroom): 4/5. If your school does not use Google Classroom, your chances are: 1/5. (They would be confused)', document.getElementById("classroomCloak"));
            });

            $("#customCloak").on("click", function () {
                document.getElementById("cloakTitle")!.style.opacity = "0";
                document.getElementById("cloakDescription")!.style.opacity = "0";
                document.getElementById("customCloakTitleInput")!.style.opacity = "0";
                document.getElementById("saveCloak")!.style.opacity = "0";
                document.getElementById("uploadIcon")!.style.opacity = "0";

                document.getElementById("iconPreview")!.style.opacity = "0"
                document.getElementById("iconHint")!.style.transition = "opacity 0.2s ease;"
                document.getElementById("iconHint")!.style.opacity = "0"

                setTimeout(async function () {
                    if ($("#customCloak").attr("data-state") == "off") {
                        document.getElementById("cloakTitle")!.textContent = "No cloak set.";
                        document.getElementById("cloakDescription")!.textContent = "Enable a cloak to reduce the chances of this link getting blocked.";

                        document.getElementById("customCloakTitleInput")!.style.display = "none";
                        document.getElementById("saveCloak")!.style.display = "none";
                        document.getElementById("uploadIcon")!.style.display = "none";
                        document.getElementById("iconPreview")!.style.display = "none"
                        document.getElementById("cloakTitle")!.style.opacity = "1"
                        document.getElementById("cloakDescription")!.style.opacity = "1"
                        setHintVisibility("none")
                    } else {
                        localStorage.setItem("cloak", "custom");
                        localStorage.setItem("cloakTab", "custom");
                        document.getElementById("customCloakTitleInput")!.style.display = "";
                        document.getElementById("saveCloak")!.style.display = "";
                        document.getElementById("uploadIcon")!.style.display = "";
                        document.getElementById("iconPreview")!.style.display = ""
                        document.getElementById("customCloakTitleInput")!.style.opacity = "1";
                        document.getElementById("saveCloak")!.style.opacity = "1";
                        document.getElementById("uploadIcon")!.style.opacity = "1";
                        document.getElementById("iconPreview")!.style.opacity = "1"
                        setHintVisibility("block")
                        document.getElementById("iconHint")!.style.opacity = "1"
                        document.getElementById("cloakTitle")!.textContent = "Custom Cloaks";
                        document.getElementById("cloakDescription")!.textContent = "Want to cloak a website that's not listed? Make your own!";
                        document.getElementById("cloakTitle")!.style.opacity = "1";
                        document.getElementById("cloakDescription")!.style.opacity = "1";
                        if (await localForage.getItem("customCloakTitle") && await localForage.getItem('customCloakImg') && await localForage.getItem("customCloakTitle") !== "" && await localForage.getItem("customCloakImg") !== "") {
                            var upi = document.getElementById("uploadIcon")
                            var sc = document.getElementById("saveCloak")
                            var ip = document.getElementById("iconPreview")
                            var ii = document.getElementById("iconIMG")
                            setImgPreviewSrc(await localForage.getItem("customCloakImg") as string)
                            upi!.style.top = "0"
                            sc!.style.top = "0"
                            upi!.style.position = ""
                            sc!.style.position = ""
                            setTimeout(async function () {
                                ip!.style.opacity = "1"
                                setHintVisibility("block")

                                var ccti = document.getElementById("customCloakTitleInput") as HTMLInputElement
                                ccti.value = await localForage.getItem("customCloakTitle") as string



                            }, 150)
                        }

                    }
                }, 200);
            });
        });
        $("#uploadIcon").on("click", function () {

            var input = document.getElementById("iconUpload") as HTMLInputElement
            input!.onchange = e => {
                var target = e!.target as HTMLInputElement;
                if (target.files) {
                    var file = target?.files[0];
                    // set up file stuff
                    try {
                        var reader = new FileReader();
                        reader.readAsDataURL(file);

                        // promise to work with sonnre
                        const fileReadPromise = new Promise((resolve, reject) => {
                            reader.onload = readerEvent => {
                                if (readerEvent.target) {
                                    var content = readerEvent!.target.result; //yay content!!!

                                    var image = new Image();

                                    image.src = readerEvent!.target.result as string;


                                    image.onload = function () {
                                        var height = image.height;
                                        var width = image.width;
                                        if (height > 500 || width > 500) {
                                            toast.error("Error: Image width and height should not exceed 500px.");
                                            reject(new Error("Image width and height should not exceed 500px."));
                                            return;
                                        }

                                        // Wait an additional second before resolving the promise
                                        setTimeout(() => {
                                            resolve(content);
                                        }, 1000);
                                    };

                                    image.onerror = () => {
                                        reject(new Error("Error loading image"));
                                    };
                                } else {
                                    reject(new Error("File reading failed"));
                                }
                            };

                            reader.onerror = error => {
                                reject(new Error("Error reading file"));
                            };
                        });

                        // Use the actual promise in toast.promise
                        toast.promise(fileReadPromise, {
                            loading: 'Loading image...',
                            success: (content) => {
                                showIconPreview(content)
                                return 'Image loaded successfully';
                            },
                            error: 'Error loading image',
                        });

                    } catch (e) {
                        console.log("Error has occurred, most likely user clicked cancel. Error:", e);
                    }
                }
            }
            if (input && localStorage.getItem("fileUpload") !== "true") {
                input!.click();
                localStorage.setItem("fileUpload", "true")
            } else {
                setTimeout(function () {
                    localStorage.removeItem('fileUpload')
                }, 350)

            }

        })

        $(function () {
            const iconPreview = document.getElementById("iconPreview");
            $("#unroundImages").on("click", function () {
                if (localStorage.getItem("rounded") !== "true" && iconPreview?.style.borderRadius == "999px") {

                    iconPreview!.style.borderRadius = "0";
                    console.log("border radius is now set to 0", iconPreview?.style.borderRadius);
                    if (iconPreview?.classList.contains("rounded-full")) {
                        iconPreview?.classList.remove("rounded-full");
                        setTimeout(function () {
                            console.log("eeeeeeeeee")
                        }, 300)
                    }
                    localStorage.setItem("rounded", "true")
                }


            });
            $("#roundImages").on("click", function () {
                if (localStorage.getItem("rounded") == "true" && iconPreview?.style.borderRadius !== "999px") {

                    iconPreview!.style.borderRadius = "999px";
                    console.log("border radius is now set to 0", iconPreview?.style.borderRadius);
                    if (iconPreview?.classList.contains("rounded-full")) {
                        iconPreview?.classList.remove("rounded-full");
                        setTimeout(function () {
                            console.log("eeeeeeeeee")
                        }, 300)
                    }
                    localStorage.removeItem("rounded")
                }
            })
        })



        function showIconPreview(dataURI) {
            console.log("data uri from showiconpreview", dataURI)
            var upi = document.getElementById("uploadIcon")
            var sc = document.getElementById("saveCloak")
            var ip = document.getElementById("iconPreview")
            var ii = document.getElementById("iconIMG")
            setImgPreviewSrc(dataURI)
            upi!.style.top = "0"
            sc!.style.top = "0"
            upi!.style.position = ""
            sc!.style.position = ""
            setTimeout(function () {
                ip!.style.opacity = "1"
                setHintVisibility("block")
                localForage.setItem("customCloakImg", dataURI)
                console.log("temporarily stored currently upload icon in to IndexDB")



            }, 150)



        }





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
                <Navbar settings="true"></Navbar>
                <br>
                </br>
                <br>
                </br>

                <div className="w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8 text-left">
                    <h1 className="text-3xl font-bold mb-6" style={{ width: "145px", background: "hsla(var(--card) / 0.4)", backdropFilter: "blur(50px)", borderRadius: "999px", paddingRight: "10px", paddingLeft: "10px" }}>Settings</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card id="searchCard" className="h-full" style={{ background: "hsla(var(--card) / 0.4)", backdropFilter: "blur(10px)" }}>
                            <CardHeader>
                                <CardTitle>Search</CardTitle>
                                <CardDescription>Manage how you surf with Daylight</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Proxy</Label>
                                    <br></br>
                                    <Combobox onValueChange={proxyChange} placeHolder="proxy" triggerID="proxyTrigger" list={proxyList} placeHolderPlural="proxies" defaultValue="ultraviolet" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Search Engine</Label>
                                    <br></br>
                                    <Combobox onValueChange={searchChange} placeHolder="search engine" triggerID="searchTrigger" list={searchList} placeHolderPlural="search engines" defaultValue="google" />
                                </div>
                                { /* 
                                The below code is advanced for most users, so they will be hidden under a  "Advanced" submenu. The following settings
                                manage wisp servers and transports!
                                */}
                                <Accordion type="single" collapsible style={{ paddingLeft: "0" }} id="accordion" className="w-full">
                                    <AccordionItem value="main">
                                        <div className="flex items-center justify-between space-x-4 px-4" style={{ paddingLeft: "0" }}>

                                            <AccordionTrigger id="accTrigger">

                                                <Label htmlFor="email">Advanced</Label>


                                            </AccordionTrigger>
                                        </div>

                                        <AccordionContent className="space-y-4 pt-2 pb-0 p-[5px]">
                                            <div className="space-y-2">
                                                <CardDescription>Custom wisp servers are planned in the next major update.</CardDescription>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Transport</Label>
                                                <CardDescription>Do not change this setting unless you know what you are doing.</CardDescription>
                                                <Combobox onValueChange={transportChange} triggerID="transportTrigger" placeHolder="transport" list={transportList} defaultValue="libcurl" placeHolderPlural="transports" />
                                            </div>

                                        </AccordionContent>
                                    </AccordionItem>

                                </Accordion>

                            </CardContent>
                            <CardFooter>
                                <Button>Save Changes</Button>
                            </CardFooter>
                        </Card>
                        <Card id="cloakCard" style={{ background: "hsla(var(--card) / 0.4)", backdropFilter: "blur(10px)" }}>
                            <CardHeader>
                                <CardTitle>Cloaks</CardTitle>
                                <CardDescription>Manage your tab cloaks</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardDescription>Unfortunately, due to lack of time, about:blank cloaks are not available yet.</CardDescription>

                                    </div>
                                </div>

                                <ToggleGroup variant="outline" type="single">
                                    <ToggleGroupItem id="googleCloak" value="google" aria-label="Toggle Google cloak">
                                        <i className="fa-brands fa-google"></i>
                                    </ToggleGroupItem>
                                    <ToggleGroupItem id="schoologyCloak" value="schoology" aria-label="Toggle Schoology cloak">
                                        <Schoology />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem id="canvasCloak" value="canvas" aria-label="Toggle Canvas cloak">
                                        <SiCanvas size={20} />

                                    </ToggleGroupItem>
                                    <ToggleGroupItem id="docsCloak" value="docs" aria-label="Toggle Google Docs cloak">
                                        <SiGoogledocs size={20} />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem id="slidesCloak" value="slides" aria-label="Toggle Google Slides cloak">
                                        <SiGoogleslides size={20} />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem id="classroomCloak" value="classroom" aria-label="Toggle Google Classroom cloak">
                                        <SiGoogleclassroom size={20} />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem id="customCloak" value="custom" aria-label="Toggle Custom cloak">
                                        <TbWorld size={20} />
                                    </ToggleGroupItem>
                                </ToggleGroup>


                                <div className="flex items-center justify-between">
                                    <div>
                                        <p id="cloakTitle" className="font-medium">No cloak set.</p>
                                        <p id="cloakDescription" className="text-muted-foreground text-sm">Enable a cloak to reduce the chances of this link getting blocked. Tab cloaks cloak the tab title and icon to reduce the chances of this link getting blocked.</p>
                                        <Input id="customCloakTitleInput" className="opacity-0" onChange={handleCloakInputChange} placeholder="Enter the title of the custom cloak..."></Input>
                                        <input className="hidden" accept="image/*" type="file" id="iconUpload"></input>
                                        <br />
                                        <Avatar style={{ width: "80px", height: "80px", borderRadius: "999px" }} className="opacity-0" id="iconPreview" >
                                            <AvatarImage style={{ width: "80px", height: "80px" }} src={imgPreviewSrc} alt="Favicon Preview" id="iconIMG" />
                                            <AvatarFallback>IMG</AvatarFallback>
                                            <h4>Icon Preview</h4>
                                        </Avatar>
                                        <br></br>
                                        <Button id="saveCloak" className="opacity-0">Save <Save style={{ width: "20px", height: "16px" }} /></Button>
                                        <Button id="uploadIcon" className="opacity-0">Upload Icon <ImageUp style={{ width: "20px", height: "16px" }} /></Button>
                                        <CardDescription id="iconHint" style={{ display: hintVisibility }}>The image preview will round or circlify images. If you want to view the raw image without any rounding, click <Button id="unroundImages" style={{ padding: "0", height: "0" }} variant="link">here.</Button> Click <Button id="roundImages" style={{ padding: "0", height: "0" }} variant="link">here</Button> if you want to round the images again.</CardDescription>
                                    </div>


                                </div>
                            </CardContent>

                        </Card>
                        <Card id="themeCard1024" style={{ background: "hsla(var(--card) / 0.4)", backdropFilter: "blur(10px)" }} >
                            <CardHeader>
                                <CardTitle>Themes</CardTitle>
                                <CardDescription>Customize how Daylight looks. Each theme has a Dark and Light variant customizable from the widget on the top right.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Two-Factor Authentication</p>
                                        <p className="text-muted-foreground text-sm">Add an extra layer of security to your account</p>
                                    </div>
                                    <Switch id="two-factor-auth" />
                                </div>

                            </CardContent>
                            <CardFooter>
                                <Button>Update Security</Button>
                            </CardFooter>
                        </Card>
                        <Card id="generalCard" style={{ background: "hsla(var(--card) / 0.4)", backdropFilter: "blur(10px)" }} className="">
                            <CardHeader>
                                <CardTitle>General</CardTitle>
                                <CardDescription>Manage general settings here.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Light Theme</p>
                                        <p className="text-muted-foreground text-sm">Use a light background with dark text</p>
                                    </div>
                                    <RadioGroup id="theme" defaultValue="light" className="flex items-center gap-2">
                                        <RadioGroupItem id="theme-light" value="light" />
                                    </RadioGroup>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Dark Theme</p>
                                        <p className="text-muted-foreground text-sm">Use a dark background with light text</p>
                                    </div>
                                    <RadioGroup id="theme" defaultValue="light" className="flex items-center gap-2">
                                        <RadioGroupItem id="theme-dark" value="dark" />
                                    </RadioGroup>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save Theme</Button>
                            </CardFooter>
                        </Card>
                        <Card id="themeCard" style={{ background: "hsla(var(--card) / 0.4)", backdropFilter: "blur(10px)" }} className="theme">
                            <CardHeader>
                                <CardTitle>Themes</CardTitle>
                                <CardDescription>Customize how Daylight looks. Each theme has a Dark and Light variant customizable from the widget on the top right.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Two-Factor Authentication</p>
                                        <p className="text-muted-foreground text-sm">Add an extra layer of security to your account</p>
                                    </div>
                                    <Switch id="two-factor-auth" />
                                </div>

                            </CardContent>
                            <CardFooter>
                                <Button>Update Security</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>

                <Toaster richColors />
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
