import { useSoundStore } from "../store/useSoundStore";

export default function LanguageToggle() {
  const language = useSoundStore((s) => s.language);
  const setLanguage = useSoundStore((s) => s.setLanguage);

  return (
    <div className="flex items-center rounded-full bg-white/10 p-0.5 gap-0.5">
      {(["en", "es"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
            language === lang
              ? "bg-white text-teal-900"
              : "text-white/60 hover:text-white/90"
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
