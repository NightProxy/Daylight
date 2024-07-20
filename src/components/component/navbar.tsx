import React from "react";
import { Button } from "@/components/ui/button";
import { Home, Star, ToyBrick, Settings } from "lucide-react";

export function Navbar({ home = "false", favorites = "false", addons = "false", settings = "false"}) {
  return (
    <header className="flex items-center justify-center py-4 fixed" style={{top: "10px", left: "50%",  transform: "translate(-50%)", zIndex: "10000"}}>
      <nav id="navbar" className="flex items-center rounded-full bg-transparent px-4 py-2 shadow-sm border">
        <Button
          className="rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
          variant="ghost"
          data-focus={home}
          id="home"
        > 
          <div className="container2">
          <Home style={{transition: "all 0.3s ease", marginLeft: "45px"}} size={20} />
          <p className="description" id="homeDescription">Home</p>
          </div>
          
        </Button>
        <Button
          className="rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
          id="favorites"
          variant="ghost"
          data-focus={favorites}
         
        >
          <div className="container2">
          <Star style={{transition: "all 0.3s ease", marginLeft: "70px"}} size={20} />
          <p className="description" id="favoritesDescription">Favorites</p>
          </div>
        </Button>
        
        <Button
          className="rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
          id="addons"
          variant="ghost"
          data-focus={addons}
         
        >
          <div className="container2">
          <ToyBrick style={{transition: "all 0.3s ease", marginLeft: "58px"}} size={20} />
          <p className="description" id="addonsDescription">Addons</p>
          </div>
        </Button>
        <Button
          className="rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
          id="settings"
          variant="ghost"
          data-focus={settings}
          
        >
          <div className="container2">
          <Settings style={{transition: "all 0.3s ease", marginLeft: "61px"}} size={20} />
          <p className="description" id="addonsDescription">Settings</p>
          </div>
        </Button>
      </nav>
    </header>
  );
}
