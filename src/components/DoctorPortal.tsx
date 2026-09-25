import React, { useState } from 'react';
import { 
  DollarSign, 
  Clock, 
  Calendar, 
  Check, 
  Users, 
  Share2, 
  Plus, 
  Building2, 
  Home, 
  Video, 
  ChevronRight,
  Save
} from 'lucide-react';
import { Doctor, Appointment, UserProfile } from '../types';

interface DoctorPortalProps {
  doctors: Doctor[];
  selectedDoctorId: string;
  onSelectDoctorId: (id: string) => void;
  onUpdateDoctorPricing: (
    doctorId: string,
    inClinic: number,
    homeVisit: number,
    teleconsult: number,
    isOpen: boolean
  ) => void;
  appointments: Appointment[];
  onUpdateAppointmentStatus: (appointmentId: string, newStatus: Appointment['status']) => void;
  onOpenNewReferralModal: (prefillPatient?: { name: string; symptoms: string }) => void;
  onSwitchToReferralHub: () => void;
  currentUser?: UserProfile | null;
}

export const DoctorPortal: React.FC<DoctorPortalProps> = ({
  doctors,
  selectedDoctorId,
  onSelectDoctorId,
  onUpdateDoctorPricing,
  appointments,
  onUpdateAppointmentStatus,
  onOpenNewReferralModal,
  onSwitchToReferralHub,
}) => {
  const currentDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  // Pricing edit state
  const [inClinicFee, setInClinicFee] = useState<number>(currentDoctor.consultationFee);
  const [homeVisitFee, setHomeVisitFee] = useState<number>(currentDoctor.homeVisitFee);
  const [teleconsultFee, setTeleconsultFee] = useState<number>(currentDoctor.teleconsultFee);
  const [isOpenNow, setIsOpenNow] = useState<boolean>(currentDoctor.isOpenNow);
  const [saveToast, setSaveToast] = useState(false);
  const [mobileTab, setMobileTab] = useState<'queue' | 'pricing'>('queue');

  // Sync state if selected doctor changes
  React.useEffect(() => {
    setInClinicFee(currentDoctor.consultationFee);
    setHomeVisitFee(currentDoctor.homeVisitFee);
    setTeleconsultFee(currentDoctor.teleconsultFee);
    setIsOpenNow(currentDoctor.isOpenNow);
  }, [currentDoctor.id]);

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDoctorPricing(
      currentDoctor.id,
      Number(inClinicFee),
      Number(homeVisitFee),
      Number(teleconsultFee),
      isOpenNow
    );
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  // Filter appointments for this doctor
  const doctorAppointments = appointments.filter((a) => a.doctorId === currentDoctor.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 sm:pb-6 space-y-6">
      {/* Top Banner & Doctor Selector */}
      <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl p-5 sm:p-6 border border-red-200 dark:border-amber-500/30 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src={currentDoctor.avatar}
              alt={currentDoctor.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-red-200 dark:border-amber-500/40 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-50 dark:bg-amber-500/10 text-red-700 dark:text-amber-300 border border-red-200 dark:border-amber-500/30 font-semibold">
                  Provider Workspace
                </span>
                <span className={`text-[10px] font-mono font-medium ${isOpenNow ? 'text-red-600 dark:text-amber-400' : 'text-zinc-400'}`}>
                  {isOpenNow ? '● Live & Accepting Bookings' : '● Off Duty'}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold">{currentDoctor.name}</h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                {currentDoctor.title} · {currentDoctor.clinicName}
              </p>
            </div>
          </div>

          {/* Doctor Profile Switcher */}
          <div className="bg-zinc-50 dark:bg-black/60 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 w-full md:w-auto">
            <label className="block text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-1">
              Active Provider Profile:
            </label>
            <select
              value={currentDoctor.id}
              onChange={(e) => onSelectDoctorId(e.target.value)}
              className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs font-medium px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 focus:outline-hidden w-full font-mono focus:border-red-600 dark:focus:border-amber-400"
            >
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.specialty})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Tab Switcher: Instant Queue vs Pricing */}
      <div className="lg:hidden flex items-center p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
        <button
          onClick={() => setMobileTab('queue')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'queue'
              ? 'bg-white dark:bg-zinc-950 text-red-600 dark:text-amber-400 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Patient Queue ({doctorAppointments.length})</span>
        </button>
        <button
          onClick={() => setMobileTab('pricing')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'pricing'
              ? 'bg-white dark:bg-zinc-950 text-red-600 dark:text-amber-400 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Fees & Settings</span>
        </button>
      </div>

      {/* Main Grid: Left Pricing & Settings, Right Queue & Peer Referral */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Instant Price Adjustment & Practice Tools (5 cols) */}
        <div className={`lg:col-span-5 space-y-6 ${mobileTab === 'pricing' ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-red-50 dark:bg-amber-500/10 text-red-600 dark:text-amber-400 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-zinc-950 dark:text-white">Fee Management</h2>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Live prices reflect instantly on Dawlah Care map</p>
                </div>
              </div>

              {saveToast && (
                <span className="text-[11px] font-mono text-red-700 dark:text-amber-300 bg-red-50 dark:bg-amber-500/20 px-2 py-0.5 rounded-sm border border-red-200 dark:border-amber-500/40">
                  Updated Live
                </span>
              )}
            </div>

            <form onSubmit={handleSavePricing} className="space-y-3.5">
              {/* In-Clinic Fee */}
              <div>
                <label className="block text-xs text-zinc-700 dark:text-zinc-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                    Standard Clinic Consultation
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">Base ($)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-zinc-400 font-mono text-xs">$</span>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    step="5"
                    value={inClinicFee}
                    onChange={(e) => setInClinicFee(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-semibold text-zinc-950 dark:text-white focus:outline-hidden focus:border-zinc-950 dark:focus:border-white"
                  />
                </div>
              </div>

              {/* Doorstep Visit Fee */}
              <div>
                <label className="block text-xs text-zinc-700 dark:text-zinc-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-zinc-500" />
                    Doorstep Urgent House Call
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">Dispatch ($)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-zinc-400 font-mono text-xs">$</span>
                  <input
                    type="number"
                    min="20"
                    max="600"
                    step="5"
                    value={homeVisitFee}
                    onChange={(e) => setHomeVisitFee(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-semibold text-zinc-950 dark:text-white focus:outline-hidden focus:border-zinc-950 dark:focus:border-white"
                  />
                </div>
              </div>

              {/* Teleconsult Fee */}
              <div>
                <label className="block text-xs text-zinc-700 dark:text-zinc-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-zinc-500" />
                    Video Teleconsult
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">Virtual ($)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-zinc-400 font-mono text-xs">$</span>
                  <input
                    type="number"
                    min="15"
                    max="300"
                    step="5"
                    value={teleconsultFee}
                    onChange={(e) => setTeleconsultFee(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-semibold text-zinc-950 dark:text-white focus:outline-hidden focus:border-zinc-950 dark:focus:border-white"
                  />
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="pt-1">
                <label className="flex items-center justify-between p-2.5 rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 cursor-pointer">
                  <span className="text-xs text-zinc-800 dark:text-zinc-200 font-normal">
                    Accepting New Bookings & Queue Passes
                  </span>
                  <input
                    type="checkbox"
                    checked={isOpenNow}
                    onChange={(e) => setIsOpenNow(e.target.checked)}
                    className="w-4 h-4 accent-zinc-900 rounded"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-md bg-red-600 hover:bg-red-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Live Pricing & Status</span>
              </button>
            </form>
          </div>

          {/* Quick Doctor Referral Action Box */}
          <div className="bg-red-50/50 dark:bg-zinc-900 rounded-xl border border-red-200/80 dark:border-zinc-800 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-md bg-red-600 dark:bg-amber-500 text-white dark:text-black flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-zinc-950 dark:text-white">
                Uncertain Case? Refer to Colleague
              </h3>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              If a patient's symptoms are ambiguous, not responding to medication, or require a sub-specialist (e.g. Endoscopy, Surgery), broadcast a referral to verified physicians.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => onOpenNewReferralModal()}
                className="w-full py-2 px-3 rounded-md bg-red-600 hover:bg-red-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Broadcast Referral Case</span>
              </button>

              <button
                type="button"
                onClick={onSwitchToReferralHub}
                className="w-full py-2 px-3 rounded-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-red-300 dark:hover:border-amber-500/40 text-xs font-medium transition flex items-center justify-center gap-1"
              >
                <span>Referral Hub</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Appointment Queue & Bookings (7 cols) */}
        <div className={`lg:col-span-7 space-y-6 ${mobileTab === 'queue' ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-red-50 dark:bg-amber-500/10 text-red-600 dark:text-amber-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-zinc-950 dark:text-white">
                    Patient Queue ({doctorAppointments.length})
                  </h2>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Incoming bookings & patient symptom records</p>
                </div>
              </div>

              <span className="text-[11px] font-mono px-2 py-0.5 rounded-sm bg-red-50 dark:bg-amber-500/10 text-red-700 dark:text-amber-300 border border-red-200 dark:border-amber-500/30 font-semibold">
                Today
              </span>
            </div>

            {doctorAppointments.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 dark:text-zinc-500">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-30 text-zinc-400" />
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">No appointments scheduled today</p>
                <p className="text-[11px] mt-1">Book an appointment from Find Care to test the live queue.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {doctorAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-sm bg-red-100 dark:bg-amber-500/20 text-red-800 dark:text-amber-300 border border-red-200 dark:border-amber-500/30">
                          {apt.queueCode}
                        </span>
                        <h3 className="text-xs font-semibold text-zinc-950 dark:text-white">
                          {apt.patientName} ({apt.patientAge}y)
                        </h3>
                      </div>
                      <span className="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300">
                        {apt.slotTime}
                      </span>
                    </div>

                    <div className="text-xs text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 p-2.5 rounded-md border border-zinc-200 dark:border-zinc-800 mb-2.5">
                      <div className="text-[10px] font-mono text-zinc-400 uppercase mb-0.5">
                        Symptoms:
                      </div>
                      <p className="italic">"{apt.patientSymptoms}"</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                      <div className="text-[11px] text-zinc-500 font-mono">
                        Format: {apt.consultType.replace('-', ' ')} · Fee: <strong className="text-zinc-900 dark:text-white">${apt.totalAmount}</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* 1-Click Refer Button */}
                        <button
                          onClick={() => onOpenNewReferralModal({ name: apt.patientName, symptoms: apt.patientSymptoms })}
                          className="text-xs font-medium px-2 py-1 rounded-md bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:text-red-600 dark:hover:text-amber-300 transition flex items-center gap-1 border border-zinc-200 dark:border-zinc-700"
                          title="Refer to specialist peer"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>Refer Case</span>
                        </button>

                        {apt.status !== 'completed' ? (
                          <button
                            onClick={() => onUpdateAppointmentStatus(apt.id, 'completed')}
                            className="text-xs font-semibold px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black transition flex items-center gap-1 shadow-xs"
                          >
                            <Check className="w-3 h-3" />
                            <span>Mark Completed</span>
                          </button>
                        ) : (
                          <span className="text-xs font-mono text-zinc-500">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
