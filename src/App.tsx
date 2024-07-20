import * as React from "react";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { useLocation, useRoutes } from "react-router-dom";

import Settings from "./routes/Settings";
import Home from "./routes/Home"
import Favorites from "./routes/Favorites"
import Addons from "./routes/Addons"
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
    }
  ]);

  if (!element) return null;

  console.log("Rendering route for path:", location.pathname);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={location.pathname}>
        {element}
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
