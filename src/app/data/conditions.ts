import type { AmbientCondition, AmbientConditionInfo } from "../types";

import calmIcon from "@/assets/e65a9047f4f935b712f1a005b183ec3f059d51e1.png";
import stormIcon from "@/assets/5b3d7954d5b036202934c5a13a0ba824127398df.png";
import cruiseShipIcon from "@/assets/fb96a261a239fa7f23f5d07c3a46c921e5be61bd.png";
import winterIcon from "@/assets/12f4059262a1e4783417b0a59b00d843925de4c3.png";

export const conditionOrder: AmbientCondition[] = ["calm", "winter", "storm", "cruiseShip"];
export const conditionDisplayOrder: AmbientCondition[] = [...conditionOrder].reverse();

export const conditionPillColor: Record<AmbientCondition, string> = {
  calm: "var(--ss-state-calm)",
  winter: "var(--ss-state-winter)",
  storm: "var(--ss-state-storm)",
  cruiseShip: "var(--ss-state-cruise-ship)",
};

// Actual rgba values for SVG/canvas contexts where CSS variables are unavailable
export const conditionBarColor: Record<AmbientCondition, string> = {
  calm: "rgba(45, 212, 191, 0.9)",
  winter: "rgba(234, 179, 8, 0.9)",
  storm: "rgba(220, 38, 38, 0.9)",
  cruiseShip: "rgba(127, 29, 29, 0.9)",
};

export const conditionBarColorDim: Record<AmbientCondition, string> = {
  calm: "rgba(45, 212, 191, 0.3)",
  winter: "rgba(234, 179, 8, 0.3)",
  storm: "rgba(220, 38, 38, 0.3)",
  cruiseShip: "rgba(127, 29, 29, 0.3)",
};

export const conditionSelectedClass: Record<AmbientCondition, string> = {
  calm: "ss-selected-calm",
  winter: "ss-selected-winter",
  storm: "ss-selected-storm",
  cruiseShip: "ss-selected-cruise",
};

export const conditionInfo: Record<AmbientCondition, AmbientConditionInfo> = {
  calm: {
    title: { en: "Calm Seas", es: "Mares en calma" },
    subtitle: { en: "Summer", es: "Verano" },
    description: { en: "Quiet seas increase the listening range", es: "Los mares tranquilos maximizan la distancia de escucha." },
    icon: calmIcon,
  },
  winter: {
    title: { en: "Wind & Waves", es: "Viento y olas" },
    subtitle: { en: "Winter", es: "Invierno" },
    description: { en: "Wind and waves decrease the listening range", es: "El oleaje superficial enmascara llamadas distantes." },
    icon: winterIcon,
  },
  storm: {
    title: { en: "Storm", es: "Tormenta" },
    subtitle: { en: "Heavy wind and waves", es: "Viento y oleaje intensos" },
    description: { en: "Loud environmental noise constrains hearing.", es: "El ruido ambiental de alta intensidad enmascara sonidos." },
    icon: stormIcon,
  },
  cruiseShip: {
    title: { en: "Cruise Ship", es: "Crucero" },
    subtitle: { en: "Ship noise", es: "Ruido de barco" },
    description: { en: "Ship noise restricts listening space.", es: "El zumbido del motor reduce el rango de audición." },
    icon: cruiseShipIcon,
  },
};
