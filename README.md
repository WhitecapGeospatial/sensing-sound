# SensingSound

SensingSound is an interactive web application about underwater acoustics in Monterey Bay. It lets users explore a central question: **how far can one marine animal hear another, and how does ocean noise change that distance?**

The app models this around two core concepts:

- **AudioParticipant** -- a marine animal that can produce sound (source), detect sound (listener), or both. Each participant carries a `Noise` (an audio clip and spectrogram of the sound it makes), a list of other participants it can hear (`listens_to`), and the acoustic detection data for each of those pairings across four ocean conditions.
- **Ocean condition** -- the ambient noise context (`calm`, `winter`, `storm`, `cruiseShip`). Switching conditions recalculates every detection distance in the app.

Users pick a listener, a source, and an ocean condition. The app derives the detection distance from the listener's embedded data for that source under that condition, and presents it through an animated underwater scene, a spectrogram audio player, a hearing range frequency chart, and a log-scale bar chart comparing all 9 valid pairings.

## Participants

Four species are modeled, producing 9 valid listener/source combinations:

| Participant        | Can listen | Can produce sound | Listens to                                       |
|--------------------|------------|-------------------|--------------------------------------------------|
| Rockfish           | no         | yes (grunt)       | --                                               |
| Harbor Seal        | yes        | yes (roar)        | Rockfish, Harbor Seal, Killer Whale, Bottlenose Dolphin |
| Bottlenose Dolphin | yes        | yes (whistle)     | Killer Whale, Bottlenose Dolphin                 |
| Killer Whale       | yes        | yes (call)         | Harbor Seal, Killer Whale, Bottlenose Dolphin    |

Each detection entry stores a peak frequency, third-octave band level, and distance values (in km) for calm, winter, storm, and cruise ship conditions. Distances range from 20 meters (Harbor Seal hearing a Rockfish grunt in cruise ship noise) to 73 km (Harbor Seal hearing a Killer Whale call in calm seas).

## Dashboard

The home page (`/app`) presents six components driven by a shared Zustand store:

- **ConditionSelector** -- vertical slider and buttons to choose ocean context.
- **AudioParticipantSelector** (x2) -- carousel pickers for listener and source.
- **SceneViewer** -- animated underwater scene showing the selected listener, source, and computed detection distance.
- **AudioViewer** -- play/pause the source animal's sound with a spectrogram progress overlay.
- **HearingRangeViewer** -- frequency range chart comparing hearing across species and humans.
- **DetectionRanges** -- log-scale bar chart of all 9 pairings under the current condition, with calm-baseline reference bars and percentage-decrease labels.

The About page (`/`) presents project background, scientific framing (transmission loss equation `DT = SL - 15log(r) - ar`), collaborators, and funders.

## Tech Stack

- React 18 + TypeScript
- Vite 6
- Zustand 5 (global state)
- React Router 7
- Tailwind CSS v4 + custom `--ss-*` design tokens
- Lucide icons

## Local Development

```bash
pnpm install
pnpm dev
```

Production build:

```bash
pnpm build
```

## Key Files

| File | Purpose |
|------|---------|
| `src/app/types/index.ts` | Domain types: `AudioParticipant`, `Noise`, `DetectionData`, `AmbientCondition` |
| `src/app/data/participants.ts` | Four participant objects with embedded detection distances and `listens_to` wiring |
| `src/app/store/useSoundStore.ts` | Zustand store: selected listener, source, condition, and derived distance |
| `src/app/utils/formatting.ts` | Shared display helpers |
| `src/app/pages/Home.tsx` | Main dashboard layout |
| `src/app/pages/About.tsx` | Project background, science, credits |
| `src/app/config/colorPalette.json` | Theme tokens applied as CSS custom properties at runtime |

## Collaborators and Funding

The project is a collaboration across UC Santa Cruz, Monterey Bay Aquarium Research Institute, and the Middlebury Institute, with funding support from NOAA, the Packard Foundation, and UC Santa Cruz Science.
