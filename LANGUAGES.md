# Localization via Google Sheets

Website copy for English and Spanish is managed in a shared Google Sheet and fetched at runtime.

**Sheet URL:** https://docs.google.com/spreadsheets/d/127xJ85ehcJ7Yf7WLv7Um6MxauauDKJ3RwJSGiCjrXOk/edit?gid=0#gid=0

## How it works

1. The sheet is fetched as CSV via the public `gviz` endpoint (no API key).
2. Rows are filtered to `Experience Type = "Website"`.
3. The `usePanelCopy(panelName)` hook returns a `Record<itemName, text>` for the active language.
4. Language preference is stored in `useSoundStore` (`language: "en" | "es"`).
5. Each component falls back to hardcoded English if the fetch fails.

### Relevant columns

| Column | Header | Purpose |
|--------|--------|---------|
| C | Experience Type | Filter — only `"Website"` rows are used |
| D | Panel name | Groups items by UI section |
| E | Item name | Identifies a specific text element within a panel |
| F | English Text | English copy |
| G | Spanish Text | Spanish copy |

## Panel implementation status

| Panel name | Items | Status | Location |
|---|---|---|---|
| About Hero | Subtitle | Implemented | `About.tsx` (hero) |
| About the Project | Title, Body 1, Body 2 - emphasized text, Body 3 | Implemented | `About.tsx` → `AboutTheProject` |
| About the Experience | Title, Body 1, Body 2, Body - emphasized central question | Implemented | `About.tsx` → `AboutTheExperience` |
| About the Science | Title, Body 1, Body 2 - math equation, Body 3 - math equation description, Body 4 - Text, Body 5 - box Title, Body 5 - box Description | Implemented | `About.tsx` → `AboutTheScience` |
| Funders | Title, Description | Implemented | `About.tsx` (funders section) |
| Footer | Copyright, Collaboration line, Credit 1, Credit 2 | Implemented | `About.tsx` (footer) |
| About Page | Back button | Not implemented | — |
| Navigation | Home, About | Not implemented | — |
| Mobile Menu | Button | Not implemented | — |
| Select Listener | Title, Option 1–3 | Implemented | `AudioParticipantSelector.tsx` |
| Select Sound | Title, Option 1–4 | Implemented | `AudioParticipantSelector.tsx` |
| Select Context | Title, Options 1–4 (each with subtitle + description), Volume label | Implemented | `ConditionSelector.tsx` |
| Distance Comparison | Title, Field label 1–2, Pill 1–2 | Not implemented | — |
| Listening Scene | Toggle (show/hide), Center label | Not implemented | — |
| Audio Panel | Muted, Unmuted, Play, Pause | Not implemented | — |
| Detection Ranges | Title, Subtitle, Axis label | Not implemented | — |
| Hearing Ranges | Title, Note | Not implemented | — |
| Invalid Selection Modal | Title pattern, Subtitle pattern, Detail pattern | Not implemented | — |
