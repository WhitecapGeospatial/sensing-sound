import { Headphones } from "lucide-react";
import { ListenerType } from "../data/soundData";
import harborSealImage from "@/assets/ae6420e7e13fdb75fda431bbe0983f9edfff3ba0.png";
import dolphinImage from "@/assets/6e437c4de464e8599fcd42edacd7e3b7aa527daf.png";
import killerWhaleImage from "@/assets/7286e0f12e79234dbb73ab313c5a7334a01234ad.png";

interface ListenerSelectorProps {
  selected: ListenerType;
  onChange: (listener: ListenerType) => void;
}

export default function ListenerSelector({ selected, onChange }: ListenerSelectorProps) {
  const listeners: ListenerType[] = ["Harbor Seal", "Bottlenose Dolphin", "Killer Whale"];

  const getListenerIndex = (listener: ListenerType) => listeners.indexOf(listener);
  const currentIndex = getListenerIndex(selected);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value);
    onChange(listeners[index]);
  };

  const getListenerImage = (listener: ListenerType) => {
    if (listener === "Harbor Seal") return harborSealImage;
    if (listener === "Bottlenose Dolphin") return dolphinImage;
    return killerWhaleImage;
  };

  return (
    <div className="fixed bottom-8 left-8 z-10">
      <div className="bg-gradient-to-t from-teal-800/90 to-teal-700/70 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <Headphones className="w-5 h-5 text-orange-400" />
          <div className="text-orange-400 font-bold tracking-wider text-sm">
            CHOOSE LISTENER
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex gap-8 items-end">
            {listeners.map((listener, index) => (
              <div
                key={listener}
                className={`text-center transition-all duration-300 ${
                  index === currentIndex ? "scale-110" : "opacity-60"
                }`}
              >
                <div className={`w-20 h-20 mb-2 rounded-full flex items-center justify-center p-2 ${
                  index === currentIndex ? "bg-white/60" : "bg-white/20"
                }`}>
                  <img 
                    src={getListenerImage(listener)} 
                    alt={listener}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-white text-xs font-medium uppercase whitespace-nowrap">
                  {listener.split(" ").map((word, i) => (
                    <div key={i}>{word}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <input
            type="range"
            min="0"
            max="2"
            step="1"
            value={currentIndex}
            onChange={handleSliderChange}
            className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #f97316 0%, #f97316 ${
                (currentIndex / 2) * 100
              }%, rgba(255,255,255,0.3) ${(currentIndex / 2) * 100}%, rgba(255,255,255,0.3) 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}