import React from 'react';
import { 
  X, 
  Calendar, 
  MapPin
} from 'lucide-react';
import { Appointment } from '../types';

interface ActiveAppointmentsTrayProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  onCancelAppointment: (id: string) => void;
}

export const ActiveAppointmentsTray: React.FC<ActiveAppointmentsTrayProps> = ({
  isOpen,
  onClose,
  appointments,
  onCancelAppointment,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col border-l border-zinc-200 dark:border-zinc-800">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
          <div>
            <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">Active Passes & Queue</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Real-time status tracking</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-950 dark:hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {appointments.length === 0 ? (
            <div className="text-center py-12 text-zinc-400 dark:text-zinc-500">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30 text-zinc-400" />
              <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">No active passes</p>
              <p className="text-xs text-zinc-400 mt-1">Book an in-clinic visit or consult to generate a pass.</p>
            </div>
          ) : (
            appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col justify-between"
              >
                {/* Status bar */}
                <div className="flex items-center justify-between mb-3 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-red-700 dark:text-amber-300 bg-red-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md border border-red-200 dark:border-amber-500/30">
                      {apt.queueCode}
                    </span>
                  </div>
                  <span className="text-[10px] text-red-600 dark:text-amber-400 font-semibold uppercase tracking-wide">
                    ● {apt.status}
                  </span>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={apt.doctorAvatar}
                    alt={apt.doctorName}
                    className="w-10 h-10 rounded-lg object-cover border border-zinc-200 dark:border-zinc-800 shadow-xs"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-950 dark:text-white">{apt.doctorName}</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">{apt.doctorTitle}</p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">{apt.clinicName}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-900/50 p-2 rounded-md mb-3 border border-zinc-100 dark:border-zinc-800/80">
                  <div>
                    <span className="text-[9px] uppercase text-zinc-400 block">Format</span>
                    <span className="text-zinc-800 dark:text-zinc-200 capitalize">{apt.consultType.replace('-', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-zinc-400 block">Slot</span>
                    <span className="text-zinc-950 dark:text-white font-bold">{apt.slotTime}</span>
                  </div>
                </div>

                {/* Patient notes */}
                <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 bg-zinc-50 dark:bg-zinc-900 p-2 rounded-md border border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-400 block text-[9px] font-mono uppercase">Symptoms:</span>
                  <p className="italic text-[11px]">"{apt.patientSymptoms}"</p>
                </div>

                {/* Clinic address */}
                <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{apt.clinicAddress}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100 dark:border-zinc-800 font-mono">
                  <span className="text-xs font-semibold text-zinc-950 dark:text-white">${apt.totalAmount}</span>
                  {apt.status !== 'cancelled' && (
                    <button
                      onClick={() => onCancelAppointment(apt.id)}
                      className="text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white underline underline-offset-2"
                    >
                      Cancel Pass
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
