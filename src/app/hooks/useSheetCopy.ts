import { useQuery } from "@tanstack/react-query";
import Papa from "papaparse";
import { useMemo } from "react";
import { useSoundStore } from "../store/useSoundStore";
import type { PanelCopyMap, SheetRow } from "../types";

const SHEET_ID = "127xJ85ehcJ7Yf7WLv7Um6MxauauDKJ3RwJSGiCjrXOk";
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

function findColumn(headers: string[], substring: string): number {
  return headers.findIndex((h) =>
    h.toLowerCase().includes(substring.toLowerCase())
  );
}

async function fetchSheetRows(): Promise<SheetRow[]> {
  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
  const text = await res.text();

  const { data } = Papa.parse<string[]>(text, { header: false });
  if (data.length < 2) return [];

  const headers = data[0];
  const colType = findColumn(headers, "experience type");
  const colPanel = findColumn(headers, "panel name");
  const colItem = findColumn(headers, "item name");
  const colEn = findColumn(headers, "english text");
  const colEs = findColumn(headers, "spanish text");

  if ([colType, colPanel, colItem, colEn, colEs].includes(-1)) {
    throw new Error("Could not locate required columns in sheet");
  }

  return data
    .slice(1)
    .filter((row) => row[colType]?.trim() === "Website")
    .map((row) => ({
      experienceType: row[colType]?.trim() ?? "",
      panelName: row[colPanel]?.trim() ?? "",
      itemName: row[colItem]?.trim() ?? "",
      en: row[colEn]?.trim() ?? "",
      es: row[colEs]?.trim() ?? "",
    }));
}

export function useSheetCopy() {
  return useQuery({
    queryKey: ["sheet-copy"],
    queryFn: fetchSheetRows,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePanelCopy(panelName: string): {
  copy: PanelCopyMap;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useSheetCopy();
  const language = useSoundStore((s) => s.language);

  const copy = useMemo(() => {
    if (!data) return {};
    const map: PanelCopyMap = {};
    for (const row of data) {
      if (row.panelName === panelName) {
        map[row.itemName] = row[language] || row.en;
      }
    }
    return map;
  }, [data, panelName, language]);

  return { copy, isLoading, isError };
}
