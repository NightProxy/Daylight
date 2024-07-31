import * as React from "react";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { useLocation, useRoutes } from "react-router-dom";
//hello there!
//this handles routing..
//do you have any questions
//ahh we import them into the routes, any imported files in the pages will automatically
//be injected. we don't import them here.
//which page do u want to have a script to be injected
//or, we can juts code directly in the page!! 
//elaborate
//for those, we code directly in the route. look, follow me
import Settings from "./routes/Settings";
import Home from "./routes/Home"
import Favorites from "./routes/Favorites"
import Go from "./routes/Go"
import Addons from "./routes/Addons"
import ErrorBoundary from "./routes/ErrorBoundary";
import Landing from "./routes/Landing"
export default function App() {
  const location = useLocation();
  const isPresent = useIsPresent();
  const element = useRoutes([
    {
      path: "/",
      element: <Home />,
      
    },
    {
      path: "/settings",
      element: <Settings />
    },
    {
      path: "/favorites",
      element: <Favorites />
    },
    {
      path: "/addons",
      element: <Addons />
    },
    {
      path: "/go",
      element: <Go />
    },
    {
      path: "/landing",
      element: <Landing documentClassList={localStorage.getItem("documentClassList")}/>
    }
  ]);

  if (!element) return null;

  console.log("Rendering route for path:", location.pathname);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={location.pathname}>
        <ErrorBoundary>
        {element}
        </ErrorBoundary>
        
        <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
        exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="privacy-screen"
      />
      </motion.div>
    </AnimatePresence>
  );
}
