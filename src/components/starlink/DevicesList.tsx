import { useState } from "react";

// 1. DEFINICIÓN DE TIPOS
interface Subscription {
  id: string;
  name: string;
  serviceLine: string;
  alerts: number;
  status: "active" | "ending" | "inactive";
  // Nuevo campo parametrizable para el mensaje del tooltip
  alertMessage?: string;
}

// 2. JSON DE DATOS (Parametrizable)
const SUBSCRIPTIONS_DATA: Subscription[] = [
  {
    id: "1",
    name: "Nombre de la suscripción",
    serviceLine: "SL-2152144-76226-67",
    alerts: 0,
    status: "active",
    // Sin mensaje, no mostrará tooltip
  },
  {
    id: "2",
    name: "Nombre de la suscripción",
    serviceLine: "SL-2152144-76226-67",
    alerts: 2,
    status: "active",
    alertMessage:
      "Conexión por cable débil. La velocidad de internet puede ser más lenta de lo esperado.",
  },
  {
    id: "3",
    name: "Nombre de la suscripción",
    serviceLine: "SL-2152144-76226-67",
    alerts: 0,
    status: "ending",
  },
  {
    id: "4",
    name: "Nombre de la suscripción",
    serviceLine: "SL-2152144-76226-67",
    alerts: 1,
    status: "active",
    alertMessage: "Dispositivo desconectado de la red eléctrica.",
  },
  {
    id: "5",
    name: "Nombre de la suscripción",
    serviceLine: "SL-2152144-76226-67",
    alerts: 0,
    status: "inactive",
  },
  {
    id: "6",
    name: "Nombre de la suscripción",
    serviceLine: "SL-2152144-76226-67",
    alerts: 0,
    status: "active",
  },
];

export default function DevicesList() {
  // Estado para controlar qué tooltip se muestra (por ID)
  const [hoveredAlertId, setHoveredAlertId] = useState<string | null>(null);

  // Helper para obtener estilos del badge según el estado
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "active":
        return {
          badge: "border-[var(--blanco-04)]",
          dot: "bg-[var(--estado-activo)] shadow-[0_0_8px_var(--estado-activo)]",
          text: "Activa",
        };
      case "ending":
        return {
          badge: "border-[var(--blanco-04)]",
          dot: "bg-[var(--estado-finalizando)] shadow-[0_0_8px_var(--estado-finalizando)]",
          text: "Finalizando",
        };
      case "inactive":
        return {
          badge: "border-[var(--blanco-04)]",
          dot: "bg-[var(--estado-inactivo)] shadow-[0_0_8px_var(--estado-inactivo)]",
          text: "Inactivo",
        };
      default:
        return { badge: "", dot: "", text: "" };
    }
  };

  return (
    <div className="overflow-x-auto pb-5 w-full">
      <table className="w-full border-separate border-spacing-y-[10px]">
        <thead>
          <tr>
            <th className="text-left text-[var(--blanco-08)] text-xs tracking-[2px] px-5 py-2.5 uppercase font-semibold">
              SUSCRIPCIÓN
            </th>
            <th className="text-left text-[var(--blanco-08)] text-xs tracking-[2px] px-5 py-2.5 uppercase font-semibold">
              LINEA DE SERVICIO
            </th>
            <th className="text-left text-[var(--blanco-08)] text-xs tracking-[2px] px-5 py-2.5 uppercase font-semibold">
              ALERTAS ACTIVAS
            </th>
            <th className="text-left text-[var(--blanco-08)] text-xs tracking-[2px] px-5 py-2.5 uppercase font-semibold">
              ESTADO
            </th>
            <th className="px-5 py-2.5"></th>
          </tr>
        </thead>
        <tbody>
          {SUBSCRIPTIONS_DATA.map((item) => {
            const statusStyle = getStatusStyles(item.status);

            return (
              <tr key={item.id} className="group">
                {/* COLUMNA 1: NOMBRE */}
                <td className="bg-[var(--azul-primario-06)] px-5 py-4 text-[var(--blanco-total)] text-sm border-y border-[var(--blanco-02)] first:rounded-l-[18px] first:border-l align-middle">
                  <a
                    href="/charts_page"
                    className="flex items-center gap-1 font-medium"
                  >
                    {item.name}
                  </a>
                </td>

                {/* COLUMNA 2: LINEA */}
                <td className="bg-[var(--azul-primario-06)] px-5 py-4 text-[var(--blanco-total)] text-sm border-y border-[var(--blanco-02)] align-middle">
                  <a href="/charts_page" className="flex items-center gap-1">
                    {item.serviceLine}
                  </a>
                </td>

                {/* COLUMNA 3: ALERTAS CON TOOLTIP */}
                <td className="bg-[var(--azul-primario-06)] px-5 py-4 text-[var(--blanco-total)] text-sm border-y border-[var(--blanco-02)] align-middle relative">
                  <div className="flex items-center gap-1.5 w-fit relative">
                    <span>{item.alerts}</span>

                    {/* Icono de Alerta */}
                    <div
                      className="relative inline-block"
                      onMouseEnter={() => setHoveredAlertId(item.id)}
                      onMouseLeave={() => setHoveredAlertId(null)}
                      onClick={() =>
                        setHoveredAlertId(
                          hoveredAlertId === item.id ? null : item.id
                        )
                      } // Soporte móvil
                    >
                      <img
                        src="/icons/Frame.svg"
                        alt="Alert"
                        className={`w-4 h-4 mb-0.5 cursor-pointer transition-transform duration-200 ${
                          item.alerts > 0
                            ? "opacity-100"
                            : "opacity-40 grayscale"
                        }`}
                      />

                      {/* TOOLTIP FLOTANTE */}
                      {hoveredAlertId === item.id && item.alertMessage && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 z-50 animate-in fade-in zoom-in-95 duration-200">
                          <div className="bg-[var(--azul-primario-08)] backdrop-blur-[4px] border border-white/20 p-3 rounded-lg shadow-2xl relative">
                            {/* Triángulo del tooltip */}
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[var(--azul-primario-08)] border-r border-b border-white/20 rotate-45 transform"></div>

                            <p className="text-xs text-white/90 leading-relaxed font-normal">
                              {item.alertMessage}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* COLUMNA 4: ESTADO (BADGES) */}
                <td className="bg-[var(--azul-primario-06)] px-5 py-4 text-[var(--blanco-total)] text-sm border-y border-[var(--blanco-02)] align-middle">
                  <a href="/charts_page">
                    <div
                      className={`inline-flex items-center justify-between gap-4 px-4 py-1.5 rounded-full border text-xs font-semibold w-full max-w-[140px] bg-white/[0.03] ${statusStyle.badge}`}
                    >
                      {statusStyle.text}
                      <span
                        className={`w-[18px] h-[6px] rounded-full inline-block ${statusStyle.dot}`}
                      ></span>
                    </div>
                  </a>
                </td>

                {/* COLUMNA 5: ACCIÓN */}
                <td className="bg-[var(--azul-primario-06)] px-2 py-4 text-[var(--blanco-total)] text-sm border-y border-[var(--blanco-02)] last:rounded-r-[18px] last:border-r align-middle text-right w-[80px]">
                  <a
                    href="/charts_page"
                    className="inline-block relative right-4"
                  >
                    <img
                      src="/icons/icon-circle-arrow-right.svg"
                      alt="Ir"
                      className="w-8 h-8 transition-transform duration-200 hover:translate-x-1 cursor-pointer"
                    />
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
