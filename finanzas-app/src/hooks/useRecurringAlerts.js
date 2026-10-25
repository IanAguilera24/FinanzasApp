// src/hooks/useRecurringAlerts.js
import { useMemo } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "./useAuth";
import { useTransactions } from "./useTransactions";
import { useIncomes } from "./useIncomes";

function aFecha(timestamp) {
  return timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
}

function diasHasta(fecha) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const objetivo = new Date(fecha);
  objetivo.setHours(0, 0, 0, 0);
  return Math.round((objetivo - hoy) / (1000 * 60 * 60 * 24));
}

function calcularNivelAlerta(registro) {
  if (!registro.recurrente || registro.estadoRecurrencia === "cancelado") return null;
  if (!registro.fechaVencimientoRecurrencia) return null;

  const hoy = new Date();

  // Si tiene alertaDescartadaHasta y todavía no pasó, no mostrar
  if (registro.alertaDescartadaHasta) {
    const descartadaHasta = aFecha(registro.alertaDescartadaHasta);
    if (hoy < descartadaHasta) return null;
  }

  const dias = diasHasta(aFecha(registro.fechaVencimientoRecurrencia));

  if (dias < 0) return "vencido";
  if (dias <= 7) return "urgente";
  if (dias <= 30) return "proximo";
  return null;
}

export function useRecurringAlerts() {
  const { user } = useAuth();
  const { transactions, updateExpense } = useTransactions();
  const { incomes, updateIncome } = useIncomes();

  const alertas = useMemo(() => {
    const todas = [];

    transactions.forEach((t) => {
      const nivel = calcularNivelAlerta(t);
      if (nivel) {
        todas.push({
          ...t,
          tipo: "gasto",
          nivel,
          diasRestantes: diasHasta(aFecha(t.fechaVencimientoRecurrencia)),
        });
      }
    });

    incomes.forEach((i) => {
      const nivel = calcularNivelAlerta(i);
      if (nivel) {
        todas.push({
          ...i,
          tipo: "ingreso",
          nivel,
          diasRestantes: diasHasta(aFecha(i.fechaVencimientoRecurrencia)),
        });
      }
    });

    // Ordena: vencidos primero, luego urgentes, luego próximos
    return todas.sort((a, b) => a.diasRestantes - b.diasRestantes);
  }, [transactions, incomes]);

  async function renovar(alerta) {
    const nuevaFechaVencimiento = new Date();
    nuevaFechaVencimiento.setFullYear(nuevaFechaVencimiento.getFullYear() + 1);

    const updates = {
      estadoRecurrencia: "activo",
      fechaInicioRecurrencia: new Date(),
      fechaVencimientoRecurrencia: nuevaFechaVencimiento,
      alertaDescartadaHasta: null,
    };

    if (alerta.tipo === "gasto") await updateExpense(alerta.id, updates);
    else await updateIncome(alerta.id, updates);
  }

  async function cancelarRecurrencia(alerta) {
    const updates = {
      recurrente: false,
      estadoRecurrencia: "cancelado",
      alertaDescartadaHasta: null,
    };

    if (alerta.tipo === "gasto") await updateExpense(alerta.id, updates);
    else await updateIncome(alerta.id, updates);
  }

  async function descartarHastaManana(alerta) {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    manana.setHours(0, 0, 0, 0);

    const updates = { alertaDescartadaHasta: manana };

    if (alerta.tipo === "gasto") await updateExpense(alerta.id, updates);
    else await updateIncome(alerta.id, updates);
  }

  return { alertas, renovar, cancelarRecurrencia, descartarHastaManana };
}