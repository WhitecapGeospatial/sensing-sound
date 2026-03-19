import { Link } from "react-router";
import { Info } from "lucide-react";
import logoImage from "@/assets/9962ff5db39642ae80b1efdc857274dd2ff0055a.png";

export default function Navigation() {
  return (
    <header className="flex-none z-20 flex items-center justify-between px-6 py-3 bg-teal-900/60 backdrop-blur-sm">
      <img src={logoImage} alt="Sensing Sound" className="h-10 w-auto" />
      <Link
        to="/"
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <Info className="w-5 h-5 text-white" />
        <span className="text-white text-sm font-medium">About</span>
      </Link>
    </header>
  );
}