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
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
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

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithGoogle,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
