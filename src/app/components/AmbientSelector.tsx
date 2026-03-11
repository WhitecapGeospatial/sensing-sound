import { Ship, CloudRainWind, Wind, Waves } from "lucide-react";
import { AmbientCondition } from "../data/soundData";
import windIcon from "@/assets/784a77a0f0c0038971397b6e6f7015e9b7c234e7.png";
import windWavesIcon from "@/assets/12f4059262a1e4783417b0a59b00d843925de4c3.png";
import stormIcon from "@/assets/5b3d7954d5b036202934c5a13a0ba824127398df.png";

interface AmbientSelectorProps {
  selected: AmbientCondition;
  onChange: (condition: AmbientCondition) => void;
}

export default function AmbientSelector({ selected, onChange }: AmbientSelectorProps) {
  const conditions: { value: AmbientCondition; label: string; icon: React.ReactNode }[] = [
    { value: "cruiseShip", label: "CRUISE\nSHIP", icon: <Ship className="w-8 h-8" /> },
    { value: "storm", label: "STORM\nEVENT", icon: <img src={stormIcon} alt="Storm" className="w-8 h-8 object-contain" /> },
    { value: "winter", label: "WIND &\nWAVES", icon: <img src={windWavesIcon} alt="Wind & Waves" className="w-8 h-8 object-contain" /> },
    { value: "calm", label: "CALM\nSEAS", icon: <Waves className="w-8 h-8" /> },
  ];

  return (
    <div className="fixed left-8 top-32 z-10">
      <div className="bg-gradient-to-r from-teal-800/90 to-teal-700/70 backdrop-blur-sm p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <img src={windIcon} alt="Wind" className="w-6 h-6 object-contain" />
          <div>
            <div className="text-orange-400 font-bold tracking-wider text-sm">CHOOSE</div>
            <div className="text-orange-400 font-bold tracking-wider text-sm">CONTEXT</div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {conditions.map((condition) => (
            <button
              key={condition.value}
              onClick={() => onChange(condition.value)}
              className={`
                flex items-center gap-3 p-4 rounded-xl transition-all duration-300
                ${
                  selected === condition.value
                    ? "bg-orange-500 text-white shadow-lg scale-105"
                    : "bg-white/20 text-white hover:bg-white/30"
                }
              `}
            >
              <div className="w-10 h-10 flex items-center justify-center">
                {condition.icon}
              </div>
              <div className="text-left text-sm font-semibold whitespace-pre-line leading-tight">
                {condition.label}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/30">
          <div className="text-white/90 text-xs font-medium mb-2">LOOK</div>
          <div className="text-white/90 text-xs font-medium">AROUND</div>
          <div className="mt-3 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    </div>
  );
}