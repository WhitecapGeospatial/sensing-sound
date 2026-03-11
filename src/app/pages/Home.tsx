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
    <div className="relative w-full h-screen overflow-hidden">
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
      <AmbientSelector selected={condition} onChange={setCondition} />

      {/* Sound Visualization Panel */}
      <SoundVisualization 
        listener={listener} 
        source={source} 
        condition={condition}
        onListenerChange={setListener}
        onSourceChange={setSource}
        onConditionChange={setCondition}
      />
    </div>
  );
}
