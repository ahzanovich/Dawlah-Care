import { Doctor, TriageResult } from '../types';

export function runClientTriage(symptomText: string, doctors: Doctor[]): TriageResult {
  const query = symptomText.toLowerCase().trim();

  // GI / Stomach ache / Digestion (Key requirement)
  if (
    query.includes('stomach') ||
    query.includes('belly') ||
    query.includes('tummy') ||
    query.includes('ache') ||
    query.includes('cramp') ||
    query.includes('gastric') ||
    query.includes('gut') ||
    query.includes('digest') ||
    query.includes('acid') ||
    query.includes('reflux') ||
    query.includes('heartburn') ||
    query.includes('nausea') ||
    query.includes('vomit') ||
    query.includes('diarrhea') ||
    query.includes('bloat') ||
    query.includes('constipat') ||
    query.includes('ulcer') ||
    query.includes('food poison')
  ) {
    const isEmergency = query.includes('blood') || query.includes('black stool') || query.includes('unbearable') || query.includes('faint');

    // Filter & rank Gastrologists and urgent care doctors
    const matchedDocs = doctors
      .filter((d) => d.specialtySlug === 'gastroenterology' || d.specialtySlug === 'urgent-care')
      .sort((a, b) => {
        // Prioritize gastrologists, then lowest distance, then highest rating
        if (a.specialtySlug === 'gastroenterology' && b.specialtySlug !== 'gastroenterology') return -1;
        if (b.specialtySlug === 'gastroenterology' && a.specialtySlug !== 'gastroenterology') return 1;
        return a.distanceKm - b.distanceKm || b.rating - a.rating;
      });

    return {
      symptomQuery: symptomText,
      matchedSpecialty: 'Gastroenterologist',
      matchedSpecialtySlug: 'gastroenterology',
      urgency: isEmergency ? 'emergency-warning' : 'same-day',
      urgencyLabel: isEmergency ? 'Urgent Medical Attention' : 'Same-Day Consultation Advised',
      possibleConditions: ['Acute Gastritis', 'Dyspepsia / Acid Reflux', 'Food Intolerance / Gastroenteritis', 'Irritable Bowel Syndrome'],
      clinicalSummary: 'Your symptoms match upper or lower digestive tract distress. Seeing a qualified Gastroenterologist can help assess mucosal inflammation, rule out gastric ulcers, and provide prompt medication relief.',
      suggestedDoctorQuestions: [
        'Could this be caused by dietary irritation, H. Pylori bacteria, or gastritis?',
        'Are prescription mucosal protectants (like PPIs) recommended over over-the-counter antacids?',
        'Do you advise a bedside abdominal ultrasound to check the gallbladder and stomach?',
      ],
      homeCareTip: 'Sip warm water or oral rehydration fluids. Avoid caffeine, NSAIDs (like ibuprofen/aspirin which irritate the stomach lining), and heavy oily foods.',
      redFlagsToWatch: ['Vomiting blood or coffee-ground material', 'Black tarry stools', 'High fever (>38.5°C) with rigid abdomen', 'Severe localized pain in lower right quadrant (appendicitis rule-out)'],
      recommendedDoctors: matchedDocs,
    };
  }

  // Chest / Heart / Breathing
  if (
    query.includes('chest') ||
    query.includes('heart') ||
    query.includes('palpitat') ||
    query.includes('breath') ||
    query.includes('pressure in chest') ||
    query.includes('cardio')
  ) {
    const isEmergency = query.includes('crushing') || query.includes('arm pain') || query.includes('jaw') || query.includes('cannot breathe');
    const matchedDocs = doctors
      .filter((d) => d.specialtySlug === 'cardiology' || d.specialtySlug === 'urgent-care')
      .sort((a, b) => a.distanceKm - b.distanceKm || b.rating - a.rating);

    return {
      symptomQuery: symptomText,
      matchedSpecialty: 'Cardiologist',
      matchedSpecialtySlug: 'cardiology',
      urgency: isEmergency ? 'emergency-warning' : 'immediate',
      urgencyLabel: isEmergency ? 'Emergency - Seek Immediate Care' : 'Prompt Cardiac Review',
      possibleConditions: ['Cardiovascular Strain', 'Arrhythmia / Palpitations', 'Costochondritis', 'Acid Reflux Mimicking Angina'],
      clinicalSummary: 'Chest symptoms require prompt professional evaluation with an ECG and blood pressure check to rule out acute ischemia.',
      suggestedDoctorQuestions: ['Is an immediate 12-lead ECG recommended?', 'Could this be cardiac or musculoskeletal/gastric related?'],
      homeCareTip: 'Rest in a comfortable upright position. Do not engage in strenuous exertion.',
      redFlagsToWatch: ['Pain radiating to left arm, neck, or jaw', 'Cold sweats with dizziness', 'Shortness of breath at rest'],
      recommendedDoctors: matchedDocs,
    };
  }

  // Pediatrics / Child
  if (query.includes('child') || query.includes('baby') || query.includes('kid') || query.includes('toddler') || query.includes('infant') || query.includes('pediatric')) {
    const matchedDocs = doctors
      .filter((d) => d.specialtySlug === 'pediatrics' || d.specialtySlug === 'urgent-care')
      .sort((a, b) => a.distanceKm - b.distanceKm || b.rating - a.rating);

    return {
      symptomQuery: symptomText,
      matchedSpecialty: 'Pediatrician',
      matchedSpecialtySlug: 'pediatrics',
      urgency: 'same-day',
      urgencyLabel: 'Same-Day Pediatric Care',
      possibleConditions: ['Viral Exanthem', 'Infant Colic / Tummy Bug', 'Upper Respiratory Infection', 'Otitis Media'],
      clinicalSummary: 'Children require weight-adjusted medications and gentle pediatric assessment for comfort and rapid recovery.',
      suggestedDoctorQuestions: ['What is the correct weight-based dosage for antipyretics?', 'Are there signs of ear infection or dehydration?'],
      homeCareTip: 'Keep child hydrated with small sips of electrolyte solution. Monitor wet diaper counts and body temperature.',
      redFlagsToWatch: ['Lethargy or difficulty waking', 'Stiff neck', 'Inability to keep liquids down for >12 hours', 'Persistent high fever >39°C'],
      recommendedDoctors: matchedDocs,
    };
  }

  // Skin / Allergy / Rash
  if (query.includes('skin') || query.includes('rash') || query.includes('itch') || query.includes('eczema') || query.includes('hives') || query.includes('allergy') || query.includes('mole')) {
    const matchedDocs = doctors
      .filter((d) => d.specialtySlug === 'dermatology' || d.specialtySlug === 'urgent-care')
      .sort((a, b) => a.distanceKm - b.distanceKm || b.rating - a.rating);

    return {
      symptomQuery: symptomText,
      matchedSpecialty: 'Dermatologist',
      matchedSpecialtySlug: 'dermatology',
      urgency: 'routine',
      urgencyLabel: 'Dermatology & Skin Triage',
      possibleConditions: ['Acute Urticaria (Hives)', 'Contact Dermatitis', 'Eczema Flare', 'Allergic Reaction'],
      clinicalSummary: 'Dermatologists can accurately identify lesions using dermoscopy and prescribe targeted topical or oral antihistamine therapies.',
      suggestedDoctorQuestions: ['Is this an allergic contact reaction or infectious?', 'Would topical corticosteroids or barrier creams help?'],
      homeCareTip: 'Apply a cool, damp compress. Avoid hot showers and scented soaps that strip natural skin lipids.',
      redFlagsToWatch: ['Swelling of lips, tongue, or difficulty breathing (Anaphylaxis - call emergency immediately)', 'Rapidly spreading purple or blistering rash'],
      recommendedDoctors: matchedDocs,
    };
  }

  // Bones / Joints / Sprains
  if (query.includes('bone') || query.includes('joint') || query.includes('back') || query.includes('knee') || query.includes('ankle') || query.includes('sprain') || query.includes('fracture') || query.includes('neck pain')) {
    const matchedDocs = doctors
      .filter((d) => d.specialtySlug === 'orthopedics' || d.specialtySlug === 'urgent-care')
      .sort((a, b) => a.distanceKm - b.distanceKm || b.rating - a.rating);

    return {
      symptomQuery: symptomText,
      matchedSpecialty: 'Orthopedic Specialist',
      matchedSpecialtySlug: 'orthopedics',
      urgency: 'same-day',
      urgencyLabel: 'Orthopedic Assessment Advised',
      possibleConditions: ['Acute Ligament Sprain', 'Lumbar Muscle Strain', 'Joint Synovitis', 'Tendinopathy'],
      clinicalSummary: 'Specialized physical examination and on-site radiography (X-ray) can determine whether soft tissue or bone structures are affected.',
      suggestedDoctorQuestions: ['Is an on-site digital X-ray necessary to rule out hairline fracture?', 'Do you recommend a brace or physical therapy?'],
      homeCareTip: 'Follow the P.R.I.C.E protocol: Protect, Rest, Ice (15-20 min intervals), Compress gently, and Elevate.',
      redFlagsToWatch: ['Inability to bear any weight', 'Visible limb deformity', 'Numbness or tingling below the injured joint'],
      recommendedDoctors: matchedDocs,
    };
  }

  // General / Fever / Flu / Default
  const matchedDocs = doctors
    .filter((d) => d.specialtySlug === 'urgent-care' || d.specialtySlug === 'gastroenterology')
    .sort((a, b) => a.distanceKm - b.distanceKm || b.rating - a.rating);

  return {
    symptomQuery: symptomText,
    matchedSpecialty: 'Urgent Care Physician',
    matchedSpecialtySlug: 'urgent-care',
    urgency: 'same-day',
    urgencyLabel: 'General Medical Triage',
    possibleConditions: ['Acute Viral Syndrome', 'Systemic Infection', 'General Malaise'],
    clinicalSummary: 'Our on-demand Urgent Care GP and clinics can assess your symptoms promptly, perform rapid tests, and dispense relief medications.',
    suggestedDoctorQuestions: ['What is the primary cause of these symptoms?', 'Are lab tests or specialized referrals required?'],
    homeCareTip: 'Get plenty of rest, hydrate with electrolytes, and track your temperature.',
    redFlagsToWatch: ['Difficulty breathing', 'Persistent fever unresponsive to antipyretics', 'Severe unremitting pain'],
    recommendedDoctors: matchedDocs.length > 0 ? matchedDocs : doctors.slice(0, 4),
  };
}
