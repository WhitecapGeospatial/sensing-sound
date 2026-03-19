import { Link } from "react-router";
import { Users, Waves, Ship, AlertCircle } from "lucide-react";
import kelpForestImage from "@/assets/466eeefa090642bc63ad30b19adb04bdeebda888.png";
import logoImage from "@/assets/9962ff5db39642ae80b1efdc857274dd2ff0055a.png";
import harborSealImage from "@/assets/ae6420e7e13fdb75fda431bbe0983f9edfff3ba0.png";
import noaaLogo from "@/assets/NOAA_Logo_10x.png";
import packardLogo from "@/assets/PackardFoundation_Logo_10x.png";
import ucscScienceLogo from "@/assets/UCSC_Logo_10x.png";

export default function About() {
  return (
    <div className="relative w-full min-h-screen overflow-auto">
      <div
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{
          backgroundImage: `url(${kelpForestImage})`,
        }}
      />

      <div className="fixed inset-0 bg-teal-900/80 backdrop-blur-sm -z-10" />

      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <img src={logoImage} alt="SensingSound" className="h-20 w-auto" />
          </div>
          <p className="text-xl text-white/90 italic">
            Exploring Underwater Acoustics in Monterey Bay
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 mt-6 mx-auto px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-semibold transition-colors"
          >
            Explore
          </Link>
        </div>

        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-orange-400" />
              <h2 className="text-2xl font-bold text-white">About the Project</h2>
            </div>
            <div className="text-white/90 space-y-4 leading-relaxed">
              <p>
                Scientists from <strong>UC Santa Cruz</strong>, <strong>Monterey Bay Aquarium Research Institute</strong>, and <strong>Middlebury Institute</strong> collaborated to study how underwater noise affects what marine animals can hear.
              </p>
              <p className="italic text-orange-300 text-lg">
                How can animal sound perception be impacted by background noise, especially when ambient noise is elevated by anthropogenic sources?
              </p>
              <p>
                This project turns acoustic research into an interactive format so users can compare how listening conditions change from calm seas to vessel noise.
              </p>
            </div>
          </div>

          <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex flex-col items-center">
              <img
                src={harborSealImage}
                alt="Sprouts the harbor seal"
                className="w-52 h-52 rounded-full object-cover border-4 border-cyan-300/70 shadow-xl"
              />
              <p className="mt-3 text-white/90 text-sm italic">Sprouts the harbor seal</p>
            </div>
            <div className="absolute bottom-2 right-3 text-[11px] tracking-widest text-white/30">
              NMFS 23554
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Waves className="w-6 h-6 text-orange-400" />
              <h2 className="text-2xl font-bold text-white">About the Experience</h2>
            </div>
            <div className="text-white/90 space-y-4 leading-relaxed">
              <p>
                Explore Monterey Bay from the perspective of marine listeners and test how sound detection changes under different environmental contexts.
              </p>
              <p>
                Harbor seals, bottlenose dolphins, and killer whales all depend on acoustic cues, but their hearing sensitivity and communication frequencies differ.
              </p>
              <p className="text-orange-400">
                The central question is how quickly detection range collapses as ambient noise increases.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-400" />
              <h2 className="text-2xl font-bold text-white">About the Science</h2>
            </div>
            <div className="text-white/90 space-y-4 leading-relaxed">
              <p>
                To estimate communication ranges in Monterey Bay National Marine Sanctuary, we integrated three datasets: species auditory parameters, vocalization source levels and spectra, and underwater ambient noise measurements.
              </p>
              <p>
                The species represented are harbor seal (<em>Phoca vitulina</em>), bottlenose dolphin (<em>Tursiops truncatus</em>), and killer whale (<em>Orcinus orca</em>). We additionally include a local fish source, rockfish (<em>Sebastes paucispinis</em>).
              </p>
              <p>
                Hearing thresholds and critical ratios were used to estimate the quietest detectable vocalizations at relevant frequencies under measured background noise levels.
              </p>
              <div className="bg-black/20 border border-white/20 rounded-lg p-4 text-center">
                <p className="text-lg text-orange-300 font-mono">DT = SL - 15log(r) - ar</p>
                <p className="text-sm text-white/80 mt-2">
                  <strong>DT</strong> is detection threshold in context, <strong>SL</strong> is source level, <strong>r</strong> is range, and <strong>a</strong> is frequency-dependent seawater absorption.
                </p>
              </div>
              <p>
                In accessible terms: a call starts loud, then weakens with spreading and absorption until it falls below what a listener can detect in local noise.
              </p>
              <div className="bg-orange-400/15 border border-orange-300/50 rounded-lg p-4">
                <p className="text-orange-300 font-semibold mb-2">Relative vs. absolute range display</p>
                <p className="text-sm">
                  Showing relative changes between contexts can be easier to interpret for broad audiences and avoids over-weighting any single absolute estimate. Absolute ranges remain scientifically informative, while relative decline highlights ecological impact clearly.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Ship className="w-6 h-6 text-orange-400" />
              <h2 className="text-2xl font-bold text-white">The Impact of Human Noise</h2>
            </div>
            <div className="text-white/90 space-y-4 leading-relaxed">
              <p>
                Human activities such as shipping and cruise traffic introduce persistent underwater sound that can reduce communication and detection distances.
              </p>
              <p className="italic text-orange-300 text-lg">
                Compare calm and vessel contexts to evaluate relative masking effects.
              </p>
              <p>
                These comparisons help show how natural and anthropogenic noise can alter communication space and habitat quality.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">How to Explore</h2>
            <div className="text-white/90 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center flex-shrink-0 text-white font-bold">
                  1
                </div>
                <p>
                  <strong>Choose your context:</strong> Compare calm, wind and waves, storms, and vessel noise.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center flex-shrink-0 text-white font-bold">
                  2
                </div>
                <p>
                  <strong>Pick your listener:</strong> Switch among harbor seal, bottlenose dolphin, and killer whale.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center flex-shrink-0 text-white font-bold">
                  3
                </div>
                <p>
                  <strong>Select a sound source:</strong> Test fish and marine mammal sounds across listeners.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center flex-shrink-0 text-white font-bold">
                  4
                </div>
                <p>
                  <strong>Observe results:</strong> Focus on relative range changes as noise conditions shift.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Funders</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="bg-white/10 border border-white/20 rounded-xl p-4 h-full flex items-center justify-center">
                <img src={noaaLogo} alt="NOAA" className="max-h-24 w-auto object-contain" />
              </div>
              <div className="bg-white/10 border border-white/20 rounded-xl p-4 h-full flex items-center justify-center">
                <img src={packardLogo} alt="Packard Foundation" className="max-h-24 w-auto object-contain" />
              </div>
              <div className="bg-white/10 border border-white/20 rounded-xl p-4 h-full flex items-center justify-center">
                <img src={ucscScienceLogo} alt="UC Santa Cruz Science" className="max-h-24 w-auto object-contain" />
              </div>
            </div>
            <p className="mt-4 text-sm text-white/80">
              Funding support from NOAA, the Packard Foundation, and UC Santa Cruz Science.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center text-white/60 text-sm">
          <p>© 2026 SensingSound Project</p>
          <p className="mt-2">
            A collaboration between UC Santa Cruz, Monterey Bay Aquarium Research Institute, and Middlebury Institute
          </p>
          <p className="mt-4">Website designed by Jessica Kendall-Bar.</p>
          <p className="mt-1">
            Interactive exhibit at Seymour Marine Discovery Center designed by Ian Costello and Jessica Kendall-Bar.
          </p>
        </div>
      </div>
    </div>
  );
}
