import { useState } from "react";
import Navigation from "../components/Navigation";
import AmbientSelector from "../components/AmbientSelector";
import SoundVisualization from "../components/SoundVisualization";
import { ListenerType, SourceType, AmbientCondition } from "../data/soundData";

export default function Home() {
  const [listener, setListener] = useState<ListenerType>("Harbor Seal");
  const [source, setSource] = useState<SourceType>("Rockfish");
  const [condition, setCondition] = useState<AmbientCondition>("winter");

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden lg:h-screen lg:overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, var(--ss-surface-panel-end) 0%, var(--ss-surface-panel-start) 50%, var(--ss-surface-panel-end) 100%)",
        }}
      />

      {/* Navigation */}
      <Navigation />

      {/* Ambient Condition Selector */}
      <div className="hidden lg:block">
        <AmbientSelector selected={condition} onChange={setCondition} />
      </div>

      {/* Sound Visualization Panel */}
      <div className="relative z-10 px-3 pb-4 pt-28 lg:px-0 lg:pb-0 lg:pt-0">
        <SoundVisualization
          listener={listener}
          source={source}
          condition={condition}
          onListenerChange={setListener}
          onSourceChange={setSource}
          onConditionChange={setCondition}
        />
      </div>
    </div>
  );
}
