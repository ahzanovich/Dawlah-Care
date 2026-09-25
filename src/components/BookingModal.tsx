import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Clock, 
  ShieldCheck, 
  User, 
  Phone
} from 'lucide-react';
import { Doctor, ConsultationType, Appointment, UserProfile } from '../types';

interface BookingModalProps {
  doctor: Doctor;
  initialType: ConsultationType;
  initialSlot: string;
  defaultSymptoms: string;
  currentUser?: UserProfile | null;
  onClose: () => void;
  onConfirmBooking: (appointment: Appointment) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  doctor,
  initialType,
  initialSlot,
  defaultSymptoms,
  currentUser,
  onClose,
  onConfirmBooking,
}) => {
  const [consultType, setConsultType] = useState<ConsultationType>(initialType);
  const [slot, setSlot] = useState<string>(initialSlot || doctor.availableSlotsToday[0]);
  const [patientName, setPatientName] = useState(currentUser?.name || 'Alex Morgan');
  const [patientAge, setPatientAge] = useState(String(currentUser?.age || '28'));
  const [patientPhone, setPatientPhone] = useState(currentUser?.emailOrPhone || '+65 9876 5432');
  const [symptoms, setSymptoms] = useState(
    defaultSymptoms || currentUser?.healthNotes || 'I am having a sharp stomach ache with bloating after eating'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState<Appointment | null>(null);

  const getFee = () => {
    if (consultType === 'house-call') return doctor.homeVisitFee;
    if (consultType === 'teleconsult') return doctor.teleconsultFee;
    return doctor.consultationFee;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const queueNum = `DAWLAH-${Math.floor(10 + Math.random() * 89)}`;
    const fee = getFee();

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      queueCode: queueNum,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorTitle: doctor.title,
      doctorAvatar: doctor.avatar,
      clinicName: doctor.clinicName,
      clinicAddress: doctor.address,
      consultType,
      slotTime: slot,
      appointmentDate: 'Today',
      patientName: patientName.trim(),
      patientAge: parseInt(patientAge, 10) || 28,
      patientPhone: patientPhone.trim(),
      patientSymptoms: symptoms.trim(),
      status: 'confirmed',
      consultationFee: fee,
      serviceFee: 0,
      totalAmount: fee,
      createdAt: new Date().toISOString(),
      doctorNotes: 'Transmitted to clinic physician registry.',
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmedTicket(newApt);
      onConfirmBooking(newApt);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-t-2xl sm:rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
          <div>
            <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">
              {confirmedTicket ? 'Confirmed Queue Pass' : 'Schedule Clinical Visit'}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              {doctor.name} · {doctor.specialty}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-950 dark:hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {confirmedTicket ? (
          /* Confirmation Success Screen */
          <div className="p-6 text-center space-y-5 overflow-y-auto">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-amber-500/15 border border-red-200 dark:border-amber-500/30 text-red-600 dark:text-amber-400 mx-auto flex items-center justify-center">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-700 dark:text-amber-300 bg-red-50 dark:bg-amber-500/15 border border-red-200 dark:border-amber-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                Reservation Active
              </span>
              <h3 className="text-xl font-mono font-bold text-zinc-950 dark:text-white mt-2">
                Queue Pass: {confirmedTicket.queueCode}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-normal">
                Transmitted to {doctor.clinicName}. Show this pass on arrival.
              </p>
            </div>

            {/* Ticket Card - Light in bright mode, Dark+Gold in dark mode */}
            <div className="bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-white rounded-xl p-5 text-left border border-red-200 dark:border-amber-500/30 shadow-xs">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-12 h-12 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700"
                />
                <div>
                  <h4 className="text-sm font-semibold">{doctor.name}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">{doctor.title}</p>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300 font-medium">{doctor.clinicName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400 block text-[10px] uppercase">Patient</span>
                  <span className="text-zinc-900 dark:text-zinc-200 font-medium">{confirmedTicket.patientName} ({confirmedTicket.patientAge}y)</span>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400 block text-[10px] uppercase">Format</span>
                  <span className="text-zinc-900 dark:text-zinc-200 font-medium capitalize">{confirmedTicket.consultType.replace('-', ' ')}</span>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400 block text-[10px] uppercase">Slot Time</span>
                  <span className="text-red-600 dark:text-amber-400 font-bold">{confirmedTicket.slotTime}</span>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400 block text-[10px] uppercase">Fee Paid</span>
                  <span className="text-red-600 dark:text-amber-400 font-bold">${confirmedTicket.totalAmount}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Physician queue notified · Approx wait: {doctor.waitTimeMin}m</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black font-semibold text-xs transition shadow-xs cursor-pointer"
            >
              Done & Return to Clinics
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
            {/* Format & Slot */}
            <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                Care Format & Slot
              </label>
              
              <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                <button
                  type="button"
                  onClick={() => setConsultType('in-clinic')}
                  className={`py-1.5 px-2 text-center rounded-md text-xs font-medium border transition cursor-pointer ${
                    consultType === 'in-clinic'
                      ? 'bg-red-600 dark:bg-amber-500 text-white dark:text-black border-red-600 dark:border-amber-400 font-semibold shadow-xs'
                      : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  In-Clinic (${doctor.consultationFee})
                </button>
                {doctor.acceptsHouseCalls && (
                  <button
                    type="button"
                    onClick={() => setConsultType('house-call')}
                    className={`py-1.5 px-2 text-center rounded-md text-xs font-medium border transition cursor-pointer ${
                      consultType === 'house-call'
                        ? 'bg-red-600 dark:bg-amber-500 text-white dark:text-black border-red-600 dark:border-amber-400 font-semibold shadow-xs'
                        : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    Doorstep (${doctor.homeVisitFee})
                  </button>
                )}
                {doctor.acceptsTeleconsult && (
                  <button
                    type="button"
                    onClick={() => setConsultType('teleconsult')}
                    className={`py-1.5 px-2 text-center rounded-md text-xs font-medium border transition cursor-pointer ${
                      consultType === 'teleconsult'
                        ? 'bg-red-600 dark:bg-amber-500 text-white dark:text-black border-red-600 dark:border-amber-400 font-semibold shadow-xs'
                        : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    Video (${doctor.teleconsultFee})
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                <span className="text-[10px] font-mono uppercase text-zinc-400 shrink-0 mr-1">Time:</span>
                {doctor.availableSlotsToday.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSlot(s)}
                    className={`text-xs px-2 py-1 rounded-md shrink-0 font-mono transition cursor-pointer ${
                      slot === s
                        ? 'bg-red-600 dark:bg-amber-500 text-white dark:text-black font-semibold shadow-xs'
                        : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Details */}
            <div className="space-y-2.5">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Patient Info
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2 bg-zinc-50 dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-red-600 dark:focus:border-amber-400 font-normal"
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="number"
                    required
                    placeholder="Age"
                    min="1"
                    max="120"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 bg-zinc-50 dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-red-600 dark:focus:border-amber-400 font-mono text-center"
                  />
                </div>
              </div>

              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Contact Email or Phone"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 bg-zinc-50 dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-red-600 dark:focus:border-amber-400 font-normal"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-600 dark:text-zinc-400 mb-1">
                  Symptoms & Clinical Reason:
                </label>
                <textarea
                  rows={2}
                  required
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. Sharp stomach ache, acid reflux after meals..."
                  className="w-full text-xs p-2.5 bg-zinc-50 dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-red-600 dark:focus:border-amber-400"
                ></textarea>
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Doctor Consultation ({doctor.specialty})</span>
                <span className="text-zinc-950 dark:text-white font-medium">${getFee()}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Priority Clinic Fast-Pass</span>
                <span className="text-red-600 dark:text-amber-400 font-medium">Free</span>
              </div>
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between text-sm font-semibold text-zinc-950 dark:text-white">
                <span>Total Due</span>
                <span className="font-mono text-base text-red-600 dark:text-amber-400">${getFee()}</span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50 shadow-xs cursor-pointer"
            >
              {isSubmitting ? (
                <span>Generating Queue Pass...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm Booking · ${getFee()}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
