---
name: localize-component
description: >-
  Add English/Spanish language support to a component using the Google Sheets
  copy store. Use when localizing UI text, adding i18n support, wiring up
  usePanelCopy, or connecting a component to the Google Doc spreadsheet.
---

# Localize a Component with Google Sheets Copy

## Overview

Website copy lives in a Google Sheet with English and Spanish columns. A
TanStack Query hook (`useSheetCopy`) fetches it at runtime. Components use
`usePanelCopy(panelName)` to get a `Record<itemName, localizedText>` for the
active language.

For the full panel inventory and implementation status, see
[LANGUAGES.md](../../../LANGUAGES.md).

## Key files

| File | Role |
|------|------|
| `src/app/hooks/useSheetCopy.ts` | `useSheetCopy()` and `usePanelCopy()` hooks |
| `src/app/store/useSoundStore.ts` | `language` state (`"en"` / `"es"`) |
| `src/app/types/index.ts` | `Language`, `SheetRow`, `PanelCopyMap` types |
| `LANGUAGES.md` | Panel inventory and implementation status |

## Steps to localize a component

### 1. Identify the panel name

Look up the component's panel name in [LANGUAGES.md](../../../LANGUAGES.md).
The panel name must match the **Panel name** column in the Google Sheet exactly
(e.g. `"About the Project"`, `"Select Listener"`).

### 2. Define a fallback constant

Create a `const FALLBACK` object keyed by the **Item name** values from the
sheet. Values are the current hardcoded English strings:

```typescript
const FALLBACK = {
  Title: "Hearing Ranges",
  Note: "No rockfish hearing data",
};
```

### 3. Wire up the hook

Call `usePanelCopy` with the exact panel name and create a `t` helper that
falls back to the constant when the sheet data is unavailable:

```typescript
function HearingRanges() {
  const { copy, isLoading } = usePanelCopy("Hearing Ranges");
  const t = (key: string) =>
    copy[key] || FALLBACK[key as keyof typeof FALLBACK] || "";

  if (isLoading) return <SectionSkeleton />;

  return (
    <div>
      <h2>{t("Title")}</h2>
      <p>{t("Note")}</p>
    </div>
  );
}
```

### 4. Replace hardcoded strings

Replace every hardcoded English string with `{t("Item Name")}`. The item name
keys must match the sheet's **Item name** column exactly.

### 5. Update LANGUAGES.md

Mark the panel as `Implemented` in the status table and fill in the `Location`
column.

## Pattern reference (from About.tsx)

The established pattern in `src/app/pages/About.tsx` has these elements:

1. **Fallback constant** at module scope, typed by item-name keys
2. **Component function** that calls `usePanelCopy(panelName)`
3. **`t` helper** — `copy[key] || FALLBACK[key] || ""`
4. **Loading state** — render `<SectionSkeleton />` while `isLoading` is true
5. **Template** — identical to the original markup, with `{t("...")}` in place
   of string literals

## Checklist

- [ ] Fallback constant with all item-name keys and current English text
- [ ] `usePanelCopy("Exact Panel Name")` called in the component
- [ ] `t` helper merges sheet copy over fallback
- [ ] Loading skeleton rendered while data loads
- [ ] Every hardcoded string replaced with `{t("...")}`
- [ ] `LANGUAGES.md` status table updated
