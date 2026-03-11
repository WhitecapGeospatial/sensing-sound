import { Link, useLocation } from "react-router";
import { Home, Info } from "lucide-react";
import logoImage from "@/assets/9962ff5db39642ae80b1efdc857274dd2ff0055a.png";

export default function Navigation() {
  const location = useLocation();

  return (
    <>
      {/* Logo - Top Left */}
      <div className="fixed top-8 left-8 z-20">
        <div className="bg-teal-700/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-2xl">
          <img src={logoImage} alt="SensingSound" className="h-12 w-auto" />
        </div>
      </div>

      {/* Navigation - Top Right */}
      <div className="fixed top-8 right-8 z-20 flex items-center gap-4">
        {/* Navigation */}
        <div className="flex gap-3">
          <Link
            to="/"
            className={`
              flex flex-col items-center justify-center w-16 h-16 rounded-full
              bg-white/20 backdrop-blur-sm transition-all duration-300
              ${location.pathname === "/" ? "bg-orange-500 scale-110" : "hover:bg-white/30"}
            `}
          >
            <Home className="w-6 h-6 text-white" />
            <div className="text-white text-xs font-medium mt-1">HOME</div>
          </Link>
          
          <Link
            to="/about"
            className={`
              flex flex-col items-center justify-center w-16 h-16 rounded-full
              bg-white/20 backdrop-blur-sm transition-all duration-300
              ${location.pathname === "/about" ? "bg-orange-500 scale-110" : "hover:bg-white/30"}
            `}
          >
            <Info className="w-6 h-6 text-white" />
            <div className="text-white text-xs font-medium mt-1">ABOUT</div>
          </Link>
        </div>
      </div>
    </>
  );
}