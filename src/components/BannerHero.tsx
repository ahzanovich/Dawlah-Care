import React from 'react';
import { ShieldCheck, Clock, Award, Stethoscope, ArrowRight } from 'lucide-react';

interface BannerHeroProps {
  onQuickSymptomClick: (symptom: string) => void;
}

export const BannerHero: React.FC<BannerHeroProps> = ({ onQuickSymptomClick }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gradient-to-br dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-white p-4 sm:p-6 md:p-8 mb-4 sm:mb-8 border border-red-100 dark:border-amber-500/30 shadow-xs transition-colors">
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-50/50 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* MOBILE COMPACT HEADER (under 90px on phone, zero clutter) */}
      <div className="md:hidden relative z-10 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-red-50 dark:bg-amber-500/10 border border-red-200/80 dark:border-amber-500/30 text-[10px] font-mono text-red-700 dark:text-amber-300 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-amber-400 animate-pulse"></span>
            <span>EXPRESS CARE</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
            Median Wait: <strong>12m</strong>
          </span>
        </div>

        <h1 className="text-base font-bold text-zinc-950 dark:text-white leading-tight">
          Find Fast Care & <span className="text-red-600 dark:text-amber-400">Express Passes</span>
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-snug">
          Verified doctors near you with live wait times and transparent fees.
        </p>
      </div>

      {/* DESKTOP FULL HERO BANNER */}
      <div className="hidden md:flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-red-50 dark:bg-amber-500/10 border border-red-200/80 dark:border-amber-500/30 text-xs font-mono text-red-700 dark:text-amber-300 tracking-wider mb-4 font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-amber-400 animate-pulse"></span>
            <span>DAWLAH CLINICAL ACCESS</span>
            <span className="text-red-300 dark:text-amber-500/40">/</span>
            <span>ON-DEMAND HEALTHCARE</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white leading-snug mb-3">
            Not sure which doctor to see? <br />
            <span className="text-red-600 dark:text-amber-400 font-semibold">Describe your symptoms in plain words.</span>
          </h1>
          
          <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed mb-6 max-w-xl font-normal">
            Type <span className="text-red-700 dark:text-amber-300 font-semibold underline underline-offset-4 decoration-red-400 dark:decoration-amber-400">"I'm having stomach ache"</span> or your specific symptoms. Dawlah Care triages clinical urgency, matches specialized verified physicians, displays transparent fees, and generates express queue passes.
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-600 dark:text-amber-400" />
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">Verified Board Specialists</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-600 dark:text-amber-400" />
              <span>Median Clinic Wait: <strong className="text-zinc-900 dark:text-white">12 mins</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-red-600 dark:text-amber-400" />
              <span>Peer Physician Referral Exchange</span>
            </div>
          </div>
        </div>

        {/* Clinical Voucher Card on Desktop */}
        <div className="shrink-0 w-full md:w-72 bg-gradient-to-br from-red-50/80 via-white to-red-50/40 dark:from-zinc-900 dark:via-black dark:to-zinc-900 border border-red-200/90 dark:border-amber-500/30 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-red-600 dark:text-amber-400 font-bold mb-1">
              New Patient Welcome
            </div>
            <div className="text-lg font-bold text-zinc-950 dark:text-white mb-1">
              $20 First Visit Credit
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4 leading-normal">
              Applies toward clinic queue passes, doorstep doctor house-calls, and video consults.
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 bg-white dark:bg-zinc-950 rounded-lg px-3 py-2 border border-red-200 dark:border-amber-500/20 text-xs">
            <code className="font-mono font-bold text-red-700 dark:text-amber-300 tracking-widest">DAWLAH20</code>
            <span className="text-[10px] font-mono uppercase font-bold text-white bg-red-600 dark:bg-amber-400 dark:text-black px-2 py-0.5 rounded-sm">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
