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
  import { SiCanvas } from "react-icons/si";

function login() {
    const [accordionDelay, setAccordionDelay] = useState(0)
    const proxyChange = (value: string) => {
        console.log("gyatt", value)
        //add handling 
      }
      const searchChange = (value: string) => {
        console.log("gyatt", value)
        //add handling 
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
        function responsive(){

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

            var isClosed = $("#accTrigger").attr("data-state") === "closed";

            console.log("AHAHAHAH")
            if (window.innerWidth >= 1024) {
                if (isClosed) {
                    document.getElementById("generalCard")!.style.transition = "margin-top 0.2s ease-out"
                    document.getElementById("themeCard")!.style.height = ""
                    document.getElementById("cloakCard")!.style.height = ""
                    document.getElementById("generalCard")!.style.marginTop = "157.5px"
                    document.getElementById("generalCard")!.style.transition = "all 0.2s ease-out"
                    document.getElementById("searchCard")!.style.height = "715px"


                    document.getElementById("generalCard")!.style.width = "205%"
                    document.getElementById("generalCard")!.style.marginLeft = "105%"
                    
                    setTimeout(function(){
                        document.getElementById('generalCard')!.style.marginTop = "0"
                    }, 200)
                        setTimeout(function(){
                            document.getElementById("generalCard")!.style.marginTop = "-315px"
                            document.getElementById("generalCard")!.style.transition = "all 0.2s ease-out"
                        }, 200)
                    
                    
                    








                } else {
                    setTimeout(function () {

                        document.getElementById('generalCard')!.style.marginTop = "0"
                        setTimeout(function () {
                            document.getElementById('generalCard')!.style.marginTop = ""
                            document.getElementById("generalCard")!.style.width = "310%"
                            document.getElementById("generalCard")!.style.marginLeft = "auto"
                            document.getElementById("searchCard")!.style.height = "400px"





                            document.getElementById("themeCard")!.style.height = ""
                            document.getElementById("cloakCard")!.style.height = ""
                        }, 200)

                    }, 200)



                }
            } else {
                console.log(window.innerWidth)
                if (isClosed) {
                    document.getElementById("cloakCard")!.style.height = "300px"
                    document.getElementById("themeCard")!.style.marginTop = "-275px"
                    document.getElementById("themeCard")!.style.height = "260px"
                    setTimeout(function () {
                        document.getElementById("generalCard")!.style.width = "205%"
                    }, 200)

                } else {
                    document.getElementById("generalCard")!.style.width = "100%"

                    document.getElementById("cloakCard")!.style.height = "100%"
                    document.getElementById("themeCard")!.style.marginTop = "0"
                    document.getElementById("themeCard")!.style.height = "100%"



                }
            }



        });

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
                                    <ToggleGroup variant="outline" type="single">
      <ToggleGroupItem value="google" aria-label="Toggle Google cloak">
      <i className="fa-brands fa-google"></i>
      </ToggleGroupItem>
      <ToggleGroupItem value="schoology" aria-label="Toggle Schoology cloak">
        <i className="fa-regular fa-circle-s"></i>
      </ToggleGroupItem>
      <ToggleGroupItem value="canvas" aria-label="Toggle Canvas cloak">
      <SiCanvas  size={20}/>

      </ToggleGroupItem>
    </ToggleGroup>

                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Push Notifications</p>
                                        <p className="text-muted-foreground text-sm">Receive push notifications on your devices</p>
                                    </div>
                                    <Switch id="push-notifications" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save Preferences</Button>
                            </CardFooter>
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
