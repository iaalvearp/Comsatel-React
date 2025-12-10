import { useState, useEffect, useMemo } from "react";
import UsageBarChart from "./UsageBarChart";

export default function SubscriptionSection() {
  const [isOpen, setIsOpen] = useState(false);

  // 1. ESTADO ACTUALIZADO CON DATOS PARA EL MODAL
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "Alerta 001 - 000",
      modalTitle:
        "Conexión por cable débil. La velocidad de internet puede ser más lenta de lo esperado.",
      modalText:
        "La autonegociación del enlace Ethernet se estableció en 100 MB/s. La autonegociación del dispositivo Starlink debe establecerse en 1000 MB/s. Puede haber un problema con el cable o la conexión.",
    },
    {
      id: 2,
      text: "Alerta 002 - 000 - 000",
      modalTitle: "Actualización disponible",
      modalText:
        "Hay una nueva versión de firmware disponible para su dispositivo. Se recomienda instalarla para mejorar la estabilidad de la conexión.",
    },
  ]);

  // Estado para controlar qué Alerta se está viendo
  const [selectedNote, setSelectedNote] = useState<any>(null);

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Estado de consumo general
  const [consumption, setConsumption] = useState({ current: 0, total: 50 });

  // 1. Estado para el filtro de meses
  const [activeMonth, setActiveMonth] = useState("OCT-NOV");
  const months = ["ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT-NOV"];

  // 2. Generar datos DIARIOS simulados según el mes seleccionado
  const chartData = useMemo(() => {
    // Si es "OCT-NOV", usaremos "OCT" como prefijo, si no, el nombre del mes
    const prefix = activeMonth === "OCT-NOV" ? "OCT" : activeMonth;

    // Simulamos 30 días de datos
    return Array.from({ length: 30 }, (_, i) => ({
      date: `${prefix} ${i + 1}`, // Genera "OCT 1", "OCT 2"...
      usage: Math.random() * 8 + 1, // Valor random entre 1 y 9
    }));
  }, [activeMonth]);

  // Simulación de carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setConsumption({ current: 9.3, total: 50 });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const percentage = Math.min(
    (consumption.current / consumption.total) * 100,
    100
  );

  return (
    <div className="w-full border-none bg-none rounded-xl grid gap-2 overflow-hidden mb-4">
      {/* CABECERA DEL ACORDEÓN */}
      <div className="flex items-center justify-between bg-[var(--azul-noche-10)] sm:w-[380px] px-3 sm:px-6 py-2 sm:py-4 border border-[var(--blanco-04)] rounded-xl gap-2">
        <div className="flex flex-wrap items-baseline gap-2">
          <h2 className="text-xl font-light tracking-wide text-white">
            Suscripción
          </h2>
          <code className="text-xs rounded text-[--cyan-neon] font-mono block">
            SL-2152144-76226-67
          </code>
        </div>
        <img
          src="/icons/icon-arrow-down.svg"
          className={`text-white h-6 w-4 transition-transform duration-300 cursor-pointer ${
            isOpen ? "rotate-180" : ""
          }`}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {/* CONTENIDO DEL ACORDEÓN */}
      {isOpen && (
        <div className="p-4 animate-in slide-in-from-top-4 duration-300 rounded-xl border border-[var(--blanco-04)] text-[var(--blanco-08)]">
          {/* Detalles del plan (Texto estático) */}
          <div className="flex flex-col-reverse sm:flex-row justify-center sm:justify-between gap-2 sm:gap-0">
            <div className="text-center sm:text-left p-2 bg-[var(--azul-noche-04)] sm:bg-transparent rounded-lg">
              <label className="text-xs uppercase tracking-widest text-[var(--blanco-08)] font-semibold">
                APODO
              </label>
              <div className="text-[--cyan-neon] text-xs">
                Don antonio logisinsa - pg 50 gb
              </div>
            </div>
            <div className="text-center sm:text-right gap-2">
              <label className="text-[var(--blanco-08)] text-xs tracking-widest uppercase font-semibold">
                Alertas
              </label>

              {/* LISTA DE NOTIFICACIONES */}
              <div className="flex flex-col items-center sm:items-end gap-1">
                {notifications.length > 0 ? (
                  notifications.map((note) => (
                    <div
                      key={note.id}
                      className="text-xs flex justify-center min-[940px]:justify-end gap-2 items-center animate-in fade-in zoom-in duration-300"
                    >
                      {/* CAMBIO: Ahora es un botón/span que abre el modal */}
                      <span
                        onClick={() => setSelectedNote(note)}
                        className="cursor-pointer hover:text-[var(--cyan-neon)] transition-colors underline decoration-dotted underline-offset-4"
                      >
                        {note.text}
                      </span>

                      <img
                        className="cursor-pointer font-semibold h-3 hover:scale-110 transition-transform"
                        src="/icons/icon-red-x.svg"
                        alt="Cerrar"
                        onClick={() => removeNotification(note.id)}
                      />
                    </div>
                  ))
                ) : (
                  <span className="text-[10px] text-[var(--blanco-04)] italic">
                    Sin notificaciones nuevas
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div className="w-full flex flex-col sm:flex-row gap-1 sm:gap-3 sm:justify-between col-span-2">
              <div className="w-full sm:w-1/2 flex flex-col gap-1 p-2 bg-[var(--azul-noche-04)] rounded-lg">
                <div className="w-full flex items-center justify-center sm:justify-start gap-1">
                  <p className="text-xs uppercase tracking-widest text-[var(--blanco-08)] font-semibold">
                    Plan de Servicio
                  </p>
                  <span className="text-[var(--estado-activo)] text-xs">
                    Activo
                  </span>
                  <img
                    className="h-4 w-4 text-[var(--estado-activo)] mb-[2px]"
                    src="/icons/icon-like.svg"
                    alt="Activo"
                  />
                </div>
                <div className="w-full flex items-center justify-center sm:justify-start gap-1">
                  <span className="text-[--cyan-neon] text-xs">
                    Suscripción de prioridad global
                  </span>
                </div>
              </div>

              <div className="w-full sm:w-1/2 flex flex-col items-center justify-center sm:items-start gap-[2px] p-2 bg-[var(--azul-noche-04)] rounded-lg">
                <p className="text-xs uppercase tracking-widest text-[var(--blanco-08)] font-semibold">
                  Política de IP
                </p>
                <span className="text-[var(--cyan-neon)] text-xs">
                  IP pública
                </span>
              </div>
            </div>

            <div className="col-span-2">
              <h3 className="text-xs uppercase tracking-widest text-[var(--blanco-08)] font-semibold mt-3 mb-2">
                Datos
              </h3>
              <div className="bg-[var(--azul-noche-04)] p-2 sm:p-4 rounded-lg flex flex-col">
                <div className="text-xs flex flex-wrap justify-center sm:flex-nowrap sm:justify-start gap-2 uppercase tracking-widest text-[var(--blanco-08)] font-semibold mb-1">
                  Uso de Datos Mensuales
                  <p className="text-[11px] text-right text-[--cyan-neon]">
                    {/* Usamos el estado para mostrar los números */}
                    <span id="consumido">{consumption.current}</span> GB /{" "}
                    <span id="total-plan">{consumption.total}</span> GB
                  </p>
                </div>

                {/* BARRA DE PROGRESO DINÁMICA */}
                <div className="w-full bg-[var(--azul-acero-10)] rounded-full h-2 mt-1">
                  <div
                    id="consumo-bar"
                    // Eliminado w-[20%], agregada transición y style dinámico
                    className="bg-[--cyan-neon] h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* --- AQUÍ INICIA LA GRÁFICA --- */}
          <div className="mt-4 bg-[var(--azul-noche-04)] border border-[var(--blanco-04)] rounded-lg p-2 sm:p-4">
            {/* Header del Gráfico con Filtros */}
            <div className="mb-4">
              <h3 className="text-xs uppercase tracking-widest text-[var(--blanco-08)] flex gap-2 font-semibold mb-4">
                Uso Total de Datos{" "}
                <span className="text-[11px] text-[--cyan-neon]">
                  {consumption.current} GB
                </span>
              </h3>

              {/* FILTRO DE MESES */}
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {months.map((month) => (
                  <button
                    key={month}
                    onClick={() => setActiveMonth(month)}
                    className={`text-[10px] font-bold tracking-wider transition-colors uppercase whitespace-nowrap cursor-pointer ${
                      activeMonth === month
                        ? "text-white border-b border-white" // Opcional: subrayado
                        : "text-[var(--blanco-04)] hover:text-[var(--blanco-06)]"
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>

            {/* Usamos el NUEVO componente aquí */}
            <UsageBarChart
              data={chartData}
              dataKey="usage"
              xAxisKey="date"
              unit="GB"
            />
          </div>

          {/* Información Adicional de la Suscripción */}
          <div className="mt-3 flex justify-start border border-[var(--blanco-04)] rounded-lg p-2 sm:p-4 gap-14 pt-5">
            <div className="flex flex-col gap-2">
              <span className="text-xs sm:text-sm font-semibold mb-1 text-[--cyan-neon]">
                Prioridad Global
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-sm sm:text-base font-semibold text-[var(--blanco-08)]">
                  9.3 GB
                </span>{" "}
                <span className="text-[11px] sm:text-xs text-[var(--blanco-06)]">
                  50 GB recurrentes
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm sm:text-base font-semibold text-[var(--blanco-08)]">
                  0 GB
                </span>{" "}
                <span className="text-[11px] sm:text-xs text-[var(--blanco-06)]">
                  Recarga de 0 GB
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs sm:text-sm font-semibold mb-1 text-[--cyan-neon]">
                Otros
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-sm sm:text-base font-semibold text-[var(--blanco-08)]">
                  0 GB
                </span>{" "}
                <span className="text-[11px] sm:text-xs text-[var(--blanco-06)]">
                  Ilimitada
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MODAL DE Alerta (CORREGIDO: DENTRO DEL RETURN) */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--blanco-004)] backdrop-blur-sm animate-in fade-in duration-300">
          {/* Contenedor del Modal */}
          <div className="w-full max-w-lg bg-[var(--azul-primario-08)] backdrop-blur-sm border border-[var(--blanco-04)] rounded-[12px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 space-y-4">
              {/* Título */}
              <h3 className="text-lg font-semibold text-[var(--blanco-total)] leading-tight">
                {selectedNote.modalTitle}
              </h3>

              {/* Texto */}
              <p className="text-sm text-[var(--blanco-08)] leading-relaxed">
                {selectedNote.modalText}
              </p>
            </div>

            {/* Footer con Botones */}
            <div className="flex justify-end gap-3 p-4 bg-[var(--azul-noche-04)]/50 border-t border-[var(--blanco-02)]">
              <button
                onClick={() => setSelectedNote(null)}
                className="px-4 py-2 text-sm font-medium text-[var(--blanco-total)] border border-[var(--blanco-02)] rounded-lg hover:bg-[var(--blanco-006)] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setSelectedNote(null)}
                className="px-4 py-2 text-sm font-medium text-black bg-white rounded-lg hover:bg-gray-200 transition-colors"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
