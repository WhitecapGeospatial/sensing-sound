import ConditionSelector from "../components/ConditionSelector";
import AudioParticipantSelector from "../components/AudioParticipantSelector";
import SceneViewer from "../components/SceneViewer";
import AudioViewer from "../components/AudioViewer";
import HearingRangeViewer from "../components/HearingRangeViewer";
import DetectionRanges from "../components/DetectionRanges";
import Navigation from "../components/Navigation";

export default function Home() {
  return (
    <div
      className="relative flex flex-col h-screen"
      style={{
        background:
          "linear-gradient(180deg, var(--ss-surface-panel-end) 0%, var(--ss-surface-panel-start) 50%, var(--ss-surface-panel-end) 100%)",
      }}
    >
      <Navigation />

      <div className="flex flex-row flex-1 overflow-hidden">
        {/* LeftPanel */}
        <div className="w-1/4 flex flex-col gap-4 p-4 overflow-y-auto">
          <ConditionSelector />
          <AudioParticipantSelector variant="listener" />
          <AudioParticipantSelector variant="source" />
        </div>

        {/* MainContent */}
        <div className="flex-1 flex flex-col gap-4 p-4 min-h-0" style={{ flex: "1 1 0%" }}>
          <div style={{ flex: "45 1 0%" }} className="min-h-0">
            <SceneViewer />
          </div>
          <div style={{ flex: "15 1 0%" }} className="min-h-0">
            <AudioViewer />
          </div>

          {/* RangesContent */}
          <div style={{ flex: "40 1 0%" }} className="flex flex-row gap-4 min-h-0">
            <div className="w-3/4">
              <DetectionRanges />
            </div>
            <div className="w-1/4">
              <HearingRangeViewer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
