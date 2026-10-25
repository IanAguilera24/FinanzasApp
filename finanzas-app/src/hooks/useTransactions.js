// src/hooks/useTransactions.js
import { useMemo } from "react";
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { useFirestoreQuery } from "./useFirestoreQuery";
import { parsearFechaLocal } from "../utils/dateHelpers";

export function useTransactions() {
  const { user } = useAuth();

  const transactionsQuery = useMemo(() => {
    if (!user) return null;
    const ref = collection(db, "users", user.uid, "transactions");
    return query(ref, orderBy("fecha", "desc"));
  }, [user]);

  const { data, loading, error } = useFirestoreQuery(transactionsQuery);

  async function addExpense({ concepto, monto, metodoPago, lugar, fecha, categoria, notas, recurrente }) {
    if (!user) throw new Error("No hay usuario autenticado");
    const fechaObj = parsearFechaLocal(fecha);
    const ref = collection(db, "users", user.uid, "transactions");

    const ahora = new Date();
    const vencimiento = recurrente
      ? new Date(ahora.getFullYear() + 1, ahora.getMonth(), ahora.getDate())
      : null;

    await addDoc(ref, {
      concepto,
      monto: Number(monto),
      metodoPago,
      lugar,
      categoria,
      fecha: fechaObj,
      fechaCreacion: serverTimestamp(),
      anio: fechaObj.getFullYear(),
      mes: fechaObj.getMonth() + 1,
      diaSemana: fechaObj.getDay(),
      origen: "manual",
      autollenado: false,
      imagenTicketUrl: null,
      datosOCRConfianza: null,
      notas: notas || "",
      recurrente: Boolean(recurrente),
      fechaInicioRecurrencia: recurrente ? ahora : null,
      fechaVencimientoRecurrencia: vencimiento,
      estadoRecurrencia: recurrente ? "activo" : null,
      alertaDescartadaHasta: null,
    });
  }

  async function updateExpense(transactionId, updates) {
    if (!user) throw new Error("No hay usuario autenticado");
    const ref = doc(db, "users", user.uid, "transactions", transactionId);

    if (updates.fecha) {
      const fechaObj = parsearFechaLocal(updates.fecha);
      updates = {
        ...updates,
        fecha: fechaObj,
        anio: fechaObj.getFullYear(),
        mes: fechaObj.getMonth() + 1,
        diaSemana: fechaObj.getDay(),
      };
    }
    if (updates.monto !== undefined) updates.monto = Number(updates.monto);
    await updateDoc(ref, updates);
  }

  async function deleteExpense(transactionId) {
    if (!user) throw new Error("No hay usuario autenticado");
    const ref = doc(db, "users", user.uid, "transactions", transactionId);
    await deleteDoc(ref);
  }

  return { transactions: data, loading, error, addExpense, updateExpense, deleteExpense };
}