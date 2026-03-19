import type { AmbientCondition } from "../types";
import { useSoundStore } from "../store/useSoundStore";
import { formatDistance, formatAnimalLabel } from "../utils/formatting";
import underwaterBg from "@/assets/58cf7a0f771955415ed9a0900074952ee2c8a1f7.png";

const contextPillColorOpaque: Record<AmbientCondition, string> = {
  calm: "var(--ss-state-calm-solid)",
  winter: "var(--ss-state-winter-solid)",
  storm: "var(--ss-state-storm-solid)",
  cruiseShip: "var(--ss-state-cruise-ship-solid)",
};

export default function SceneViewer() {
  const listener = useSoundStore((s) => s.listener);
  const source = useSoundStore((s) => s.source);
  const condition = useSoundStore((s) => s.oceanCondition);
  const distance = useSoundStore((s) => s.getDistance());

  return (
    <div className="relative h-full bg-white/5 rounded-lg overflow-hidden">
      <img
        src={underwaterBg}
        alt="Underwater scene"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />

      <div className="absolute inset-0 ss-home-overlay" />

      <div className="relative h-full p-8">
        {/* Listener - Left Side */}
        <div className="absolute left-1/3 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-white text-xs uppercase tracking-wider font-bold mb-2">Listener</div>
          <div className="relative">
            <span className="listener-ring listener-ring-1" />
            <span className="listener-ring listener-ring-2" />
            <span className="listener-ring listener-ring-3" />
            <div
              className="w-44 h-44 rounded-full border-8 bg-white/30 backdrop-blur-sm flex items-center justify-center p-4 shadow-2xl"
              style={{ borderColor: "var(--ss-signal-listener-stroke)" }}
            >
              <img src={listener.icon} alt={listener.name} className="w-full h-full object-contain drop-shadow-lg" />
            </div>
          </div>
          <div className="mt-3 text-white text-xl drop-shadow-lg">{formatAnimalLabel(listener.name)}</div>
          <div className="text-white/90 text-sm italic drop-shadow">{listener.scientificName}</div>
        </div>

        {/* Distance pill */}
        <div
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-lg font-bold text-white text-center shadow-lg border z-10"
          style={{ background: contextPillColorOpaque[condition], borderColor: "var(--ss-accent-secondary)" }}
        >
          <div className="text-[11px] uppercase tracking-wide text-white/90">Sound Perception Distance</div>
          <div className="text-xl leading-tight">{formatDistance(distance)}</div>
        </div>

        {/* Sound Producer - Right Side */}
        <div className="absolute left-2/3 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-right">
          <div className="text-white text-xs uppercase tracking-wider font-bold mb-2">Sound Producer</div>
          <div className="relative inline-block">
            <span className="source-ring source-ring-1" />
            <span className="source-ring source-ring-2" />
            <span className="source-ring source-ring-3" />
            <div
              className="w-44 h-44 rounded-full border-8 bg-white/30 backdrop-blur-sm flex items-center justify-center p-4 shadow-2xl"
              style={{ borderColor: "var(--ss-signal-source-stroke)" }}
            >
              <img src={source.icon} alt={source.name} className="w-full h-full object-contain drop-shadow-lg" />
            </div>
          </div>
          <div className="mt-3 text-white text-xl drop-shadow-lg">{formatAnimalLabel(source.name)}</div>
          <div className="text-white/90 text-sm italic drop-shadow">{source.scientificName}</div>
        </div>
      </div>
    </div>
  );
}
