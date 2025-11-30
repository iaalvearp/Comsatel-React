import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush, // Esta es la barra de abajo importante
} from "recharts";

interface ChartBaseProps {
  data: any[];
  dataKey: string; // Qué dato graficar (ej: 'usage', 'download')
  xAxisKey: string; // La clave del tiempo/fecha (ej: 'time', 'date')
  color?: string; // Color principal (Cyan por defecto)
  height?: number;
  unit?: string; // Para el tooltip (ej: 'GB', 'Mbps')
}

export default function ChartBase({
  data,
  dataKey,
  xAxisKey,
  color = "#06B6D4", // Cyan Starlink
  height = 250,
  unit = "",
}: ChartBaseProps) {
  return (
    <div className="w-full ">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient
              id={`gradient-${dataKey}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
            vertical={false}
          />

          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            minTickGap={30}
          />

          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              borderColor: "#475569",
              borderRadius: "8px",
              color: "#fff",
            }}
            itemStyle={{ color: color }}
            formatter={(value: any) => [`${value} ${unit}`, "Uso"]}
          />

          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${dataKey})`}
            animationDuration={1000}
          />

          {/* AQUÍ ESTÁ LA BARRA DESLIZADORA (RANGE SELECTOR) */}
          <Brush
            dataKey={xAxisKey}
            height={30}
            stroke={color}
            fill="#1e293b"
            tickFormatter={() => ""} // Ocultar texto dentro de la barra
            alwaysShowText={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
