import type { AudioParticipant, AmbientCondition } from "../types";
import { allParticipants } from "../data/participants";

export function formatDistance(dist: number): string {
  if (dist >= 1) {
    return `${dist.toFixed(2)} km`;
  }
  return `${(dist * 1000).toFixed(0)} m`;
}

export function formatAnimalLabel(name: string): string {
  if (!name) return name;
  const lower = name.toLowerCase();
  return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`;
}

export function getSoundDescriptor(participant: AudioParticipant): string {
  switch (participant.id) {
    case "rockfish":
      return "grunt";
    case "harbor-seal":
      return "roar";
    case "bottlenose-dolphin":
      return "whistle";
    case "killer-whale":
      return "call";
    default:
      return "sound";
  }
}

export function getSoundFullName(participant: AudioParticipant): string {
  switch (participant.id) {
    case "rockfish":
      return "Rockfish Grunt";
    case "harbor-seal":
      return "Harbor Seal Roar";
    case "bottlenose-dolphin":
      return "Dolphin Whistle";
    case "killer-whale":
      return "Killer Whale Call";
    default:
      return participant.name;
  }
}

export function getConditionLabel(cond: AmbientCondition): string {
  const labels: Record<AmbientCondition, string> = {
    calm: "Calm Summer",
    winter: "Wind & Waves (Winter)",
    storm: "Storm Event",
    cruiseShip: "Cruise Ship Noise",
  };
  return labels[cond];
}

export function formatAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function findParticipantById(id: string): AudioParticipant | undefined {
  return allParticipants.find((p) => p.id === id);
}

export function getDetectionDistance(
  listener: AudioParticipant,
  source: AudioParticipant,
  condition: AmbientCondition,
): number {
  const detection = listener.detections[source.id];
  if (!detection) return 0;
  return detection[condition];
}
