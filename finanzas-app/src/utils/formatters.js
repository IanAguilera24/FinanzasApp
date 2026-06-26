// src/utils/formatters.js
export function formatMoneda(monto) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(monto);
}

export function formatFecha(fecha) {
  const fechaObj = fecha?.toDate ? fecha.toDate() : new Date(fecha);
  return fechaObj.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function fechaParaInput(fecha) {
  // Convierte timestamp de Firestore a "YYYY-MM-DD" para <input type="date">
  const fechaObj = fecha?.toDate ? fecha.toDate() : new Date(fecha);
  const anio = fechaObj.getFullYear();
  const mes = String(fechaObj.getMonth() + 1).padStart(2, "0");
  const dia = String(fechaObj.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}