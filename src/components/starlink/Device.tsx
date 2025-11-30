import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ChartBase from "./ChartBase";

interface DeviceProps {
  title: string;
  deviceId: string;
}

// Generamos datos aleatorios para simular latencia
const generateData = () =>
  Array.from({ length: 50 }, (_, i) => ({
    time: `${10 + Math.floor(i / 60)}:${(i % 60).toString().padStart(2, "0")}`,
    latency: Math.floor(Math.random() * 40) + 20,
    download: Math.floor(Math.random() * 200) + 50,
  }));

export default function DeviceSection({ title, deviceId }: DeviceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const data = generateData();

  return (
    <div className="border border-slate-700 rounded-xl bg-slate-950/50 backdrop-blur overflow-hidden mb-4">
      {/* CABECERA */}
      <div className="flex items-center justify-between min-[940px]:w-[380px] px-3 min-[940px]:px-6 py-2 min-[940px]:py-4 bg-[var(--azul-noche-10)] border border-[var(--blanco-02)] rounded-xl gap-2">
        <div className="flex items-baseline gap-2">
          <h2 className="text-xl font-light tracking-wide text-white">
            {title}
          </h2>
          <span className="text-xs rounded text-cyan-400 font-mono block">
            {deviceId}
          </span>
        </div>
        <img
          src="/assets/icons/icon-arrow-down.svg"
          className={`text-white h-6 w-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {/* CONTENIDO */}
      {isOpen && (
        <div className="p-6 space-y-8 animate-in slide-in-from-top-4 duration-300">
          {/* Información Técnica */}
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase">ID del Kit</p>
              <p className="text-cyan-400 font-mono">{deviceId}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Tiempo Activo</p>
              <p className="text-slate-300">8h 20m 33s</p>
            </div>
          </div>

          {/* Grilla de Gráficas (Rendimiento) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-400 mb-2">Latencia (ms)</p>
              <ChartBase
                data={data}
                dataKey="latency"
                xAxisKey="time"
                height={200}
                unit="ms"
              />
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-2">Descarga (Mbps)</p>
              <ChartBase
                data={data}
                dataKey="download"
                xAxisKey="time"
                height={200}
                color="#34d399" // Un color verde para diferenciar
                unit="Mbps"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
