import { useState } from "react";
import ChartBase from "./ChartBase";

interface DeviceProps {
  title: string;
  deviceId: string;
}

// 1. JSON CON LA INFORMACIÓN DE LOS DISPOSITIVOS
const DEVICES_DATA: Record<string, any> = {
  KITP3340: {
    starlinkId: "0100000000-0000000-0008398 HYB",
    numeroSerie: "HPUNE0000000323443",
    versionSoftware: "2023.10.02.mr64789",
    numeroKit: "KITP00222979",
    tiempoActividad: "8 hours 20 minutes 37 seconds",
    ultimaActualizacion: "10/14/2025, 11:07:57 AM",
    ipsPublicas: [
      "149.19.163.252",
      "2803:9810:5367:2800::/56",
      "2803:9810:5367:2800::/54",
    ],
  },
  KITP2120: {
    starlinkId: "0200000000-0000000-0009999 ADV",
    numeroSerie: "HPUNE0000000998877",
    versionSoftware: "2023.11.05.mr77889",
    numeroKit: "KITP00111222",
    tiempoActividad: "12 days 4 hours 10 minutes",
    ultimaActualizacion: "10/15/2025, 09:30:00 AM",
    ipsPublicas: ["192.168.1.100", "2803:cafe:beef:1100::/64"],
  },
};

// Generamos datos aleatorios para simular latencia
const generateData = () =>
  Array.from({ length: 50 }, (_, i) => ({
    time: `${10 + Math.floor(i / 60)}:${(i % 60).toString().padStart(2, "0")}`,
    latency: Math.floor(Math.random() * 40) + 20,
    download: Math.floor(Math.random() * 200) + 50,
  }));

export default function DeviceSection({ title, deviceId }: DeviceProps) {
  const [isOpen, setIsOpen] = useState(false);

  // --- NUEVO ESTADO PARA EL FILTRO DE TIEMPO ---
  const [timeRange, setTimeRange] = useState("15 minutos");
  const timeOptions = ["15 minutos", "3 horas", "1 día", "7 días", "30 días"];

  const data = generateData(); // En una app real, usarías 'timeRange' para filtrar estos datos

  // Obtener info del dispositivo
  const info = DEVICES_DATA[deviceId] || {
    starlinkId: "N/A",
    numeroSerie: "N/A",
    versionSoftware: "N/A",
    numeroKit: "N/A",
    tiempoActividad: "N/A",
    ultimaActualizacion: "N/A",
    ipsPublicas: [],
  };

  return (
    <div className="flex flex-col gap-3 overflow-hidden mb-4">
      {/* CABECERA */}
      <div className="flex items-center justify-between bg-[var(--azul-noche-10)] sm:w-[380px] px-3 sm:px-6 py-2 sm:py-4 border border-[var(--blanco-04)] rounded-xl gap-2">
        <div className="flex items-baseline gap-2">
          <h2 className="text-xl font-light tracking-wide text-[var(--blanco-total)]">
            {title}
          </h2>
          <span className="text-xs rounded text-[var(--cyan-neon)] font-mono block">
            {deviceId}
          </span>
        </div>
        <img
          src="/icons/icon-arrow-down.svg"
          className={`text-white h-6 w-4 transition-transform duration-300 cursor-pointer ${
            isOpen ? "rotate-180" : ""
          }`}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {/* CONTENIDO */}
      {isOpen && (
        <div className="animate-in slide-in-from-top-4 duration-300">
          {/* Información Técnica */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] sm:grid-cols-2 gap-4 mb-4 rounded-xl border border-[var(--blanco-04)] text-[var(--blanco-08)] p-4">
            <div>
              <label className="block text-[var(--blanco-06)] text-[11px] tracking-wide mb-1">
                STARLINK
              </label>
              <div className="text-[var(--blanco-total)] text-sm font-semibold">
                {info.starlinkId}
              </div>
            </div>
            <div>
              <label className="block text-[var(--blanco-06)] text-[11px] tracking-wide mb-1">
                NÚMERO DE SERIE
              </label>
              <div className="text-[var(--blanco-total)] text-sm font-semibold">
                {info.numeroSerie}
              </div>
            </div>
            <div>
              <label className="block text-[var(--blanco-06)] text-[11px] tracking-wide mb-1">
                VERSIÓN DEL SOFTWARE
              </label>
              <div className="text-[var(--blanco-total)] text-sm font-semibold">
                {info.versionSoftware}
              </div>
            </div>
            <div>
              <label className="block text-[var(--blanco-06)] text-[11px] tracking-wide mb-1">
                NÚMERO DE KIT
              </label>
              <div className="text-[var(--blanco-total)] text-sm font-semibold">
                {info.numeroKit}
              </div>
            </div>
            <div>
              <label className="block text-[var(--blanco-06)] text-[11px] tracking-wide mb-1">
                TIEMPO DE ACTIVIDAD
              </label>
              <div className="text-[var(--blanco-total)] text-sm font-semibold">
                {info.tiempoActividad}
              </div>
            </div>
            <div>
              <label className="block text-[var(--blanco-06)] text-[11px] tracking-wide mb-1">
                ÚLTIMA ACTUALIZACIÓN
              </label>
              <div className="text-[var(--blanco-total)] text-sm font-semibold">
                {info.ultimaActualizacion}
              </div>
            </div>
            <div className="sm:col-start-2">
              <label className="block text-[var(--blanco-06)] text-[11px] tracking-wide mb-1">
                IP PÚBLICAS
              </label>
              {info.ipsPublicas.map((ip: string, index: number) => (
                <div
                  key={index}
                  className="text-[var(--blanco-total)] text-sm font-semibold"
                >
                  {ip}
                </div>
              ))}
            </div>
          </div>

          {/* CONTENEDOR DE GRÁFICAS CON EL FILTRO */}
          <div className="w-full rounded-xl border border-[var(--blanco-04)] text-[var(--blanco-08)] p-4">
            {/* --- AQUÍ ESTÁ EL MENÚ DE TIEMPO (Estilo Imagen 2) --- */}
            <div className="flex justify-start mb-6">
              <div className="inline-flex bg-[var(--azul-noche-04)] p-1 rounded-lg border border-[var(--blanco-02)]">
                {timeOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setTimeRange(option)}
                    className={`px-3 py-1.5 text-[11px] font-medium rounded-md transition-all ${
                      timeRange === option
                        ? "bg-[var(--azul-primario-total)] text-white shadow-sm border border-[var(--blanco-02)]" // Estado Activo
                        : "text-[var(--blanco-06)] hover:text-white" // Estado Inactivo
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Grids de Charts */}
            <div className="w-full flex flex-col gap-4">
              <div className="w-full">
                <p className="text-sm text-[var(--blanco-08)] mb-2 flex items-center gap-2">
                  Latencia (ms)
                  {/* Icono de info opcional si quieres igualar la img */}
                  <span className="text-[10px] text-[var(--blanco-04)] border border-[var(--blanco-04)] rounded-full w-4 h-4 flex items-center justify-center cursor-help">
                    i
                  </span>
                </p>
                <ChartBase
                  data={data}
                  dataKey="latency"
                  xAxisKey="time"
                  height={200}
                  color="#00d2ff"
                  unit="ms"
                />
              </div>
              <div className="w-full">
                <p className="text-sm text-[var(--blanco-08)] mb-2 flex items-center gap-2">
                  Descarga (Mbps)
                </p>
                <ChartBase
                  data={data}
                  dataKey="download"
                  xAxisKey="time"
                  height={200}
                  color="#00d2ff"
                  unit="Mbps"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
