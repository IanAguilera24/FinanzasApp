// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged se dispara automáticamente al cargar la app
    // y cada vez que cambia el estado de sesión (login/logout)
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Crea el documento users/{uid} la primera vez que alguien se registra
  // (tanto por email como por Google). Si ya existe, no lo sobreescribe.
  async function ensureUserDocument(firebaseUser) {
    const userRef = doc(db, "users", firebaseUser.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      await setDoc(userRef, {
        displayName: firebaseUser.displayName || firebaseUser.email.split("@")[0],
        email: firebaseUser.email,
        currency: "MXN",
        createdAt: serverTimestamp(),
        categories: [
          { id: "alimentacion", nombre: "Alimentación", icono: "🍔", color: "#FF6B6B" },
          { id: "transporte", nombre: "Transporte", icono: "🚗", color: "#4ECDC4" },
          { id: "ocio", nombre: "Ocio", icono: "🎮", color: "#FFD93D" },
          { id: "servicios", nombre: "Servicios", icono: "💡", color: "#6C5CE7" },
          { id: "salud", nombre: "Salud", icono: "🏥", color: "#00B894" },
          { id: "otros", nombre: "Otros", icono: "📦", color: "#95A5A6" },
        ],
      });
    }
  }

  async function registerWithEmail(email, password) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await ensureUserDocument(credential.user);
    return credential.user;
  }

  async function loginWithEmail(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    await ensureUserDocument(credential.user);
    return credential.user;
  }

  async function logout() {
    await signOut(auth);
  }

  const value = {
    user,
    loading,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}