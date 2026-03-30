export type Language = "en" | "es";

export interface SheetRow {
  experienceType: string;
  panelName: string;
  itemName: string;
  en: string;
  es: string;
}

export type PanelCopyMap = Record<string, string>;

export type AmbientCondition = "calm" | "winter" | "storm" | "cruiseShip";

export interface AmbientConditionInfo {
  title: { en: string; es: string };
  subtitle: { en: string; es: string };
  description: { en: string; es: string };
  icon: string;
}

export interface Noise {
  audioFile: string;
  spectrogram: string;
}

export interface DetectionData {
  peakFrequency: number;
  thirdOctaveBand: number;
  calm: number;
  winter: number;
  storm: number;
  cruiseShip: number;
}

export interface AudioParticipant {
  id: string;
  name: { en: string; es: string };
  soundName?: { en: string; es: string };
  icon: string;
  scientificName: string;
  source: boolean;
  listener: boolean;
  noise: Noise;
  listens_to: AudioParticipant[];
  detections: Record<string, DetectionData>;
  audioVolumeAdjustmentFactor?: number;
}
