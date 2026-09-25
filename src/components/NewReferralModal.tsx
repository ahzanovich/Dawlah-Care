import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Trash2 
} from 'lucide-react';
import { ReferralCase, Doctor } from '../types';

interface NewReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoctor: Doctor;
  prefill?: { name: string; symptoms: string };
  onCreateCase: (newCase: ReferralCase) => void;
}

export const NewReferralModal: React.FC<NewReferralModalProps> = ({
  isOpen,
  onClose,
  currentDoctor,
  prefill,
  onCreateCase,
}) => {
  if (!isOpen) return null;

  const [patientInitials, setPatientInitials] = useState(
    prefill?.name ? `${prefill.name.slice(0, 1)}.M., 34yo` : 'J.K., 34yo'
  );
  const [patientAgeGender, setPatientAgeGender] = useState('34 years, Female');
  const [targetSpecialty, setTargetSpecialty] = useState('Gastroenterology');
  const [urgency, setUrgency] = useState<'routine' | 'priority' | 'urgent'>('priority');
  const [symptomsSummary, setSymptomsSummary] = useState(
    prefill?.symptoms || 'Persistent epigastric pain and burning sensation after meals, accompanied by nausea and lack of appetite. No response to standard antacids.'
  );
  const [primaryConcern, setPrimaryConcern] = useState(
    'Refractory dyspepsia with epigastric tenderness. Need specialist gastro review, potential endoscopy or H. pylori evaluation.'
  );
  const [testName, setTestName] = useState('Abdominal Ultrasound');
  const [testResult, setTestResult] = useState('Normal liver and gallbladder, mild gastric distention');
  const [tests, setTests] = useState<{ testName: string; result: string; date: string; abnormal: boolean }[]>([
    { testName: 'Abdominal Ultrasound', result: 'Normal biliary tree, no gallstones detected', date: '2026-09-23', abnormal: false },
    { testName: 'Complete Blood Count', result: 'Normal WBC, Hb 12.1 g/dL', date: '2026-09-23', abnormal: false }
  ]);

  const handleAddTest = () => {
    if (testName.trim() && testResult.trim()) {
      setTests([...tests, {
        testName: testName.trim(),
        result: testResult.trim(),
        date: 'Today',
        abnormal: false,
      }]);
      setTestName('');
      setTestResult('');
    }
  };

  const handleRemoveTest = (index: number) => {
    setTests(tests.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const caseNum = `REF-${Math.floor(2000 + Math.random() * 8000)}`;
    const createdCase: ReferralCase = {
      id: `case-${Date.now()}`,
      caseRef: caseNum,
      patientInitials: patientInitials.trim(),
      patientAgeGender: patientAgeGender.trim(),
      symptomsSummary: symptomsSummary.trim(),
      duration: '2-3 weeks',
      primaryConcern: primaryConcern.trim(),
      referringDoctorId: currentDoctor.id,
      referringDoctorName: currentDoctor.name,
      referringDoctorSpecialty: currentDoctor.specialty,
      referringClinic: currentDoctor.clinicName,
      targetSpecialty,
      urgency,
      status: 'open',
      createdAt: new Date().toISOString(),
      diagnosticTests: tests,
      currentMedications: ['Omeprazole 20mg daily', 'Antacid liquid PRN'],
      replies: [],
    };

    onCreateCase(createdCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-red-600 dark:bg-amber-500 text-white dark:text-black flex items-center justify-center">
              <Share2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">Broadcast Clinical Case for Referral</h2>
              <p className="text-[11px] font-mono text-zinc-500">Referring Physician: {currentDoctor.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-950 dark:hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Patient Anonymized details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">
                Patient Code / Initials
              </label>
              <input
                type="text"
                required
                value={patientInitials}
                onChange={(e) => setPatientInitials(e.target.value)}
                placeholder="e.g. M.K., 38yo"
                className="w-full text-xs px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-hidden focus:border-zinc-950 dark:focus:border-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">
                Age & Demographics
              </label>
              <input
                type="text"
                required
                value={patientAgeGender}
                onChange={(e) => setPatientAgeGender(e.target.value)}
                placeholder="e.g. 38 years, Female"
                className="w-full text-xs px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-hidden focus:border-zinc-950 dark:focus:border-white font-mono"
              />
            </div>
          </div>

          {/* Target Specialty & Urgency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">
                Target Referral Specialty
              </label>
              <select
                value={targetSpecialty}
                onChange={(e) => setTargetSpecialty(e.target.value)}
                className="w-full text-xs px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-hidden focus:border-zinc-950 dark:focus:border-white"
              >
                <option value="Gastroenterology">Gastroenterology (Stomach & Digestive)</option>
                <option value="Cardiology">Cardiology (Heart & Chest)</option>
                <option value="General Surgery">General Surgery</option>
                <option value="Internal Medicine">Internal Medicine</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Orthopedics">Orthopedics</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">
                Clinical Urgency
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full text-xs px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-hidden focus:border-zinc-950 dark:focus:border-white font-mono"
              >
                <option value="priority">Priority (within 24 hours)</option>
                <option value="urgent">Urgent Intervention</option>
                <option value="routine">Routine Second Opinion</option>
              </select>
            </div>
          </div>

          {/* Clinical Presentation */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">
              Case History & Clinical Findings
            </label>
            <textarea
              rows={3}
              required
              value={symptomsSummary}
              onChange={(e) => setSymptomsSummary(e.target.value)}
              placeholder="Describe symptoms, progression, and physical exam findings..."
              className="w-full text-xs p-2.5 bg-zinc-50 dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-hidden focus:border-zinc-950 dark:focus:border-white leading-relaxed"
            ></textarea>
          </div>

          {/* Primary Dilemma / Referral Question */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">
              Primary Diagnostic Question or Specialist Request
            </label>
            <textarea
              rows={2}
              required
              value={primaryConcern}
              onChange={(e) => setPrimaryConcern(e.target.value)}
              placeholder="e.g. Unclear why symptoms persist. Requesting specialist endoscopy or second opinion..."
              className="w-full text-xs p-2.5 bg-zinc-50 dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-hidden focus:border-zinc-950 dark:focus:border-white"
            ></textarea>
          </div>

          {/* Attached Diagnostics */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-mono uppercase text-zinc-500">
                Attached Diagnostics & Labs
              </label>
            </div>

            {/* Test list */}
            <div className="space-y-1.5 mb-2.5">
              {tests.map((t, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono"
                >
                  <div>
                    <span className="font-semibold text-zinc-950 dark:text-white">{t.testName}: </span>
                    <span className="text-zinc-600 dark:text-zinc-400">{t.result}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTest(idx)}
                    className="text-zinc-400 hover:text-zinc-950 dark:hover:text-white p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add test inputs */}
            <div className="flex gap-2">
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Test (e.g. H. Pylori Breath Test)"
                className="w-1/3 text-xs px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
              <input
                type="text"
                value={testResult}
                onChange={(e) => setTestResult(e.target.value)}
                placeholder="Result (e.g. Positive)"
                className="flex-1 text-xs px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-mono"
              />
              <button
                type="button"
                onClick={handleAddTest}
                className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-md text-xs font-medium hover:bg-zinc-300 shrink-0"
              >
                Add Test
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Broadcast Case to Physician Network</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
