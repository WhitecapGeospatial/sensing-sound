# SensingSound Game Dashboard

SensingSound is an interactive web experience about underwater acoustics in Monterey Bay. Users compare how far marine animals can detect sounds under changing ambient conditions such as calm seas, winter wind and waves, storm events, and cruise ship noise.

## Website Overview

The app has two routes:

- `/`: Interactive dashboard for comparing listener, sound source, and environmental context.
- `/about`: Project background, science context, collaborators, and funders.

The home dashboard is designed around one core question: how does background noise change sound perception distance for different species pairings?

## What Users Can Do

- Select an ocean context: `Calm Seas`, `Wind & Waves`, `Storm Event`, or `Cruise Ship`.
- Select a listener: `Harbor Seal`, `Bottlenose Dolphin`, or `Killer Whale`.
- Select a sound source: `Rockfish`, `Harbor Seal`, `Bottlenose Dolphin`, or `Killer Whale`.
- Compare detection distances across all valid listener/source pairs in a log-scale bar chart.
- Inspect relative decreases from calm conditions in noisier contexts.
- Listen to source audio clips and view synchronized spectrogram previews.
- Open and close the hearing ranges panel from the listening scene.

## Dashboard Features

- **Detection Distance Comparison panel**: Quick listener and source selection using dropdowns with species imagery.
- **Listening scene**: Animated listener and source rings, scientific/common names, and a live `Sound Perception Distance` readout.
- **Hearing ranges panel**: Toggleable side panel for additional hearing context.
- **Audio and spectrogram panel**: Play/pause and mute controls with playback progress over spectrogram images.
- **Detection Ranges chart**: Log-scaled bars with calm reference bars and context-specific overlays.
- **Pairing shortcuts**: Listener chips and source buttons jump directly to specific pairings.
- **Invalid pairing handling**: If a listener/source combination is unavailable in the dataset, the UI shows a notice and auto-reverts to a valid pair.

## Species and Data Model

Core acoustic data lives in `src/app/data/soundData.ts`.

Each valid pairing stores:

- `peakFrequency`
- `thirdOctaveBand`
- Detection distance values for `calm`, `winter`, `storm`, and `cruiseShip`

The current dataset includes 9 valid listener/source combinations (not all theoretical combinations are present).

The About page also presents the transmission-loss framing used in the exhibit narrative:

`DT = SL - 15log(r) - ar`

## Tech Stack

- React + TypeScript
- React Router
- Vite
- Tailwind CSS utilities plus project-specific CSS variables
- Lucide icons

## Local Development

Install dependencies:

```bash
npm i
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Key Project Files

- `src/app/routes.ts`: Route definitions for `/` and `/about`.
- `src/app/pages/Home.tsx`: Main interactive dashboard page.
- `src/app/pages/About.tsx`: Background, scientific framing, and credits.
- `src/app/components/SoundVisualization.tsx`: Core interaction and visualization logic.
- `src/app/components/MontereyBayMap.tsx`: Map-based source marker visualization.
- `src/app/components/PolarPlot.tsx`: Relative context decrease radial chart component.
- `src/app/data/soundData.ts`: Detection distance and acoustic metadata.
- `src/app/config/colorPalette.json`: Theme tokens applied at runtime.
- `src/app/config/applyColorPalette.ts`: Converts palette JSON into CSS custom properties.

## Collaborators and Funding

The website content credits collaboration across UC Santa Cruz, Monterey Bay Aquarium Research Institute, and Middlebury Institute, with funding support including NOAA, the Packard Foundation, and UC Santa Cruz Science.
The website content credits collaboration across UC Santa Cruz, Monterey Bay Aquarium Research Institute, and Middlebury Institute, with funding support including NOAA, the Packard Foundation, and UC Santa Cruz Science.


