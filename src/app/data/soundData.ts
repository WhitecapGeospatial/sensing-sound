// Detection distance data in kilometers
export interface SoundDataEntry {
  peakFrequency: number;
  thirdOctaveBand: number;
  calm: number;
  winter: number;
  storm: number;
  cruiseShip: number;
}

export type ListenerType = "Harbor Seal" | "Bottlenose Dolphin" | "Killer Whale";
export type SourceType = "Rockfish" | "Harbor Seal" | "Killer Whale" | "Bottlenose Dolphin";
export type AmbientCondition = "calm" | "winter" | "storm" | "cruiseShip";

export const soundData: Record<string, SoundDataEntry> = {
  "Harbor Seal/Rockfish": {
    peakFrequency: 160,
    thirdOctaveBand: 107,
    calm: 0.05,
    winter: 0.07,
    storm: 0.05,
    cruiseShip: 0.02,
  },
  "Harbor Seal/Harbor Seal": {
    peakFrequency: 500,
    thirdOctaveBand: 138,
    calm: 12.37,
    winter: 9.6,
    storm: 5.43,
    cruiseShip: 2.15,
  },
  "Harbor Seal/Killer Whale": {
    peakFrequency: 2500,
    thirdOctaveBand: 150,
    calm: 73.48,
    winter: 66.06,
    storm: 37.67,
    cruiseShip: 23.71,
  },
  "Harbor Seal/Bottlenose Dolphin": {
    peakFrequency: 10000,
    thirdOctaveBand: 136,
    calm: 8.99,
    winter: 7.49,
    storm: 4.15,
    cruiseShip: 2.05,
  },
  "Bottlenose Dolphin/Killer Whale": {
    peakFrequency: 2500,
    thirdOctaveBand: 150,
    calm: 39.11,
    winter: 34.57,
    storm: 15.39,
    cruiseShip: 8.34,
  },
  "Bottlenose Dolphin/Bottlenose Dolphin": {
    peakFrequency: 10000,
    thirdOctaveBand: 136,
    calm: 7.82,
    winter: 6.47,
    storm: 3.45,
    cruiseShip: 1.62,
  },
  "Killer Whale/Harbor Seal": {
    peakFrequency: 500,
    thirdOctaveBand: 138,
    calm: 0.22,
    winter: 0.22,
    storm: 0.22,
    cruiseShip: 0.22,
  },
  "Killer Whale/Killer Whale": {
    peakFrequency: 2500,
    thirdOctaveBand: 150,
    calm: 31.62,
    winter: 31.62,
    storm: 23.71,
    cruiseShip: 13.99,
  },
  "Killer Whale/Bottlenose Dolphin": {
    peakFrequency: 10000,
    thirdOctaveBand: 136,
    calm: 8.86,
    winter: 7.42,
    storm: 4.15,
    cruiseShip: 2.06,
  },
};

export const ambientConditions = {
  calm: {
    label: "Calm Seas",
    description: "Summer conditions - the quietest underwater environment",
    icon: "🌊",
  },
  winter: {
    label: "Wind & Waves",
    description: "Winter conditions with natural wind and wave noise",
    icon: "🌬️",
  },
  storm: {
    label: "Storm Event",
    description: "Stormy conditions with high wave action",
    icon: "⛈️",
  },
  cruiseShip: {
    label: "Cruise Ship",
    description: "Human-made anthropogenic noise from cruise ships",
    icon: "🚢",
  },
};

export function getDetectionDistance(
  listener: ListenerType,
  source: SourceType,
  condition: AmbientCondition
): number {
  const key = `${listener}/${source}`;
  const data = soundData[key];
  if (!data) return 0;
  return data[condition];
}
