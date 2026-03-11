import colorPalette from "./colorPalette.json";

type PaletteValue = string | number | boolean | null;
type PaletteNode = Record<string, PaletteNode | PaletteValue>;

function toKebabCase(input: string): string {
  return input.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

function flattenPalette(node: PaletteNode, prefix: string[] = []): Array<[string, string]> {
  const vars: Array<[string, string]> = [];
  for (const [key, value] of Object.entries(node)) {
    const nextPath = [...prefix, toKebabCase(key)];
    if (value !== null && typeof value === "object") {
      vars.push(...flattenPalette(value as PaletteNode, nextPath));
      continue;
    }
    vars.push([`--ss-${nextPath.join("-")}`, String(value)]);
  }
  return vars;
}

export function applyColorPalette(): void {
  if (typeof document === "undefined") return;
  const rootStyle = document.documentElement.style;
  for (const [name, value] of flattenPalette(colorPalette as PaletteNode)) {
    rootStyle.setProperty(name, value);
  }
}

