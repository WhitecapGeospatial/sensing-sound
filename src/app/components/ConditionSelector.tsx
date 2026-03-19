import { useState } from "react";
import { Info } from "lucide-react";
import type { AmbientCondition, AmbientConditionInfo } from "../types";
import { useSoundStore } from "../store/useSoundStore";
import contextIcon from "@/assets/784a77a0f0c0038971397b6e6f7015e9b7c234e7.png";
import calmIcon from "@/assets/e65a9047f4f935b712f1a005b183ec3f059d51e1.png";
import winterIcon from "@/assets/5b3d7954d5b036202934c5a13a0ba824127398df.png";
import stormIcon from "@/assets/fb96a261a239fa7f23f5d07c3a46c921e5be61bd.png";
import cruiseShipIcon from "@/assets/12f4059262a1e4783417b0a59b00d843925de4c3.png";

const contextOrder: AmbientCondition[] = ["calm", "winter", "storm", "cruiseShip"];
const contextDisplayOrder: AmbientCondition[] = [...contextOrder].reverse();

const contextPillColor: Record<AmbientCondition, string> = {
  calm: "var(--ss-state-calm)",
  winter: "var(--ss-state-winter)",
  storm: "var(--ss-state-storm)",
  cruiseShip: "var(--ss-state-cruise-ship)",
};

const conditionColors: Record<AmbientCondition, string> = {
  calm: "ss-selected-calm",
  winter: "ss-selected-winter",
  storm: "ss-selected-storm",
  cruiseShip: "ss-selected-cruise",
};

const conditionLabels: Record<AmbientCondition, AmbientConditionInfo> = {
  calm: { title: "CALM", subtitle: "Summer", description: "Quiet seas maximize listening distance." },
  winter: { title: "WIND & WAVES", subtitle: "Winter", description: "Surface chop masks distant calls." },
  storm: { title: "STORM", subtitle: "Heavy wind and waves", description: "High intensity ambient noise masks noise." },
  cruiseShip: { title: "CRUISE SHIP", subtitle: "Ship noise", description: "Engine hum narrows hearing range." },
};

const conditionIcons: Record<AmbientCondition, string> = {
  calm: calmIcon,
  winter: cruiseShipIcon,
  storm: winterIcon,
  cruiseShip: stormIcon,
};

function ConditionPill({
  conditionType,
  isSelected,
  onSelect,
}: {
  conditionType: AmbientCondition;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <button
      onClick={onSelect}
      className={`h-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 ${
        isSelected
          ? `${conditionColors[conditionType]} ring-2 ring-white shadow-lg`
          : "bg-white/10 hover:bg-white/20"
      }`}
    >
      <img
        src={conditionIcons[conditionType]}
        alt=""
        className={`w-8 h-8 object-contain ${isSelected ? "scale-110" : ""}`}
      />
      <div className="text-left leading-tight flex-1">
        <div className={`text-white text-xs font-semibold uppercase ${isSelected ? "font-bold" : ""}`}>
          {conditionLabels[conditionType].title}
        </div>
      </div>
      <div
        className="relative"
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
      >
        <Info className="w-4 h-4 text-white/60 hover:text-white/90 cursor-help transition-colors" />
        {showInfo && (
          <div className="absolute right-0 top-full mt-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-50 shadow-lg border border-white/10">
            {conditionLabels[conditionType].description}
          </div>
        )}
      </div>
    </button>
  );
}

export default function ConditionSelector() {
  const condition = useSoundStore((s) => s.oceanCondition);
  const setCondition = useSoundStore((s) => s.setOceanCondition);
  const currentContextIndex = contextOrder.indexOf(condition);

  return (
    <div className="ss-panel-soft rounded-lg p-3 h-full flex flex-col">
      <div className="flex items-center gap-2 ss-accent-text text-sm uppercase tracking-wider font-bold" style={{ flex: "0 0 20%" }}>
        <img src={contextIcon} alt="" className="w-5 h-5 object-contain opacity-80" />
        <span>SELECT CONTEXT</span>
      </div>
      <div className="flex gap-3 items-stretch" style={{ flex: "0 0 80%" }}>
        <div className="w-10 flex flex-col items-center">
          <div className="text-[9px] uppercase tracking-wide text-white/70 mb-1">Volume</div>
          <div className="relative flex-1 w-full">
            <input
              type="range"
              min={0}
              max={3}
              step={1}
              value={currentContextIndex}
              onChange={(e) => setCondition(contextOrder[Number(e.target.value)])}
              className="context-knob absolute left-1/2 -translate-x-1/2 top-[11.375%] h-[77.25%]"
              style={{ ["--context-slider-color" as string]: contextPillColor[condition] }}
              aria-label="Context volume control"
            />
          </div>
        </div>
        <div className="grid grid-rows-4 gap-2 flex-1">
          {contextDisplayOrder.map((conditionType) => (
            <ConditionPill
              key={conditionType}
              conditionType={conditionType}
              isSelected={condition === conditionType}
              onSelect={() => setCondition(conditionType)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
