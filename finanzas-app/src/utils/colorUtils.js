// src/utils/colorUtils.js

// Paleta de colores principales disponibles para elegir
export const COLORES_DISPONIBLES = [
  { id: "violeta", label: "Violeta", hex: "#7c3aed", hoverHex: "#6d28d9" },
  { id: "azul", label: "Azul", hex: "#2563eb", hoverHex: "#1d4ed8" },
  { id: "rosa", label: "Rosa", hex: "#db2777", hoverHex: "#be185d" },
  { id: "naranja", label: "Naranja", hex: "#ea580c", hoverHex: "#c2410c" },
  { id: "cian", label: "Cian", hex: "#0891b2", hoverHex: "#0e7490" },
  { id: "indigo", label: "Índigo", hex: "#4f46e5", hoverHex: "#4338ca" },
  { id: "grafito", label: "Grafito", hex: "#334155", hoverHex: "#1e293b" },
];

// Convierte hex a RGB
function hexARgb(hex) {
  const limpio = hex.replace("#", "");
  const r = parseInt(limpio.substring(0, 2), 16);
  const g = parseInt(limpio.substring(2, 4), 16);
  const b = parseInt(limpio.substring(4, 6), 16);
  return { r, g, b };
}

// Calcula luminancia relativa (fórmula WCAG)
function luminanciaRelativa({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    const c = val / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calcula ratio de contraste WCAG entre dos colores hex (1 a 21)
export function calcularContraste(hex1, hex2) {
  const lum1 = luminanciaRelativa(hexARgb(hex1));
  const lum2 = luminanciaRelativa(hexARgb(hex2));
  const claro = Math.max(lum1, lum2);
  const oscuro = Math.min(lum1, lum2);
  return (claro + 0.05) / (oscuro + 0.05);
}

// Decide si el texto sobre un color de fondo debe ser blanco o negro
export function textoContrastante(hexFondo) {
  const contrasteConBlanco = calcularContraste(hexFondo, "#ffffff");
  const contrasteConNegro = calcularContraste(hexFondo, "#000000");
  return contrasteConBlanco >= contrasteConNegro ? "#ffffff" : "#1f2937";
}

// WCAG AA para texto normal requiere contraste >= 4.5
export function cumpleContrasteMinimo(hexFondo, hexTexto = "#ffffff") {
  return calcularContraste(hexFondo, hexTexto) >= 4.5;
}