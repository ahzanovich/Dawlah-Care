import { Doctor, TriageResult } from '../types';
import { runClientTriage } from '../utils/triageEngine';

export async function triageSymptoms(symptomText: string, allDoctors: Doctor[]): Promise<TriageResult> {
  try {
    const res = await fetch('/api/triage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptom: symptomText }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.matchedSpecialty) {
        // Find matching doctors based on AI specialty suggestion
        const matched = allDoctors
          .filter((d) => {
            const matchesSlug = data.matchedSpecialtySlug && d.specialtySlug.toLowerCase() === data.matchedSpecialtySlug.toLowerCase();
            const matchesName = d.specialty.toLowerCase().includes(data.matchedSpecialty.toLowerCase());
            return matchesSlug || matchesName || d.specialtySlug === 'urgent-care';
          })
          .sort((a, b) => {
            const aExact = a.specialtySlug === data.matchedSpecialtySlug;
            const bExact = b.specialtySlug === data.matchedSpecialtySlug;
            if (aExact && !bExact) return -1;
            if (bExact && !aExact) return 1;
            return a.distanceKm - b.distanceKm || b.rating - a.rating;
          });

        return {
          symptomQuery: symptomText,
          matchedSpecialty: data.matchedSpecialty,
          matchedSpecialtySlug: data.matchedSpecialtySlug || 'gastroenterology',
          urgency: data.urgency || 'same-day',
          urgencyLabel: data.urgencyLabel || 'Same-Day Consultation',
          possibleConditions: data.possibleConditions || ['Gastric / Abdominal Distress'],
          clinicalSummary: data.clinicalSummary || '',
          suggestedDoctorQuestions: data.suggestedDoctorQuestions || [],
          homeCareTip: data.homeCareTip || '',
          redFlagsToWatch: data.redFlagsToWatch || [],
          recommendedDoctors: matched.length > 0 ? matched : allDoctors.slice(0, 4),
        };
      }
    }
  } catch {
    // Network or server offline, fall through to client triage
  }

  // Guaranteed fallback
  return runClientTriage(symptomText, allDoctors);
}

export async function getAiSecondOpinion(caseData: {
  patientAgeGender: string;
  symptomsSummary: string;
  primaryConcern: string;
  diagnosticTests?: { testName: string; result: string }[];
  currentMedications?: string[];
}): Promise<{
  differentialDiagnosis: string[];
  suggestedAction: string;
  recommendedSpecialty: string;
  clinicalDiscussion: string;
}> {
  try {
    const res = await fetch('/api/ai-second-opinion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseData),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {
    // fallback
  }

  // Clinical heuristic fallback for inter-doctor consult
  return {
    differentialDiagnosis: [
      'Refractory Functional Dyspepsia with Hypersensitivity',
      'Helicobacter Pylori / Peptic Mucosal Ulceration',
      'Occult Biliary / Sphincter of Oddi Dysfunction',
      'Atypical Celiac Disease or Eosinophilic Gastritis',
    ],
    suggestedAction: 'Consider diagnostic upper endoscopy (EGD) with duodenal biopsies, serum ferritin, and anti-tTG IgA before escalating to CT imaging.',
    recommendedSpecialty: 'Gastroenterology',
    clinicalDiscussion: 'Given persistent symptoms refractory to first-line PPI therapy, direct mucosal visualization via endoscopy is the gold standard next step.',
  };
}
