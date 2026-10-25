// src/utils/msiUtils.js

function aFecha(timestamp) {
  return timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
}

/**
 * Dado un gasto MSI y un rango de fechas,
 * devuelve el monto que corresponde a ese rango.
 * Si el rango cubre N meses de la deuda, devuelve N * msiMontoPorMes.
 */
export function montoMSIEnRango(gasto, inicio, fin) {
  if (!gasto.msi) return gasto.monto;

  const msiInicio = aFecha(gasto.msiFechaInicio);
  const msiFin = aFecha(gasto.msiFechaFin);

  let mesesEnRango = 0;

  // Recorre mes a mes dentro del rango de la deuda MSI
  const cursor = new Date(msiInicio.getFullYear(), msiInicio.getMonth(), 1);
  const finDeuda = new Date(msiFin.getFullYear(), msiFin.getMonth(), 1);
  const inicioRango = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
  const finRango = new Date(fin.getFullYear(), fin.getMonth(), 1);

  while (cursor <= finDeuda) {
    if (cursor >= inicioRango && cursor <= finRango) {
      mesesEnRango++;
    }
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return mesesEnRango * gasto.msiMontoPorMes;
}

/**
 * Para el comparativo mensual:
 * dado un gasto MSI y un mes específico (anio, mes),
 * devuelve msiMontoPorMes si ese mes está dentro de la deuda, o 0 si no.
 */
export function montoMSIEnMes(gasto, anio, mes) {
  if (!gasto.msi) return gasto.monto;

  const msiInicio = aFecha(gasto.msiFechaInicio);
  const msiFin = aFecha(gasto.msiFechaFin);

  const inicioMes = new Date(anio, mes - 1, 1);
  const inicioDeuda = new Date(msiInicio.getFullYear(), msiInicio.getMonth(), 1);
  const finDeuda = new Date(msiFin.getFullYear(), msiFin.getMonth(), 1);

  if (inicioMes >= inicioDeuda && inicioMes <= finDeuda) {
    return gasto.msiMontoPorMes;
  }
  return 0;
}

/**
 * Cuántos meses quedan de la deuda desde hoy.
 */
export function mesesRestantesMSI(gasto) {
  if (!gasto.msi) return 0;
  const hoy = new Date();
  const msiFin = aFecha(gasto.msiFechaFin);
  const diff = (msiFin.getFullYear() - hoy.getFullYear()) * 12
    + (msiFin.getMonth() - hoy.getMonth());
  return Math.max(0, diff);
}

/**
 * Cuánto queda por pagar de la deuda MSI desde hoy.
 */
export function montoRestanteMSI(gasto) {
  return mesesRestantesMSI(gasto) * gasto.msiMontoPorMes;
}