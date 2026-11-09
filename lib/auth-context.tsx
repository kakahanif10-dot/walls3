"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleAuthProvider } from "./firebase";
import { handleFirestoreError, OperationType } from "./firestore-error";

export interface UserProfileData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  plan?: "reader" | "premium" | "institutional";
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfileData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  updateUserPlan: (plan: "reader" | "premium" | "institutional") => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
  updateUserPlan: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync user profile to Firestore
  const syncProfile = useCallback(async (firebaseUser: User) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    try {
      const snap = await getDoc(userRef);
      const now = new Date().toISOString();
      if (!snap.exists()) {
        const newProfile: UserProfileData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || "Desk Trader",
          photoURL: firebaseUser.photoURL || "",
          plan: "reader",
          createdAt: now,
          updatedAt: now,
        };
        await setDoc(userRef, newProfile);
        setProfile(newProfile);
      } else {
        const data = snap.data() as UserProfileData;
        const updated = {
          ...data,
          displayName: firebaseUser.displayName || data.displayName || "Desk Trader",
          photoURL: firebaseUser.photoURL || data.photoURL || "",
          updatedAt: now,
        };
        await setDoc(userRef, updated, { merge: true });
        setProfile(updated);
      }
    } catch (err) {
      console.warn("Could not sync user profile to Firestore:", err);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncProfile]);

  const signInWithGoogle = useCallback(async () => {
    try {
      const cred = await signInWithPopup(auth, googleAuthProvider);
      if (cred.user) {
        await syncProfile(cred.user);
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      throw error;
    }
  }, [syncProfile]);

  const signOutUser = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Sign-out error:", error);
      throw error;
    }
  }, []);

  const updateUserPlan = useCallback(async (newPlan: "reader" | "premium" | "institutional") => {
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        const now = new Date().toISOString();
        await setDoc(userRef, { plan: newPlan, updatedAt: now }, { merge: true });
        setProfile((prev) => (prev ? { ...prev, plan: newPlan, updatedAt: now } : null));
      } catch (err) {
        console.error("Failed to update user plan in Firestore:", err);
      }
    } else {
      // For guest demo mode, update local simulated profile
      setProfile((prev) => ({
        uid: "guest-user",
        email: "guest@nextwallstreet.com",
        displayName: "Guest Trader",
        plan: newPlan,
        updatedAt: new Date().toISOString(),
      }));
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithGoogle,
        signOutUser,
        updateUserPlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
