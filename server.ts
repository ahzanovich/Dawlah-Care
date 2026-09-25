import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  app.use(express.json());

  // Initialize Gemini AI client if API key is available
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }

  // Symptom Triage AI Endpoint
  app.post('/api/triage', async (req, res) => {
    const { symptom } = req.body;
    if (!symptom || typeof symptom !== 'string') {
      return res.status(400).json({ error: 'Symptom string required' });
    }

    if (!ai) {
      // Return structured response even without API key so client gets consistent data
      return res.json({
        fallback: true,
        matchedSpecialty: symptom.toLowerCase().includes('stomach') || symptom.toLowerCase().includes('belly') ? 'Gastroenterologist' : 'Urgent Care Physician',
        matchedSpecialtySlug: symptom.toLowerCase().includes('stomach') || symptom.toLowerCase().includes('belly') ? 'gastroenterology' : 'urgent-care',
        urgency: 'same-day',
        urgencyLabel: 'Same-Day Medical Attention',
        possibleConditions: ['Acute Gastritis', 'Functional Dyspepsia', 'Dietary Gastroenteritis'],
        clinicalSummary: 'Based on your reported abdominal and digestive symptoms, a Gastroenterologist or Urgent Care specialist can perform an abdominal exam, rule out ulcers or gallbladder irritation, and prescribe soothing targeted medication.',
        suggestedDoctorQuestions: [
          'Could this pain be aggravated by specific foods, stress, or H. Pylori?',
          'Is an in-clinic abdominal ultrasound or rapid breath test recommended?',
          'Should I be taking an acid suppressor (PPI) or antispasmodic?'
        ],
        homeCareTip: 'Drink lukewarm electrolytes or ginger water. Avoid alcohol, NSAIDs, greasy or acidic dishes.',
        redFlagsToWatch: ['Vomiting blood or coffee-ground liquid', 'Dark tarry stools', 'Fever over 38.5°C', 'Severe sharp pain on lower right side']
      });
    }

    try {
      const prompt = `You are the lead triage clinical intelligence behind DocPanda, an on-demand healthcare marketplace.
A patient states their symptoms: "${symptom}".

Analyze the symptom and return structured JSON matching this schema:
{
  "matchedSpecialty": "Exact medical specialist title, e.g. Gastroenterologist, Urgent Care Physician, Cardiologist, Pediatrician, Dermatologist, Orthopedic Specialist",
  "matchedSpecialtySlug": "one of: gastroenterology, urgent-care, cardiology, pediatrics, dermatology, orthopedics, neurology, ent",
  "urgency": "one of: routine, same-day, immediate, emergency-warning",
  "urgencyLabel": "Short human readable urgency like 'Same-Day Care Recommended' or 'Emergency Attention'",
  "possibleConditions": ["Condition 1", "Condition 2", "Condition 3"],
  "clinicalSummary": "2-3 empathetic, clear sentences explaining why this specialist is the ideal match for their symptom.",
  "suggestedDoctorQuestions": ["Question 1 patient should ask the doctor", "Question 2", "Question 3"],
  "homeCareTip": "Immediate comfort advice before consultation (e.g. hydration, foods/meds to avoid).",
  "redFlagsToWatch": ["Red flag 1", "Red flag 2", "Red flag 3"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchedSpecialty: { type: Type.STRING },
              matchedSpecialtySlug: { type: Type.STRING },
              urgency: { type: Type.STRING },
              urgencyLabel: { type: Type.STRING },
              possibleConditions: { type: Type.ARRAY, items: { type: Type.STRING } },
              clinicalSummary: { type: Type.STRING },
              suggestedDoctorQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              homeCareTip: { type: Type.STRING },
              redFlagsToWatch: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['matchedSpecialty', 'matchedSpecialtySlug', 'urgency', 'clinicalSummary'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.error('Gemini triage error:', err);
      return res.status(500).json({ error: 'AI Triage temporarily unavailable', details: err?.message });
    }
  });

  // Doctor-to-Doctor Peer Second Opinion Endpoint
  app.post('/api/ai-second-opinion', async (req, res) => {
    const { patientAgeGender, symptomsSummary, primaryConcern, diagnosticTests, currentMedications } = req.body;

    if (!ai) {
      return res.json({
        differentialDiagnosis: [
          'Refractory Gastric Mucosal Ulceration (H. Pylori / NSAID-induced)',
          'Occult Biliary Dyskinesia / Microlithiasis',
          'Atypical Celiac Disease or Eosinophilic Gastritis',
          'Postprandial Distress Syndrome'
        ],
        suggestedAction: 'Schedule diagnostic EGD with mucosal biopsies, test serum ferritin, and perform rapid fecal antigen.',
        recommendedSpecialty: 'Gastroenterology',
        clinicalDiscussion: 'Given persistent pain with inadequate response to oral PPIs, direct endoscopic visualization is recommended to exclude occult ulceration or mucosal pathology.'
      });
    }

    try {
      const prompt = `You are a Senior Academic Medical Grand Rounds Specialist helping community and clinic doctors discuss ambiguous or complex patient cases for inter-doctor referral.
Case details:
Patient: ${patientAgeGender || 'Adult'}
Clinical Summary: ${symptomsSummary || ''}
Primary Diagnostic Concern: ${primaryConcern || ''}
Diagnostic Tests Completed: ${JSON.stringify(diagnosticTests || [])}
Current Medications: ${JSON.stringify(currentMedications || [])}

Provide an expert clinical second-opinion analysis in JSON with:
{
  "differentialDiagnosis": ["Differential 1", "Differential 2", "Differential 3", "Differential 4"],
  "suggestedAction": "Concrete diagnostic step or procedural referral recommendation",
  "recommendedSpecialty": "Specialty to refer patient to (e.g. Gastroenterology, Hepatology, Rheumatology)",
  "clinicalDiscussion": "A concise, collegial physician-level rationale explaining the pathophysiology and why this patient should be referred."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              differentialDiagnosis: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestedAction: { type: Type.STRING },
              recommendedSpecialty: { type: Type.STRING },
              clinicalDiscussion: { type: Type.STRING },
            },
            required: ['differentialDiagnosis', 'suggestedAction', 'recommendedSpecialty', 'clinicalDiscussion'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.error('Second opinion error:', err);
      return res.status(500).json({ error: 'AI consult failed', details: err?.message });
    }
  });

  // Health check endpoint for Cloud Run and monitoring
  app.get(['/health', '/api/health'], (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Serve Vite app in production or fallback to static if dist exists
  const distPath = path.resolve(__dirname, 'dist');
  const isCloudRun = Boolean(process.env.K_SERVICE);
  const isProduction = process.env.NODE_ENV === 'production' || isCloudRun;
  const isDev = process.env.NODE_ENV === 'development' && !isCloudRun;

  if ((isProduction || !isDev) && fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DocPanda server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
