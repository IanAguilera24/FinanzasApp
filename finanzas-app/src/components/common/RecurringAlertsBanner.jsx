// src/components/common/RecurringAlertsbanner.jsx
import { useState } from "react";
import { Bell, RefreshCw, X, ChevronDown, ChevronUp } from "lucide-react";
import { useRecurringAlerts } from "../../hooks/useRecurringAlerts";
import { ConfirmModal } from "./ConfirmModal";

function etiquetaDias(dias) {
  if (dias < 0) return "Vencido";
  if (dias === 0) return "Vence hoy";
  if (dias === 1) return "Vence mañana";
  return `Vence en ${dias} días`;
}

function colorNivel(nivel) {
  if (nivel === "vencido") return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
  if (nivel === "urgente") return "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
  return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
}

function colorBadge(nivel) {
  if (nivel === "vencido") return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300";
  if (nivel === "urgente") return "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300";
  return "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300";
}

export function RecurringAlertsBanner() {
  const { alertas, renovar, cancelarRecurrencia, descartarHastaManana } = useRecurringAlerts();
  const [expandido, setExpandido] = useState(false);
  const [alertaAccion, setAlertaAccion] = useState(null);
  const [tipoAccion, setTipoAccion] = useState(null);
  const [procesando, setProcesando] = useState(false);

  if (alertas.length === 0) return null;

  function solicitarAccion(alerta, tipo) {
    setAlertaAccion(alerta);
    setTipoAccion(tipo);
  }

  async function confirmarAccion() {
    if (!alertaAccion) return;
    setProcesando(true);
    try {
      if (tipoAccion === "renovar") await renovar(alertaAccion);
      else if (tipoAccion === "cancelar") await cancelarRecurrencia(alertaAccion);
    } finally {
      setProcesando(false);
      setAlertaAccion(null);
      setTipoAccion(null);
    }
  }

  const textoModal = {
    renovar: {
      title: "¿Renovar por un año más?",
      message: `"${alertaAccion?.concepto}" seguirá marcado como recurrente por otro año. La nueva fecha de vencimiento será en 12 meses desde hoy.`,
      confirmLabel: "Renovar",
    },
    cancelar: {
      title: "¿Marcar como no recurrente?",
      message: `"${alertaAccion?.concepto}" dejará de estar marcado como recurrente. Seguirá en tu historial pero no generará más alertas.`,
      confirmLabel: "Sí, ya no es recurrente",
    },
  };

  const hayVencidos = alertas.some((a) => a.nivel === "vencido");
  const hayUrgentes = alertas.some((a) => a.nivel === "urgente");
  const colorGeneral = hayVencidos ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
    : hayUrgentes ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
    : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";

  const colorIcono = hayVencidos ? "text-red-600 dark:text-red-400"
    : hayUrgentes ? "text-amber-600 dark:text-amber-400"
    : "text-blue-600 dark:text-blue-400";

  return (
    <>
      <div className={`mx-4 mt-3 rounded-xl border ${colorGeneral} overflow-hidden`}>
        <button
          onClick={() => setExpandido(!expandido)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
        >
          <div className="flex items-center gap-2">
            <Bell size={18} className={colorIcono} />
            <span className={`font-semibold text-sm ${colorIcono}`}>
              {alertas.length === 1
                ? "1 pago recurrente requiere tu atención"
                : `${alertas.length} pagos recurrentes requieren tu atención`}
            </span>
          </div>
          {expandido ? <ChevronUp size={16} className={colorIcono} /> : <ChevronDown size={16} className={colorIcono} />}
        </button>

        {expandido && (
          <div className="border-t border-current border-opacity-10 divide-y divide-current divide-opacity-10">
            {alertas.map((alerta) => (
              <div key={`${alerta.tipo}-${alerta.id}`} className={`px-4 py-3 ${colorNivel(alerta.nivel)}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-gray-800 dark:text-slate-100 truncate">
                        {alerta.concepto}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorBadge(alerta.nivel)}`}>
                        {etiquetaDias(alerta.diasRestantes)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        alerta.tipo === "gasto"
                          ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300"
                          : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300"
                      }`}>
                        {alerta.tipo === "gasto" ? "Gasto" : "Ingreso"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                      ${alerta.monto.toLocaleString("es-MX")} · Inició{" "}
                      {alerta.fechaInicioRecurrencia
                        ? aFechaTexto(alerta.fechaInicioRecurrencia)
                        : "fecha desconocida"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-2 flex-wrap">
                  <button
                    onClick={() => solicitarAccion(alerta, "renovar")}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-current border-opacity-20 text-gray-700 dark:text-slate-200 hover:opacity-80 transition font-medium"
                  >
                    <RefreshCw size={12} />
                    Sigue activo (renovar)
                  </button>
                  <button
                    onClick={() => solicitarAccion(alerta, "cancelar")}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-current border-opacity-20 text-gray-700 dark:text-slate-200 hover:opacity-80 transition font-medium"
                  >
                    <X size={12} />
                    Ya no es recurrente
                  </button>
                  <button
                    onClick={() => descartarHastaManana(alerta)}
                    className="text-xs px-3 py-1.5 rounded-lg text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition"
                  >
                    Recordar mañana
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {alertaAccion && tipoAccion && textoModal[tipoAccion] && (
        <ConfirmModal
          open={true}
          title={textoModal[tipoAccion].title}
          message={textoModal[tipoAccion].message}
          confirmLabel={procesando ? "Procesando..." : textoModal[tipoAccion].confirmLabel}
          onConfirm={confirmarAccion}
          onCancel={() => { setAlertaAccion(null); setTipoAccion(null); }}
          variant="default"
        />
      )}
    </>
  );
}

function aFechaTexto(timestamp) {
  const fecha = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return fecha.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
}