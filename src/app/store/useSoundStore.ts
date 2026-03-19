import { create } from "zustand";
import type { AmbientCondition, AudioParticipant, DetectionData } from "../types";
import { harborSeal, rockfish } from "../data/participants";

interface SoundStore {
  oceanCondition: AmbientCondition;
  listener: AudioParticipant;
  source: AudioParticipant;

  setOceanCondition: (condition: AmbientCondition) => void;
  setListener: (participant: AudioParticipant) => void;
  setSource: (participant: AudioParticipant) => void;

  getSoundData: () => DetectionData | null;
  getDistance: () => number;
}

export const useSoundStore = create<SoundStore>()((set, get) => ({
  oceanCondition: "winter",
  listener: harborSeal,
  source: rockfish,

  setOceanCondition: (condition) => set({ oceanCondition: condition }),
  setListener: (participant) => set({ listener: participant }),
  setSource: (participant) => set({ source: participant }),

  getSoundData: () => {
    const { listener, source } = get();
    return listener.detections[source.id] ?? null;
  },

  getDistance: () => {
    const { oceanCondition } = get();
    const soundData = get().getSoundData();
    if (!soundData) return 0;
    return soundData[oceanCondition];
  },
}));
