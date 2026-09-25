import React, { useState, useMemo, useEffect } from 'react';
import { 
  AppViewMode, 
  ConsultationType, 
  Doctor, 
  Appointment, 
  ReferralCase, 
  TriageResult,
  ReferralReply,
  ThemeMode,
  UserProfile
} from './types';
import { 
  SPECIALTY_CATEGORIES, 
  INITIAL_DOCTORS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_REFERRAL_CASES 
} from './data/mockData';
import { triageSymptoms } from './services/api';
import { Header } from './components/Header';
import { BannerHero } from './components/BannerHero';
import { SymptomTriageBar } from './components/SymptomTriageBar';
import { SpecialtyGrid } from './components/SpecialtyGrid';
import { DoctorCard } from './components/DoctorCard';
import { DoctorDetailModal } from './components/DoctorDetailModal';
import { BookingModal } from './components/BookingModal';
import { ActiveAppointmentsTray } from './components/ActiveAppointmentsTray';
import { DoctorPortal } from './components/DoctorPortal';
import { DoctorReferralHub } from './components/DoctorReferralHub';
import { NewReferralModal } from './components/NewReferralModal';
import { AuthOnboardingScreen } from './components/AuthOnboardingScreen';
import { MobileBottomNav } from './components/MobileBottomNav';
import { testFirestoreConnection, signOutUser } from './lib/firebase';
import { 
  ArrowUpDown, 
  Filter, 
  Clock, 
  Sparkles, 
  Search, 
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Building2,
  Home,
  Video,
  X,
  Layers
} from 'lucide-react';

