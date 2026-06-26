// src/hooks/useIncomes.js
import { useMemo } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { useFirestoreQuery } from "./useFirestoreQuery";
import { parsearFechaLocal } from "../utils/dateHelpers";

export function useIncomes() {
  const { user } = useAuth();

  const incomesQuery = useMemo(() => {
    if (!user) return null;
    const ref = collection(db, "users", user.uid, "incomes");
    return query(ref, orderBy("fecha", "desc"));
  }, [user]);

  const { data, loading, error } = useFirestoreQuery(incomesQuery);

  async function addIncome({ concepto, monto, fuente, fecha, recurrente, notas }) {
    if (!user) throw new Error("No hay usuario autenticado");

    const fechaObj = parsearFechaLocal(fecha);
    const ref = collection(db, "users", user.uid, "incomes");

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
    });
  }

  async function updateIncome(incomeId, updates) {
    if (!user) throw new Error("No hay usuario autenticado");
    const ref = doc(db, "users", user.uid, "incomes", incomeId);

    if (updates.fecha) {
      const fechaObj = parsearFechaLocal(updates.fecha);
      updates = {
        ...updates,
        fecha: fechaObj,
        anio: fechaObj.getFullYear(),
        mes: fechaObj.getMonth() + 1,
      };
    }
    if (updates.monto !== undefined) {
      updates.monto = Number(updates.monto);
    }

    await updateDoc(ref, updates);
  }

  async function deleteIncome(incomeId) {
    if (!user) throw new Error("No hay usuario autenticado");
    const ref = doc(db, "users", user.uid, "incomes", incomeId);
    await deleteDoc(ref);
  }

  return {
    incomes: data,
    loading,
    error,
    addIncome,
    updateIncome,
    deleteIncome,
  };
}