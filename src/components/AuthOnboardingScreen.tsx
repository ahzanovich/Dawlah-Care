import React, { useState } from 'react';
import { 
  Stethoscope, 
  User, 
  Building2, 
  ShieldCheck, 
  Check, 
  Sun, 
  Moon, 
  ArrowRight, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  Users, 
  CalendarCheck,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { UserRole, UserProfile, ThemeMode } from '../types';
import { 
  signInWithGoogle, 
  signInWithFacebook, 
  signOutUser, 
  saveUserProfileToFirestore,
  SocialAuthResult 
} from '../lib/firebase';

interface AuthOnboardingScreenProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onCompleteSignUp: (profile: UserProfile) => void;
}

export const AuthOnboardingScreen: React.FC<AuthOnboardingScreenProps> = ({
  theme,
  onToggleTheme,
  onCompleteSignUp,
}) => {
  // Social auth state
  const [socialUser, setSocialUser] = useState<SocialAuthResult | null>(null);
  const [authLoading, setAuthLoading] = useState<'google' | 'facebook' | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Role selection state (after social sign-in)
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');

  // Patient form state
  const [patientName, setPatientName] = useState('');
  const [patientEmailPhone, setPatientEmailPhone] = useState('');
  const [patientAge, setPatientAge] = useState(28);
  const [patientGender, setPatientGender] = useState('Female');
  const [patientLocation, setPatientLocation] = useState('42 Orchard Boulevard, Central');
  const [patientHealthNotes, setPatientHealthNotes] = useState('');

  // Doctor form state
  const [doctorName, setDoctorName] = useState('');
  const [doctorEmailPhone, setDoctorEmailPhone] = useState('');
  const [doctorSpecialty, setDoctorSpecialty] = useState('Gastroenterologist');
  const [doctorClinicName, setDoctorClinicName] = useState('Dawlah Gastro & Endoscopy Center');
  const [doctorLicense, setDoctorLicense] = useState('MOH-884219');
  const [doctorFee, setDoctorFee] = useState(45);

  // Google sign in handler
  const handleGoogleSignIn = async () => {
    setAuthLoading('google');
    setAuthError(null);
    try {
      const result = await signInWithGoogle();
      setSocialUser(result);
      setPatientName(result.name);
      setPatientEmailPhone(result.email);
      setDoctorName(result.name.startsWith('Dr.') ? result.name : `Dr. ${result.name}`);
      setDoctorEmailPhone(result.email);
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in cancelled. Please complete the Google popup window to proceed.');
      } else if (err.code === 'auth/popup-blocked') {
        setAuthError('Sign-in popup was blocked by your browser. Please allow popups or use the demo login.');
      } else {
        setAuthError(err.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setAuthLoading(null);
    }
  };

  // Facebook sign in handler
  const handleFacebookSignIn = async () => {
    setAuthLoading('facebook');
    setAuthError(null);
    try {
      const result = await signInWithFacebook();
      setSocialUser(result);
      setPatientName(result.name);
      setPatientEmailPhone(result.email);
      setDoctorName(result.name.startsWith('Dr.') ? result.name : `Dr. ${result.name}`);
      setDoctorEmailPhone(result.email);
    } catch (err: any) {
      console.error('Facebook sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in cancelled. Please complete the Facebook popup window to proceed.');
      } else if (err.code === 'auth/popup-blocked') {
        setAuthError('Sign-in popup was blocked by your browser. Please allow popups or use the demo login.');
      } else if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/configuration-not-found') {
        setAuthError('Facebook sign-in is not yet enabled in the Firebase console. Please sign in with Google or use the demo login.');
      } else {
        setAuthError(err.message || 'Facebook sign-in failed. Please try again.');
      }
    } finally {
      setAuthLoading(null);
    }
  };

  // Switch or sign out from current social account
  const handleSignOutSocial = async () => {
    try {
      await signOutUser();
    } catch {
      // ignore
    }
    setSocialUser(null);
    setAuthError(null);
  };

  // Quick simulated login as Amira (patient)
  const handleDemoSocialPatient = () => {
    const mockGooglePatient: SocialAuthResult = {
      uid: 'google-demo-amira',
      name: 'Amira Rahman',
      email: 'amira.rahman@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      provider: 'google',
    };
    setSocialUser(mockGooglePatient);
    setPatientName(mockGooglePatient.name);
    setPatientEmailPhone(mockGooglePatient.email);
    setSelectedRole('patient');
  };

  // Quick simulated login as Dr. Thorne (doctor)
  const handleDemoSocialDoctor = () => {
    const mockGoogleDoctor: SocialAuthResult = {
      uid: 'google-demo-thorne',
      name: 'Dr. Aris Thorne, MD',
      email: 'dr.thorne@dawlahcare.com',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
      provider: 'google',
    };
    setSocialUser(mockGoogleDoctor);
    setDoctorName(mockGoogleDoctor.name);
    setDoctorEmailPhone(mockGoogleDoctor.email);
    setSelectedRole('doctor');
  };

  // Final patient submission
  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = (patientName || socialUser?.name || 'Patient User').trim();
    const email = (patientEmailPhone || socialUser?.email || 'patient@dawlahcare.com').trim();

    const profile: UserProfile = {
      id: socialUser?.uid || `user-p-${Date.now()}`,
      role: 'patient',
      name,
      emailOrPhone: email,
      avatar: socialUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      authProvider: socialUser?.provider || 'demo',
      age: Number(patientAge) || 28,
      gender: patientGender,
      location: patientLocation.trim() || 'Central District',
      healthNotes: patientHealthNotes.trim(),
    };

    await saveUserProfileToFirestore(profile);
    onCompleteSignUp(profile);
  };

  // Final doctor submission
  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = (doctorName || socialUser?.name || 'Dr. Physician, MD').trim();
    const email = (doctorEmailPhone || socialUser?.email || 'physician@dawlahcare.com').trim();

    const profile: UserProfile = {
      id: socialUser?.uid || `user-d-${Date.now()}`,
      role: 'doctor',
      name: name.startsWith('Dr.') ? name : `Dr. ${name}`,
      emailOrPhone: email,
      avatar: socialUser?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
      authProvider: socialUser?.provider || 'demo',
      doctorId: 'doc-1',
      specialty: doctorSpecialty,
      clinicName: doctorClinicName.trim() || 'Dawlah Gastro & Endoscopy Center',
      licenseNumber: doctorLicense.trim() || 'MOH-884219',
      consultationFee: Number(doctorFee) || 45,
    };

    await saveUserProfileToFirestore(profile);
    onCompleteSignUp(profile);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-200">
      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-600 dark:bg-amber-500 text-white dark:text-black flex items-center justify-center shadow-xs">
            <Stethoscope className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-zinc-950 dark:text-white">
                Dawlah <span className="font-normal text-red-600 dark:text-amber-400">Care</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-sm border border-red-200 dark:border-amber-500/30 text-red-700 dark:text-amber-300 bg-red-50 dark:bg-amber-500/10 font-semibold">
                Identity Gateway
              </span>
            </div>
          </div>
        </div>

        {/* Theme Switcher */}
        <button
          onClick={onToggleTheme}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light (White & Red)' : 'Dark (Obsidian & Gold)'} layout`}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Light (White & Red)</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-zinc-800" />
              <span>Dark (Obsidian & Gold)</span>
            </>
          )}
        </button>
      </header>

      {/* Main Body */}
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10 flex-1 flex flex-col justify-center">
        
        {/* STEP 1: SOCIAL SIGN-IN REQUIRED (Google or Facebook) */}
        {!socialUser ? (
          <div className="space-y-6">
            <div className="text-center max-w-lg mx-auto">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider text-red-700 dark:text-amber-300 bg-red-50 dark:bg-amber-500/10 border border-red-200 dark:border-amber-500/30 mb-3 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-red-600 dark:text-amber-400" />
                <span>Verified Provider & Patient Access</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
                Sign in to Dawlah Care
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                Please sign in with Google or Facebook to authenticate your identity before choosing your patient or doctor portal.
              </p>
            </div>

            {/* Error Message Box */}
            {authError && (
              <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs text-red-800 dark:text-red-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Authentication Notice</p>
                  <p className="mt-0.5 opacity-90">{authError}</p>
                </div>
              </div>
            )}

            {/* Social Authentication Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-4">
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authLoading !== null}
                className="w-full py-3 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-semibold text-sm flex items-center justify-center gap-3 transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50"
              >
                {authLoading === 'google' ? (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              {/* Facebook Button */}
              <button
                type="button"
                onClick={handleFacebookSignIn}
                disabled={authLoading !== null}
                className="w-full py-3 px-4 rounded-xl border border-[#1877F2]/40 bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-sm flex items-center justify-center gap-3 transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50"
              >
                {authLoading === 'facebook' ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
                <span>Continue with Facebook</span>
              </button>

              <div className="relative py-2 flex items-center justify-center">
                <div className="border-t border-zinc-200 dark:border-zinc-800 w-full"></div>
                <span className="bg-white dark:bg-zinc-900 px-3 text-[11px] font-mono uppercase text-zinc-400 shrink-0">
                  Or One-Click Test Account
                </span>
              </div>

              {/* Demo Sign-in buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleDemoSocialPatient}
                  className="py-2.5 px-3 rounded-lg border border-red-200 dark:border-amber-500/30 bg-red-50/50 dark:bg-amber-500/10 text-red-700 dark:text-amber-300 hover:bg-red-100/70 dark:hover:bg-amber-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-red-600 dark:text-amber-400" />
                  <span>Demo Patient (Amira)</span>
                </button>
                <button
                  type="button"
                  onClick={handleDemoSocialDoctor}
                  className="py-2.5 px-3 rounded-lg border border-red-200 dark:border-amber-500/30 bg-red-50/50 dark:bg-amber-500/10 text-red-700 dark:text-amber-300 hover:bg-red-100/70 dark:hover:bg-amber-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-red-600 dark:text-amber-400" />
                  <span>Demo Doctor (Dr. Thorne)</span>
                </button>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center text-xs text-zinc-500 dark:text-zinc-400">
              <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-red-600 dark:text-amber-400" />
                <span>Firebase Authentication</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center gap-2">
                <CalendarCheck className="w-3.5 h-3.5 text-red-600 dark:text-amber-400" />
                <span>Encrypted Queue Passes</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center gap-2">
                <Users className="w-3.5 h-3.5 text-red-600 dark:text-amber-400" />
                <span>Verified Physician Badging</span>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 2: USER IS SIGNED IN -> SELECT PORTAL (Doctor vs Patient) */
          <div className="space-y-6">
            {/* Authenticated Identity Bar */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <img
                  src={socialUser.avatar}
                  alt={socialUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-red-200 dark:border-amber-500/40"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-950 dark:text-white">
                      {socialUser.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full capitalize bg-red-50 dark:bg-amber-500/10 text-red-700 dark:text-amber-300 border border-red-200 dark:border-amber-500/30 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3 text-red-600 dark:text-amber-400" />
                      <span>{socialUser.provider} Verified</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                    {socialUser.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOutSocial}
                className="text-xs text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-amber-400 flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 hover:border-red-200 dark:hover:border-amber-500/30 transition cursor-pointer font-mono"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch Account</span>
              </button>
            </div>

            <div className="text-center max-w-lg mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                Select Your Access Portal
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Choose whether you are registering as a patient seeking care, or a licensed physician managing consultations.
              </p>
            </div>

            {/* Portal Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Patient Card */}
              <button
                type="button"
                onClick={() => setSelectedRole('patient')}
                className={`p-5 rounded-xl text-left border transition-all flex flex-col justify-between relative cursor-pointer ${
                  selectedRole === 'patient'
                    ? 'border-red-600 dark:border-amber-400 bg-red-50/20 dark:bg-amber-500/10 shadow-md ring-2 ring-red-600/20 dark:ring-amber-400/20'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-red-300 dark:hover:border-amber-500/40 opacity-80 hover:opacity-100'
                }`}
              >
                {selectedRole === 'patient' && (
                  <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-red-600 dark:bg-amber-500 text-white dark:text-black flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div>
                  <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-amber-500/15 text-red-600 dark:text-amber-400 flex items-center justify-center mb-3">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-zinc-950 dark:text-white">Patient</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-red-100 dark:bg-amber-500/20 text-red-800 dark:text-amber-300 font-semibold border border-red-200 dark:border-amber-500/30">
                      Find Care Only
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                    Describe symptoms, compare transparent doctor fees, book instant clinic queue passes, or request doorstep house calls.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-medium">
                  <span className="text-zinc-500 dark:text-zinc-400 text-[11px] font-mono">Triage · Passes · Maps</span>
                  <span className="text-red-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
                    <span>Patient Portal</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>

              {/* Doctor Card */}
              <button
                type="button"
                onClick={() => setSelectedRole('doctor')}
                className={`p-5 rounded-xl text-left border transition-all flex flex-col justify-between relative cursor-pointer ${
                  selectedRole === 'doctor'
                    ? 'border-red-600 dark:border-amber-400 bg-red-50/20 dark:bg-amber-500/10 shadow-md ring-2 ring-red-600/20 dark:ring-amber-400/20'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-red-300 dark:hover:border-amber-500/40 opacity-80 hover:opacity-100'
                }`}
              >
                {selectedRole === 'doctor' && (
                  <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-red-600 dark:bg-amber-500 text-white dark:text-black flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div>
                  <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-amber-500/15 text-red-600 dark:text-amber-400 flex items-center justify-center mb-3">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-zinc-950 dark:text-white">Doctor / Physician</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-red-100 dark:bg-amber-500/20 text-red-800 dark:text-amber-300 font-semibold border border-red-200 dark:border-amber-500/30">
                      Portal & Referral Hub
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                    Live consultation fee adjustments, manage today's incoming patient queue, and share second opinions in the peer referral network.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-medium">
                  <span className="text-zinc-500 dark:text-zinc-400 text-[11px] font-mono">Workspace · Queue · Referrals</span>
                  <span className="text-red-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
                    <span>Doctor Portal</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            </div>

            {/* Portal Setup Details */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 shadow-xs">
              {selectedRole === 'patient' ? (
                /* Patient Confirmation Form */
                <form onSubmit={handlePatientSubmit} className="space-y-4">
                  <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                      Confirm Patient Profile
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Your identity is linked to {socialUser.email}.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={patientName || socialUser.name}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full text-xs px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-red-600 dark:focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-1">
                        Contact Email
                      </label>
                      <input
                        type="text"
                        required
                        value={patientEmailPhone || socialUser.email}
                        onChange={(e) => setPatientEmailPhone(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full text-xs px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-red-600 dark:focus:border-amber-400 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={patientAge}
                        onChange={(e) => setPatientAge(Number(e.target.value))}
                        className="w-full text-xs px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-red-600 dark:focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-1">
                        Gender
                      </label>
                      <select
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-red-600 dark:focus:border-amber-400"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-1">
                      Current Location
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={patientLocation}
                        onChange={(e) => setPatientLocation(e.target.value)}
                        placeholder="e.g. 42 Orchard Boulevard, Central"
                        className="w-full text-xs pl-9 pr-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-red-600 dark:focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      <span>Open Find Care Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              ) : (
                /* Doctor Confirmation Form */
                <form onSubmit={handleDoctorSubmit} className="space-y-4">
                  <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                      Confirm Physician Practice Profile
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Your identity is linked to {socialUser.email}.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-1">
                        Physician Name & Title
                      </label>
                      <input
                        type="text"
                        required
                        value={doctorName || (socialUser.name.startsWith('Dr.') ? socialUser.name : `Dr. ${socialUser.name}`)}
                        onChange={(e) => setDoctorName(e.target.value)}
                        placeholder="e.g. Dr. Aris Thorne, MD"
                        className="w-full text-xs px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-red-600 dark:focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-1">
                        Professional Email
                      </label>
                      <input
                        type="text"
                        required
                        value={doctorEmailPhone || socialUser.email}
                        onChange={(e) => setDoctorEmailPhone(e.target.value)}
                        placeholder="dr.thorne@dawlahcare.com"
                        className="w-full text-xs px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-red-600 dark:focus:border-amber-400 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-1">
                        Medical Specialty
                      </label>
                      <select
                        value={doctorSpecialty}
                        onChange={(e) => setDoctorSpecialty(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-red-600 dark:focus:border-amber-400"
                      >
                        <option value="Gastroenterologist">Gastroenterology (Stomach & Digestion)</option>
                        <option value="General Practitioner">Urgent Care GP</option>
                        <option value="Cardiologist">Cardiology (Heart & Chest)</option>
                        <option value="Pediatrician">Pediatrics (Children & Infants)</option>
                        <option value="Dermatologist">Dermatology (Skin & Allergy)</option>
                        <option value="Internal Medicine">Internal Medicine Specialist</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-1">
                        Clinic / Hospital Practice
                      </label>
                      <input
                        type="text"
                        required
                        value={doctorClinicName}
                        onChange={(e) => setDoctorClinicName(e.target.value)}
                        placeholder="e.g. Dawlah Gastro & Endoscopy Center"
                        className="w-full text-xs px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-red-600 dark:focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-1">
                        Medical License Number
                      </label>
                      <input
                        type="text"
                        required
                        value={doctorLicense}
                        onChange={(e) => setDoctorLicense(e.target.value)}
                        placeholder="e.g. MOH-884219"
                        className="w-full text-xs px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-red-600 dark:focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-1">
                        Initial Consultation Fee ($)
                      </label>
                      <div className="relative">
                        <DollarSign className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                        <input
                          type="number"
                          min="15"
                          max="500"
                          value={doctorFee}
                          onChange={(e) => setDoctorFee(Number(e.target.value))}
                          className="w-full text-xs pl-8 pr-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono font-medium focus:outline-hidden focus:border-red-600 dark:focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      <span>Open Doctor Practice Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400 dark:text-zinc-500 font-mono">
        Dawlah Care — Secure Google & Facebook Authentication Gateway
      </footer>
    </div>
  );
};