export default function App() {
  // Theme state with HTML dark class sync
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('dawlah_theme') as ThemeMode;
    if (saved === 'dark' || saved === 'light') return saved;
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dawlah_theme', theme);
  }, [theme]);

  // Test connection to Firestore on boot as required by skill
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // User Auth & Role state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('dawlah_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  // App view state
  const [currentView, setCurrentView] = useState<AppViewMode>(() => {
    if (currentUser?.role === 'doctor') return 'doctor-portal';
    return 'patient';
  });
  const [selectedConsultType, setSelectedConsultType] = useState<ConsultationType>('in-clinic');
  const [userLocation, setUserLocation] = useState('42 Orchard Boulevard, Central');

  // Enforce role-based view separation
  useEffect(() => {
    if (currentUser?.role === 'doctor') {
      if (currentView === 'patient') {
        setCurrentView('doctor-portal');
      }
    } else if (currentUser?.role === 'patient') {
      if (currentView !== 'patient') {
        setCurrentView('patient');
      }
    }
  }, [currentUser?.role, currentView]);

  const handleViewChange = (newView: AppViewMode) => {
    if (currentUser?.role === 'doctor') {
      // Doctor can only toggle between doctor-portal and inter-doctor-hub
      if (newView === 'doctor-portal' || newView === 'inter-doctor-hub') {
        setCurrentView(newView);
      }
    } else {
      // Patient can only view patient (Find Care)
      setCurrentView('patient');
    }
  };

  // Marketplace & Doctor data
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [referralCases, setReferralCases] = useState<ReferralCase[]>(INITIAL_REFERRAL_CASES);

  // Active Doctor Workspace context
  const [selectedPracticingDoctorId, setSelectedPracticingDoctorId] = useState<string>(() => {
    return currentUser?.doctorId || 'doc-1';
  });

  // Filtering & Sorting
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price' | 'wait'>('distance');
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);
  const [mobilePatientTab, setMobilePatientTab] = useState<'clinics' | 'triage'>('clinics');
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');

  // Triage state
  const [activeTriage, setActiveTriage] = useState<TriageResult | null>(null);
  const [isTriageLoading, setIsTriageLoading] = useState(false);

  // Modals & Panels
  const [detailModalDoctor, setDetailModalDoctor] = useState<Doctor | null>(null);
  const [bookingTarget, setBookingTarget] = useState<{
    doctor: Doctor;
    consultType: ConsultationType;
    slot: string;
  } | null>(null);
  const [isAppointmentsTrayOpen, setIsAppointmentsTrayOpen] = useState(false);
  const [isNewReferralModalOpen, setIsNewReferralModalOpen] = useState(false);
  const [referralPrefill, setReferralPrefill] = useState<{ name: string; symptoms: string } | undefined>(undefined);

  // Auth completion handler
  const handleAuthComplete = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('dawlah_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    if (user.role === 'doctor') {
      setCurrentView('doctor-portal');
      if (user.doctorId) {
        setSelectedPracticingDoctorId(user.doctorId);
      }
    } else {
      setCurrentView('patient');
    }
  };

  const handleSignOutOrSwitch = async () => {
    try {
      await signOutUser();
    } catch {
      // ignore
    }
    setCurrentUser(null);
    localStorage.removeItem('dawlah_user');
  };

  // Triage search handler
  const handleTriageSearch = async (symptomQuery: string) => {
    setIsTriageLoading(true);
    try {
      const result = await triageSymptoms(symptomQuery, doctors);
      setActiveTriage(result);
      if (result.matchedSpecialtySlug) {
        setSelectedCategorySlug(result.matchedSpecialtySlug);
      }
    } finally {
      setIsTriageLoading(false);
    }
  };

  const handleClearTriage = () => {
    setActiveTriage(null);
    setSelectedCategorySlug(null);
  };

  // Doctor price & status update (From Doctor Portal)
  const handleUpdateDoctorPricing = (
    doctorId: string,
    inClinic: number,
    homeVisit: number,
    teleconsult: number,
    isOpen: boolean
  ) => {
    setDoctors((prev) =>
      prev.map((d) =>
        d.id === doctorId
          ? {
              ...d,
              consultationFee: inClinic,
              homeVisitFee: homeVisit,
              teleconsultFee: teleconsult,
              isOpenNow: isOpen,
            }
          : d
      )
    );
  };

  // Appointment operations
  const handleConfirmBooking = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
  };

  const handleUpdateAppointmentStatus = (id: string, newStatus: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
    );
  };

  // Referral operations
  const handleCreateReferralCase = (newCase: ReferralCase) => {
    setReferralCases((prev) => [newCase, ...prev]);
  };

  const handleAddReplyToCase = (caseId: string, reply: ReferralReply) => {
    setReferralCases((prev) =>
      prev.map((c) =>
        c.id === caseId ? { ...c, replies: [...c.replies, reply], status: 'collaborating' } : c
      )
    );
  };

  const handleAcceptReferralTransfer = (caseId: string, acceptingDoctorName: string) => {
    setReferralCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? { ...c, status: 'referred', referredToDoctorName: acceptingDoctorName }
          : c
      )
    );
  };

  const handleOpenNewReferralModal = (prefill?: { name: string; symptoms: string }) => {
    setReferralPrefill(prefill);
    setIsNewReferralModalOpen(true);
  };

  // Filter and sort doctors for the marketplace
  const displayedDoctors = useMemo(() => {
    let list = [...doctors];

    // Filter by Mobile Search Query
    if (mobileSearchQuery.trim()) {
      const q = mobileSearchQuery.toLowerCase().trim();
      list = list.filter((d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.clinicName.toLowerCase().includes(q) ||
        d.address.toLowerCase().includes(q)
      );
    }

    // Filter by Specialty Category
    if (selectedCategorySlug) {
      list = list.filter((d) => d.specialtySlug.toLowerCase() === selectedCategorySlug.toLowerCase());
    }

    // Filter by consultation mode availability
    if (selectedConsultType === 'house-call') {
      list = list.filter((d) => d.acceptsHouseCalls);
    } else if (selectedConsultType === 'teleconsult') {
      list = list.filter((d) => d.acceptsTeleconsult);
    }

    // Filter by Open Now
    if (onlyOpenNow) {
      list = list.filter((d) => d.isOpenNow);
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'wait') return a.waitTimeMin - b.waitTimeMin;
      if (sortBy === 'price') {
        const feeA =
          selectedConsultType === 'house-call'
            ? a.homeVisitFee
            : selectedConsultType === 'teleconsult'
            ? a.teleconsultFee
            : a.consultationFee;
        const feeB =
          selectedConsultType === 'house-call'
            ? b.homeVisitFee
            : selectedConsultType === 'teleconsult'
            ? b.teleconsultFee
            : b.consultationFee;
        return feeA - feeB;
      }
      return 0;
    });

    return list;
  }, [doctors, selectedCategorySlug, selectedConsultType, onlyOpenNow, sortBy, mobileSearchQuery]);

  const currentDoctor = doctors.find((d) => d.id === selectedPracticingDoctorId) || doctors[0];
  const activeAppointmentsCount = appointments.filter((a) => a.status !== 'cancelled').length;
  const doctorAppointmentsCount = appointments.filter((a) => a.doctorId === currentDoctor.id && a.status !== 'cancelled').length;
  const pendingReferralsCount = referralCases.filter((c) => c.status === 'open').length;

  const displayedAppointments = useMemo(() => {
    if (currentUser?.role === 'doctor') {
      return appointments.filter((a) => a.doctorId === currentDoctor.id);
    }
    return appointments;
  }, [appointments, currentUser?.role, currentDoctor.id]);

  // Gatekeeper: If user hasn't selected their role and signed up, show Onboarding Screen
  if (!currentUser) {
    return (
      <AuthOnboardingScreen
        onCompleteSignUp={handleAuthComplete}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors duration-200">
      {/* Top Navbar */}
      <Header
        currentView={currentView}
        onViewChange={handleViewChange}
        selectedConsultType={selectedConsultType}
        onConsultTypeChange={setSelectedConsultType}
        userLocation={userLocation}
        onLocationChange={setUserLocation}
        activeAppointmentsCount={currentUser.role === 'doctor' ? doctorAppointmentsCount : activeAppointmentsCount}
        onOpenAppointments={() => setIsAppointmentsTrayOpen(true)}
        pendingReferralsCount={pendingReferralsCount}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        currentUser={currentUser}
        onSwitchRoleOrSignOut={handleSignOutOrSwitch}
        currentDoctor={currentDoctor}
        onOpenNewReferralModal={() => handleOpenNewReferralModal()}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-24 sm:pb-6">
        {currentView === 'patient' && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
            {/* ======================================================== */}
            {/* MOBILE-ONLY EXPERIENCE (< sm screens: zero clutter, no scrolling) */}
            {/* ======================================================== */}
            <div className="sm:hidden space-y-3">
              {/* TABS / SWITCHER VIEW */}
              {mobilePatientTab === 'clinics' ? (
                <>
                  {/* Compact Mobile Search & AI Triage Bar */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={mobileSearchQuery}
                        onChange={(e) => setMobileSearchQuery(e.target.value)}
                        placeholder="Search doctor, clinic, specialty..."
                        className="w-full pl-9 pr-8 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-red-600 dark:focus:border-amber-400"
                      />
                      {mobileSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setMobileSearchQuery('')}
                          className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* AI Triage Quick Trigger */}
                    <button
                      type="button"
                      onClick={() => setMobilePatientTab('triage')}
                      className="px-3 py-2 rounded-xl bg-red-50 dark:bg-amber-500/10 text-red-700 dark:text-amber-300 border border-red-200 dark:border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 shrink-0 hover:bg-red-100 transition cursor-pointer"
                      title="Symptom Checker"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-red-600 dark:text-amber-400" />
                      <span>AI Triage</span>
                    </button>
                  </div>

                  {/* 1-Touch Care Mode Selector Strip */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setSelectedConsultType('in-clinic')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg transition-all text-xs font-semibold cursor-pointer ${
                        selectedConsultType === 'in-clinic'
                          ? 'bg-red-600 dark:bg-amber-500 text-white dark:text-black shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>In-Clinic</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedConsultType('house-call')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg transition-all text-xs font-semibold cursor-pointer ${
                        selectedConsultType === 'house-call'
                          ? 'bg-red-600 dark:bg-amber-500 text-white dark:text-black shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      <Home className="w-3.5 h-3.5" />
                      <span>Doorstep</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedConsultType('teleconsult')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg transition-all text-xs font-semibold cursor-pointer ${
                        selectedConsultType === 'teleconsult'
                          ? 'bg-red-600 dark:bg-amber-500 text-white dark:text-black shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Video</span>
                    </button>
                  </div>

                  {/* Horizontal Scroll Specialty Pills & Quick Filters */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
                    {/* All button */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategorySlug(null);
                        setActiveTriage(null);
                      }}
                      className={`px-3 py-1.5 rounded-lg border font-mono text-xs shrink-0 transition-all cursor-pointer ${
                        selectedCategorySlug === null
                          ? 'bg-red-600 dark:bg-amber-500 text-white dark:text-black border-red-600 dark:border-amber-400 font-bold shadow-xs'
                          : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      All ({doctors.length})
                    </button>

                    {/* Specialty chips */}
                    {SPECIALTY_CATEGORIES.map((cat) => {
                      const isSelected = selectedCategorySlug === cat.slug;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategorySlug(isSelected ? null : cat.slug)}
                          className={`px-3 py-1.5 rounded-lg border text-xs shrink-0 transition-all cursor-pointer whitespace-nowrap ${
                            isSelected
                              ? 'bg-red-600 dark:bg-amber-500 text-white dark:text-black border-red-600 dark:border-amber-400 font-bold shadow-xs'
                              : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'
                          }`}
                        >
                          {cat.name}
                        </button>
                      );
                    })}

                    {/* Open Now pill */}
                    <button
                      type="button"
                      onClick={() => setOnlyOpenNow(!onlyOpenNow)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-mono shrink-0 transition-all cursor-pointer ${
                        onlyOpenNow
                          ? 'bg-red-600 dark:bg-amber-500 text-white dark:text-black font-bold border-red-600 dark:border-amber-400'
                          : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      ● Open Now
                    </button>

                    {/* Sort selector */}
                    <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-xs shrink-0">
                      <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-transparent font-medium text-zinc-900 dark:text-zinc-100 focus:outline-hidden text-xs cursor-pointer"
                      >
                        <option value="distance" className="dark:bg-zinc-900">Nearest</option>
                        <option value="rating" className="dark:bg-zinc-900">Top Rated</option>
                        <option value="price" className="dark:bg-zinc-900">Lowest Fee</option>
                        <option value="wait" className="dark:bg-zinc-900">Shortest Wait</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Triage Banner Alert on Mobile (if triage filter is active) */}
                  {activeTriage && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-amber-500/10 border border-red-200 dark:border-amber-500/30 flex items-center justify-between gap-2">
                      <div className="text-xs">
                        <div className="font-semibold text-red-900 dark:text-amber-200">
                          Matched: {activeTriage.matchedSpecialty} ({activeTriage.urgencyLabel})
                        </div>
                        <div className="text-[11px] text-zinc-600 dark:text-zinc-400 truncate max-w-[220px]">
                          "{activeTriage.symptomQuery}"
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearTriage}
                        className="text-xs font-semibold text-red-700 dark:text-amber-300 px-2 py-1 rounded-md bg-white dark:bg-zinc-900 border border-red-200 dark:border-amber-500/30"
                      >
                        Clear
                      </button>
                    </div>
                  )}

                  {/* Mobile Doctor Cards: Direct Immediate Access without Scrolling */}
                  {displayedDoctors.length === 0 ? (
                    <div className="py-12 text-center bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                      <Search className="w-8 h-8 mx-auto text-zinc-400 mb-2 opacity-50" />
                      <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">No clinics match this filter</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Try resetting the specialty or consultation mode filter.</p>
                      <button
                        onClick={() => {
                          setSelectedCategorySlug(null);
                          setOnlyOpenNow(false);
                          setActiveTriage(null);
                          setMobileSearchQuery('');
                        }}
                        className="mt-3 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black text-xs font-semibold shadow-xs cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 px-1 font-mono">
                        <span>{displayedDoctors.length} verified clinics nearby</span>
                        <span>Live wait times</span>
                      </div>
                      {displayedDoctors.map((doc) => (
                        <DoctorCard
                          key={doc.id}
                          doctor={doc}
                          selectedConsultType={selectedConsultType}
                          onSelectDoctor={(d) => setDetailModalDoctor(d)}
                          onBookNow={(d) =>
                            setBookingTarget({
                              doctor: d,
                              consultType: selectedConsultType,
                              slot: d.availableSlotsToday[0] || '10:30 AM',
                            })
                          }
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* DEDICATED MOBILE AI TRIAGE VIEW (Zero clutter, full focus) */
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setMobilePatientTab('clinics')}
                      className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-amber-400"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Clinics</span>
                    </button>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-50 dark:bg-amber-500/10 text-red-700 dark:text-amber-300 font-semibold border border-red-200 dark:border-amber-500/30">
                      Clinical Urgency
                    </span>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                      AI Clinical Symptom Triage
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Describe your symptoms in everyday words for urgency analysis and clinic matching.
                    </p>
                  </div>

                  {/* Full Triage Component */}
                  <SymptomTriageBar
                    onSearch={async (query) => {
                      await handleTriageSearch(query);
                    }}
                    isLoading={isTriageLoading}
                    activeTriage={activeTriage}
                    onClearTriage={handleClearTriage}
                  />

                  {/* High-visibility Action to Return to Matched Clinics */}
                  {activeTriage && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMobilePatientTab('clinics');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                      >
                        <span>Show {activeTriage.recommendedDoctors.length} Matched {activeTriage.matchedSpecialty} Clinics</span>
                        <ArrowUpDown className="w-3.5 h-3.5 rotate-90" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ======================================================== */}
            {/* DESKTOP EXPERIENCE (>= sm screens: rich, expansive) */}
            {/* ======================================================== */}
            <div className="hidden sm:block">
              {/* On-Demand Care Hero Banner */}
              <BannerHero onQuickSymptomClick={handleTriageSearch} />

              {/* Smart Symptom Triage Bar ("I'm having a stomach ache" search) */}
              <SymptomTriageBar
                onSearch={handleTriageSearch}
                isLoading={isTriageLoading}
                activeTriage={activeTriage}
                onClearTriage={handleClearTriage}
              />

              {/* Specialties Icon Grid */}
              <SpecialtyGrid
                categories={SPECIALTY_CATEGORIES}
                selectedCategorySlug={selectedCategorySlug}
                onSelectCategory={(slug) => {
                  setSelectedCategorySlug(slug);
                  if (activeTriage && activeTriage.matchedSpecialtySlug !== slug) {
                    setActiveTriage(null);
                  }
                }}
              />

              {/* Filters & Sorting Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                    {selectedCategorySlug
                      ? `${SPECIALTY_CATEGORIES.find((c) => c.slug === selectedCategorySlug)?.name || 'Specialist'} Clinics`
                      : 'All Clinics & Doctors Available Nearby'}
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                    {displayedDoctors.length}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Filter toggle */}
                  <button
                    onClick={() => setOnlyOpenNow(!onlyOpenNow)}
                    className={`px-3 py-1 rounded-md text-xs font-mono transition cursor-pointer ${
                      onlyOpenNow
                        ? 'bg-red-600 dark:bg-amber-500 text-white dark:text-black font-semibold shadow-xs'
                        : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-red-300 dark:hover:border-amber-500/40'
                    }`}
                  >
                    ● Open Now
                  </button>

                  {/* Sort selector */}
                  <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-2.5 py-1 text-xs">
                    <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-zinc-400 font-mono">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent font-medium text-zinc-900 dark:text-zinc-100 focus:outline-hidden cursor-pointer text-xs"
                    >
                      <option value="distance" className="dark:bg-zinc-900">Nearest Distance</option>
                      <option value="rating" className="dark:bg-zinc-900">Highest Rated</option>
                      <option value="price" className="dark:bg-zinc-900">Lowest Fee</option>
                      <option value="wait" className="dark:bg-zinc-900">Shortest Wait</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Doctor Cards Grid */}
              {displayedDoctors.length === 0 ? (
                <div className="py-16 text-center bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8">
                  <Search className="w-10 h-10 mx-auto text-zinc-400 mb-2 opacity-50" />
                  <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">No clinics match this filter</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Try resetting the specialty or consultation mode filter.</p>
                  <button
                    onClick={() => {
                      setSelectedCategorySlug(null);
                      setOnlyOpenNow(false);
                      setActiveTriage(null);
                      setMobileSearchQuery('');
                    }}
                    className="mt-3 px-3.5 py-1.5 rounded-md bg-red-600 hover:bg-red-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {displayedDoctors.map((doc) => (
                    <DoctorCard
                      key={doc.id}
                      doctor={doc}
                      selectedConsultType={selectedConsultType}
                      onSelectDoctor={(d) => setDetailModalDoctor(d)}
                      onBookNow={(d) =>
                        setBookingTarget({
                          doctor: d,
                          consultType: selectedConsultType,
                          slot: d.availableSlotsToday[0] || '10:30 AM',
                        })
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Doctor Workspace View */}
        {currentView === 'doctor-portal' && (
          <DoctorPortal
            doctors={doctors}
            selectedDoctorId={selectedPracticingDoctorId}
            onSelectDoctorId={setSelectedPracticingDoctorId}
            onUpdateDoctorPricing={handleUpdateDoctorPricing}
            appointments={appointments}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onOpenNewReferralModal={handleOpenNewReferralModal}
            onSwitchToReferralHub={() => setCurrentView('inter-doctor-hub')}
            currentUser={currentUser}
          />
        )}

        {/* Inter-Doctor Peer Referral Hub View */}
        {currentView === 'inter-doctor-hub' && (
          <DoctorReferralHub
            cases={referralCases}
            doctors={doctors}
            currentDoctor={currentDoctor}
            onOpenNewCaseModal={() => handleOpenNewReferralModal()}
            onAddReplyToCase={handleAddReplyToCase}
            onAcceptReferralTransfer={handleAcceptReferralTransfer}
            onBackToDoctorPortal={() => setCurrentView('doctor-portal')}
          />
        )}
      </main>

      {/* Footer (Desktop only) */}
      <footer className="hidden sm:block bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 mt-16 py-6 font-mono text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-950 dark:text-white">
              Dawlah Care
            </span>
            <span>· On-Demand Healthcare & Physician Network</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Transparent Fees</span>
            <span>·</span>
            <span>Instant Triage</span>
            <span>·</span>
            <span>Physician Referrals</span>
          </div>
        </div>
      </footer>

      {/* Doctor Detail Modal */}
      {detailModalDoctor && (
        <DoctorDetailModal
          doctor={detailModalDoctor}
          initialConsultType={selectedConsultType}
          onClose={() => setDetailModalDoctor(null)}
          onBookAppointment={(doc, cType, slot) => {
            setDetailModalDoctor(null);
            setBookingTarget({
              doctor: doc,
              consultType: cType,
              slot,
            });
          }}
        />
      )}

      {/* Booking Modal */}
      {bookingTarget && (
        <BookingModal
          doctor={bookingTarget.doctor}
          initialType={bookingTarget.consultType}
          initialSlot={bookingTarget.slot}
          defaultSymptoms={activeTriage ? activeTriage.symptomQuery : ''}
          currentUser={currentUser}
          onClose={() => setBookingTarget(null)}
          onConfirmBooking={(apt) => {
            handleConfirmBooking(apt);
          }}
        />
      )}

      {/* Active Appointments Tray */}
      <ActiveAppointmentsTray
        isOpen={isAppointmentsTrayOpen}
        onClose={() => setIsAppointmentsTrayOpen(false)}
        appointments={displayedAppointments}
        onCancelAppointment={handleCancelAppointment}
      />

      {/* New Referral Case Modal */}
      <NewReferralModal
        isOpen={isNewReferralModalOpen}
        onClose={() => {
          setIsNewReferralModalOpen(false);
          setReferralPrefill(undefined);
        }}
        currentDoctor={currentDoctor}
        prefill={referralPrefill}
        onCreateCase={handleCreateReferralCase}
      />

      {/* Mobile Bottom Navigation Bar (Always reachable, zero scrolling needed) */}
      <MobileBottomNav
        currentView={currentView}
        onViewChange={handleViewChange}
        mobilePatientTab={mobilePatientTab}
        onMobilePatientTabChange={setMobilePatientTab}
        currentUser={currentUser}
        onSwitchRoleOrSignOut={handleSignOutOrSwitch}
        selectedConsultType={selectedConsultType}
        onConsultTypeChange={setSelectedConsultType}
        activePassesCount={currentUser?.role === 'doctor' ? doctorAppointmentsCount : activeAppointmentsCount}
        onOpenAppointments={() => setIsAppointmentsTrayOpen(true)}
        pendingReferralsCount={pendingReferralsCount}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenNewReferralModal={() => handleOpenNewReferralModal()}
      />
    </div>
  );
}
