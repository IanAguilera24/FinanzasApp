// src/utils/dateHelpers.js
export function fechaLocalISO(date = new Date()) {
  const anio = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

export function parsearFechaLocal(fechaString) {
  const [anio, mes, dia] = fechaString.split("-").map(Number);
  return new Date(anio, mes - 1, dia, 0, 0, 0);
}

const PERIODOS_EN_MESES = {
  semanal: null, // se maneja distinto (por días, no meses)
  quincenal: null,
  mensual: 1,
  trimestral: 3,
  semestral: 6,
  anual: 12,
};

function inicioDeSemana(date) {
  // Semana empieza en lunes
  const d = new Date(date);
  const dia = d.getDay(); // 0 = domingo
  const diff = dia === 0 ? -6 : 1 - dia;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function inicioDeQuincena(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate() <= 15 ? 1 : 16);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getRangoPeriodo(periodo, fechaReferencia) {
  const ref = new Date(fechaReferencia);
  let inicio, fin;

  switch (periodo) {
    case "semanal": {
      inicio = inicioDeSemana(ref);
      fin = new Date(inicio);
      fin.setDate(fin.getDate() + 6);
      break;
    }
    case "quincenal": {
      inicio = inicioDeQuincena(ref);
      if (inicio.getDate() === 1) {
        fin = new Date(inicio.getFullYear(), inicio.getMonth(), 15);
      } else {
        fin = new Date(inicio.getFullYear(), inicio.getMonth() + 1, 0); // último día del mes
      }
      break;
    }
    case "mensual": {
      inicio = new Date(ref.getFullYear(), ref.getMonth(), 1);
      fin = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
      break;
    }
    case "trimestral": {
      const trimestreInicio = Math.floor(ref.getMonth() / 3) * 3;
      inicio = new Date(ref.getFullYear(), trimestreInicio, 1);
      fin = new Date(ref.getFullYear(), trimestreInicio + 3, 0);
      break;
    }
    case "semestral": {
      const semestreInicio = ref.getMonth() < 6 ? 0 : 6;
      inicio = new Date(ref.getFullYear(), semestreInicio, 1);
      fin = new Date(ref.getFullYear(), semestreInicio + 6, 0);
      break;
    }
    case "anual": {
      inicio = new Date(ref.getFullYear(), 0, 1);
      fin = new Date(ref.getFullYear(), 11, 31);
      break;
    }
    default:
      throw new Error(`Periodo desconocido: ${periodo}`);
  }

  fin.setHours(23, 59, 59, 999);
  return { inicio, fin };
}

// Mueve la fecha de referencia al periodo anterior o siguiente
export function navegarPeriodo(periodo, fechaReferencia, direccion) {
  // direccion: 1 (siguiente) o -1 (anterior)
  const ref = new Date(fechaReferencia);

  switch (periodo) {
    case "semanal":
      ref.setDate(ref.getDate() + 7 * direccion);
      break;
    case "quincenal":
      ref.setDate(ref.getDate() + 15 * direccion);
      break;
    case "mensual":
      ref.setMonth(ref.getMonth() + direccion);
      break;
    case "trimestral":
      ref.setMonth(ref.getMonth() + 3 * direccion);
      break;
    case "semestral":
      ref.setMonth(ref.getMonth() + 6 * direccion);
      break;
    case "anual":
      ref.setFullYear(ref.getFullYear() + direccion);
      break;
  }
  return ref;
}

// Etiqueta legible para mostrar en el selector ("Junio 2026", "Semana del 23-29 jun", etc.)
export function etiquetaPeriodo(periodo, fechaReferencia) {
  const { inicio, fin } = getRangoPeriodo(periodo, fechaReferencia);
  const opcionesMes = { month: "short", day: "numeric" };

  switch (periodo) {
    case "semanal":
    case "quincenal":
      return `${inicio.toLocaleDateString("es-MX", opcionesMes)} – ${fin.toLocaleDateString("es-MX", opcionesMes)}`;
    case "mensual":
      return inicio.toLocaleDateString("es-MX", { month: "long", year: "numeric" });
    case "trimestral": {
      const trimestreNum = Math.floor(inicio.getMonth() / 3) + 1;
      return `T${trimestreNum} ${inicio.getFullYear()}`;
    }
    case "semestral": {
      const semestreNum = inicio.getMonth() < 6 ? 1 : 2;
      return `Semestre ${semestreNum} ${inicio.getFullYear()}`;
    }
    case "anual":
      return `${inicio.getFullYear()}`;
    default:
      return "";
  }
}