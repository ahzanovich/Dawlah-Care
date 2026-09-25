import React, { useState } from 'react';
import { 
  X, 
  Star, 
  GraduationCap, 
  Languages, 
  ArrowRight,
  Building2,
  Home,
  Video
} from 'lucide-react';
import { Doctor, ConsultationType } from '../types';

interface DoctorDetailModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBookAppointment: (doctor: Doctor, selectedType: ConsultationType, selectedSlot: string) => void;
  initialConsultType: ConsultationType;
}

export const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({
  doctor,
  onClose,
  onBookAppointment,
  initialConsultType,
}) => {
  if (!doctor) return null;

  const [consultType, setConsultType] = useState<ConsultationType>(initialConsultType);
  const [selectedSlot, setSelectedSlot] = useState<string>(doctor.availableSlotsToday[0] || '10:30 AM');

  const getFee = () => {
    if (consultType === 'house-call') return doctor.homeVisitFee;
    if (consultType === 'teleconsult') return doctor.teleconsultFee;
    return doctor.consultationFee;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-t-2xl sm:rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        {/* Top banner */}
        <div className="relative h-44 sm:h-52 bg-zinc-900 overflow-hidden shrink-0">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>

          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
            <div>
              <div className="flex items-center gap-2 mb-1.5 font-mono text-xs">
                <span className="text-[10px] uppercase font-mono font-semibold tracking-wider px-2 py-0.5 rounded-md bg-white/95 text-red-700 backdrop-blur-md shadow-xs border border-red-100">
                  {doctor.specialty}
                </span>
                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded-md text-[11px]">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="font-semibold">{doctor.rating}</span>
                  <span className="text-zinc-300">({doctor.reviewCount})</span>
                </div>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold">{doctor.name}</h2>
              <p className="text-xs text-zinc-300 font-mono">{doctor.clinicName} · {doctor.distanceKm} km</p>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[10px] uppercase font-mono text-zinc-300">Fee</div>
              <div className="text-2xl font-mono font-bold text-white">${getFee()}</div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Care Mode Selector */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Select Care Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setConsultType('in-clinic')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  consultType === 'in-clinic'
                    ? 'border-red-600 dark:border-amber-400 bg-red-50/70 dark:bg-amber-500/15'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-red-300 dark:hover:border-amber-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Building2 className={`w-3.5 h-3.5 ${consultType === 'in-clinic' ? 'text-red-600 dark:text-amber-400' : 'text-zinc-500'}`} />
                  <span className={`text-xs font-mono font-semibold ${consultType === 'in-clinic' ? 'text-red-700 dark:text-amber-300' : 'text-zinc-950 dark:text-white'}`}>${doctor.consultationFee}</span>
                </div>
                <div className="text-xs font-semibold text-zinc-950 dark:text-white">In-Clinic Visit</div>
                <div className="text-[10px] text-zinc-500 font-mono">Direct Pass</div>
              </button>

              {doctor.acceptsHouseCalls && (
                <button
                  type="button"
                  onClick={() => setConsultType('house-call')}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    consultType === 'house-call'
                      ? 'border-red-600 dark:border-amber-400 bg-red-50/70 dark:bg-amber-500/15'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-red-300 dark:hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Home className={`w-3.5 h-3.5 ${consultType === 'house-call' ? 'text-red-600 dark:text-amber-400' : 'text-zinc-500'}`} />
                    <span className={`text-xs font-mono font-semibold ${consultType === 'house-call' ? 'text-red-700 dark:text-amber-300' : 'text-zinc-950 dark:text-white'}`}>${doctor.homeVisitFee}</span>
                  </div>
                  <div className="text-xs font-semibold text-zinc-950 dark:text-white">Doorstep Visit</div>
                  <div className="text-[10px] text-zinc-500 font-mono">Dispatched</div>
                </button>
              )}

              {doctor.acceptsTeleconsult && (
                <button
                  type="button"
                  onClick={() => setConsultType('teleconsult')}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    consultType === 'teleconsult'
                      ? 'border-red-600 dark:border-amber-400 bg-red-50/70 dark:bg-amber-500/15'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-red-300 dark:hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Video className={`w-3.5 h-3.5 ${consultType === 'teleconsult' ? 'text-red-600 dark:text-amber-400' : 'text-zinc-500'}`} />
                    <span className={`text-xs font-mono font-semibold ${consultType === 'teleconsult' ? 'text-red-700 dark:text-amber-300' : 'text-zinc-950 dark:text-white'}`}>${doctor.teleconsultFee}</span>
                  </div>
                  <div className="text-xs font-semibold text-zinc-950 dark:text-white">Video Call</div>
                  <div className="text-[10px] text-zinc-500 font-mono">Immediate</div>
                </button>
              )}
            </div>
          </div>

          {/* Time slot picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Available Slots Today
              </label>
              <span className="text-[10px] font-mono text-zinc-500">
                Walk-ins also accepted
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {doctor.availableSlotsToday.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-1.5 px-2 rounded-md text-xs font-mono text-center border transition cursor-pointer ${
                    selectedSlot === slot
                      ? 'bg-red-600 dark:bg-amber-500 text-white dark:text-black border-red-600 dark:border-amber-400 font-semibold shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-red-300 dark:hover:border-amber-500/40'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Doctor Bio & Credentials */}
          <div className="bg-zinc-50 dark:bg-zinc-950 rounded-lg p-3.5 border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
              Clinical Background
            </h3>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
              {doctor.bio}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-zinc-200 dark:border-zinc-800 text-xs">
              <div className="flex items-start gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-200">Education:</span>
                  <ul className="text-zinc-600 dark:text-zinc-400 mt-0.5 space-y-0.5">
                    {doctor.education.map((edu, i) => (
                      <li key={i}>· {edu}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Languages className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-200">Languages:</span>
                  <p className="text-zinc-600 dark:text-zinc-400 mt-0.5">{doctor.languages.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Clinic Services */}
          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Diagnostic Services & Procedures
            </h3>
            <div className="space-y-1.5">
              {doctor.services.map((srv) => (
                <div
                  key={srv.id}
                  className="flex items-center justify-between p-2.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-950 dark:text-white">{srv.name}</h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{srv.description}</p>
                  </div>
                  <div className="text-right shrink-0 pl-3">
                    <span className="text-xs font-mono font-semibold text-zinc-950 dark:text-white">${srv.price}</span>
                    <span className="block text-[10px] text-zinc-400 font-mono">~{srv.durationMin}m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-3.5 sm:p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4 shrink-0">
          <div>
            <div className="text-[10px] font-mono uppercase text-zinc-500">
              Format: {consultType.replace('-', ' ')} · {selectedSlot}
            </div>
            <div className="text-lg font-mono font-bold text-red-600 dark:text-amber-400">${getFee()}</div>
          </div>

          <button
            onClick={() => onBookAppointment(doctor, consultType, selectedSlot)}
            className="px-5 py-2 rounded-md bg-red-600 hover:bg-red-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black font-semibold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <span>Proceed to Book</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
