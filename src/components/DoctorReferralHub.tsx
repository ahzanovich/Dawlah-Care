import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  MessageSquare, 
  AlertCircle, 
  Send,
  Sparkles,
  Check,
  Building2,
  ArrowLeft
} from 'lucide-react';
import { ReferralCase, Doctor, ReferralReply } from '../types';
import { getAiSecondOpinion } from '../services/api';

interface DoctorReferralHubProps {
  cases: ReferralCase[];
  doctors: Doctor[];
  currentDoctor: Doctor;
  onOpenNewCaseModal: () => void;
  onAddReplyToCase: (caseId: string, reply: ReferralReply) => void;
  onAcceptReferralTransfer: (caseId: string, acceptingDoctorName: string) => void;
  onBackToDoctorPortal?: () => void;
}

export const DoctorReferralHub: React.FC<DoctorReferralHubProps> = ({
  cases,
  currentDoctor,
  onOpenNewCaseModal,
  onAddReplyToCase,
  onAcceptReferralTransfer,
  onBackToDoctorPortal,
}) => {
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState<string>('all');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [differentialTextMap, setDifferentialTextMap] = useState<Record<string, string>>({});
  const [aiLoadingCaseId, setAiLoadingCaseId] = useState<string | null>(null);
  const [aiAnalysisMap, setAiAnalysisMap] = useState<Record<string, any>>({});

  const filteredCases = cases.filter((c) => {
    if (selectedSpecialtyFilter === 'all') return true;
    return c.targetSpecialty.toLowerCase() === selectedSpecialtyFilter.toLowerCase();
  });

  const handlePostReply = (caseId: string) => {
    const text = replyTextMap[caseId]?.trim();
    if (!text) return;

    const differentialRaw = differentialTextMap[caseId]?.trim();
    const differentialDiagnosis = differentialRaw
      ? differentialRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : undefined;

    const newReply: ReferralReply = {
      id: `reply-${Date.now()}`,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      doctorSpecialty: currentDoctor.specialty,
      doctorAvatar: currentDoctor.avatar,
      clinicName: currentDoctor.clinicName,
      createdAt: new Date().toISOString(),
      message: text,
      differentialDiagnosis,
      willingToAcceptTransfer: true,
    };

    onAddReplyToCase(caseId, newReply);
    setReplyTextMap({ ...replyTextMap, [caseId]: '' });
    setDifferentialTextMap({ ...differentialTextMap, [caseId]: '' });
  };

  const handleRunAiSecondOpinion = async (c: ReferralCase) => {
    setAiLoadingCaseId(c.id);
    try {
      const result = await getAiSecondOpinion({
        patientAgeGender: c.patientAgeGender,
        symptomsSummary: c.symptomsSummary,
        primaryConcern: c.primaryConcern,
        diagnosticTests: c.diagnosticTests,
        currentMedications: c.currentMedications,
      });
      setAiAnalysisMap({ ...aiAnalysisMap, [c.id]: result });
    } catch {
      // handled
    } finally {
      setAiLoadingCaseId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 sm:pb-6 space-y-6">
      {/* Hero Header */}
      <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl p-5 sm:p-6 border border-red-200 dark:border-amber-500/30 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-red-50 dark:bg-amber-500/10 text-[10px] font-mono uppercase tracking-wider mb-2 border border-red-200 dark:border-amber-500/30 text-red-700 dark:text-amber-300 font-semibold">
              <Users className="w-3 h-3 text-red-600 dark:text-amber-400" />
              <span>Dawlah Care · Physician Referral Exchange</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Physician Consultation & Referral Network
            </h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl leading-relaxed">
              When a patient's case is unclear or requires specialist attention, broadcast clinical findings, exchange differential diagnoses, and coordinate direct patient transfers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
            {onBackToDoctorPortal && (
              <button
                onClick={onBackToDoctorPortal}
                className="px-3.5 py-2 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-zinc-200 dark:border-zinc-700"
              >
                <Building2 className="w-3.5 h-3.5 text-red-600 dark:text-amber-400" />
                <span>Doctor Portal</span>
              </button>
            )}
            <button
              onClick={onOpenNewCaseModal}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-black text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Broadcast New Case</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-1.5">
          {['all', 'Gastroenterology', 'Cardiology', 'Internal Medicine', 'Urgent Care'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedSpecialtyFilter(tab)}
              className={`px-3 py-1 rounded-md text-xs font-mono transition ${
                selectedSpecialtyFilter === tab
                  ? 'bg-red-600 dark:bg-amber-500 text-white dark:text-black font-semibold shadow-xs'
                  : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-red-300 dark:hover:border-amber-500/40'
              }`}
            >
              {tab === 'all' ? 'All Cases' : tab}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-zinc-500 shrink-0">
          {filteredCases.length} Active Consults
        </div>
      </div>

      {/* Cases Feed */}
      <div className="space-y-4">
        {filteredCases.map((c) => {
          const aiData = aiAnalysisMap[c.id];
          const isAiLoading = aiLoadingCaseId === c.id;

          return (
            <div
              key={c.id}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
            >
              {/* Case Header */}
              <div className="p-4 sm:p-5 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-sm bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    {c.caseRef}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-950 dark:text-white flex items-center gap-2">
                      <span>Patient: {c.patientInitials}</span>
                      <span className="text-xs text-zinc-500 font-normal">({c.patientAgeGender})</span>
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                      Referred by: {c.referringDoctorName} · {c.referringClinic}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[11px] px-2 py-0.5 rounded-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800">
                    Target: {c.targetSpecialty}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-sm capitalize border ${
                      c.status === 'referred'
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700'
                        : c.urgency === 'urgent'
                        ? 'bg-zinc-950 dark:bg-white text-white dark:text-black border-zinc-950 dark:border-white font-semibold'
                        : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    {c.status === 'referred' ? 'Transferred' : c.urgency}
                  </span>
                </div>
              </div>

              {/* Case Body */}
              <div className="p-4 sm:p-5 space-y-3.5">
                <div>
                  <h4 className="text-[10px] font-mono uppercase text-zinc-400 mb-1">
                    Clinical Presentation & Symptoms:
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
                    {c.symptomsSummary}
                  </p>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Primary Clinical Question / Reason for Referral:</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400">{c.primaryConcern}</p>
                </div>

                {/* Diagnostic Tests */}
                {c.diagnosticTests.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5">
                      Completed Lab & Imaging Tests:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {c.diagnosticTests.map((t, i) => (
                        <div
                          key={i}
                          className="p-2 rounded-md border text-xs flex items-start justify-between gap-2 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                        >
                          <div>
                            <span className="font-semibold">{t.testName}: </span>
                            <span className="font-mono text-[11px]">{t.result}</span>
                          </div>
                          {t.abnormal && (
                            <span className="text-[9px] font-mono uppercase border border-zinc-400 px-1 py-0.2 rounded-xs shrink-0">
                              Abnormal
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Medical Grand Rounds Assistant */}
                <div className="pt-1">
                  {!aiData ? (
                    <button
                      onClick={() => handleRunAiSecondOpinion(c)}
                      disabled={isAiLoading}
                      className="text-xs font-semibold text-red-700 dark:text-amber-300 hover:text-red-800 dark:hover:text-amber-200 flex items-center gap-1.5 bg-red-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-md border border-red-200 dark:border-amber-500/30 transition cursor-pointer"
                    >
                      {isAiLoading ? (
                        <span>Analyzing with AI Assistant...</span>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-red-600 dark:text-amber-400" />
                          <span>Generate Clinical Second Opinion (Gemini)</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                          <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                          <span>AI Clinical Grand Rounds Differential:</span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500">
                          Gemini 3.8 Flash
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {aiData.differentialDiagnosis.map((item: string, i: number) => (
                          <span key={i} className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded-xs text-[11px] font-mono">
                            {item}
                          </span>
                        ))}
                      </div>

                      <p className="text-zinc-700 dark:text-zinc-300 text-xs leading-relaxed pt-1">
                        <strong className="font-semibold">Suggested Action:</strong> {aiData.suggestedAction}
                      </p>
                    </div>
                  )}
                </div>

                {/* Colleague Discussion Thread */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-mono uppercase text-zinc-500 flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3 text-zinc-400" />
                      <span>Physician Discussion ({c.replies.length})</span>
                    </h4>

                    {c.status !== 'referred' && (
                      <button
                        onClick={() => onAcceptReferralTransfer(c.id, currentDoctor.name)}
                        className="text-xs font-semibold text-white dark:text-black bg-red-600 hover:bg-red-700 dark:bg-amber-500 dark:hover:bg-amber-400 px-2.5 py-1 rounded-md transition flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        <span>Accept Referral as {currentDoctor.name}</span>
                      </button>
                    )}
                  </div>

                  {c.referredToDoctorName && (
                    <div className="p-2.5 bg-red-50 dark:bg-amber-500/10 rounded-md border border-red-200 dark:border-amber-500/30 text-xs text-red-900 dark:text-amber-200 font-mono">
                      Care referred to and accepted by {c.referredToDoctorName}.
                    </div>
                  )}

                  {/* Reply cards */}
                  <div className="space-y-2">
                    {c.replies.map((reply) => (
                      <div key={reply.id} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <img
                              src={reply.doctorAvatar}
                              alt={reply.doctorName}
                              className="w-5 h-5 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                            />
                            <span className="font-semibold text-zinc-950 dark:text-zinc-100">{reply.doctorName}</span>
                            <span className="text-[11px] font-mono text-zinc-500">
                              ({reply.doctorSpecialty})
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-zinc-400">
                            {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-1.5">
                          {reply.message}
                        </p>

                        {reply.differentialDiagnosis && reply.differentialDiagnosis.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1 text-[11px] font-mono">
                            <span className="text-zinc-400">Differentials:</span>
                            {reply.differentialDiagnosis.map((item, idx) => (
                              <span key={idx} className="bg-white dark:bg-zinc-900 px-1.5 py-0.2 rounded-xs border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                                {item}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Reply Input Box */}
                  <div className="pt-1">
                    <div className="bg-zinc-50 dark:bg-zinc-950 rounded-lg p-2.5 border border-zinc-200 dark:border-zinc-800 space-y-2">
                      <div className="text-[10px] font-mono text-zinc-400">
                        Reply as {currentDoctor.name} ({currentDoctor.specialty}):
                      </div>
                      <textarea
                        rows={2}
                        value={replyTextMap[c.id] || ''}
                        onChange={(e) => setReplyTextMap({ ...replyTextMap, [c.id]: e.target.value })}
                        placeholder="Clinical thoughts, tests to order, or offer to accept case..."
                        className="w-full text-xs p-2 bg-white dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-red-600 dark:focus:border-amber-400"
                      ></textarea>

                      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
                        <input
                          type="text"
                          value={differentialTextMap[c.id] || ''}
                          onChange={(e) => setDifferentialTextMap({ ...differentialTextMap, [c.id]: e.target.value })}
                          placeholder="Suggested differentials (comma-separated)..."
                          className="w-full sm:w-2/3 text-xs px-2.5 py-1.5 bg-white dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-red-600 dark:focus:border-amber-400"
                        />

                        <button
                          onClick={() => handlePostReply(c.id)}
                          className="w-full sm:w-auto px-3.5 py-1.5 bg-red-600 hover:bg-red-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black rounded-md text-xs font-semibold transition flex items-center justify-center gap-1 shrink-0 shadow-xs cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send Reply</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
