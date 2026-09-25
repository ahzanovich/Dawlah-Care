import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  getDocFromServer,
  serverTimestamp 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile } from '../types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Cloud Firestore (using databaseId if configured)
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Auth Providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const facebookProvider = new FacebookAuthProvider();

export interface SocialAuthResult {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'facebook';
}

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle(): Promise<SocialAuthResult> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  return {
    uid: user.uid,
    name: user.displayName || 'Google User',
    email: user.email || '',
    avatar: user.photoURL || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80`,
    provider: 'google'
  };
}

/**
 * Sign in with Facebook Popup
 */
export async function signInWithFacebook(): Promise<SocialAuthResult> {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;
    return {
      uid: user.uid,
      name: user.displayName || 'Facebook User',
      email: user.email || '',
      avatar: user.photoURL || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80`,
      provider: 'facebook'
    };
  } catch (err: any) {
    // If Facebook provider isn't enabled in console yet or popup was blocked, rethrow with descriptive message
    throw err;
  }
}

/**
 * Sign out from Firebase Auth
 */
export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Save user profile to Firestore
 */
export async function saveUserProfileToFirestore(profile: UserProfile): Promise<void> {
  try {
    const userRef = doc(db, 'users', profile.id);
    await setDoc(userRef, {
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('Could not save user profile to Firestore (offline or rules restricted):', error);
  }
}

/**
 * Fetch user profile from Firestore
 */
export async function fetchUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      return snapshot.data() as UserProfile;
    }
  } catch (error) {
    console.warn('Could not fetch user profile from Firestore:', error);
  }
  return null;
}

/**
 * Validate Connection to Firestore as required by Skill
 */
export async function testFirestoreConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
