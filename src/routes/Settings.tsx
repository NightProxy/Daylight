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
import { ChevronDown } from "lucide-react"
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

function login() {
    var gen = document.getElementById("generalCard")
    var themec = document.getElementById("themeCard")
    var cloc = document.getElementById("cloakCard")
    var sea = document.getElementById("searchCard")
    function check() {
        if (sea!.style.height == "400px") {
            gen!.style.transition = "margin-top 0.2s ease-out"
            themec!.style.height = ""
            cloc!.style.height = ""
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
            value: "dynamic",
            label: "Dynamic",
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
    function setInitialColor() {
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
        function responsive() {

        }
        setInterval(responsive, 10)
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
                if (isClosed) {

                    gen!.style.transition = "margin-top 0.2s ease-out"
                    themec!.style.height = ""
                    cloc!.style.height = ""
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











                } else {
                    setTimeout(function () {


                        $("#accTrigger").removeAttr("disabled")
                        document.getElementById('generalCard')!.style.marginTop = "0"
                        setTimeout(function () {
                            document.getElementById('generalCard')!.style.marginTop = ""
                            gen!.style.width = "310%"
                            gen!.style.marginLeft = "auto"
                            document.getElementById("searchCard")!.style.height = "400px"





                            themec!.style.height = ""
                            cloc!.style.height = ""

                        }, 200)

                    }, 200)



                }
            } else {
                console.log(window.innerWidth)
                if (isClosed) {
                    document.getElementById("cloakDescription")!.style.opacity = "0"
                    document.getElementById("saveCloak")!.style.opacity = "0"
                    document.getElementById("customCloakTitleInput")!.style.opacity = "0"
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
                        document.getElementById("saveCloak")!.style.opacity = "1"
                        document.getElementById("customCloakTitleInput")!.style.opacity = "1"
                        if (localStorage.getItem("cloak") == "custom") {
                            document.getElementById("cloakTitle")!.textContent = "Custom Cloak Active"
                        } else {
                            document.getElementById("cloakTitle")!.textContent = `${capitalizefr(localStorage.getItem("cloak") as string)} Cloak Active`
                        }
                    }, 200)


                }
            }



        });
        var ct = document.getElementById("cloakTitle")
        var cd = document.getElementById("cloakDescription")
        var saveC = document.getElementById("saveCloak")
        $(window).on("resize", function () {
            if (window.innerWidth >= 1024) {
                document.getElementById('generalCard')!.style.marginTop = ""
                gen!.style.width = "310%"
                gen!.style.marginLeft = "auto"
                document.getElementById("searchCard")!.style.height = "400px"





                themec!.style.height = ""
                cloc!.style.height = "100%"

            } else {
                cloc!.style.height = "300px"
                themec!.style.marginTop = "-275px"
                themec!.style.height = "260px"
                gen!.style.width = "205%"
                gen!.style.width = "100%"

                cloc!.style.height = "100%"
                themec!.style.marginTop = "0"
                themec!.style.height = "100%"

            }
        })
        $("#googleCloak").on("click", function () {
            ct!.style.opacity = "0"
            cd!.style.opacity = "0"
            document.getElementById("customCloakTitleInput")!.style.opacity = "0"
            document.getElementById("saveCloak")!.style.opacity = "0"
            if (localStorage.getItem("cloak")) {
                if (localStorage.getItem("cloak") == "google") {
                    setTimeout(function () {
                        document.getElementById("cloakTitle")!.textContent = "No cloak set."
                        cd!.textContent = "Enable a cloak to reduce the chances of this link getting blocked."
                    }, 200)
                } else {
                    localStorage.setItem("cloak", "google")
            localStorage.setItem("cloakTab", "google")
            setTimeout(function () {
                document.getElementById("cloakTitle")!.textContent = "Google Cloak Active"
                document.getElementById("cloakDescription")!.textContent = 'You have selected the "Google" website as your cloak. Chances of proctor or admin not finding out (the higher the better, approximate, this is my opinion): 2/5'
                ct!.style.opacity = "1"
                cd!.style.opacity = "1"
            }, 200)
                }
            } else {
                localStorage.setItem("cloak", "google")
            localStorage.setItem("cloakTab", "google")
            setTimeout(function () {
                document.getElementById("cloakTitle")!.textContent = "Google Cloak Active"
                document.getElementById("cloakDescription")!.textContent = 'You have selected the "Google" website as your cloak. Chances of proctor or admin not finding out (the higher the better, approximate, this is my opinion): 2/5'
                ct!.style.opacity = "1"
                cd!.style.opacity = "1"
            }, 200)
            }
            

        })
        $("#schoologyCloak").on("click", function () {
            ct!.style.opacity = "0"
            cd!.style.opacity = "0"
            document.getElementById("customCloakTitleInput")!.style.opacity = "0"
            document.getElementById("saveCloak")!.style.opacity = "0"
            if (localStorage.getItem("cloak")) {
                if (localStorage.getItem("cloak") == "schoology") {
                    console.log("womp womp womp wopm")
                    setTimeout(function () {
                        document.getElementById("cloakTitle")!.textContent = "No cloak set."
                        cd!.textContent = "Enable a cloak to reduce the chances of this link getting blocked."
                    }, 200)
                } else {
                    localStorage.setItem("cloak", "schoology")
                    localStorage.setItem("cloakTab", "schoology")
                    setTimeout(function () {
                        document.getElementById("cloakTitle")!.textContent = "Schoology Cloak Active"
                        document.getElementById("cloakDescription")!.textContent = 'You have selected the "Schoology" service as your cloak. Chances of proctor or admin not finding out (the higher the better, approximate, my opinion, if your school uses this service): 5/5 (Most schools have custom domains for Schoology). If your school does not use this service, your chances are: 2/5'
                        ct!.style.opacity = "1"
                        cd!.style.opacity = "1"
                    }, 200)
                }
            } else {
                localStorage.setItem("cloak", "schoology")
            localStorage.setItem("cloakTab", "schoology")
            setTimeout(function () {
                document.getElementById("cloakTitle")!.textContent = "Schoology Cloak Active"
                document.getElementById("cloakDescription")!.textContent = 'You have selected the "Schoology" service as your cloak. Chances of proctor or admin not finding out (the higher the better, approximate, my opinion, if your school uses this service): 5/5 (Most schools have custom domains for Schoology). If your school does not use this service, your chances are: 2/5'
                ct!.style.opacity = "1"
                cd!.style.opacity = "1"
            }, 200)
            }
            


        })
        $("#canvasCloak").on("click", function () {
            ct!.style.opacity = "0"
            cd!.style.opacity = "0"
            document.getElementById("customCloakTitleInput")!.style.opacity = "0"
            document.getElementById("saveCloak")!.style.opacity = "0"
            if (localStorage.getItem("cloak")) {
                if (localStorage.getItem("cloak") == "canvas") {
                    setTimeout(function () {
                        document.getElementById("cloakTitle")!.textContent = "No cloak set."
                        cd!.textContent = "Enable a cloak to reduce the chances of this link getting blocked."
                    }, 200)
                } else {
                    localStorage.setItem("cloak", "canvas")
            localStorage.setItem("cloakTab", "canvas")
            setTimeout(function () {
                document.getElementById("cloakTitle")!.textContent = "Canvas Cloak Active"
                document.getElementById("cloakDescription")!.textContent = `You have selected the "Canvas" service as your cloak. Chances of proctor or admin not finding out (the higher the better, approximate, this is my opinion, if your school uses this service): 3/5 (The title set as the cloak may differ than Canvas' actual title)`
                ct!.style.opacity = "1"
                cd!.style.opacity = "1"
            }, 200)
                }
            } else {
                localStorage.setItem("cloak", "canvas")
            localStorage.setItem("cloakTab", "canvas")
            setTimeout(function () {
                document.getElementById("cloakTitle")!.textContent = "Canvas Cloak Active"
                document.getElementById("cloakDescription")!.textContent = `You have selected the "Canvas" service as your cloak. Chances of proctor or admin not finding out (the higher the better, approximate, this is my opinion, if your school uses this service): 3/5 (The title set as the cloak may differ than Canvas' actual title)`
                ct!.style.opacity = "1"
                cd!.style.opacity = "1"
            }, 200)
            }
            

        })
        $("#docsCloak").on("click", function () {
            ct!.style.opacity = "0"
            cd!.style.opacity = "0"
            document.getElementById("customCloakTitleInput")!.style.opacity = "0"
            document.getElementById("saveCloak")!.style.opacity = "0"
            if (localStorage.getItem("cloak")) {
                if (localStorage.getItem("cloak") == "docs") {
                    setTimeout(function () {
                        document.getElementById("cloakTitle")!.textContent = "No cloak set."
                        cd!.textContent = "Enable a cloak to reduce the chances of this link getting blocked."
                    }, 200)
                } else {
                    localStorage.setItem("cloak", "docs")
                    localStorage.setItem("cloakTab", "docs")
                    setTimeout(function () {
                        document.getElementById("cloakTitle")!.textContent = "Docs Cloak Active"
                        document.getElementById("cloakDescription")!.textContent = 'You have selected the "Google Docs" service as your cloak. Chances of proctor or admin not finding out (the higher the better, approximate, this is my opinion): 4/5 (They would think your writing an essay)'
                        ct!.style.opacity = "1"
                        cd!.style.opacity = "1"
                    }, 200)
                }
            } else {
                localStorage.setItem("cloak", "docs")
                localStorage.setItem("cloakTab", "docs")
                setTimeout(function () {
                    document.getElementById("cloakTitle")!.textContent = "Docs Cloak Active"
                    document.getElementById("cloakDescription")!.textContent = 'You have selected the "Google Docs" service as your cloak. Chances of proctor or admin not finding out (the higher the better, approximate, this is my opinion): 4/5 (They would think your writing an essay)'
                    ct!.style.opacity = "1"
                    cd!.style.opacity = "1"
                }, 200)
            }


        })
        $("#slidesCloak").on("click", function () {
            ct!.style.opacity = "0"
            cd!.style.opacity = "0"
            document.getElementById("customCloakTitleInput")!.style.opacity = "0"
            document.getElementById("saveCloak")!.style.opacity = "0"
            if (localStorage.getItem("cloak")) {
                if (localStorage.getItem("cloak") == "slides") {
                    setTimeout(function () {
                        document.getElementById("cloakTitle")!.textContent = "No cloak set."
                        cd!.textContent = "Enable a cloak to reduce the chances of this link getting blocked."
                    }, 200)
                } else {
                    localStorage.setItem("cloak", "slides")
                    localStorage.setItem("cloakTab", "slides")
                    setTimeout(function () {
                        document.getElementById("cloakTitle")!.textContent = "Slides Cloak Active"
                        document.getElementById("cloakDescription")!.textContent = 'You have selected the "Google Slides" service as your cloak. Chances of proctor or admin not finding out (the higher the better, approximate, this is my opinion): 3/5'
                        ct!.style.opacity = "1"
                        cd!.style.opacity = "1"
                    }, 200)
                }
            } else {
                localStorage.setItem("cloak", "slides")
                localStorage.setItem("cloakTab", "slides")
                setTimeout(function () {
                    document.getElementById("cloakTitle")!.textContent = "Slides Cloak Active"
                    document.getElementById("cloakDescription")!.textContent = 'You have selected the "Google Slides" service as your cloak. Chances of proctor or admin not finding out (the higher the better, approximate, this is my opinion): 3/5'
                    ct!.style.opacity = "1"
                    cd!.style.opacity = "1"
                }, 200)
            }


        })
        $("#classroomCloak").on("click", function () {
            ct!.style.opacity = "0"
            cd!.style.opacity = "0"
            document.getElementById("customCloakTitleInput")!.style.opacity = "0"
            document.getElementById("saveCloak")!.style.opacity = "0"
            if (localStorage.getItem("cloak")) {
                if (localStorage.getItem("cloak") == "classroom") {
                    setTimeout(function () {
                        document.getElementById("cloakTitle")!.textContent = "No cloak set."
                        cd!.textContent = "Enable a cloak to reduce the chances of this link getting blocked."
                    }, 200)
                } else {
                    localStorage.setItem("cloak", "classroom")
                    localStorage.setItem("cloakTab", "classroom")
                    setTimeout(function () {
                        document.getElementById("cloakTitle")!.textContent = "Classroom Cloak Active"
                        document.getElementById("cloakDescription")!.textContent = 'You have selected the "Google Classroom" service as your cloak. Chances of your proctor or admin not finding out (if your school uses Google Classrom): 4/5. If your school does not use Google Classroom, your chances are: 1/5. (They would be confused)'
                        ct!.style.opacity = "1"
                        cd!.style.opacity = "1"
                    }, 200)
                }
            } else {
                localStorage.setItem("cloak", "classroom")
                localStorage.setItem("cloakTab", "classroom")
                setTimeout(function () {
                    document.getElementById("cloakTitle")!.textContent = "Classroom Cloak Active"
                    document.getElementById("cloakDescription")!.textContent = 'You have selected the "Google Classroom" service as your cloak. Chances of your proctor or admin not finding out (if your school uses Google Classrom): 4/5. If your school does not use Google Classroom, your chances are: 1/5. (They would be confused)'
                    ct!.style.opacity = "1"
                    cd!.style.opacity = "1"
                }, 200)
            }


        })
        $("#customCloakButton").on("click", function () {
            ct!.style.opacity = "0"
            cd!.style.opacity = "0"
            document.getElementById("customCloakTitleInput")!.style.opacity = "0"
            document.getElementById("saveCloak")!.style.opacity = "0"
            if (localStorage.getItem("cloak")) {
                if (localStorage.getItem("cloak") == "custom") {
                    setTimeout(function () {
                        document.getElementById("cloakTitle")!.textContent = "No cloak set."
                        cd!.textContent = "Enable a cloak to reduce the chances of this link getting blocked."
                    }, 200)
                } else {
                    localStorage.setItem("cloak", "custom")
                    localStorage.setItem("cloakTab", "custom")
                    setTimeout(function () {
                        document.getElementById("customCloakTitleInput")!.style.opacity = "1"
                        document.getElementById("saveCloak")!.style.opacity = "1"
                        document.getElementById("cloakTitle")!.textContent = "Custom Cloaks"
                        document.getElementById("cloakDescription")!.textContent = "Want to cloak a website that's not listed? Make your own!"
                        ct!.style.opacity = "1"
                        cd!.style.opacity = "1"
                    }, 200)
                }
            } else {
                localStorage.setItem("cloak", "custom")
                localStorage.setItem("cloakTab", "custom")
                setTimeout(function () {
                    document.getElementById("customCloakTitleInput")!.style.opacity = "1"
                    document.getElementById("saveCloak")!.style.opacity = "1"
                    document.getElementById("cloakTitle")!.textContent = "Custom Cloaks"
                    document.getElementById("cloakDescription")!.textContent = "Want to cloak a website that's not listed? Make your own!"
                    ct!.style.opacity = "1"
                    cd!.style.opacity = "1"
                }, 200)
            }



        })



    }, [])

    return (
        <>

            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <div id="light" style={{
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
                }}>

                </div>
                <div id="dark" style={{
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
                }} className="opacity-0">

                </div>
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
                                    <ToggleGroupItem id="customCloakButton" value="custom" aria-label="Toggle Custom cloak">
                                        <TbWorld size={20} />
                                    </ToggleGroupItem>
                                </ToggleGroup>


                                <div className="flex items-center justify-between">
                                    <div>
                                        <p id="cloakTitle" className="font-medium">Push Notifications</p>
                                        <p id="cloakDescription" className="text-muted-foreground text-sm">Receive push notifications on your devices</p>
                                        <Input id="customCloakTitleInput" className="" placeholder="Enter the title of the custom cloak..."></Input>
                                        <br />
                                        <Button id="saveCloak" className="">Save</Button>
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
