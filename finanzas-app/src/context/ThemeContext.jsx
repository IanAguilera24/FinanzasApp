// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "./AuthContext";
import { useUserProfile } from "../hooks/useUserProfile";
import { COLORES_DISPONIBLES, textoContrastante } from "../utils/colorUtils";

const ThemeContext = createContext(null);

function aplicarColorAlDocumento(colorId) {
  const color = COLORES_DISPONIBLES.find((c) => c.id === colorId) || COLORES_DISPONIBLES[0];
  const root = document.documentElement;
  root.style.setProperty("--color-primary", color.hex);
  root.style.setProperty("--color-primary-hover", color.hoverHex);
  root.style.setProperty("--color-primary-text", textoContrastante(color.hex));
}

function aplicarModoAlDocumento(modoOscuro) {
  document.documentElement.classList.toggle("dark", modoOscuro);
}

export function ThemeProvider({ children }) {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [colorId, setColorId] = useState("violeta");
  const [modoOscuro, setModoOscuro] = useState(false);

  // Cuando carga el perfil desde Firestore, sincroniza el estado local
  useEffect(() => {
    if (profile?.colorPrincipal) {
      setColorId(profile.colorPrincipal);
      aplicarColorAlDocumento(profile.colorPrincipal);
    }
    if (typeof profile?.modoOscuro === "boolean") {
      setModoOscuro(profile.modoOscuro);
      aplicarModoAlDocumento(profile.modoOscuro);
    }
  }, [profile]);

  async function cambiarColor(nuevoColorId) {
    setColorId(nuevoColorId);
    aplicarColorAlDocumento(nuevoColorId);
    if (user) {
      await updateDoc(doc(db, "users", user.uid), { colorPrincipal: nuevoColorId });
    }
  }

  async function cambiarModoOscuro(nuevoValor) {
    setModoOscuro(nuevoValor);
    aplicarModoAlDocumento(nuevoValor);
    if (user) {
      await updateDoc(doc(db, "users", user.uid), { modoOscuro: nuevoValor });
    }
  }

  return (
    <ThemeContext.Provider value={{ colorId, modoOscuro, cambiarColor, cambiarModoOscuro }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme debe usarse dentro de un ThemeProvider");
  return context;
}