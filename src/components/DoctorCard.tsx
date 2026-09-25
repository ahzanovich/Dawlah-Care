import React from 'react';
import { 
  Star, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Home, 
  Video, 
  Building2, 
  ArrowRight
} from 'lucide-react';
import { Doctor, ConsultationType } from '../types';

interface DoctorCardProps {
  doctor: Doctor;
  selectedConsultType: ConsultationType;
  onSelectDoctor: (doctor: Doctor) => void;
  onBookNow: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  selectedConsultType,
  onSelectDoctor,
  onBookNow,
}) => {
  // Determine relevant fee based on chosen consultation mode
  const currentFee = 
    selectedConsultType === 'house-call' 
      ? doctor.homeVisitFee 
      : selectedConsultType === 'teleconsult'
      ? doctor.teleconsultFee
      : doctor.consultationFee;

  const modeLabel = 
    selectedConsultType === 'house-call' 
      ? 'Doorstep Call' 
      : selectedConsultType === 'teleconsult'
      ? 'Video Consult'
      : 'In-Clinic Fee';

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-red-300 dark:hover:border-amber-500/40 transition-colors flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md">
      {/* MOBILE COMPACT VIEW (<sm screens: under 125px tall, zero wasted space) */}
      <div className="sm:hidden p-3.5 space-y-2.5">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-14 h-14 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700"
            />
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 px-1 py-0.2 rounded-xs shadow-xs border border-zinc-200 dark:border-zinc-700 flex items-center gap-0.5 text-[9px] font-mono">
              <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-400" />
              <span className="font-bold">{doctor.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] uppercase font-mono font-semibold text-red-700 dark:text-amber-300 truncate">
                {doctor.specialty}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 shrink-0">
                {doctor.distanceKm} km · {doctor.waitTimeMin}m wait
              </span>
            </div>

            <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-1 truncate">
              <span className="truncate">{doctor.name}</span>
              <ShieldCheck className="w-3 h-3 text-red-600 dark:text-amber-400 shrink-0" />
            </h3>

            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              {doctor.clinicName}
            </p>
          </div>
        </div>

        {/* Mobile footer row: Price & Quick Book */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-base font-bold text-red-700 dark:text-amber-300">${currentFee}</span>
            <span className="text-[10px] text-zinc-400 uppercase">{modeLabel}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelectDoctor(doctor)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-amber-300 transition cursor-pointer min-h-[34px]"
            >
              Info
            </button>
            <button
              onClick={() => onBookNow(doctor)}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black flex items-center gap-1 transition shadow-xs cursor-pointer min-h-[34px]"
            >
              <span>Book Pass</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* TABLET & DESKTOP RICH VIEW (>=sm screens) */}
      <div className="hidden sm:block">
        {/* Card Header with Image & Badges */}
        <div className="relative h-44 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"></div>

          {/* Top Category Badge */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span className="text-[10px] uppercase font-mono font-semibold tracking-wider px-2 py-0.5 rounded-md bg-white/95 dark:bg-zinc-900/95 text-red-700 dark:text-amber-300 backdrop-blur-md shadow-xs border border-red-100 dark:border-amber-500/30">
              {doctor.specialty}
            </span>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 text-xs font-mono text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-800">
            <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
            <span className="font-semibold">{doctor.rating.toFixed(1)}</span>
            <span className="text-zinc-500 dark:text-zinc-400 font-normal text-[10px]">({doctor.reviewCount})</span>
          </div>

          {/* Bottom Bar inside image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs z-10 font-mono">
            <div className="flex items-center gap-1.5 text-zinc-200 text-[11px] drop-shadow-xs">
              <MapPin className="w-3 h-3 text-red-400 dark:text-amber-400" />
              <span>{doctor.distanceKm} km</span>
              <span className="text-zinc-400">·</span>
              <Clock className="w-3 h-3 text-zinc-300" />
              <span>{doctor.travelTimeMin}m</span>
            </div>

            <div className="bg-red-600/95 dark:bg-amber-400 text-white dark:text-black font-semibold backdrop-blur-md text-[10px] font-mono px-2 py-0.5 rounded-md shadow-xs">
              {doctor.waitTimeMin}m wait
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-white flex items-center gap-1.5">
                <span>{doctor.name}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-red-600 dark:text-amber-400 shrink-0" />
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">{doctor.title}</p>
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 flex items-center gap-1 truncate font-medium">
            <Building2 className="w-3 h-3 shrink-0 text-zinc-400" />
            <span className="truncate">{doctor.clinicName}</span>
          </p>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
            {doctor.bio}
          </p>

          {/* Supported consultation modes */}
          <div className="flex items-center gap-1.5 mb-3 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
            <span className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 rounded-sm border border-zinc-200 dark:border-zinc-700">
              <Building2 className="w-3 h-3 text-red-600 dark:text-amber-400" />
              Clinic
            </span>
            {doctor.acceptsHouseCalls && (
              <span className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 rounded-sm border border-zinc-200 dark:border-zinc-700">
                <Home className="w-3 h-3 text-red-600 dark:text-amber-400" />
                Doorstep
              </span>
            )}
            {doctor.acceptsTeleconsult && (
              <span className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 rounded-sm border border-zinc-200 dark:border-zinc-700">
                <Video className="w-3 h-3 text-red-600 dark:text-amber-400" />
                Video
              </span>
            )}
          </div>

          {/* Key Services Minimal List */}
          <div className="space-y-1 mb-3">
            {doctor.services.slice(0, 2).map((srv) => (
              <div key={srv.id} className="text-xs flex items-center justify-between text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950 px-2 py-1 rounded-sm border border-zinc-100 dark:border-zinc-800/80">
                <span className="truncate pr-2 font-normal">{srv.name}</span>
                <span className="font-mono text-zinc-900 dark:text-zinc-100 shrink-0 font-medium">${srv.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card Footer with Price & Actions on Tablet/Desktop */}
        <div className="p-4 pt-0">
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-400 dark:text-zinc-500">
                {modeLabel}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold font-mono text-red-700 dark:text-amber-300">${currentFee}</span>
                {doctor.originalFee && selectedConsultType === 'in-clinic' && (
                  <span className="text-xs text-zinc-400 line-through font-mono">
                    ${doctor.originalFee}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                Next: {doctor.availableSlotsToday[0] || 'Available Today'}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSelectDoctor(doctor)}
                className="text-xs font-medium px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 hover:border-red-300 dark:hover:border-amber-500/40 text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-amber-300 transition cursor-pointer"
              >
                Profile
              </button>
              <button
                onClick={() => onBookNow(doctor)}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-md bg-red-600 hover:bg-red-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black flex items-center gap-1 transition shadow-xs cursor-pointer"
              >
                <span>Book</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
