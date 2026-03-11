import { useState, useEffect, useRef } from "react";
import { Activity, Ruler, ChevronLeft, ChevronRight, ChevronDown, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { soundData, ListenerType, SourceType, AmbientCondition } from "../data/soundData";
import harborSealImage from "@/assets/ae6420e7e13fdb75fda431bbe0983f9edfff3ba0.png";
import dolphinImage from "@/assets/6e437c4de464e8599fcd42edacd7e3b7aa527daf.png";
import killerWhaleImage from "@/assets/7286e0f12e79234dbb73ab313c5a7334a01234ad.png";
import rockfishImage from "@/assets/1a59581f38678f44d8c992e8f18dd3d6d87706f7.png";
import calmIcon from "@/assets/e65a9047f4f935b712f1a005b183ec3f059d51e1.png";
import winterIcon from "@/assets/5b3d7954d5b036202934c5a13a0ba824127398df.png";
import stormIcon from "@/assets/fb96a261a239fa7f23f5d07c3a46c921e5be61bd.png";
import cruiseShipIcon from "@/assets/12f4059262a1e4783417b0a59b00d843925de4c3.png";
import logoImage from "@/assets/9962ff5db39642ae80b1efdc857274dd2ff0055a.png";
import listenerIcon from "@/assets/ca9fb87cf475c6320024953a6c99f360a8bb7fa4.png";
import soundIcon from "@/assets/fdfd2fb83371a16d3a6b5ce24d5901f66d00b810.png";
import contextIcon from "@/assets/784a77a0f0c0038971397b6e6f7015e9b7c234e7.png";
import underwaterBg from "@/assets/58cf7a0f771955415ed9a0900074952ee2c8a1f7.png";
import rockfishGruntAudio from "@/assets/Bocaccio-Rockfish_Grunt.wav";
import killerWhaleCallAudio from "@/assets/Killer-whale_call.m4a";
import dolphinWhistleAudio from "@/assets/Dolphin-whistle.m4a";
import harborSealRoarAudio from "@/assets/Harbor-seal_roar_06062016_Project 006_sprouts.wav";
import rockfishGruntSpectrogram from "@/assets/Bocaccio-Rockfish_Grunt_spectrogram.png";
import dolphinWhistleSpectrogram from "@/assets/Dolphin-whistle_spectrogram.png";
import killerWhaleCallSpectrogram from "@/assets/Killer-whale_call_spectrogram.png";
import harborSealRoarSpectrogram from "@/assets/Harbor-seal_roar_spectrogram.png";
import MontereyBayMap from "./MontereyBayMap";
import PolarPlot from "./PolarPlot";
import Frame8 from "../../imports/Frame8";

interface SoundVisualizationProps {
  listener: ListenerType;
  source: SourceType;
  condition: AmbientCondition;
  onListenerChange: (listener: ListenerType) => void;
  onSourceChange: (source: SourceType) => void;
  onConditionChange: (condition: AmbientCondition) => void;
}

export default function SoundVisualization({ listener, source, condition, onListenerChange, onSourceChange, onConditionChange }: SoundVisualizationProps) {
  const [hoveredBar, setHoveredBar] = useState<{ key: string; condition: AmbientCondition } | null>(null);
  const [hoveredListener, setHoveredListener] = useState<ListenerType | null>(null);
  const [invalidNotice, setInvalidNotice] = useState<{ title: string; subtitle: string; detail: string } | null>(null);
  const [showHearingRanges, setShowHearingRanges] = useState(false);
  const [showListenerDropdown, setShowListenerDropdown] = useState(false);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [rockfishIsPlaying, setRockfishIsPlaying] = useState(false);
  const [rockfishProgress, setRockfishProgress] = useState(0);
  const [rockfishDuration, setRockfishDuration] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [listenerScrollOffset, setListenerScrollOffset] = useState(0);
  const [sourceScrollOffset, setSourceScrollOffset] = useState(0);
  const listenerWheelRemainderRef = useRef(0);
  const sourceWheelRemainderRef = useRef(0);
  const listenerSnapTimerRef = useRef<number | null>(null);
  const sourceSnapTimerRef = useRef<number | null>(null);
  const rockfishAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Helper function to get detection distance
  const getDetectionDistance = (listener: ListenerType, source: SourceType, condition: AmbientCondition): number => {
    const key = `${listener}/${source}`;
    const data = soundData[key];
    if (!data) return 0;
    return data[condition];
  };
  
  const distance = getDetectionDistance(listener, source, condition);

  // Check for invalid combinations and auto-correct
  useEffect(() => {
    const currentKey = `${listener}/${source}`;
    const isValid = soundData[currentKey] !== undefined;
    
    if (!isValid) {
      const soundName = getSoundFullName(source);
      // Force open hearing ranges on invalid pairing.
      setShowHearingRanges(true);

      // Default to the first (leftmost) valid combo in the bar plot ordering.
      const firstCombo = layeredData[0];
      if (firstCombo) {
        const fallbackListener = firstCombo.listener as ListenerType;
        const fallbackSource = firstCombo.source as SourceType;

        setInvalidNotice({
          title: `${listener} can't hear ${soundName}`,
          subtitle: `Reverting to ${fallbackListener} and ${getSoundFullName(fallbackSource)} instead..`,
          detail: `This is outside the hearing range for ${listener}. See the hearing range panel for more information.`
        });

        const timerId = window.setTimeout(() => {
          onListenerChange(firstCombo.listener as ListenerType);
          onSourceChange(firstCombo.source as SourceType);
          setInvalidNotice(null);
        }, 3200);

        return () => window.clearTimeout(timerId);
      }
    } else {
      setInvalidNotice(null);
    }
  }, [listener, source]);

  const formatDistance = (dist: number): string => {
    if (dist >= 1) {
      return `${dist.toFixed(2)} km`;
    } else {
      return `${(dist * 1000).toFixed(0)} m`;
    }
  };

  // Convert distance (in km) to meters
  const toMeters = (km: number): number => km * 1000;

  // Log scale calculation (natural log base e)
  const minLog = Math.log(10); // 10 meters minimum
  const maxLog = Math.log(100000); // 100 km maximum
  
  const getLogPosition = (distanceKm: number): number => {
    const meters = toMeters(distanceKm);
    const logValue = Math.log(Math.max(10, meters)); // Ensure minimum of 10m
    return ((logValue - minLog) / (maxLog - minLog)) * 100;
  };

  // Tick marks for y-axis (now vertical)
  const tickMarks = [
    { value: 0.01, label: '10m' },
    { value: 0.05, label: '50m' },
    { value: 0.1, label: '100m' },
    { value: 0.5, label: '500m' },
    { value: 1, label: '1km' },
    { value: 5, label: '5km' },
    { value: 10, label: '10km' },
    { value: 100, label: '100km' },
  ];

  const getConditionLabel = (cond: AmbientCondition): string => {
    const labels = {
      calm: "Calm Summer",
      winter: "Wind & Waves (Winter)",
      storm: "Storm Event",
      cruiseShip: "Cruise Ship Noise"
    };
    return labels[cond];
  };

  const getAnimalIcon = (animal: string): string => {
    if (animal.includes("harbor seal")) return harborSealImage;
    if (animal.includes("bottlenose dolphin")) return dolphinImage;
    if (animal.includes("killer whale")) return killerWhaleImage;
    if (animal.includes("rockfish")) return rockfishImage;
    return "";
  };

  const getSoundDescriptor = (animal: string): string => {
    if (animal === "Rockfish") return "grunt";
    if (animal === "Harbor Seal") return "roar";
    if (animal === "Bottlenose Dolphin") return "whistle";
    if (animal === "Killer Whale") return "call";
    return "sound";
  };

  const getQuestion = (): string => {
    const questions = [
      `How far can a ${listener.toLowerCase()} hear a ${source.toLowerCase()} ${getSoundDescriptor(source)}?`,
      `Can you imagine detecting sounds from ${distance >= 10 ? "tens of kilometers" : distance >= 1 ? "kilometers" : "meters"} away underwater?`,
      `What if the underwater environment becomes noisier?`,
      `How does background noise impact sound detection?`
    ];
    
    const index = (listener.length + source.length) % questions.length;
    return questions[index];
  };

  // Prepare layered bar data for each pairing
  const layeredData = Object.entries(soundData).map(([key]) => {
    const [listenerPart, sourcePart] = key.split('/');
    return {
      key,
      listener: listenerPart,
      source: sourcePart,
      label: key.split('/').join(' → '),
      cruiseShip: soundData[key].cruiseShip,
      storm: soundData[key].storm,
      winter: soundData[key].winter,
      calm: soundData[key].calm,
    };
  });

  // Custom sort order for listener group columns.
  const getListenerSortOrder = (name: string): number => {
    if (name === 'Harbor Seal') return 0;
    if (name === 'Bottlenose Dolphin') return 1;
    if (name === 'Killer Whale') return 2;
    return 4;
  };

  // Source order requested for bar plot: Rockfish, Harbor Seal, Dolphin, Killer Whale.
  const getSourceSortOrder = (name: string): number => {
    if (name === 'Rockfish') return 0;
    if (name === 'Harbor Seal') return 1;
    if (name === 'Bottlenose Dolphin') return 2;
    if (name === 'Killer Whale') return 3;
    return 4;
  };

  // Sort by listener first, then by source
  layeredData.sort((a, b) => {
    const listenerOrder = getListenerSortOrder(a.listener) - getListenerSortOrder(b.listener);
    if (listenerOrder !== 0) {
      return listenerOrder;
    }
    return getSourceSortOrder(a.source) - getSourceSortOrder(b.source);
  });

  const currentKey = `${listener}/${source}`;

  // Get unique listeners in order
  const uniqueListeners: ListenerType[] = [];
  layeredData.forEach(item => {
    if (!uniqueListeners.includes(item.listener as ListenerType)) {
      uniqueListeners.push(item.listener as ListenerType);
    }
  });

  // Get unique sources in order
  const uniqueSources: SourceType[] = [];
  layeredData.forEach(item => {
    if (!uniqueSources.includes(item.source as SourceType)) {
      uniqueSources.push(item.source as SourceType);
    }
  });

  const sourceOptions: SourceType[] = ["Rockfish", "Harbor Seal", "Bottlenose Dolphin", "Killer Whale"];
  const sourceAudioMap: Partial<Record<SourceType, string>> = {
    Rockfish: rockfishGruntAudio,
    "Harbor Seal": harborSealRoarAudio,
    "Bottlenose Dolphin": dolphinWhistleAudio,
    "Killer Whale": killerWhaleCallAudio
  };
  const sourceSpectrogramMap: Partial<Record<SourceType, string>> = {
    Rockfish: rockfishGruntSpectrogram,
    "Harbor Seal": harborSealRoarSpectrogram,
    "Bottlenose Dolphin": dolphinWhistleSpectrogram,
    "Killer Whale": killerWhaleCallSpectrogram
  };
  const currentSourceAudio = sourceAudioMap[source];
  const currentSourceSpectrogram = sourceSpectrogramMap[source];
  const getWrappedIndex = (index: number, length: number): number => {
    if (length === 0) return 0;
    return ((index % length) + length) % length;
  };

  const getCarouselWindow = <T,>(items: T[], centerIndex: number, radius = 2): T[] => {
    if (items.length === 0) return [];
    const window: T[] = [];
    for (let offset = -radius; offset <= radius; offset += 1) {
      window.push(items[getWrappedIndex(centerIndex + offset, items.length)]);
    }
    return window;
  };
  const contextOrder: AmbientCondition[] = ["calm", "winter", "storm", "cruiseShip"];
  const contextDisplayOrder: AmbientCondition[] = [...contextOrder].reverse();
  const currentContextIndex = contextOrder.indexOf(condition);
  const contextPillColor: Record<AmbientCondition, string> = {
    calm: "var(--ss-state-calm)",
    winter: "var(--ss-state-winter)",
    storm: "var(--ss-state-storm)",
    cruiseShip: "var(--ss-state-cruise-ship)"
  };
  const contextPillColorOpaque: Record<AmbientCondition, string> = {
    calm: "var(--ss-state-calm-solid)",
    winter: "var(--ss-state-winter-solid)",
    storm: "var(--ss-state-storm-solid)",
    cruiseShip: "var(--ss-state-cruise-ship-solid)"
  };

  const getSoundFullName = (source: SourceType): string => {
    const fullNames = {
      "Harbor Seal": "Harbor Seal Roar",
      "Bottlenose Dolphin": "Dolphin Whistle",
      "Killer Whale": "Killer Whale Call",
      "Rockfish": "Rockfish Grunt"
    };
    return fullNames[source] || source;
  };

  const getScientificName = (animal: string): string => {
    const scientificNames = {
      "Harbor Seal": "Phoca vitulina",
      "Bottlenose Dolphin": "Tursiops truncatus",
      "Killer Whale": "Orcinus orca",
      "Rockfish": "Sebastes spp."
    };
    return scientificNames[animal as keyof typeof scientificNames] || "";
  };

  const formatAnimalLabel = (animal: string): string => {
    if (!animal) return animal;
    const lower = animal.toLowerCase();
    return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`;
  };

  const listenerCenterIndex = Math.max(0, uniqueListeners.indexOf(listener));
  const sourceCenterIndex = Math.max(0, sourceOptions.indexOf(source));
  const listenerCarousel = getCarouselWindow(uniqueListeners, listenerCenterIndex);
  const sourceCarousel = getCarouselWindow(sourceOptions, sourceCenterIndex);

  const cycleListener = (step: number) => {
    if (uniqueListeners.length === 0) return;
    const current = uniqueListeners.indexOf(listener);
    const next = getWrappedIndex((current < 0 ? 0 : current) + step, uniqueListeners.length);
    onListenerChange(uniqueListeners[next]);
  };

  const cycleSource = (step: number) => {
    if (sourceOptions.length === 0) return;
    const current = sourceOptions.indexOf(source);
    const next = getWrappedIndex((current < 0 ? 0 : current) + step, sourceOptions.length);
    onSourceChange(sourceOptions[next]);
  };

  const WHEEL_SWITCH_THRESHOLD = 55;
  const WHEEL_OFFSET_DAMPING = 0.14;
  const WHEEL_MAX_OFFSET = 18;

  const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

  const scheduleOffsetReset = (
    timerRef: React.MutableRefObject<number | null>,
    setOffset: (value: number) => void,
    remainderRef: React.MutableRefObject<number>
  ) => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setOffset(0);
      remainderRef.current = 0;
      timerRef.current = null;
    }, 110);
  };

  const handleListenerWheel = (deltaY: number) => {
    listenerWheelRemainderRef.current += deltaY;
    const visualOffset = clamp(listenerWheelRemainderRef.current * WHEEL_OFFSET_DAMPING, -WHEEL_MAX_OFFSET, WHEEL_MAX_OFFSET);
    setListenerScrollOffset(visualOffset);

    while (Math.abs(listenerWheelRemainderRef.current) >= WHEEL_SWITCH_THRESHOLD) {
      const step = listenerWheelRemainderRef.current > 0 ? 1 : -1;
      cycleListener(step);
      listenerWheelRemainderRef.current -= step * WHEEL_SWITCH_THRESHOLD;
      setListenerScrollOffset(clamp(listenerWheelRemainderRef.current * WHEEL_OFFSET_DAMPING, -WHEEL_MAX_OFFSET, WHEEL_MAX_OFFSET));
    }

    scheduleOffsetReset(listenerSnapTimerRef, setListenerScrollOffset, listenerWheelRemainderRef);
  };

  const handleSourceWheel = (deltaY: number) => {
    sourceWheelRemainderRef.current += deltaY;
    const visualOffset = clamp(sourceWheelRemainderRef.current * WHEEL_OFFSET_DAMPING, -WHEEL_MAX_OFFSET, WHEEL_MAX_OFFSET);
    setSourceScrollOffset(visualOffset);

    while (Math.abs(sourceWheelRemainderRef.current) >= WHEEL_SWITCH_THRESHOLD) {
      const step = sourceWheelRemainderRef.current > 0 ? 1 : -1;
      cycleSource(step);
      sourceWheelRemainderRef.current -= step * WHEEL_SWITCH_THRESHOLD;
      setSourceScrollOffset(clamp(sourceWheelRemainderRef.current * WHEEL_OFFSET_DAMPING, -WHEEL_MAX_OFFSET, WHEEL_MAX_OFFSET));
    }

    scheduleOffsetReset(sourceSnapTimerRef, setSourceScrollOffset, sourceWheelRemainderRef);
  };

  useEffect(() => {
    return () => {
      if (listenerSnapTimerRef.current !== null) {
        window.clearTimeout(listenerSnapTimerRef.current);
      }
      if (sourceSnapTimerRef.current !== null) {
        window.clearTimeout(sourceSnapTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("ss-audio-muted");
    if (saved === "1") {
      setIsAudioMuted(true);
    }
  }, []);

  useEffect(() => {
    const audio = rockfishAudioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (!audio.duration || Number.isNaN(audio.duration)) return;
      setRockfishProgress(audio.currentTime / audio.duration);
    };
    const onLoadedMetadata = () => {
      setRockfishDuration(audio.duration || 0);
    };
    const onEnded = () => {
      setRockfishIsPlaying(false);
      setRockfishProgress(0);
    };
    const onPlay = () => setRockfishIsPlaying(true);
    const onPause = () => setRockfishIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem("ss-audio-muted", isAudioMuted ? "1" : "0");
  }, [isAudioMuted]);

  useEffect(() => {
    const audio = rockfishAudioRef.current;
    if (!audio) return;

    if (currentSourceAudio) {
      audio.currentTime = 0;
      setRockfishProgress(0);
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          setRockfishIsPlaying(false);
        });
      }
    } else {
      audio.pause();
      audio.currentTime = 0;
      setRockfishProgress(0);
      setRockfishIsPlaying(false);
    }
  }, [source, currentSourceAudio]);

  const toggleRockfishAudio = () => {
    const audio = rockfishAudioRef.current;
    if (!audio) return;
    if (audio.paused) {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          setRockfishIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  };

  const formatAudioTime = (seconds: number): string => {
    if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const toggleMute = () => {
    setIsAudioMuted((v) => !v);
  };

  const getPairsForListener = (listenerType: ListenerType) => {
    return layeredData.filter((item) => item.listener === listenerType);
  };

  return (
    <div className="fixed top-4 left-4 right-4 bottom-4 z-10 flex gap-3">
      {/* Left Sidebar - Full height, scrollable independently */}
      <div className="w-96 ss-panel-gradient backdrop-blur-sm rounded-2xl shadow-2xl overflow-y-auto">
        <div className="p-5">
          {/* SensingSound Logo */}
          <div className="mb-4">
            <div className="inline-block ss-panel-soft-strong backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg">
              <img src={logoImage} alt="SensingSound" className="h-10 w-auto" />
            </div>
            <p className="ss-text-muted text-sm mt-3 leading-relaxed">
              Select a marine animal listener, sound source, and ocean condition to explore detection distances.
            </p>
          </div>
          
          {/* SELECT CONTEXT */}
          <div className="ss-panel-soft rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 ss-accent-text text-base uppercase tracking-wider mb-4 font-bold">
              <img src={contextIcon} alt="" className="w-5 h-5 object-contain opacity-80" />
              <span>SELECT CONTEXT</span>
            </div>
            <div className="flex gap-3 items-stretch">
              <div className="w-12 flex flex-col items-center">
                <div className="text-[10px] uppercase tracking-wide text-white/70 mb-2">Volume</div>
                <div className="relative h-[25rem] w-full">
                  <input
                    type="range"
                    min={0}
                    max={3}
                    step={1}
                    value={currentContextIndex}
                    onChange={(e) => onConditionChange(contextOrder[Number(e.target.value)] as AmbientCondition)}
                    className="context-knob absolute left-1/2 -translate-x-1/2 top-[11.375%] h-[77.25%]"
                    style={{ ["--context-slider-color" as string]: contextPillColor[condition] }}
                    aria-label="Context volume control"
                  />
                </div>
              </div>
              <div className="grid grid-rows-4 gap-3 flex-1 h-[25rem]">
              {contextDisplayOrder.map((conditionType) => {
                const isSelected = condition === conditionType;
                const conditionColors = {
                  calm: 'ss-selected-calm',
                  winter: 'ss-selected-winter',
                  storm: 'ss-selected-storm',
                  cruiseShip: 'ss-selected-cruise'
                };
                const conditionLabels = {
                  calm: { title: 'CALM', subtitle: 'Summer', description: 'Quiet seas maximize listening distance.' },
                  winter: { title: 'WIND & WAVES', subtitle: 'Winter', description: 'Surface chop masks distant calls.' },
                  storm: { title: 'STORM', subtitle: 'Heavy wind and waves', description: 'High intensity ambient noise masks noise.' },
                  cruiseShip: { title: 'CRUISE SHIP', subtitle: 'Ship noise', description: 'Engine hum narrows hearing range.' }
                };
                const conditionIcons = {
                  calm: calmIcon,
                  winter: cruiseShipIcon,
                  storm: winterIcon,
                  cruiseShip: stormIcon
                };
                return (
                  <button
                    key={conditionType}
                    onClick={() => onConditionChange(conditionType)}
                    className={`h-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                      isSelected 
                        ? `${conditionColors[conditionType]} ring-2 ring-white shadow-lg` 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <img src={conditionIcons[conditionType]} alt="" className={`w-9 h-9 object-contain ${isSelected ? 'scale-110' : ''}`} />
                    <div className="text-left leading-tight">
                      <div className={`text-white text-sm font-semibold uppercase ${isSelected ? 'font-bold' : ''}`}>
                        {conditionLabels[conditionType].title}
                      </div>
                      <div className="text-white/85 text-xs italic">
                        {conditionLabels[conditionType].subtitle}
                      </div>
                      <div className="text-white/75 text-[11px]">
                        {conditionLabels[conditionType].description}
                      </div>
                    </div>
                  </button>
                );
              })}
              </div>
            </div>
          </div>

          {/* SELECT LISTENER */}
          <div className="ss-panel-soft rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 ss-accent-text text-base uppercase tracking-wider mb-4 font-bold">
              <img src={listenerIcon} alt="" className="w-5 h-5 object-contain opacity-80" />
              <span>SELECT LISTENER</span>
            </div>
            <div
              className="bg-white/5 border border-white/20 rounded-xl p-2 overflow-hidden"
              onWheel={(e) => {
                e.preventDefault();
                handleListenerWheel(e.deltaY);
              }}
            >
              <div
                className="flex items-center justify-center gap-1 transition-transform duration-100 ease-out"
                style={{ transform: `translateX(${listenerScrollOffset}px)` }}
              >
                {listenerCarousel.map((listenerType, i) => {
                  const isCenter = i === 2;
                  const distanceFromCenter = Math.abs(i - 2);
                  return (
                    <button
                      key={`listener-carousel-${i}-${listenerType}`}
                      type="button"
                      onClick={() => onListenerChange(listenerType)}
                      className={`shrink-0 rounded-lg transition-all duration-200 ${
                        isCenter
                          ? "ss-selected-listener ring-2 ring-white shadow-lg px-2 py-1.5"
                          : "bg-white/10 hover:bg-white/20 px-1.5 py-1"
                      }`}
                      style={{
                        opacity: distanceFromCenter === 0 ? 1 : distanceFromCenter === 1 ? 0.75 : 0.45,
                        transform: `scale(${distanceFromCenter === 0 ? 1 : distanceFromCenter === 1 ? 0.86 : 0.74})`
                      }}
                    >
                      <img src={getAnimalIcon(listenerType.toLowerCase())} alt="" className="w-20 h-20 object-contain mx-auto" />
                      {isCenter && (
                        <div className="text-white text-xs mt-1 text-center">{formatAnimalLabel(listenerType)}</div>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="text-[10px] text-white/65 text-center mt-1">Hover and two-finger scroll to rotate</div>
            </div>
          </div>

          {/* SELECT SOUND */}
          <div className="ss-panel-soft rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 ss-accent-text text-base uppercase tracking-wider mb-4 font-bold">
              <img src={soundIcon} alt="" className="w-5 h-5 object-contain opacity-80" />
              <span>SELECT SOUND</span>
            </div>
            <div
              className="bg-white/5 border border-white/20 rounded-xl p-2 overflow-hidden"
              onWheel={(e) => {
                e.preventDefault();
                handleSourceWheel(e.deltaY);
              }}
            >
              <div
                className="flex items-center justify-center gap-1 transition-transform duration-100 ease-out"
                style={{ transform: `translateX(${sourceScrollOffset}px)` }}
              >
                {sourceCarousel.map((sourceType, i) => {
                  const isCenter = i === 2;
                  const distanceFromCenter = Math.abs(i - 2);
                  return (
                    <button
                      key={`source-carousel-${i}-${sourceType}`}
                      type="button"
                      onClick={() => onSourceChange(sourceType)}
                      className={`shrink-0 rounded-lg transition-all duration-200 ${
                        isCenter
                          ? "ss-selected-sound ring-2 ring-white shadow-lg px-2 py-1.5"
                          : "bg-white/10 hover:bg-white/20 px-1.5 py-1"
                      }`}
                      style={{
                        opacity: distanceFromCenter === 0 ? 1 : distanceFromCenter === 1 ? 0.75 : 0.45,
                        transform: `scale(${distanceFromCenter === 0 ? 1 : distanceFromCenter === 1 ? 0.86 : 0.74})`
                      }}
                    >
                      <img src={getAnimalIcon(sourceType.toLowerCase())} alt="" className="w-20 h-20 object-contain mx-auto" />
                      {isCenter && (
                        <div className="text-white text-xs mt-1 text-center italic">{getSoundFullName(sourceType)}</div>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="text-[10px] text-white/65 text-center mt-1">Hover and two-finger scroll to rotate</div>
            </div>
          </div>

        </div>
      </div>

      {/* Right side - contains middle panel, optional right panel, and bottom bar chart */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Top row - Listening scene and hearing ranges - 50% height */}
        <div className="flex gap-3" style={{ flex: '0 0 calc(50% - 6px)' }}>
          {/* Main Visualization Panel - Center */}
          <div className="flex-1 ss-panel-gradient backdrop-blur-sm rounded-2xl shadow-2xl overflow-y-auto">
            <div className="p-5">
              {/* Detection Distance Comparison - Moved to Middle Panel */}
              <div className="ss-accent-soft-bg rounded-lg p-4 border-l-4 ss-accent-border mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <Activity className="w-6 h-6 ss-accent-text" />
                  <div className="ss-accent-text font-bold tracking-wider text-base uppercase">
                    Detection Distance Comparison
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-3 items-start">
                  <div className="relative">
                    <div className="mb-1 ss-accent-text text-[11px] uppercase tracking-wide font-bold">
                      Select Listener
                    </div>
                    <div className="mb-1">
                      <span className="inline-block bg-white/20 border border-white/35 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                        Listener
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowListenerDropdown((v) => !v);
                        setShowSourceDropdown(false);
                      }}
                      className="w-full flex items-center justify-between gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg border border-white/20 transition-colors"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <img src={getAnimalIcon(listener.toLowerCase())} alt="" className="w-20 h-20 object-contain" />
                        <span className="text-white text-sm truncate">{formatAnimalLabel(listener)}</span>
                      </span>
                      <ChevronDown className="w-4 h-4 text-white/80 shrink-0" />
                    </button>
                    {showListenerDropdown && (
                      <div className="absolute left-0 right-0 mt-1 z-30 ss-panel-gradient backdrop-blur-sm border border-white/20 rounded-lg p-2 shadow-xl">
                        <div className="flex flex-col gap-2">
                          {uniqueListeners.map((listenerType) => {
                            const isSelected = listener === listenerType;
                            return (
                              <button
                                key={`dd-${listenerType}`}
                                type="button"
                                onClick={() => {
                                  onListenerChange(listenerType);
                                  setShowListenerDropdown(false);
                                }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                                  isSelected ? 'ss-selected-listener ring-2 ring-white shadow-lg' : 'bg-white/10 hover:bg-white/20'
                                }`}
                              >
                                <img src={getAnimalIcon(listenerType.toLowerCase())} alt="" className="w-20 h-20 object-contain" />
                                <span className="text-white text-sm">
                                  {formatAnimalLabel(listenerType)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <div className="mb-1 ss-accent-text text-[11px] uppercase tracking-wide font-bold">
                      Select Sound
                    </div>
                    <div className="mb-1">
                      <span className="inline-block bg-white/20 border border-white/35 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                        Sound Producer
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSourceDropdown((v) => !v);
                        setShowListenerDropdown(false);
                      }}
                      className="w-full flex items-center justify-between gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg border border-white/20 transition-colors"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <img src={getAnimalIcon(source.toLowerCase())} alt="" className="w-20 h-20 object-contain" />
                        <span className="text-white text-sm uppercase italic font-semibold truncate">{getSoundFullName(source)}</span>
                      </span>
                      <ChevronDown className="w-4 h-4 text-white/80 shrink-0" />
                    </button>
                    {showSourceDropdown && (
                      <div className="absolute left-0 right-0 mt-1 z-30 ss-panel-gradient backdrop-blur-sm border border-white/20 rounded-lg p-2 shadow-xl">
                        <div className="flex flex-col gap-2">
                          {sourceOptions.map((sourceType) => {
                            const isSelected = source === sourceType;
                            const soundFullName = getSoundFullName(sourceType);
                            return (
                              <button
                                key={`dd-${sourceType}`}
                                type="button"
                                onClick={() => {
                                  onSourceChange(sourceType);
                                  setShowSourceDropdown(false);
                                }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                                  isSelected ? 'ss-selected-sound ring-2 ring-white shadow-lg' : 'bg-white/10 hover:bg-white/20'
                                }`}
                              >
                                <img src={getAnimalIcon(sourceType.toLowerCase())} alt="" className="w-20 h-20 object-contain" />
                                <span className={`text-white text-sm uppercase italic ${isSelected ? 'font-bold' : ''}`}>
                                  {soundFullName}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Animal Pairing Visualization + Hearing Ranges */}
              <div className="flex gap-3 h-96">
                <div className="relative flex-1 bg-white/5 rounded-lg overflow-hidden">
                  {/* Underwater Background */}
                  <img
                    src={underwaterBg}
                    alt="Underwater scene"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                  />
                  
                  {/* Overlay gradient for better text readability */}
                  <div className="absolute inset-0 ss-home-overlay"></div>
                  
                  {/* Toggle Button for Hearing Ranges */}
                  <button
                    onClick={() => setShowHearingRanges(!showHearingRanges)}
                    className="absolute right-4 top-4 z-10 text-white px-3 py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 font-semibold text-sm"
                    style={{ background: "var(--ss-accent-primary-hover)" }}
                  >
                    {showHearingRanges ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    {showHearingRanges ? "Hide" : "Show"} Hearing Ranges
                  </button>
                  
                  {/* Content Layer */}
                  <div className="relative h-full p-8">
                    {/* Listener - Left Side */}
                    <div className="absolute left-1/3 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="text-white text-xs uppercase tracking-wider font-bold mb-2">Listener</div>
                      <div className="relative">
                        <span className="listener-ring listener-ring-1"></span>
                        <span className="listener-ring listener-ring-2"></span>
                        <span className="listener-ring listener-ring-3"></span>
                        <div className="w-44 h-44 rounded-full border-8 bg-white/30 backdrop-blur-sm flex items-center justify-center p-4 shadow-2xl" style={{ borderColor: "var(--ss-signal-listener-stroke)" }}>
                          <img
                            src={getAnimalIcon(listener.toLowerCase())}
                            alt={listener}
                            className={`w-full h-full object-contain ${showHearingRanges ? '' : 'drop-shadow-lg'}`}
                          />
                        </div>
                      </div>
                      <div className="mt-3 text-white text-xl drop-shadow-lg">{formatAnimalLabel(listener)}</div>
                      <div className="text-white/90 text-sm italic drop-shadow">{getScientificName(listener)}</div>
                    </div>

                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-lg font-bold text-white text-center shadow-lg border z-10" style={{ background: contextPillColorOpaque[condition], borderColor: "var(--ss-accent-secondary)" }}>
                      <div className="text-[11px] uppercase tracking-wide text-white/90">Sound Perception Distance</div>
                      <div className="text-xl leading-tight">{formatDistance(distance)}</div>
                    </div>

                    {/* Sound Producer - Right Side */}
                    <div className="absolute left-2/3 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-right">
                      <div className="text-white text-xs uppercase tracking-wider font-bold mb-2">Sound Producer</div>
                      <div className="relative inline-block">
                        <span className="source-ring source-ring-1"></span>
                        <span className="source-ring source-ring-2"></span>
                        <span className="source-ring source-ring-3"></span>
                        <div className="w-44 h-44 rounded-full border-8 bg-white/30 backdrop-blur-sm flex items-center justify-center p-4 shadow-2xl" style={{ borderColor: "var(--ss-signal-source-stroke)" }}>
                          <img
                            src={getAnimalIcon(source.toLowerCase())}
                            alt={source}
                            className={`w-full h-full object-contain ${showHearingRanges ? '' : 'drop-shadow-lg'}`}
                          />
                        </div>
                      </div>
                      <div className="mt-3 text-white text-xl drop-shadow-lg">{formatAnimalLabel(source)}</div>
                      <div className="text-white/90 text-sm italic drop-shadow">{getScientificName(source)}</div>
                    </div>
                  </div>
                </div>

                {/* Rockfish audio panel beside listening scene */}
                {currentSourceAudio && (
                  <div className="w-80 ss-panel-soft rounded-lg p-4 border border-white/20">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="ss-accent-text text-sm uppercase tracking-wider font-bold">
                        {getSoundFullName(source)}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={toggleMute}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/15 hover:bg-white/25 text-white text-xs transition-colors"
                        >
                          {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          <span>{isAudioMuted ? "Muted" : "Unmuted"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={toggleRockfishAudio}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/15 hover:bg-white/25 text-white text-xs transition-colors"
                        >
                          {rockfishIsPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          <span>{rockfishIsPlaying ? "Pause" : "Play"}</span>
                        </button>
                      </div>
                    </div>

                    {currentSourceSpectrogram ? (
                      <div className="relative rounded-md overflow-hidden border border-white/20 bg-black/35">
                        <img src={currentSourceSpectrogram} alt={`${getSoundFullName(source)} spectrogram`} className="w-full h-24 object-cover" />
                        <div
                          className="absolute top-0 bottom-0 w-[2px] bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)] transition-[left] duration-75 ease-linear"
                          style={{ left: `${Math.max(0, Math.min(100, rockfishProgress * 100))}%` }}
                        />
                      </div>
                    ) : (
                      <div className="rounded-md border border-white/20 bg-black/35 h-24 flex items-center justify-center text-white/70 text-xs">
                        {getSoundFullName(source)} audio
                      </div>
                    )}

                    <div className="mt-2 flex justify-between text-[10px] text-white/75">
                      <span>{formatAudioTime((rockfishDuration || 0) * rockfishProgress)}</span>
                      <span>{formatAudioTime(rockfishDuration)}</span>
                    </div>
                  </div>
                )}

                <div
                  className={`transition-all duration-500 ease-in-out ss-panel-gradient backdrop-blur-sm rounded-2xl overflow-hidden ${
                    showHearingRanges ? 'w-96 opacity-100' : 'w-0 opacity-0'
                  }`}
                >
                  {showHearingRanges && (
                    <div className="w-96 h-full p-6">
                      <Frame8 />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Main content goes here - kelp forest, etc */}
            </div>
          </div>
          
        </div>

        {/* Bottom row - Bar chart + listener pills - 50% height */}
        <div className="ss-panel-gradient backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ flex: '0 0 calc(50% - 6px)' }}>
          <div className="p-5 flex-shrink-0">
            <div className="ss-accent-soft-bg rounded-lg p-4 border-l-4 ss-accent-border">
              <div className="flex items-center gap-3 mb-2">
                <Ruler className="w-6 h-6 ss-accent-text" />
                <div className="ss-accent-text font-bold tracking-wider text-base uppercase">
                  Detection Ranges
                </div>
              </div>
              <div className="text-white/90 text-xs">
                Maximum distance for sound perception under selected ocean conditions
              </div>
            </div>
          </div>
            
          <div className="flex gap-3 px-5 pb-5 flex-1 overflow-hidden">
            {/* Y-axis column + spacer to keep plot row aligned with bars only */}
            <div className="w-20 flex-shrink-0 flex flex-col gap-3">
              <div className="relative flex-1 border-r border-white/30">
                <div className="absolute left-0 top-1/2 -translate-x-[115%] -translate-y-1/2 -rotate-90 text-white/90 text-xs font-semibold whitespace-nowrap origin-center">
                  Detection ranges (km)
                </div>
                {tickMarks.map((tick, index) => {
                  const position = getLogPosition(tick.value);
                  return (
                    <div key={index} className="absolute right-0 flex items-center justify-end" style={{ bottom: `${position}%` }}>
                      <div className="text-white/90 text-[10px] mr-1 whitespace-nowrap font-medium text-right">{tick.label}</div>
                      <div className="h-px w-3 bg-white/50"></div>
                    </div>
                  );
                })}
              </div>
              <div className="h-[7.5rem]"></div>
            </div>

            {/* Plot + listener pills */}
            <div className="flex-1 flex flex-col gap-3 min-h-0">
              <div className="relative flex-1 flex gap-2 items-end">
                {layeredData.map((item) => {
                  const isActive = item.key === currentKey;
                  
                  // Get the distance for current condition
                  const currentDistance = item[condition];
                  const calmDistance = item.calm;
                  const percentDecrease = condition !== 'calm' ? ((calmDistance - currentDistance) / calmDistance * 100).toFixed(0) : null;
                  
                  return (
                    <div key={item.key} className="relative flex-1 h-full" style={{ minWidth: '40px' }}>
                      {/* Percentage Decrease Label at Top */}
                      {condition !== 'calm' && percentDecrease && (
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white font-bold text-[10px] whitespace-nowrap">
                          -{percentDecrease}%
                        </div>
                      )}
                      
                      {/* Background Bar - Always show Calm Summer for reference */}
                      <div 
                        className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-full rounded-t ss-bar-reference"
                        style={{ height: `${getLogPosition(calmDistance)}%` }}
                      />
                      
                      {/* Foreground Bar - Current condition */}
                      <div 
                        className={`absolute left-1/2 bottom-0 transform -translate-x-1/2 w-full rounded-t transition-all duration-500 cursor-pointer ${
                          isActive 
                            ? 'ss-bar-active ring-2 ring-white'
                            : condition === 'calm' ? 'ss-bar-calm hover:brightness-110'
                            : condition === 'winter' ? 'ss-bar-winter hover:brightness-110'
                            : condition === 'storm' ? 'ss-bar-storm hover:brightness-110'
                            : 'ss-bar-cruise hover:brightness-110'
                        }`}
                        style={{ height: `${getLogPosition(currentDistance)}%` }}
                        onClick={() => {
                          onListenerChange(item.listener as ListenerType);
                          onSourceChange(item.source as SourceType);
                        }}
                        onMouseEnter={() => setHoveredBar({ key: item.key, condition })}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        {isActive && (
                          <div className="absolute inset-0 rounded-t animate-pulse ring-2 ring-white pointer-events-none"></div>
                        )}
                        {hoveredBar?.key === item.key && (
                          <div className="absolute left-1/2 top-0 mt-1 transform -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 shadow-lg">
                            <div>{formatDistance(currentDistance)}</div>
                            {condition !== 'calm' && (
                              <div className="text-teal-300 text-[9px] mt-0.5">
                                Calm: {formatDistance(calmDistance)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Listener Group Chips */}
              <div className="h-[7.5rem] flex gap-2">
                {/* Harbor Seal Chip - First 4 bars */}
                <div className="flex-1" style={{ flex: '4' }}>
                  <div className="bg-white/12 border border-white/20 text-white px-3 py-2 rounded-xl flex items-start justify-start gap-3 h-full">
                    <img src={getAnimalIcon("harbor seal")} alt="" className="w-20 h-20 object-contain" />
                    <div className="leading-tight text-left">
                      <div className="text-xs uppercase tracking-wider font-bold">LISTENER</div>
                      <div className="text-base">{formatAnimalLabel("Harbor Seal")}</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {getPairsForListener("Harbor Seal").map((item) => (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => {
                              onListenerChange(item.listener as ListenerType);
                              onSourceChange(item.source as SourceType);
                            }}
                            onMouseEnter={() => setHoveredBar({ key: item.key, condition })}
                            onMouseLeave={() => setHoveredBar(null)}
                            className="bg-white/12 hover:bg-white/18 border border-white/25 text-white/90 px-2 py-0.5 rounded-md text-xs font-semibold italic leading-tight transition-colors"
                          >
                            {getSoundFullName(item.source as SourceType)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bottlenose Dolphin Chip - Next 2 bars */}
                <div className="flex-1" style={{ flex: '2' }}>
                  <div className="bg-white/12 border border-white/20 text-white px-3 py-2 rounded-xl flex items-start justify-start gap-3 h-full">
                    <img src={getAnimalIcon("bottlenose dolphin")} alt="" className="w-20 h-20 object-contain" />
                    <div className="leading-tight text-left">
                      <div className="text-xs uppercase tracking-wider font-bold">LISTENER</div>
                      <div className="text-base">{formatAnimalLabel("Bottlenose Dolphin")}</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {getPairsForListener("Bottlenose Dolphin").map((item) => (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => {
                              onListenerChange(item.listener as ListenerType);
                              onSourceChange(item.source as SourceType);
                            }}
                            onMouseEnter={() => setHoveredBar({ key: item.key, condition })}
                            onMouseLeave={() => setHoveredBar(null)}
                            className="bg-white/12 hover:bg-white/18 border border-white/25 text-white/90 px-2 py-0.5 rounded-md text-xs font-semibold italic leading-tight transition-colors"
                          >
                            {getSoundFullName(item.source as SourceType)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Killer Whale Chip - Last 3 bars */}
                <div className="flex-1" style={{ flex: '3' }}>
                  <div className="bg-white/12 border border-white/20 text-white px-3 py-2 rounded-xl flex items-start justify-start gap-3 h-full">
                    <img src={getAnimalIcon("killer whale")} alt="" className="w-20 h-20 object-contain" />
                    <div className="leading-tight text-left">
                      <div className="text-xs uppercase tracking-wider font-bold">LISTENER</div>
                      <div className="text-base">{formatAnimalLabel("Killer Whale")}</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {getPairsForListener("Killer Whale").map((item) => (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => {
                              onListenerChange(item.listener as ListenerType);
                              onSourceChange(item.source as SourceType);
                            }}
                            onMouseEnter={() => setHoveredBar({ key: item.key, condition })}
                            onMouseLeave={() => setHoveredBar(null)}
                            className="bg-white/12 hover:bg-white/18 border border-white/25 text-white/90 px-2 py-0.5 rounded-md text-xs font-semibold italic leading-tight transition-colors"
                          >
                            {getSoundFullName(item.source as SourceType)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {invalidNotice && (
        <div className="absolute inset-0 z-40 pointer-events-none">
          <div className="absolute inset-0 bg-black/45 invalid-backdrop-fade"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-md border border-white/45 shadow-2xl rounded-2xl px-8 py-6 text-center max-w-xl invalid-lightbox-fade">
              <div className="text-white text-2xl font-bold drop-shadow-lg">
                {invalidNotice.title}
              </div>
              <div className="text-white/90 text-sm mt-2">
                {invalidNotice.subtitle}
              </div>
              <div className="text-white/80 text-xs mt-2 leading-relaxed">
                {invalidNotice.detail}
              </div>
            </div>
          </div>
        </div>
      )}
      <audio ref={rockfishAudioRef} src={currentSourceAudio} preload="metadata" muted={isAudioMuted} />
    </div>
  );
}
