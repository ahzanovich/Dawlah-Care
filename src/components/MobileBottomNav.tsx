import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  CalendarCheck, 
  User, 
  Sun, 
  Moon,
  Sparkles,
  Stethoscope,
  Plus,
  LogOut,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { AppViewMode, ConsultationType, UserProfile, ThemeMode } from '../types';

interface MobileBottomNavProps {
  currentView: AppViewMode;
  onViewChange: (view: AppViewMode) => void;
  mobilePatientTab?: 'clinics' | 'triage';
  onMobilePatientTabChange?: (tab: 'clinics' | 'triage') => void;
  currentUser: UserProfile | null;
  onSwitchRoleOrSignOut: () => void;
  selectedConsultType?: ConsultationType;
  onConsultTypeChange?: (type: ConsultationType) => void;
  activePassesCount: number;
  onOpenAppointments: () => void;
  pendingReferralsCount: number;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenNewReferralModal?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onViewChange,
  mobilePatientTab = 'clinics',
  onMobilePatientTabChange,
  currentUser,
  onSwitchRoleOrSignOut,
  selectedConsultType,
  onConsultTypeChange,
  activePassesCount,
  onOpenAppointments,
  pendingReferralsCount,
  theme,
  onToggleTheme,
  onOpenNewReferralModal,
}) => {
  const isDoctor = currentUser?.role === 'doctor';
  const [isAccountSheetOpen, setIsAccountSheetOpen] = useState(false);

  return (
    <>


      {/* Account & Profile Quick Bottom Sheet */}
      {isAccountSheetOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs sm:hidden flex flex-col justify-end animate-in fade-in duration-200"
          onClick={() => setIsAccountSheetOpen(false)}
        >
          <div 
            className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 rounded-t-2xl p-5 space-y-4 pb-10 shadow-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="w-10 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto -mt-1 mb-2"></div>

            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-950 dark:text-white">My Account</h3>
              <button
                onClick={() => setIsAccountSheetOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center hover:text-zinc-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Profile Card */}
            {currentUser && (
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                <img
                  src={currentUser.avatar || (isDoctor 
                    ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'
                    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
                  )}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-600 dark:border-amber-400"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-zinc-950 dark:text-white truncate">{currentUser.name}</h4>
                    <ShieldCheck className="w-3.5 h-3.5 text-red-600 dark:text-amber-400 shrink-0" />
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{currentUser.emailOrPhone}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded-xs bg-red-100 dark:bg-amber-500/20 text-red-700 dark:text-amber-300 font-semibold">
                      {isDoctor ? 'Doctor' : 'Patient'}
                    </span>
                    {currentUser.authProvider && (
                      <span className="text-[10px] font-mono text-zinc-400 capitalize">
                        via {currentUser.authProvider}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions List */}
            <div className="space-y-2">
              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={onToggleTheme}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-900 dark:text-zinc-100 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Moon className="w-4 h-4 text-zinc-800" />
                    )}
                  </div>
                  <div className="text-left">
                    <div>Appearance Theme</div>
                    <div className="text-[10px] text-zinc-400 font-normal">
                      {theme === 'dark' ? 'Dark & Gold Mode' : 'White & Red (Bright Mode)'}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-red-600 dark:text-amber-400">
                  {theme === 'dark' ? 'Switch to Bright' : 'Switch to Dark'}
                </span>
              </button>

              {/* View Passes / Queue */}
              <button
                type="button"
                onClick={() => {
                  setIsAccountSheetOpen(false);
                  onOpenAppointments();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-900 dark:text-zinc-100 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-amber-500/10 text-red-600 dark:text-amber-400 flex items-center justify-center">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div>{isDoctor ? "Today's Patient Queue" : "My Active Queue Passes"}</div>
                    <div className="text-[10px] text-zinc-400 font-normal">Check status or cancel passes</div>
                  </div>
                </div>
                {activePassesCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-600 dark:bg-amber-400 text-white dark:text-black">
                    {activePassesCount}
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                )}
              </button>

              {/* Switch Role or Sign Out */}
              <button
                type="button"
                onClick={() => {
                  setIsAccountSheetOpen(false);
                  onSwitchRoleOrSignOut();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-xs font-semibold text-red-700 dark:text-red-400 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div>Switch Role / Sign Out</div>
                    <div className="text-[10px] text-red-500/80 font-normal">Change identity or log out</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Bar for Mobile Phones (Fixed bottom) */}
      <nav 
        aria-label="Mobile Navigation"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 px-3 py-2 shadow-xl"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 8px) + 6px)' }}
      >
        {isDoctor ? (
          /* DOCTOR BOTTOM BAR */
          <div className="grid grid-cols-4 items-center gap-1 text-center">
            {/* 1. Doctor Portal */}
            <button
              type="button"
              onClick={() => {
                onViewChange('doctor-portal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-colors cursor-pointer ${
                currentView === 'doctor-portal'
                  ? 'text-red-600 dark:text-amber-400 font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              <Building2 className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium leading-none">Practice</span>
            </button>

            {/* 2. Referral Hub */}
            <button
              type="button"
              onClick={() => {
                onViewChange('inter-doctor-hub');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-colors relative cursor-pointer ${
                currentView === 'inter-doctor-hub'
                  ? 'text-red-600 dark:text-amber-400 font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              <Users className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium leading-none">Referrals</span>
              {pendingReferralsCount > 0 && (
                <span className="absolute top-0 right-4 w-4 h-4 rounded-full bg-red-600 dark:bg-amber-400 text-white dark:text-black font-mono font-bold text-[9px] flex items-center justify-center shadow-xs">
                  {pendingReferralsCount}
                </span>
              )}
            </button>

            {/* 3. New Referral */}
            {onOpenNewReferralModal && (
              <button
                type="button"
                onClick={onOpenNewReferralModal}
                className="flex flex-col items-center justify-center py-1 px-1 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-red-600 dark:bg-amber-500 text-white dark:text-black flex items-center justify-center mb-0.5 shadow-xs">
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-medium leading-none">New Case</span>
              </button>
            )}

            {/* 4. Account */}
            <button
              type="button"
              onClick={() => setIsAccountSheetOpen(true)}
              className="flex flex-col items-center justify-center py-1 px-1 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              <User className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium leading-none">Account</span>
            </button>
          </div>
        ) : (
          /* PATIENT BOTTOM BAR */
          <div className="grid grid-cols-4 items-center gap-1 text-center">
            {/* 1. Find Care (Clinics) */}
            <button
              type="button"
              onClick={() => {
                if (onMobilePatientTabChange) {
                  onMobilePatientTabChange('clinics');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-colors cursor-pointer ${
                mobilePatientTab === 'clinics'
                  ? 'text-red-600 dark:text-amber-400 font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              <Stethoscope className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium leading-none">Clinics</span>
            </button>

            {/* 2. AI Triage */}
            <button
              type="button"
              onClick={() => {
                if (onMobilePatientTabChange) {
                  onMobilePatientTabChange('triage');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-colors cursor-pointer ${
                mobilePatientTab === 'triage'
                  ? 'text-red-600 dark:text-amber-400 font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              <div className="relative">
                <Sparkles className="w-5 h-5 mb-0.5" />
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-amber-400 absolute -top-0.5 -right-0.5 animate-pulse"></span>
              </div>
              <span className="text-[10px] font-medium leading-none">AI Triage</span>
            </button>

            {/* 3. Active Passes */}
            <button
              type="button"
              onClick={onOpenAppointments}
              className="flex flex-col items-center justify-center py-1 px-1 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 transition-colors relative cursor-pointer"
            >
              <CalendarCheck className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium leading-none">Passes</span>
              {activePassesCount > 0 && (
                <span className="absolute top-0 right-4 w-4 h-4 rounded-full bg-red-600 dark:bg-amber-400 text-white dark:text-black font-mono font-bold text-[9px] flex items-center justify-center shadow-xs">
                  {activePassesCount}
                </span>
              )}
            </button>

            {/* 4. Account */}
            <button
              type="button"
              onClick={() => setIsAccountSheetOpen(true)}
              className="flex flex-col items-center justify-center py-1 px-1 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              <User className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium leading-none">Account</span>
            </button>
          </div>
        )}
      </nav>
    </>
  );
};
