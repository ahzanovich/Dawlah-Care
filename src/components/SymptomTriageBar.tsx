import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  AlertCircle, 
  HelpCircle, 
  X, 
  ShieldAlert, 
  ArrowRight,
  Info
} from 'lucide-react';
import { TriageResult } from '../types';

interface SymptomTriageBarProps {
  onSearch: (symptom: string) => Promise<void>;
  isLoading: boolean;
  activeTriage: TriageResult | null;
  onClearTriage: () => void;
  onSelectDoctorFromTriage?: (docId: string) => void;
}

const POPULAR_SYMPTOM_PROMPTS = [
  "im having stomach ache",
  "acid reflux and burning gut",
  "sudden fever with chills",
  "toddler tummy pain & crying",
  "chest tightness & racing heart",
  "sprained ankle & knee swelling",
  "itchy skin rash",
];

export const SymptomTriageBar: React.FC<SymptomTriageBarProps> = ({
  onSearch,
  isLoading,
  activeTriage,
  onClearTriage,
}) => {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim());
    }
  };

  const handleChipClick = (symptom: string) => {
    setInputVal(symptom);
    onSearch(symptom);
  };

  return (
    <div className="w-full mb-8">
      {/* Search Bar Container */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-2 border border-zinc-200 dark:border-zinc-800 transition-colors">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-400" />
            </div>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Describe symptoms in your own words (e.g. 'im having stomach ache', 'migraine')..."
              className="w-full pl-10 pr-9 py-2.5 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100/70 dark:hover:bg-zinc-900 focus:bg-white dark:focus:bg-zinc-900 text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 rounded-lg text-sm font-normal border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-white focus:outline-hidden transition-all"
            />
            {inputVal && (
              <button
                type="button"
                onClick={() => {
                  setInputVal('');
                  if (activeTriage) onClearTriage();
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-black font-semibold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-xs"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 dark:border-black/40 border-t-white dark:border-t-black rounded-full animate-spin"></div>
                <span>Triaging...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Triage & Match Clinics</span>
              </>
            )}
          </button>
        </form>

        {/* Symptom Quick Chips */}
        <div className="mt-2.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 text-xs">
          <span className="text-[11px] font-mono uppercase text-zinc-400 dark:text-zinc-500 shrink-0 mr-1">
            Common:
          </span>
          {POPULAR_SYMPTOM_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleChipClick(prompt)}
              className="text-xs px-2.5 py-1 rounded-md shrink-0 font-normal transition-colors bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-red-50 hover:text-red-700 dark:hover:bg-amber-500/10 dark:hover:text-amber-300 border border-zinc-200/80 dark:border-zinc-700/80 hover:border-red-200 dark:hover:border-amber-500/30"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Active AI Triage Result Panel */}
      {activeTriage && (
        <div className="mt-3 bg-white dark:bg-zinc-900 border border-red-200 dark:border-amber-500/30 rounded-xl p-5 transition-colors shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-red-600 dark:bg-amber-400 text-white dark:text-black">
                  Recommended Specialty: {activeTriage.matchedSpecialty}
                </span>

                <span className="text-xs font-mono px-2 py-0.5 rounded-md border border-red-200 dark:border-amber-500/30 text-red-800 dark:text-amber-300 bg-red-50 dark:bg-amber-500/10">
                  {activeTriage.urgencyLabel}
                </span>

                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                  Analyzed: "{activeTriage.symptomQuery}"
                </span>
              </div>

              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                {activeTriage.clinicalSummary}
              </p>
            </div>

            <button
              onClick={onClearTriage}
              className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white flex items-center gap-1 font-medium self-start shrink-0 px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filter</span>
            </button>
          </div>

          {/* Possible Conditions & Home Advice */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            {/* Differential / Suspected Conditions */}
            <div className="bg-zinc-50 dark:bg-zinc-950 rounded-lg p-3.5 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                <Info className="w-3.5 h-3.5 text-red-600 dark:text-amber-400" />
                <span>Suspected Causes Evaluated</span>
              </div>
              <ul className="space-y-1">
                {activeTriage.possibleConditions.map((cond, i) => (
                  <li key={i} className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-amber-400"></span>
                    <span>{cond}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Questions to ask doctor */}
            <div className="bg-zinc-50 dark:bg-zinc-950 rounded-lg p-3.5 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                <HelpCircle className="w-3.5 h-3.5 text-red-600 dark:text-amber-400" />
                <span>Questions to Ask Physician</span>
              </div>
              <ul className="space-y-1">
                {activeTriage.suggestedDoctorQuestions.slice(0, 2).map((q, i) => (
                  <li key={i} className="text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-1.5">
                    <span className="text-red-500 dark:text-amber-400 font-mono shrink-0">•</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Home care & Red Flags */}
            <div className="bg-zinc-50 dark:bg-zinc-950 rounded-lg p-3.5 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-600 dark:text-amber-400" />
                <span>Clinical Pre-Care Guidance</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-2">
                {activeTriage.homeCareTip}
              </p>
              {activeTriage.redFlagsToWatch?.length > 0 && (
                <div className="text-[11px] text-red-700 dark:text-amber-400 font-mono border-t border-red-200 dark:border-amber-500/30 pt-1.5 mt-1.5 font-medium">
                  Alert: Seek immediate care if {activeTriage.redFlagsToWatch[0]}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>
              Showing <strong className="text-zinc-900 dark:text-zinc-200 font-semibold">{activeTriage.recommendedDoctors.length}</strong> {activeTriage.matchedSpecialty} clinics nearby
            </span>
            <span className="font-semibold text-red-600 dark:text-amber-400 flex items-center gap-1">
              Select clinic below to book <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
