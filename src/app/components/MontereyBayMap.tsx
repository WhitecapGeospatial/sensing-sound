import { ListenerType, SourceType, AmbientCondition, soundData } from '../data/soundData';
import harborSealImage from "@/assets/ae6420e7e13fdb75fda431bbe0983f9edfff3ba0.png";
import dolphinImage from "@/assets/6e437c4de464e8599fcd42edacd7e3b7aa527daf.png";
import killerWhaleImage from "@/assets/7286e0f12e79234dbb73ab313c5a7334a01234ad.png";
import rockfishImage from "@/assets/1a59581f38678f44d8c992e8f18dd3d6d87706f7.png";

interface MontereyBayMapProps {
  listener: ListenerType;
  source: SourceType;
  condition: AmbientCondition;
}

export default function MontereyBayMap({ listener, source, condition }: MontereyBayMapProps) {
  const getAnimalIcon = (animal: string): string => {
    if (animal.includes("harbor seal")) return harborSealImage;
    if (animal.includes("bottlenose dolphin")) return dolphinImage;
    if (animal.includes("killer whale")) return killerWhaleImage;
    if (animal.includes("rockfish")) return rockfishImage;
    return "";
  };

  // Define positions for each sound source (percentage-based for SVG)
  const positions: Record<SourceType, { x: number; y: number }> = {
    'Harbor Seal': { x: 30, y: 50 },
    'Rockfish': { x: 50, y: 70 },
    'Bottlenose Dolphin': { x: 70, y: 40 },
    'Killer Whale': { x: 60, y: 25 },
  };

  // Get distance for current selection
  const key = `${listener}/${source}`;
  const distances = soundData[key];
  
  let percentDecrease = 0;
  if (distances) {
    const currentDistance = distances[condition];
    const calmDistance = distances.calm;
    percentDecrease = ((calmDistance - currentDistance) / calmDistance) * 100;
  }

  const getConditionColor = () => {
    if (condition === 'calm') return 'rgba(45, 212, 191, 0.6)';
    if (condition === 'winter') return 'rgba(234, 179, 8, 0.5)';
    if (condition === 'storm') return 'rgba(220, 38, 38, 0.5)';
    return 'rgba(127, 29, 29, 0.5)';
  };

  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-blue-100 relative">
      {/* Static map-like background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-100 to-teal-100">
        {/* Coastline simulation */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="water" patternUnits="userSpaceOnUse" width="4" height="4">
              <path d="M0,2 Q1,1 2,2 T4,2" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="0.5" fill="none"/>
            </pattern>
          </defs>
          
          {/* Water pattern */}
          <rect width="100" height="100" fill="url(#water)" />
          
          {/* Coastline */}
          <path 
            d="M 0,20 Q 20,15 30,25 T 50,20 T 70,30 T 100,25 L 100,0 L 0,0 Z" 
            fill="rgba(134, 239, 172, 0.3)" 
            stroke="rgba(34, 197, 94, 0.4)" 
            strokeWidth="0.5"
          />
          
          {/* Bay label */}
          <text x="50" y="85" fontSize="3" fill="rgba(0, 0, 0, 0.3)" textAnchor="middle" fontWeight="bold">
            MONTEREY BAY
          </text>
        </svg>

        {/* All sound sources as markers */}
        {Object.entries(positions).map(([sourceType, pos]) => {
          const isActive = sourceType === source;
          const sourceKey = `${listener}/${sourceType}`;
          const sourceDistances = soundData[sourceKey];
          
          let sourcePercentDecrease = 0;
          if (sourceDistances) {
            const currentDist = sourceDistances[condition];
            const calmDist = sourceDistances.calm;
            sourcePercentDecrease = ((calmDist - currentDist) / calmDist) * 100;
          }
          
          const size = isActive ? Math.max(30, 60 - sourcePercentDecrease * 0.4) : 20;
          
          return (
            <div
              key={sourceType}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
              style={{ 
                left: `${pos.x}%`, 
                top: `${pos.y}%`,
              }}
            >
              {/* Circle */}
              <div 
                className={`rounded-full border-2 border-white flex items-center justify-center shadow-lg ${
                  isActive ? 'ring-2 ring-orange-400 z-20' : 'z-10'
                }`}
                style={{ 
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: isActive ? getConditionColor() : 'rgba(255, 255, 255, 0.4)',
                }}
              >
                <img 
                  src={getAnimalIcon(sourceType.toLowerCase())} 
                  alt={sourceType}
                  className="object-contain"
                  style={{ width: `${size * 0.6}px`, height: `${size * 0.6}px` }}
                />
              </div>
              
              {/* Label */}
              {isActive && (
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className="bg-white/90 px-2 py-1 rounded text-[8px] font-semibold text-teal-900 shadow">
                    {sourceType}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
