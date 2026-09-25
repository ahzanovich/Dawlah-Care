import React, { useState } from 'react';
import { 
  MapPin, 
  ChevronDown, 
  Stethoscope, 
  Home, 
  Video, 
  Building2, 
  Users, 
  CalendarCheck, 
  Sun, 
  Moon, 
  LogOut, 
  User, 
  ShieldCheck,
  Activity,
  Plus
} from 'lucide-react';
import { AppViewMode, ConsultationType, ThemeMode, UserProfile, Doctor } from '../types';

interface HeaderProps {
  currentView: AppViewMode;
  onViewChange: (mode: AppViewMode) => void;
  selectedConsultType: ConsultationType;
  onConsultTypeChange: (type: ConsultationType) => void;
  userLocation: string;
  onLocationChange: (loc: string) => void;
  activeAppointmentsCount: number;
  onOpenAppointments: () => void;
  pendingReferralsCount: number;
  theme: ThemeMode;
  onToggleTheme: () => void;
  currentUser: UserProfile | null;
  onSwitchRoleOrSignOut: () => void;
  currentDoctor?: Doctor;
  onOpenNewReferralModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  selectedConsultType,
  onConsultTypeChange,
  userLocation,
  onLocationChange,
  activeAppointmentsCount,
  onOpenAppointments,
  pendingReferralsCount,
  theme,
  onToggleTheme,
  currentUser,
  onSwitchRoleOrSignOut,
  currentDoctor,
  onOpenNewReferralModal,
}) => {
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [tempLocation, setTempLocation] = useState(userLocation);

  const isDoctor = currentUser?.role === 'doctor';

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempLocation.trim()) {
      onLocationChange(tempLocation.trim());
      setIsEditingLocation(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onViewChange(isDoctor ? 'doctor-portal' : 'patient')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
              title={isDoctor ? 'Go to Doctor Portal' : 'Go to Find Care'}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-102 ${
                isDoctor 
                  ? 'bg-red-600 dark:bg-amber-500 text-white dark:text-black shadow-xs' 
                  : 'bg-red-600 dark:bg-amber-500 text-white dark:text-black shadow-xs'
              }`}>
                {isDoctor ? (
                  <Building2 className="w-4 h-4 stroke-[2.2]" />
                ) : (
                  <Stethoscope className="w-4 h-4 stroke-[2.2]" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold tracking-tight text-zinc-950 dark:text-white">
                    Dawlah <span className="font-normal text-red-600 dark:text-amber-400">Care</span>
                  </span>
                  <span className={`text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded-sm border font-semibold ${
                    isDoctor 
                      ? 'border-red-200 dark:border-amber-500/30 bg-red-50 dark:bg-amber-500/10 text-red-700 dark:text-amber-300' 
                      : 'border-red-200 dark:border-amber-500/30 bg-red-50 dark:bg-amber-500/10 text-red-700 dark:text-amber-300'
                  }`}>
                    {isDoctor ? 'Physician Portal' : 'Patient Care'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:block">
                  {isDoctor ? 'Physician workspace & peer referral network' : 'On-demand nearby clinics & doctor visits'}
                </p>
              </div>
            </button>

            {/* Patient Location selector */}
            {!isDoctor && (
              <div className="flex items-center ml-1 sm:ml-3 sm:pl-3 sm:border-l border-zinc-200 dark:border-zinc-800">
                {isEditingLocation ? (
                  <form onSubmit={handleLocationSubmit} className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-600 dark:text-amber-400 shrink-0" />
                    <input
                      type="text"
                      value={tempLocation}
                      onChange={(e) => setTempLocation(e.target.value)}
                      placeholder="Enter address..."
                      className="text-xs px-2 py-1 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-md text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-red-600 dark:focus:border-amber-400 w-32 sm:w-48 font-medium"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="text-xs bg-red-600 hover:bg-red-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black font-semibold px-2 py-1 rounded-md transition"
                    >
                      Save
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsEditingLocation(true)}
                    className="flex items-center gap-1 text-[11px] sm:text-xs text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-amber-300 bg-zinc-50 dark:bg-zinc-900 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 transition max-w-[130px] sm:max-w-[200px]"
                    title="Change care location"
                  >
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-600 dark:text-amber-400 shrink-0" />
                    <span className="font-medium truncate">{userLocation}</span>
                    <ChevronDown className="w-2.5 h-2.5 text-zinc-400 shrink-0" />
                  </button>
                )}
              </div>
            )}

            {/* Doctor Clinic Affiliation Badge (Visible only for doctors) */}
            {isDoctor && (
              <div className="hidden lg:flex items-center ml-3 pl-3 border-l border-zinc-200 dark:border-zinc-800 text-xs">
                <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-amber-400 animate-pulse"></span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-200 truncate max-w-[220px]">
                    {currentUser?.clinicName || currentDoctor?.clinicName || 'Dawlah Gastro & Endoscopy Center'}
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Role-Specific Navigation (Desktop) */}
          {isDoctor ? (
            /* DOCTOR NAVIGATION: Only Doctor Portal and Referral Hub */
            <div className="hidden sm:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium">
              <button
                onClick={() => onViewChange('doctor-portal')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  currentView === 'doctor-portal'
                    ? 'bg-red-600 dark:bg-amber-500 text-white dark:text-black shadow-xs font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-amber-300'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Doctor Portal</span>
              </button>

              <button
                onClick={() => onViewChange('inter-doctor-hub')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors relative ${
                  currentView === 'inter-doctor-hub'
                    ? 'bg-red-600 dark:bg-amber-500 text-white dark:text-black shadow-xs font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-amber-300'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Referral Hub</span>
                {pendingReferralsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-white text-red-600 dark:bg-black dark:text-amber-400">
                    {pendingReferralsCount}
                  </span>
                )}
              </button>
            </div>
          ) : (
            /* PATIENT NAVIGATION (Desktop): Only Find Care */
            <div className="hidden sm:flex items-center">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-amber-500/10 border border-red-200 dark:border-amber-500/30 text-xs font-semibold text-red-700 dark:text-amber-300">
                <Home className="w-3.5 h-3.5 text-red-600 dark:text-amber-400" />
                <span>Find Care</span>
                <span className="text-[10px] font-mono font-normal uppercase tracking-wider px-1.5 py-0.5 rounded-xs bg-red-100 dark:bg-amber-500/20 text-red-800 dark:text-amber-200">
                  Patient Mode
                </span>
              </div>
            </div>
          )}

          {/* Right Actions: Theme, Passes/Queue, Profile & Role Switch */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 sm:p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-red-200 dark:hover:border-amber-500/40 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
              title={`Switch to ${theme === 'dark' ? 'White & Red (Light)' : 'Dark & Gold'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-800" />
              )}
            </button>

            {/* Passes & Queue button */}
            <button
              onClick={onOpenAppointments}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border border-transparent transition shadow-xs bg-red-600 hover:bg-red-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black font-semibold"
              title={isDoctor ? "View Today's Patient Queue" : "View Active Appointment Passes"}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isDoctor ? "Patient Queue" : "My Passes"}</span>
              {activeAppointmentsCount > 0 && (
                <span className="bg-white text-red-700 dark:bg-black dark:text-amber-300 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                  {activeAppointmentsCount}
                </span>
              )}
            </button>

            {/* User Profile & Role Switch Button (Desktop) */}
            {currentUser && (
              <div className="hidden sm:flex items-center gap-1.5 pl-1.5 border-l border-zinc-200 dark:border-zinc-800">
                <button
                  onClick={onSwitchRoleOrSignOut}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition text-left cursor-pointer group"
                  title="Click to Switch Portal or Sign Out"
                >
                  <img
                    src={currentUser.avatar || (isDoctor 
                      ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'
                      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
                    )}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full object-cover border border-zinc-300 dark:border-zinc-700"
                  />
                  <div className="hidden lg:block">
                    <div className="text-[11px] font-semibold text-zinc-950 dark:text-white leading-none truncate max-w-[95px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[9px] font-mono uppercase leading-none mt-0.5 font-semibold text-zinc-500 dark:text-zinc-400 capitalize">
                      {isDoctor ? 'Doctor' : 'Patient'} {currentUser.authProvider ? `(${currentUser.authProvider})` : ''}
                    </div>
                  </div>
                  <LogOut className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-500 transition-colors ml-0.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sub-bar (Desktop only): For Patient -> Care Format Selector; For Doctor -> Practice Quick Actions */}
        {!isDoctor && currentView === 'patient' && (
          <div className="hidden sm:flex items-center justify-between py-2 border-t border-zinc-100 dark:border-zinc-900 overflow-x-auto no-scrollbar gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-zinc-400 text-[11px] font-medium hidden md:inline mr-1">Format:</span>
              
              <button
                onClick={() => onConsultTypeChange('in-clinic')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition ${
                  selectedConsultType === 'in-clinic'
                    ? 'bg-red-600 dark:bg-amber-500 text-white dark:text-black font-semibold shadow-xs'
                    : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-amber-300 border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>In-Clinic Express</span>
                <span className="text-[10px] opacity-80 font-mono">Queue Pass</span>
              </button>

              <button
                onClick={() => onConsultTypeChange('house-call')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition ${
                  selectedConsultType === 'house-call'
                    ? 'bg-red-600 dark:bg-amber-500 text-white dark:text-black font-semibold shadow-xs'
                    : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-amber-300 border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Doctor to Doorstep</span>
              </button>

              <button
                onClick={() => onConsultTypeChange('teleconsult')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition ${
                  selectedConsultType === 'teleconsult'
                    ? 'bg-red-600 dark:bg-amber-500 text-white dark:text-black font-semibold shadow-xs'
                    : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-amber-300 border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Teleconsult</span>
              </button>
            </div>

            <div className="text-[11px] text-zinc-600 dark:text-zinc-400 shrink-0 hidden sm:flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-amber-400 animate-pulse"></span>
              <span>18 Clinics On-Duty within 3 km</span>
            </div>
          </div>
        )}

        {/* Doctor Practice Sub-bar (Desktop only) */}
        {isDoctor && (
          <div className="hidden sm:flex items-center justify-between py-2 border-t border-zinc-100 dark:border-zinc-900 overflow-x-auto no-scrollbar gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-sm bg-red-50 dark:bg-amber-500/10 text-red-700 dark:text-amber-300 border border-red-200 dark:border-amber-500/30 font-semibold">
                Physician Edition
              </span>
              <span className="text-zinc-600 dark:text-zinc-400 text-xs hidden sm:inline">
                Practice: <span className="font-semibold text-zinc-900 dark:text-zinc-200">{currentUser?.specialty || currentDoctor?.specialty || 'Gastroenterology'}</span>
              </span>
              <span className="text-red-600 dark:text-amber-400 text-xs flex items-center gap-1 font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-amber-400 animate-pulse"></span>
                <span>Accepting Patient Bookings</span>
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onOpenNewReferralModal && (
                <button
                  onClick={onOpenNewReferralModal}
                  className="px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black font-semibold text-xs flex items-center gap-1 transition shadow-xs"
                >
                  <Plus className="w-3 h-3" />
                  <span>Refer a Patient</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

