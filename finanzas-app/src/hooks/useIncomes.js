async function addIncome({ concepto, monto, fuente, fecha, recurrente, notas }) {
  if (!user) throw new Error("No hay usuario autenticado");
  const fechaObj = parsearFechaLocal(fecha);
  const ref = collection(db, "users", user.uid, "incomes");

  const ahora = new Date();
  const vencimiento = recurrente
    ? new Date(ahora.getFullYear() + 1, ahora.getMonth(), ahora.getDate())
    : null;

  await addDoc(ref, {
    concepto,
    monto: Number(monto),
    fuente,
    fecha: fechaObj,
    fechaCreacion: serverTimestamp(),
    anio: fechaObj.getFullYear(),
    mes: fechaObj.getMonth() + 1,
    recurrente: Boolean(recurrente),
    notas: notas || "",
    fechaInicioRecurrencia: recurrente ? ahora : null,
    fechaVencimientoRecurrencia: vencimiento,
    estadoRecurrencia: recurrente ? "activo" : null,
    alertaDescartadaHasta: null,
  });
}